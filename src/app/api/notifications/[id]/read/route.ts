import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationStatus } from "@/generated/prisma/enums";
import { requireAuth } from "@/lib/auth";
import { AppError, handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_req: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;

    const existing = await prisma.notification.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!existing || existing.userId !== user.id) {
      throw new AppError("Notification not found.", 404);
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });

    return ok({ notification }, "Notification marked as read.");
  } catch (error) {
    return handleApiError(error);
  }
}

