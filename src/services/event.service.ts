import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  EventCategory,
  EventStatus,
  TicketStatus,
} from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { AppError } from "@/lib/utils/api-response";
import { recordAuditLog } from "@/lib/utils/audit";

export function invalidatePublicEventCache() {
  try {
    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/events/[id]", "page");
    revalidatePath("/events/[id]/tickets", "page");
    revalidatePath("/fashion-shows");
    revalidatePath("/entertainment");
  } catch {
    // Ignore when called outside a Next.js request/route context
  }
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(base: string, excludeId?: string): Promise<string> {
  const clean = slugify(base) || `event-${Date.now()}`;
  let candidate = clean;
  let counter = 1;

  while (true) {
    const existing = await prisma.event.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) {
      return candidate;
    }
    candidate = `${clean}-${counter}`;
    counter += 1;
  }
}

export async function listEvents(params: {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
  includeUnpublished?: boolean;
}) {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 12));
  const skip = (page - 1) * limit;

  const where: Prisma.EventWhereInput = {};

  if (params.search) {
    const q = params.search.trim();
    where.OR = [
      { title: { contains: q } },
      { shortDescription: { contains: q } },
      { description: { contains: q } },
      { venue: { name: { contains: q } } },
      { venue: { city: { contains: q } } },
    ];
  }

  if (
    params.category &&
    params.category !== "ALL" &&
    Object.values(EventCategory).includes(params.category as EventCategory)
  ) {
    where.category = params.category as EventCategory;
  }

  if (params.includeUnpublished) {
    if (
      params.status &&
      params.status !== "ALL" &&
      Object.values(EventStatus).includes(params.status as EventStatus)
    ) {
      where.status = params.status as EventStatus;
    }
  } else {
    where.status = EventStatus.PUBLISHED;
  }

  const isPublicQuery = !params.includeUnpublished;

  const [total, items] = await Promise.all([
    prisma.event.count({ where }),
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ displayOrder: "asc" }, { startAt: "asc" }],
      include: isPublicQuery
        ? {
          venue: { select: { id: true, name: true, city: true } },
          ticketTypes: {
            where: { status: { not: TicketStatus.PAUSED } },
            orderBy: { price: "asc" },
          },
        }
        : {
          venue: true,
          artists: {
            include: {
              artist: true,
            },
          },
          ticketTypes: {
            orderBy: { price: "asc" },
          },
          _count: {
            select: { bookings: true },
          },
        },
    }),
  ]);

  const enriched = items.map((event) => ({
    ...event,
    ticketTypes: event.ticketTypes.map((t) => ({
      ...t,
      availableQuantity: Math.max(0, t.totalQuantity - t.soldQuantity),
    })),
  }));

  const payload = {
    items: enriched,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };

  return payload;
}

