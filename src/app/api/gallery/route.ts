import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  EventCategory,
  MediaStatus,
  MediaType,
  UserRole,
} from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { getCurrentUser, requireAdminOrStaff } from "@/lib/auth";
import { createGallerySchema } from "@/lib/validations/gallery";
import { AppError, created, handleApiError, ok } from "@/lib/utils/api-response";
import { recordAuditLog } from "@/lib/utils/audit";
import { getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user = await getCurrentUser();
    const isStaff =
      user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF;

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 24)));
    const skip = (page - 1) * limit;

    const where: Prisma.GalleryMediaWhereInput = {};
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const featured = searchParams.get("isFeatured");
    const eventId = searchParams.get("eventId");
    const search = searchParams.get("search") ?? searchParams.get("q");

    if (
      category &&
      category !== "ALL" &&
      Object.values(EventCategory).includes(category as EventCategory)
    ) {
      where.category = category as EventCategory;
    }

    if (
      type &&
      type !== "ALL" &&
      Object.values(MediaType).includes(type as MediaType)
    ) {
      where.type = type as MediaType;
    }

    if (isStaff) {
      if (
        status &&
        status !== "ALL" &&
        Object.values(MediaStatus).includes(status as MediaStatus)
      ) {
        where.status = status as MediaStatus;
      }
    } else {
      where.status = MediaStatus.PUBLISHED;
    }

    if (featured === "true") where.isFeatured = true;
    if (eventId) where.eventId = eventId;
    if (search) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.galleryMedia.count({ where }),
      prisma.galleryMedia.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        include: {
          event: { select: { id: true, title: true, slug: true } },
        },
      }),
    ]);

    return ok({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = await requireAdminOrStaff();
    const body = await req.json();
    const input = createGallerySchema.parse(body);

    if (input.eventId) {
      const event = await prisma.event.findUnique({
        where: { id: input.eventId },
        select: { id: true },
      });
      if (!event) {
        throw new AppError("Selected event does not exist.", 404);
      }
    }

    const media = await prisma.galleryMedia.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        type: input.type,
        category: input.category,
        url: input.url,
        thumbnailUrl: input.thumbnailUrl ?? null,
        altText: input.altText ?? null,
        isFeatured: input.isFeatured ?? false,
        status: input.status ?? MediaStatus.PUBLISHED,
        eventId: input.eventId ?? null,
      },
      include: {
        event: { select: { id: true, title: true } },
      },
    });

    await recordAuditLog({
      actorId: actor.id,
      action: "CREATE_GALLERY_MEDIA",
      entityType: "GalleryMedia",
      entityId: media.id,
      description: `Added gallery media "${media.title}"`,
      ipAddress: getClientIp(req),
    });

    return created({ media }, "Gallery item created successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

