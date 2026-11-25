import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import {
  BookingStatus,
  EventStatus,
  NotificationStatus,
  NotificationType,
  PaymentStatus,
  TicketStatus,
  UserRole,
} from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { AppError } from "@/lib/utils/api-response";
import { recordAuditLog } from "@/lib/utils/audit";

function generateBookingCode(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randPart = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `IFE-${datePart}-${randPart}`;
}

export async function createBooking(
  input: {
    eventId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: { ticketTypeId: string; quantity: number }[];
  },
  userId?: string | null
) {
  // Merge duplicate ticketTypeId entries
  const mergedMap = new Map<string, number>();
  for (const item of input.items) {
    mergedMap.set(
      item.ticketTypeId,
      (mergedMap.get(item.ticketTypeId) ?? 0) + item.quantity
    );
  }
  const requestedItems = Array.from(mergedMap.entries()).map(
    ([ticketTypeId, quantity]) => ({ ticketTypeId, quantity })
  );

  // Prevent accidental duplicate PENDING booking within 2 minutes for same email + event
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
  const recentPending = await prisma.booking.findFirst({
    where: {
      eventId: input.eventId,
      customerEmail: input.customerEmail,
      status: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      createdAt: { gte: twoMinutesAgo },
    },
    include: {
      items: {
        include: {
          ticketType: { select: { id: true, name: true, price: true } },
        },
      },
      event: { select: { id: true, title: true, slug: true, startAt: true } },
    },
  });

  if (recentPending) {
    const sameItems =
      recentPending.items.length === requestedItems.length &&
      requestedItems.every((reqItem) =>
        recentPending.items.some(
          (existingItem) =>
            existingItem.ticketTypeId === reqItem.ticketTypeId &&
            existingItem.quantity === reqItem.quantity
        )
      );

    if (sameItems) {
      return recentPending;
    }
  }

  const booking = await prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({
      where: { id: input.eventId },
      select: {
        id: true,
        title: true,
        status: true,
        endAt: true,
      },
    });

    if (!event) {
      throw new AppError("Event not found.", 404);
    }

    if (event.status !== EventStatus.PUBLISHED) {
      throw new AppError("This event is not open for bookings.", 400);
    }

    const ticketIds = requestedItems.map((i) => i.ticketTypeId);
    const ticketRecords = await tx.ticketType.findMany({
      where: {
        id: { in: ticketIds },
        eventId: input.eventId,
      },
    });

    if (ticketRecords.length !== ticketIds.length) {
      throw new AppError(
        "One or more selected ticket types are invalid for this event.",
        400
      );
    }

    const ticketMap = new Map(ticketRecords.map((t) => [t.id, t]));
    let subtotalNum = 0;
    const lineItemsToCreate: {
      ticketTypeId: string;
      quantity: number;
      unitPrice: Prisma.Decimal;
      lineTotal: Prisma.Decimal;
    }[] = [];

    for (const reqItem of requestedItems) {
      const ticket = ticketMap.get(reqItem.ticketTypeId)!;
      if (ticket.status !== TicketStatus.ACTIVE) {
        throw new AppError(
          `Ticket "${ticket.name}" is currently ${ticket.status.toLowerCase()}.`,
          400
        );
      }

      const maxAllowedBefore = ticket.totalQuantity - reqItem.quantity;
      if (maxAllowedBefore < ticket.soldQuantity) {
        const remaining = Math.max(0, ticket.totalQuantity - ticket.soldQuantity);
        throw new AppError(
          `Only ${remaining} ticket(s) remaining for "${ticket.name}".`,
          409
        );
      }

      // Atomic conditional increment to prevent overselling under concurrency
      const reserved = await tx.ticketType.updateMany({
        where: {
          id: ticket.id,
          status: TicketStatus.ACTIVE,
          soldQuantity: { lte: maxAllowedBefore },
        },
        data: {
          soldQuantity: { increment: reqItem.quantity },
        },
      });

      if (reserved.count === 0) {
        throw new AppError(
          `Not enough "${ticket.name}" tickets available. Please try again.`,
          409
        );
      }

      if (ticket.soldQuantity + reqItem.quantity >= ticket.totalQuantity) {
        await tx.ticketType.update({
          where: { id: ticket.id },
          data: { status: TicketStatus.SOLD_OUT },
        });
      }

      const unitPriceNum = Number(ticket.price);
      const lineTotalNum = Number((unitPriceNum * reqItem.quantity).toFixed(2));
      subtotalNum += lineTotalNum;

      lineItemsToCreate.push({
        ticketTypeId: ticket.id,
        quantity: reqItem.quantity,
        unitPrice: ticket.price,
        lineTotal: new Prisma.Decimal(lineTotalNum),
      });
    }

    const taxAmountNum = Math.round(subtotalNum * 0.18);
    const serviceFeeNum = 0;
    const totalAmountNum = Number(
      (subtotalNum + taxAmountNum + serviceFeeNum).toFixed(2)
    );

    const createdBooking = await tx.booking.create({
      data: {
        bookingCode: generateBookingCode(),
        userId: userId ?? null,
        eventId: input.eventId,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        subtotal: new Prisma.Decimal(subtotalNum.toFixed(2)),
        taxAmount: new Prisma.Decimal(taxAmountNum.toFixed(2)),
        serviceFee: new Prisma.Decimal(serviceFeeNum.toFixed(2)),
        totalAmount: new Prisma.Decimal(totalAmountNum.toFixed(2)),
        currency: "INR",
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        items: {
          create: lineItemsToCreate,
        },
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            startAt: true,
            venue: true,
          },
        },
        items: {
          include: {
            ticketType: { select: { id: true, name: true, price: true } },
          },
        },
      },
    });

    if (userId) {
      await tx.notification.create({
        data: {
          userId,
          type: NotificationType.BOOKING,
          status: NotificationStatus.SENT,
          recipientEmail: input.customerEmail,
          subject: `Booking Reserved: ${createdBooking.bookingCode}`,
          message: `Your booking for ${event.title} has been created. Complete payment to confirm your tickets.`,
          sentAt: new Date(),
        },
      });
    }

    return createdBooking;
  }, { timeout: 15000, maxWait: 10000 });

  return booking;
}