async function fetchEventByIdOrSlug(
  idOrSlug: string,
  includeUnpublished = false
) {
  const event = await prisma.event.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      ...(includeUnpublished ? {} : { status: EventStatus.PUBLISHED }),
    },
    include: {
      venue: true,
      artists: {
        include: {
          artist: true,
        },
      },
      ticketTypes: {
        where: includeUnpublished
          ? undefined
          : { status: { not: TicketStatus.PAUSED } },
        orderBy: { price: "asc" },
      },
      gallery: {
        where: includeUnpublished ? undefined : { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!event) {
    throw new AppError("Event not found.", 404);
  }

  return {
    ...event,
    ticketTypes: event.ticketTypes.map((t) => ({
      ...t,
      availableQuantity: Math.max(0, t.totalQuantity - t.soldQuantity),
    })),
  };
}

export async function getEventByIdOrSlug(
  idOrSlug: string,
  includeUnpublished = false
) {
  return fetchEventByIdOrSlug(idOrSlug, includeUnpublished);
}

export async function createEvent(
  input: {
    title: string;
    slug?: string;
    category: EventCategory;
    shortDescription?: string | null;
    description: string;
    bannerUrl?: string | null;
    startAt: Date;
    endAt: Date;
    capacity: number;
    status?: EventStatus;
    isPopupFeatured?: boolean;
    isBannerFeatured?: boolean;
    venueId?: string | null;
    artists?: { artistId: string; eventRole?: string | null }[];
    ticketTypes?: {
      name: string;
      description?: string | null;
      price: number;
      totalQuantity: number;
      status?: TicketStatus;
    }[];
  },
  actorId: string,
  ipAddress?: string
) {
  if (input.venueId) {
    const venue = await prisma.venue.findUnique({
      where: { id: input.venueId },
      select: { id: true },
    });
    if (!venue) {
      throw new AppError("Selected venue does not exist.", 400);
    }
  }

  if (input.artists && input.artists.length > 0) {
    const artistIds = [...new Set(input.artists.map((a) => a.artistId))];
    const count = await prisma.artist.count({
      where: { id: { in: artistIds } },
    });
    if (count !== artistIds.length) {
      throw new AppError("One or more selected artists do not exist.", 400);
    }
  }

  const slug = await generateUniqueSlug(input.slug || input.title);
  const status = input.status ?? EventStatus.DRAFT;

  const event = await prisma.$transaction(async (tx) => {
    if (input.isPopupFeatured) {
      await tx.event.updateMany({
        where: { isPopupFeatured: true },
        data: { isPopupFeatured: false },
      });
    }
    if (input.isBannerFeatured) {
      await tx.event.updateMany({
        where: { isBannerFeatured: true },
        data: { isBannerFeatured: false },
      });
    }

    const created = await tx.event.create({
      data: {
        title: input.title,
        slug,
        category: input.category,
        shortDescription: input.shortDescription ?? null,
        description: input.description,
        bannerUrl: input.bannerUrl ?? null,
        startAt: input.startAt,
        endAt: input.endAt,
        capacity: input.capacity,
        status,
        isPopupFeatured: input.isPopupFeatured ?? false,
        isBannerFeatured: input.isBannerFeatured ?? false,
        publishedAt: status === EventStatus.PUBLISHED ? new Date() : null,
        venueId: input.venueId ?? null,
        createdById: actorId,
        artists:
          input.artists && input.artists.length > 0
            ? {
              create: input.artists.map((a) => ({
                artistId: a.artistId,
                eventRole: a.eventRole ?? null,
              })),
            }
            : undefined,
        ticketTypes:
          input.ticketTypes && input.ticketTypes.length > 0
            ? {
              create: input.ticketTypes.map((t) => ({
                name: t.name,
                description: t.description ?? null,
                price: new Prisma.Decimal(t.price),
                totalQuantity: t.totalQuantity,
                status: t.status ?? TicketStatus.ACTIVE,
              })),
            }
            : undefined,
      },
      include: {
        venue: true,
        artists: { include: { artist: true } },
        ticketTypes: true,
      },
    });

    return created;
  }, { timeout: 15000, maxWait: 10000 });

  await recordAuditLog({
    actorId,
    action: "CREATE_EVENT",
    entityType: "Event",
    entityId: event.id,
    description: `Created event "${event.title}"`,
    ipAddress: ipAddress ?? null,
  });

  invalidatePublicEventCache();
  return event;
}

export async function updateEvent(
  id: string,
  input: {
    title?: string;
    slug?: string;
    category?: EventCategory;
    shortDescription?: string | null;
    description?: string;
    bannerUrl?: string | null;
    startAt?: Date;
    endAt?: Date;
    capacity?: number;
    status?: EventStatus;
    isPopupFeatured?: boolean;
    isBannerFeatured?: boolean;
    venueId?: string | null;
    artists?: { artistId: string; eventRole?: string | null }[];
    ticketTypes?: {
      id?: string;
      name: string;
      description?: string | null;
      price: number;
      totalQuantity: number;
      status?: TicketStatus;
    }[];
  },
  actorId: string,
  ipAddress?: string
) {
  const existing = await prisma.event.findUnique({
    where: { id },
    select: { id: true, title: true, startAt: true, endAt: true, publishedAt: true },
  });

  if (!existing) {
    throw new AppError("Event not found.", 404);
  }

  const nextStart = input.startAt ?? existing.startAt;
  const nextEnd = input.endAt ?? existing.endAt;
  if (nextEnd <= nextStart) {
    throw new AppError("End date/time must be after start date/time.", 400);
  }

  if (input.venueId) {
    const venue = await prisma.venue.findUnique({
      where: { id: input.venueId },
      select: { id: true },
    });
    if (!venue) {
      throw new AppError("Selected venue does not exist.", 400);
    }
  }

  const nextSlug = input.slug
    ? await generateUniqueSlug(input.slug, id)
    : undefined;

    await prisma.$transaction(async (tx) => {
      if (input.isPopupFeatured) {
        await tx.event.updateMany({
          where: { id: { not: id }, isPopupFeatured: true },
          data: { isPopupFeatured: false },
        });
      }
      if (input.isBannerFeatured) {
        await tx.event.updateMany({
          where: { id: { not: id }, isBannerFeatured: true },
          data: { isBannerFeatured: false },
        });
      }

      if (input.artists !== undefined) {
        await tx.artistEvent.deleteMany({ where: { eventId: id } });
        if (input.artists.length > 0) {
          await tx.artistEvent.createMany({
            data: input.artists.map((a) => ({
              eventId: id,
              artistId: a.artistId,
              eventRole: a.eventRole ?? null,
            })),
          });
        }
      }

      if (input.ticketTypes !== undefined) {
        for (const t of input.ticketTypes) {
          if (t.id) {
            await tx.ticketType.update({
              where: { id: t.id, eventId: id },
              data: {
                name: t.name,
                ...(t.description !== undefined
                  ? { description: t.description }
                  : {}),
                price: new Prisma.Decimal(t.price),
                totalQuantity: t.totalQuantity,
                ...(t.status ? { status: t.status } : {}),
              },
            });
          } else {
            await tx.ticketType.upsert({
              where: {
                eventId_name: {
                  eventId: id,
                  name: t.name,
                },
              },
              update: {
                ...(t.description !== undefined
                  ? { description: t.description }
                  : {}),
                price: new Prisma.Decimal(t.price),
                totalQuantity: t.totalQuantity,
                ...(t.status ? { status: t.status } : {}),
              },
              create: {
                eventId: id,
                name: t.name,
                description: t.description ?? null,
                price: new Prisma.Decimal(t.price),
                totalQuantity: t.totalQuantity,
                status: t.status ?? TicketStatus.ACTIVE,
              },
            });
          }
        }
      }

      return tx.event.update({
        where: { id },
        data: {
          ...(input.title !== undefined ? { title: input.title } : {}),
          ...(nextSlug !== undefined ? { slug: nextSlug } : {}),
          ...(input.category !== undefined ? { category: input.category } : {}),
          ...(input.shortDescription !== undefined
            ? { shortDescription: input.shortDescription }
            : {}),
          ...(input.description !== undefined
            ? { description: input.description }
            : {}),
          ...(input.bannerUrl !== undefined ? { bannerUrl: input.bannerUrl } : {}),
          ...(input.startAt !== undefined ? { startAt: input.startAt } : {}),
          ...(input.endAt !== undefined ? { endAt: input.endAt } : {}),
          ...(input.capacity !== undefined ? { capacity: input.capacity } : {}),
          ...(input.isPopupFeatured !== undefined
            ? { isPopupFeatured: input.isPopupFeatured }
            : {}),
          ...(input.isBannerFeatured !== undefined
            ? { isBannerFeatured: input.isBannerFeatured }
            : {}),
          ...(input.venueId !== undefined ? { venueId: input.venueId } : {}),
          ...(input.status !== undefined
            ? {
              status: input.status,
              publishedAt:
                input.status === EventStatus.PUBLISHED && !existing.publishedAt
                  ? new Date()
                  : existing.publishedAt,
            }
            : {}),
        },
        select: { id: true, title: true },
      });
  }, { timeout: 25000, maxWait: 10000 });

  const updated = await fetchEventByIdOrSlug(id, true);

  await recordAuditLog({
    actorId,
    action: "UPDATE_EVENT",
    entityType: "Event",
    entityId: id,
    description: `Updated event "${updated.title}"`,
    ipAddress: ipAddress ?? null,
  });

  invalidatePublicEventCache();
  return updated;
}

export async function updateEventStatus(
  id: string,
  status: EventStatus,
  actorId: string,
  ipAddress?: string
) {
  const existing = await prisma.event.findUnique({
    where: { id },
    select: { id: true, title: true, publishedAt: true },
  });

  if (!existing) {
    throw new AppError("Event not found.", 404);
  }

  const updated = await prisma.event.update({
    where: { id },
    data: {
      status,
      publishedAt:
        status === EventStatus.PUBLISHED && !existing.publishedAt
          ? new Date()
          : existing.publishedAt,
    },
    include: {
      venue: true,
      ticketTypes: true,
    },
  });

  await recordAuditLog({
    actorId,
    action: "UPDATE_EVENT_STATUS",
    entityType: "Event",
    entityId: id,
    description: `Changed status of "${existing.title}" to ${status}`,
    ipAddress: ipAddress ?? null,
  });

  invalidatePublicEventCache();
  return updated;
}

export async function setEventPopupFeatured(
  id: string,
  isPopupFeatured: boolean,
  actorId: string,
  ipAddress?: string
) {
  const existing = await prisma.event.findUnique({
    where: { id },
    select: { id: true, title: true, status: true },
  });

  if (!existing) {
    throw new AppError("Event not found.", 404);
  }

  if (isPopupFeatured && existing.status !== EventStatus.PUBLISHED) {
    throw new AppError(
      "Only published events can be featured in the homepage popup.",
      400
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (isPopupFeatured) {
      await tx.event.updateMany({
        where: { id: { not: id }, isPopupFeatured: true },
        data: { isPopupFeatured: false },
      });
    }

    return tx.event.update({
      where: { id },
      data: { isPopupFeatured },
      select: { id: true, title: true, isPopupFeatured: true },
    });
  }, { timeout: 15000, maxWait: 10000 });

  await recordAuditLog({
    actorId,
    action: "SET_POPUP_EVENT",
    entityType: "Event",
    entityId: id,
    description: isPopupFeatured
      ? `Set "${existing.title}" as homepage popup`
      : `Removed "${existing.title}" from homepage popup`,
    ipAddress: ipAddress ?? null,
  });

  invalidatePublicEventCache();
  return updated;
}

export async function setEventBannerFeatured(
  id: string,
  isBannerFeatured: boolean,
  actorId: string,
  ipAddress?: string
) {
  const existing = await prisma.event.findUnique({
    where: { id },
    select: { id: true, title: true, status: true },
  });

  if (!existing) {
    throw new AppError("Event not found.", 404);
  }

  if (isBannerFeatured && existing.status !== EventStatus.PUBLISHED) {
    throw new AppError(
      "Only published events can be featured in the homepage banner.",
      400
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (isBannerFeatured) {
      await tx.event.updateMany({
        where: { id: { not: id }, isBannerFeatured: true },
        data: { isBannerFeatured: false },
      });
    }

    return tx.event.update({
      where: { id },
      data: { isBannerFeatured },
      select: { id: true, title: true, isBannerFeatured: true },
    });
  }, { timeout: 15000, maxWait: 10000 });

  await recordAuditLog({
    actorId,
    action: "SET_BANNER_EVENT",
    entityType: "Event",
    entityId: id,
    description: isBannerFeatured
      ? `Set "${existing.title}" as homepage banner`
      : `Removed "${existing.title}" from homepage banner`,
    ipAddress: ipAddress ?? null,
  });

  invalidatePublicEventCache();
  return updated;
}

export async function deleteEvent(
  id: string,
  actorId: string,
  ipAddress?: string
) {
  const existing = await prisma.event.findUnique({
    where: { id },
    include: {
      _count: { select: { bookings: true } },
    },
  });

  if (!existing) {
    throw new AppError("Event not found.", 404);
  }

  if (existing._count.bookings > 0) {
    throw new AppError(
      "Cannot delete an event with existing bookings. Cancel the event instead.",
      409
    );
  }

  await prisma.event.delete({ where: { id } });
  invalidatePublicEventCache();

  await recordAuditLog({
    actorId,
    action: "DELETE_EVENT",
    entityType: "Event",
    entityId: id,
    description: `Deleted event "${existing.title}"`,
    ipAddress: ipAddress ?? null,
  });
}

