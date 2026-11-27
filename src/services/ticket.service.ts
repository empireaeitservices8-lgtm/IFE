import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { AppError } from "@/lib/utils/api-response";
import { recordAuditLog } from "@/lib/utils/audit";
import { invalidatePublicEventCache } from "@/services/event.service";

function enrichTicket<
  T extends { totalQuantity: number; soldQuantity: number; status: TicketStatus }
>(ticket: T) {
  const availableQuantity = Math.max(
    0,
    ticket.totalQuantity - ticket.soldQuantity
  );
  return {
    ...ticket,
    availableQuantity,
    isSoldOut:
      ticket.status === TicketStatus.SOLD_OUT || availableQuantity === 0,
  };
}

export async function listTickets(params: {
  eventId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 50));
  const skip = (page - 1) * limit;

  const where: Prisma.TicketTypeWhereInput = {};
  if (params.eventId) where.eventId = params.eventId;
  if (
    params.status &&
    params.status !== "ALL" &&
    Object.values(TicketStatus).includes(params.status as TicketStatus)
  ) {
    where.status = params.status as TicketStatus;
  }
  if (params.search) {
    const q = params.search.trim();
    where.OR = [
      { name: { contains: q } },
      { event: { title: { contains: q } } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.ticketType.count({ where }),
    prisma.ticketType.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ eventId: "asc" }, { price: "asc" }],
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            startAt: true,
            status: true,
          },
        },
      },
    }),
  ]);

  return {
    items: items.map(enrichTicket),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getTicketById(id: string) {
  const ticket = await prisma.ticketType.findUnique({
    where: { id },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          slug: true,
          startAt: true,
          status: true,
        },
      },
    },
  });

  if (!ticket) {
    throw new AppError("Ticket type not found.", 404);
  }

  return enrichTicket(ticket);
}

export async function createTicket(
  input: {
    eventId: string;
    name: string;
    description?: string | null;
    price: number;
    totalQuantity: number;
    status?: TicketStatus;
  },
  actorId: string,
  ipAddress?: string
) {
  const event = await prisma.event.findUnique({
    where: { id: input.eventId },
    select: { id: true, title: true },
  });
  if (!event) {
    throw new AppError("Event not found.", 404);
  }

  const duplicate = await prisma.ticketType.findUnique({
    where: {
      eventId_name: {
        eventId: input.eventId,
        name: input.name,
      },
    },
    select: { id: true },
  });
  if (duplicate) {
    throw new AppError(
      `A ticket type named "${input.name}" already exists for this event.`,
      409
    );
  }

  const ticket = await prisma.ticketType.create({
    data: {
      eventId: input.eventId,
      name: input.name,
      description: input.description ?? null,
      price: new Prisma.Decimal(input.price),
      totalQuantity: input.totalQuantity,
      status: input.status ?? TicketStatus.ACTIVE,
    },
    include: {
      event: { select: { id: true, title: true } },
    },
  });

  await recordAuditLog({
    actorId,
    action: "CREATE_TICKET_TYPE",
    entityType: "TicketType",
    entityId: ticket.id,
    description: `Created ticket "${ticket.name}" for event "${event.title}"`,
    ipAddress: ipAddress ?? null,
  });

  return enrichTicket(ticket);
}

export async function updateTicket(
  id: string,
  input: {
    name?: string;
    description?: string | null;
    price?: number;
    totalQuantity?: number;
    status?: TicketStatus;
  },
  actorId: string,
  ipAddress?: string
) {
  const existing = await prisma.ticketType.findUnique({
    where: { id },
  });
  if (!existing) {
    throw new AppError("Ticket type not found.", 404);
  }

  if (
    input.totalQuantity !== undefined &&
    input.totalQuantity < existing.soldQuantity
  ) {
    throw new AppError(
      `Total quantity cannot be less than sold quantity (${existing.soldQuantity}).`,
      400
    );
  }

  const nextTotal = input.totalQuantity ?? existing.totalQuantity;
  let nextStatus = input.status ?? existing.status;
  if (nextTotal <= existing.soldQuantity) {
    nextStatus = TicketStatus.SOLD_OUT;
  } else if (
    existing.status === TicketStatus.SOLD_OUT &&
    input.status === undefined &&
    nextTotal > existing.soldQuantity
  ) {
    nextStatus = TicketStatus.ACTIVE;
  }

  const ticket = await prisma.ticketType.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.price !== undefined
        ? { price: new Prisma.Decimal(input.price) }
        : {}),
      ...(input.totalQuantity !== undefined
        ? { totalQuantity: input.totalQuantity }
        : {}),
      status: nextStatus,
    },
    include: {
      event: { select: { id: true, title: true } },
    },
  });

  await recordAuditLog({
    actorId,
    action: "UPDATE_TICKET_TYPE",
    entityType: "TicketType",
    entityId: ticket.id,
    description: `Updated ticket "${ticket.name}"`,
    ipAddress: ipAddress ?? null,
  });

  invalidatePublicEventCache();
  return enrichTicket(ticket);
}

export async function updateTicketStatus(
  id: string,
  status: TicketStatus,
  actorId: string,
  ipAddress?: string
) {
  const existing = await prisma.ticketType.findUnique({
    where: { id },
  });
  if (!existing) {
    throw new AppError("Ticket type not found.", 404);
  }

  if (
    status === TicketStatus.ACTIVE &&
    existing.soldQuantity >= existing.totalQuantity
  ) {
    throw new AppError(
      "Cannot activate a sold-out ticket without increasing total quantity.",
      400
    );
  }

  const ticket = await prisma.ticketType.update({
    where: { id },
    data: { status },
  });

  await recordAuditLog({
    actorId,
    action: "UPDATE_TICKET_STATUS",
    entityType: "TicketType",
    entityId: id,
    description: `Changed ticket "${existing.name}" status to ${status}`,
    ipAddress: ipAddress ?? null,
  });

  invalidatePublicEventCache();
  return enrichTicket(ticket);
}

export async function deleteTicket(
  id: string,
  actorId: string,
  ipAddress?: string
) {
  const existing = await prisma.ticketType.findUnique({
    where: { id },
    include: {
      _count: { select: { bookingItems: true } },
    },
  });
  if (!existing) {
    throw new AppError("Ticket type not found.", 404);
  }

  if (existing._count.bookingItems > 0 || existing.soldQuantity > 0) {
    throw new AppError(
      "Cannot delete a ticket type that has bookings. Pause it instead.",
      409
    );
  }

  await prisma.ticketType.delete({ where: { id } });
  invalidatePublicEventCache();

  await recordAuditLog({
    actorId,
    action: "DELETE_TICKET_TYPE",
    entityType: "TicketType",
    entityId: id,
    description: `Deleted ticket "${existing.name}"`,
    ipAddress: ipAddress ?? null,
  });
}

