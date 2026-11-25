import { prisma } from "@/lib/prisma";
import {
  BookingStatus,
  NotificationStatus,
  NotificationType,
  PaymentGateway,
  PaymentMethod,
  PaymentStatus,
  RefundStatus,
  UserRole,
} from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import {
  getRazorpayClient,
  getRazorpayConfig,
  verifyRazorpayPaymentSignature,
  verifyRazorpayWebhookSignature,
} from "@/lib/razorpay";
import { AppError } from "@/lib/utils/api-response";

function mapRazorpayMethod(method?: string): PaymentMethod {
  switch (method?.toLowerCase()) {
    case "card":
      return PaymentMethod.CARD;
    case "upi":
      return PaymentMethod.UPI;
    case "netbanking":
      return PaymentMethod.NET_BANKING;
    case "wallet":
      return PaymentMethod.WALLET;
    default:
      return PaymentMethod.UNKNOWN;
  }
}

export async function createRazorpayOrder(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      event: { select: { title: true } },
      payments: {
        where: { gateway: PaymentGateway.RAZORPAY },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  if (booking.status === BookingStatus.CANCELLED) {
    throw new AppError("Cannot pay for a cancelled booking.", 400);
  }

  if (booking.paymentStatus === PaymentStatus.CAPTURED) {
    throw new AppError("This booking has already been paid.", 409);
  }

  const { keyId, keySecret } = getRazorpayConfig();
  const amountPaise = Math.round(Number(booking.totalAmount) * 100);
  if (amountPaise <= 0) {
    throw new AppError("Invalid booking amount for payment.", 400);
  }

  if (!keyId || !keySecret) {
    const suffix = `${Date.now()}_${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const sandboxOrderId = `sandbox_order_${booking.bookingCode}_${suffix}`;
    const sandboxPaymentId = `sandbox_pay_${suffix}`;

    await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          bookingId: booking.id,
          gateway: PaymentGateway.RAZORPAY,
          method: PaymentMethod.UPI,
          status: PaymentStatus.CAPTURED,
          amount: booking.totalAmount,
          currency: booking.currency,
          gatewayOrderId: sandboxOrderId,
          gatewayPaymentId: sandboxPaymentId,
          paidAt: new Date(),
        },
      });

      await tx.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: PaymentStatus.CAPTURED,
          status: BookingStatus.CONFIRMED,
          confirmedAt: booking.confirmedAt ?? new Date(),
        },
      });

      if (booking.userId) {
        await tx.notification.create({
          data: {
            userId: booking.userId,
            type: NotificationType.PAYMENT,
            status: NotificationStatus.SENT,
            recipientEmail: booking.customerEmail,
            subject: `Payment Confirmed: ${booking.bookingCode}`,
            message: `We received your payment of ${booking.currency} ${booking.totalAmount} for ${booking.event.title}. Your tickets are confirmed!`,
            sentAt: new Date(),
          },
        });
      }
    }, { timeout: 15000, maxWait: 10000 });

    return {
      mode: "sandbox" as const,
      orderId: sandboxOrderId,
      paymentId: sandboxPaymentId,
      amount: amountPaise,
      currency: booking.currency,
      keyId: "",
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      eventTitle: booking.event.title,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
    };
  }

  const existingPending = booking.payments.find(
    (p) =>
      p.status === PaymentStatus.PENDING &&
      p.gatewayOrderId &&
      Number(p.amount) === Number(booking.totalAmount)
  );

  if (existingPending?.gatewayOrderId) {
    return {
      orderId: existingPending.gatewayOrderId,
      amount: amountPaise,
      currency: booking.currency,
      keyId,
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      eventTitle: booking.event.title,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
    };
  }

  const razorpay = getRazorpayClient();
  let order: { id: string };
  try {
    order = await razorpay.orders.create({
      amount: amountPaise,
      currency: booking.currency,
      receipt: booking.bookingCode,
      notes: {
        bookingId: booking.id,
        bookingCode: booking.bookingCode,
      },
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    throw new AppError(
      "Unable to initialize payment gateway. Please try again.",
      502
    );
  }

  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      gateway: PaymentGateway.RAZORPAY,
      method: PaymentMethod.UNKNOWN,
      status: PaymentStatus.PENDING,
      amount: booking.totalAmount,
      currency: booking.currency,
      gatewayOrderId: order.id,
      gatewayResponse: JSON.parse(JSON.stringify(order)),
    },
  });

  return {
    orderId: order.id,
    amount: amountPaise,
    currency: booking.currency,
    keyId,
    bookingId: booking.id,
    bookingCode: booking.bookingCode,
    eventTitle: booking.event.title,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
  };
}

export async function verifyAndCapturePayment(input: {
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const isValid = verifyRazorpayPaymentSignature({
    orderId: input.razorpayOrderId,
    paymentId: input.razorpayPaymentId,
    signature: input.razorpaySignature,
  });

  if (!isValid) {
    throw new AppError("Invalid payment signature.", 400);
  }

  const existingByPaymentId = await prisma.payment.findUnique({
    where: { gatewayPaymentId: input.razorpayPaymentId },
    include: { booking: true },
  });

  if (
    existingByPaymentId &&
    existingByPaymentId.status === PaymentStatus.CAPTURED
  ) {
    return {
      payment: existingByPaymentId,
      booking: existingByPaymentId.booking,
      alreadyProcessed: true,
    };
  }

  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { gatewayOrderId: input.razorpayOrderId },
      include: {
        booking: {
          include: { event: { select: { title: true } } },
        },
      },
    });

    if (!payment || payment.bookingId !== input.bookingId) {
      throw new AppError("Matching payment order not found for booking.", 404);
    }

    if (payment.status === PaymentStatus.CAPTURED) {
      return {
        payment,
        booking: payment.booking,
        alreadyProcessed: true,
      };
    }

    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.CAPTURED,
        gatewayPaymentId: input.razorpayPaymentId,
        gatewaySignature: input.razorpaySignature,
        paidAt: new Date(),
      },
    });

    const updatedBooking = await tx.booking.update({
      where: { id: payment.bookingId },
      data: {
        paymentStatus: PaymentStatus.CAPTURED,
        status: BookingStatus.CONFIRMED,
        confirmedAt: payment.booking.confirmedAt ?? new Date(),
      },
    });

    if (payment.booking.userId) {
      await tx.notification.create({
        data: {
          userId: payment.booking.userId,
          type: NotificationType.PAYMENT,
          status: NotificationStatus.SENT,
          recipientEmail: payment.booking.customerEmail,
          subject: `Payment Confirmed: ${payment.booking.bookingCode}`,
          message: `We received your payment of ${payment.currency} ${payment.amount} for ${payment.booking.event.title}. Your tickets are confirmed!`,
          sentAt: new Date(),
        },
      });
    }

    return {
      payment: updatedPayment,
      booking: updatedBooking,
      alreadyProcessed: false,
    };
  });

  return result;
}

export async function processRazorpayWebhook(
  rawBody: string,
  signature: string
) {
  const valid = verifyRazorpayWebhookSignature(rawBody, signature);
  if (!valid) {
    throw new AppError("Invalid webhook signature.", 401);
  }

  const payload = JSON.parse(rawBody) as {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          method?: string;
          status?: string;
        };
      };
      refund?: {
        entity?: {
          id?: string;
          payment_id?: string;
          status?: string;
        };
      };
    };
  };

  const eventType = payload.event;
  const paymentEntity = payload.payload?.payment?.entity;

  if (
    (eventType === "payment.captured" || eventType === "order.paid") &&
    paymentEntity?.order_id &&
    paymentEntity?.id
  ) {
    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;

    await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { gatewayOrderId: orderId },
        include: { booking: true },
      });
      if (!payment || payment.status === PaymentStatus.CAPTURED) return;

      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.CAPTURED,
          gatewayPaymentId: paymentId,
          method: mapRazorpayMethod(paymentEntity.method),
          paidAt: new Date(),
          gatewayResponse: JSON.parse(JSON.stringify(payload)),
        },
      });

      await tx.booking.update({
        where: { id: payment.bookingId },
        data: {
          paymentStatus: PaymentStatus.CAPTURED,
          status: BookingStatus.CONFIRMED,
          confirmedAt: payment.booking.confirmedAt ?? new Date(),
        },
      });
    });
  } else if (eventType === "payment.failed" && paymentEntity?.order_id) {
    const orderId = paymentEntity.order_id;
    await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { gatewayOrderId: orderId },
      });
      if (!payment || payment.status === PaymentStatus.CAPTURED) return;

      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          gatewayPaymentId: paymentEntity.id ?? payment.gatewayPaymentId,
          method: mapRazorpayMethod(paymentEntity.method),
          gatewayResponse: JSON.parse(JSON.stringify(payload)),
        },
      });

      await tx.booking.update({
        where: { id: payment.bookingId },
        data: {
          paymentStatus: PaymentStatus.FAILED,
        },
      });
    });
  } else if (eventType === "refund.processed") {
    const refundEntity = payload.payload?.refund?.entity;
    if (refundEntity?.id) {
      await prisma.refund.updateMany({
        where: { gatewayRefundId: refundEntity.id },
        data: {
          status: RefundStatus.PROCESSED,
          processedAt: new Date(),
        },
      });
    }
  }

  return { received: true, event: eventType ?? "unknown" };
}

export async function listPayments(params: {
  status?: string;
  gateway?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Prisma.PaymentWhereInput = {};
  if (
    params.status &&
    params.status !== "ALL" &&
    Object.values(PaymentStatus).includes(params.status as PaymentStatus)
  ) {
    where.status = params.status as PaymentStatus;
  }
  if (
    params.gateway &&
    params.gateway !== "ALL" &&
    Object.values(PaymentGateway).includes(params.gateway as PaymentGateway)
  ) {
    where.gateway = params.gateway as PaymentGateway;
  }
  if (params.search) {
    const q = params.search.trim();
    where.OR = [
      { gatewayOrderId: { contains: q } },
      { gatewayPaymentId: { contains: q } },
      { booking: { bookingCode: { contains: q } } },
      { booking: { customerEmail: { contains: q } } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.payment.count({ where }),
    prisma.payment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        booking: {
          select: {
            id: true,
            bookingCode: true,
            customerName: true,
            customerEmail: true,
            event: { select: { id: true, title: true } },
          },
        },
        refunds: true,
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

export async function getPaymentById(
  id: string,
  requester: { id: string; role: UserRole }
) {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      booking: {
        include: { event: { select: { id: true, title: true } } },
      },
      refunds: true,
    },
  });

  if (!payment) {
    throw new AppError("Payment not found.", 404);
  }

  const isStaff =
    requester.role === UserRole.ADMIN || requester.role === UserRole.STAFF;
  if (!isStaff && payment.booking.userId !== requester.id) {
    throw new AppError("You do not have permission to view this payment.", 403);
  }

  return payment;
}

