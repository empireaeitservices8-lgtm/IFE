import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { MediaStatus, UserRole } from "@/generated/prisma/enums";
import { getCurrentUser, requireAdmin, requireAdminOrStaff } from "@/lib/auth";
import { updateGallerySchema } from "@/lib/validations/gallery";
import { AppError, handleApiError, ok } from "@/lib/utils/api-response";
import { recordAuditLog } from "@/lib/utils/audit";
import { getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();
    const isStaff =
      user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF;

    const media = await prisma.galleryMedia.findFirst({
      where: {
        id,
        ...(isStaff ? {} : { status: MediaStatus.PUBLISHED }),
      },
      include: {
        event: { select: { id: true, title: true, slug: true } },
      },
    });

    if (!media) {
      throw new AppError("Gallery item not found.", 404);
    }

    return ok({ media });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const actor = await requireAdminOrStaff();
    const { id } = await context.params;
    const body = await req.json();
    const input = updateGallerySchema.parse(body);

    const existing = await prisma.galleryMedia.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      throw new AppError("Gallery item not found.", 404);
    }

    const media = await prisma.galleryMedia.update({
      where: { id },
      data: input,
      include: {
        event: { select: { id: true, title: true } },
      },
    });

    await recordAuditLog({
      actorId: actor.id,
      action: "UPDATE_GALLERY_MEDIA",
      entityType: "GalleryMedia",
      entityId: media.id,
      description: `Updated gallery media "${media.title}"`,
      ipAddress: getClientIp(req),
    });

    return ok({ media }, "Gallery item updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const actor = await requireAdmin();
    const { id } = await context.params;

    const existing = await prisma.galleryMedia.findUnique({
      where: { id },
      select: { id: true, title: true },
    });
    if (!existing) {
      throw new AppError("Gallery item not found.", 404);
    }

    await prisma.galleryMedia.delete({ where: { id } });

    await recordAuditLog({
      actorId: actor.id,
      action: "DELETE_GALLERY_MEDIA",
      entityType: "GalleryMedia",
      entityId: id,
      description: `Deleted gallery media "${existing.title}"`,
      ipAddress: getClientIp(req),
    });

    return ok({ deleted: true }, "Gallery item deleted successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

