import { prisma } from "@/lib/prisma";
import { requireAdminOrStaff } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdminOrStaff();

    const items = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        event: { select: { id: true, title: true, startAt: true } },
        items: {
          include: {
            ticketType: { select: { id: true, name: true } },
          },
        },
      },
    });

    return ok({ items });
  } catch (error) {
    return handleApiError(error);
  }
}