export async function listBookings(params: {
  status?: string;
  paymentStatus?: string;
  eventId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Prisma.BookingWhereInput = {};
  if (
    params.status &&
    params.status !== "ALL" &&
    Object.values(BookingStatus).includes(params.status as BookingStatus)
  ) {
    where.status = params.status as BookingStatus;
  }
  if (
    params.paymentStatus &&
    params.paymentStatus !== "ALL" &&
    Object.values(PaymentStatus).includes(params.paymentStatus as PaymentStatus)
  ) {
    where.paymentStatus = params.paymentStatus as PaymentStatus;
  }
  if (params.eventId) {
    where.eventId = params.eventId;
  }
  if (params.search) {
    const q = params.search.trim();
    where.OR = [
      { bookingCode: { contains: q } },
      { customerName: { contains: q } },
      { customerEmail: { contains: q } },
      { customerPhone: { contains: q } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        event: {
          select: { id: true, title: true, slug: true, startAt: true },
        },
        items: {
          include: {
            ticketType: { select: { id: true, name: true } },
          },
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function listMyBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          slug: true,
          startAt: true,
          endAt: true,
          bannerUrl: true,
          venue: true,
        },
      },
      items: {
        include: {
          ticketType: { select: { id: true, name: true, price: true } },
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
}

export async function getBookingById(
  id: string,
  requester: { id: string; role: UserRole }
) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      event: {
        include: { venue: true },
      },
      items: {
        include: {
          ticketType: { select: { id: true, name: true, price: true } },
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
        include: { refunds: true },
      },
    },
  });

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  const isStaff =
    requester.role === UserRole.ADMIN || requester.role === UserRole.STAFF;

  if (!isStaff && booking.userId !== requester.id) {
    throw new AppError("You do not have permission to view this booking.", 403);
  }

  return booking;
}

export async function cancelBooking(
  id: string,
  requester: { id: string; role: UserRole },
  ipAddress?: string
) {
  const isStaff =
    requester.role === UserRole.ADMIN || requester.role === UserRole.STAFF;

  const updated = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id },
      include: {
        items: true,
        event: { select: { title: true } },
      },
    });

    if (!booking) {
      throw new AppError("Booking not found.", 404);
    }

    if (!isStaff && booking.userId !== requester.id) {
      throw new AppError(
        "You do not have permission to cancel this booking.",
        403
      );
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new AppError("Booking is already cancelled.", 400);
    }

    for (const item of booking.items) {
      const ticket = await tx.ticketType.findUnique({
        where: { id: item.ticketTypeId },
      });
      if (!ticket) continue;

      const nextSold = Math.max(0, ticket.soldQuantity - item.quantity);
      await tx.ticketType.update({
        where: { id: ticket.id },
        data: {
          soldQuantity: nextSold,
          ...(ticket.status === TicketStatus.SOLD_OUT &&
          nextSold < ticket.totalQuantity
            ? { status: TicketStatus.ACTIVE }
            : {}),
        },
      });
    }

    const cancelled = await tx.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date(),
      },
      include: {
        event: { select: { id: true, title: true } },
        items: {
          include: { ticketType: { select: { id: true, name: true } } },
        },
      },
    });

    if (booking.userId) {
      await tx.notification.create({
        data: {
          userId: booking.userId,
          type: NotificationType.BOOKING,
          status: NotificationStatus.SENT,
          recipientEmail: booking.customerEmail,
          subject: `Booking Cancelled: ${booking.bookingCode}`,
          message: `Your booking for ${booking.event.title} has been cancelled and reserved tickets have been released.`,
          sentAt: new Date(),
        },
      });
    }

    return cancelled;
  });

  if (isStaff) {
    await recordAuditLog({
      actorId: requester.id,
      action: "CANCEL_BOOKING",
      entityType: "Booking",
      entityId: id,
      description: `Cancelled booking ${updated.bookingCode}`,
      ipAddress: ipAddress ?? null,
    });
  }

  return updated;
}

export async function confirmBooking(
  id: string,
  actorId: string,
  ipAddress?: string
) {
  const updated = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id },
      include: { event: { select: { title: true } } },
    });

    if (!booking) {
      throw new AppError("Booking not found.", 404);
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new AppError("Cannot confirm a cancelled booking.", 400);
    }

    const confirmed = await tx.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CONFIRMED,
        confirmedAt: booking.confirmedAt ?? new Date(),
      },
      include: {
        event: { select: { id: true, title: true } },
        items: {
          include: { ticketType: { select: { id: true, name: true } } },
        },
      },
    });

    if (booking.userId) {
      await tx.notification.create({
        data: {
          userId: booking.userId,
          type: NotificationType.BOOKING,
          status: NotificationStatus.SENT,
          recipientEmail: booking.customerEmail,
          subject: `Booking Confirmed: ${booking.bookingCode}`,
          message: `Your booking for ${booking.event.title} is confirmed!`,
          sentAt: new Date(),
        },
      });
    }

    return confirmed;
  });

  await recordAuditLog({
    actorId,
    action: "CONFIRM_BOOKING",
    entityType: "Booking",
    entityId: id,
    description: `Manually confirmed booking ${updated.bookingCode}`,
    ipAddress: ipAddress ?? null,
  });

  return updated;
}

