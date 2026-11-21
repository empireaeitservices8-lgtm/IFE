import { prisma } from "@/lib/prisma";
import {
  NotificationStatus,
  NotificationType,
  PaymentStatus,
  RefundStatus,
} from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { getRazorpayClient } from "@/lib/razorpay";
import { AppError } from "@/lib/utils/api-response";
import { recordAuditLog } from "@/lib/utils/audit";

export async function listRefunds(params: {
  status?: string;
  paymentId?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Prisma.RefundWhereInput = {};
  if (
    params.status &&
    params.status !== "ALL" &&
    Object.values(RefundStatus).includes(params.status as RefundStatus)
  ) {
    where.status = params.status as RefundStatus;
  }
  if (params.paymentId) {
    where.paymentId = params.paymentId;
  }

  const [total, items] = await Promise.all([
    prisma.refund.count({ where }),
    prisma.refund.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        payment: {
          include: {
            booking: {
              select: {
                id: true,
                bookingCode: true,
                customerName: true,
                customerEmail: true,
              },
            },
          },
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

export async function getRefundById(id: string) {
  const refund = await prisma.refund.findUnique({
    where: { id },
    include: {
      payment: {
        include: {
          booking: {
            include: { event: { select: { id: true, title: true } } },
          },
        },
      },
    },
  });

  if (!refund) {
    throw new AppError("Refund not found.", 404);
  }

  return refund;
}

export async function createRefund(
  input: {
    paymentId: string;
    amount?: number;
    reason?: string;
  },
  actorId: string,
  ipAddress?: string
) {
  const payment = await prisma.payment.findUnique({
    where: { id: input.paymentId },
    include: {
      booking: {
        include: { event: { select: { title: true } } },
      },
      refunds: {
        where: {
          status: { in: [RefundStatus.PENDING, RefundStatus.PROCESSED] },
        },
      },
    },
  });

  if (!payment) {
    throw new AppError("Payment not found.", 404);
  }

  if (
    payment.status !== PaymentStatus.CAPTURED &&
    payment.status !== PaymentStatus.PARTIALLY_REFUNDED
  ) {
    throw new AppError(
      `Only captured or partially refunded payments can be refunded (current status: ${payment.status}).`,
      400
    );
  }

  if (!payment.gatewayPaymentId) {
    throw new AppError(
      "Missing gateway payment ID; cannot process Razorpay refund.",
      400
    );
  }

  const paidAmount = Number(payment.amount);
  const alreadyRefunded = payment.refunds.reduce(
    (sum, r) => sum + Number(r.amount),
    0
  );
  const remainingRefundable = Number((paidAmount - alreadyRefunded).toFixed(2));

  if (remainingRefundable <= 0) {
    throw new AppError("This payment has already been fully refunded.", 409);
  }

  const refundAmount = input.amount
    ? Number(input.amount.toFixed(2))
    : remainingRefundable;

  if (refundAmount <= 0 || refundAmount > remainingRefundable) {
    throw new AppError(
      `Refund amount must be between 0.01 and ${remainingRefundable}.`,
      400
    );
  }

  const razorpay = getRazorpayClient();
  const gatewayRefund = await razorpay.payments.refund(
    payment.gatewayPaymentId,
    {
      amount: Math.round(refundAmount * 100),
      notes: {
        bookingCode: payment.booking.bookingCode,
        reason: input.reason ?? "Admin initiated refund",
      },
    }
  );

  const isFullRefund = alreadyRefunded + refundAmount >= paidAmount;
  const nextPaymentStatus = isFullRefund
    ? PaymentStatus.REFUNDED
    : PaymentStatus.PARTIALLY_REFUNDED;

  const refundStatus =
    gatewayRefund.status === "processed"
      ? RefundStatus.PROCESSED
      : RefundStatus.PENDING;

  const refund = await prisma.$transaction(async (tx) => {
    const created = await tx.refund.create({
      data: {
        paymentId: payment.id,
        amount: new Prisma.Decimal(refundAmount),
        status: refundStatus,
        reason: input.reason ?? null,
        gatewayRefundId: gatewayRefund.id,
        processedAt:
          refundStatus === RefundStatus.PROCESSED ? new Date() : null,
      },
    });

    await tx.payment.update({
      where: { id: payment.id },
      data: { status: nextPaymentStatus },
    });

    await tx.booking.update({
      where: { id: payment.bookingId },
      data: { paymentStatus: nextPaymentStatus },
    });

    if (payment.booking.userId) {
      await tx.notification.create({
        data: {
          userId: payment.booking.userId,
          type: NotificationType.PAYMENT,
          status: NotificationStatus.SENT,
          recipientEmail: payment.booking.customerEmail,
          subject: `Refund Initiated: ${payment.booking.bookingCode}`,
          message: `A refund of ${payment.currency} ${refundAmount} for ${payment.booking.event.title} has been initiated.`,
          sentAt: new Date(),
        },
      });
    }

    return created;
  });

  await recordAuditLog({
    actorId,
    action: "CREATE_REFUND",
    entityType: "Refund",
    entityId: refund.id,
    description: `Initiated refund of ${payment.currency} ${refundAmount} for booking ${payment.booking.bookingCode}`,
    ipAddress: ipAddress ?? null,
  });

  return refund;
}

