import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@/generated/prisma/enums";
import { requireAdminOrStaff } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdminOrStaff();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const payments = await prisma.payment.findMany({
      where: {
        status: {
          in: [PaymentStatus.CAPTURED, PaymentStatus.PARTIALLY_REFUNDED],
        },
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        amount: true,
        paidAt: true,
        createdAt: true,
        booking: {
          select: {
            event: { select: { category: true } },
          },
        },
      },
    });

    const monthlyMap = new Map<string, number>();
    const categoryMap = new Map<string, number>();

    for (const p of payments) {
      const date = p.paidAt ?? p.createdAt;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const amount = Number(p.amount);

      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) ?? 0) + amount);

      const cat = p.booking.event.category;
      categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + amount);
    }

    const monthly = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({
        month,
        revenue: Number(revenue.toFixed(2)),
      }));

    const byCategory = Array.from(categoryMap.entries()).map(
      ([category, revenue]) => ({
        category,
        revenue: Number(revenue.toFixed(2)),
      })
    );

    return ok({ monthly, byCategory });
  } catch (error) {
    return handleApiError(error);
  }
}

