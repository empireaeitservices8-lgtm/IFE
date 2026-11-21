import { prisma } from "@/lib/prisma";
import {
  BookingStatus,
  EventStatus,
  PaymentStatus,
  RefundStatus,
  UserRole,
} from "@/generated/prisma/enums";
import { requireAdminOrStaff } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdminOrStaff();

    const [
      capturedPayments,
      processedRefunds,
      totalBookings,
      confirmedBookings,
      totalCustomers,
      publishedEvents,
      ticketAgg,
    ] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          status: {
            in: [
              PaymentStatus.CAPTURED,
              PaymentStatus.PARTIALLY_REFUNDED,
              PaymentStatus.REFUNDED,
            ],
          },
        },
        _sum: { amount: true },
      }),
      prisma.refund.aggregate({
        where: { status: RefundStatus.PROCESSED },
        _sum: { amount: true },
      }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
      prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
      prisma.event.count({ where: { status: EventStatus.PUBLISHED } }),
      prisma.ticketType.aggregate({
        _sum: { soldQuantity: true, totalQuantity: true },
      }),
    ]);

    const grossRevenue = Number(capturedPayments._sum.amount ?? 0);
    const refundedAmount = Number(processedRefunds._sum.amount ?? 0);
    const netRevenue = Number(Math.max(0, grossRevenue - refundedAmount).toFixed(2));

    return ok({
      stats: {
        grossRevenue,
        refundedAmount,
        netRevenue,
        currency: "INR",
        totalBookings,
        confirmedBookings,
        totalCustomers,
        publishedEvents,
        ticketsSold: ticketAgg._sum.soldQuantity ?? 0,
        totalTicketCapacity: ticketAgg._sum.totalQuantity ?? 0,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

