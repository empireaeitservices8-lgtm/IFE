import { prisma } from "@/lib/prisma";
import { NotificationStatus } from "@/generated/prisma/enums";
import { requireAuth } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireAuth();

    const [items, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.notification.count({
        where: {
          userId: user.id,
          status: { not: NotificationStatus.READ },
        },
      }),
    ]);

    return ok({ items, unreadCount });
  } catch (error) {
    return handleApiError(error);
  }
}

