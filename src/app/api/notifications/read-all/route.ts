import { prisma } from "@/lib/prisma";
import { NotificationStatus } from "@/generated/prisma/enums";
import { requireAuth } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function PATCH() {
  try {
    const user = await requireAuth();

    const result = await prisma.notification.updateMany({
      where: {
        userId: user.id,
        status: { not: NotificationStatus.READ },
      },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });

    return ok(
      { updatedCount: result.count },
      "All notifications marked as read."
    );
  } catch (error) {
    return handleApiError(error);
  }
}

