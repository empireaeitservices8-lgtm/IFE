import { prisma } from "@/lib/prisma";
import { EventStatus } from "@/generated/prisma/enums";
import { requireAdminOrStaff } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdminOrStaff();

    const events = await prisma.event.findMany({
      where: {
        startAt: { gte: new Date() },
        status: { in: [EventStatus.PUBLISHED, EventStatus.DRAFT] },
      },
      orderBy: { startAt: "asc" },
      take: 10,
      include: {
        venue: { select: { id: true, name: true, city: true } },
        ticketTypes: {
          select: { totalQuantity: true, soldQuantity: true },
        },
        _count: { select: { bookings: true } },
      },
    });

    const items = events.map((event) => {
      const totalTickets = event.ticketTypes.reduce(
        (sum, t) => sum + t.totalQuantity,
        0
      );
      const soldTickets = event.ticketTypes.reduce(
        (sum, t) => sum + t.soldQuantity,
        0
      );
      return {
        ...event,
        totalTickets,
        soldTickets,
      };
    });

    return ok({ items });
  } catch (error) {
    return handleApiError(error);
  }
}

