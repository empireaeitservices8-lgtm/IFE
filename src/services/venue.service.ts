import { prisma } from "@/lib/prisma";
import { VenueStatus } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { AppError } from "@/lib/utils/api-response";
import { recordAuditLog } from "@/lib/utils/audit";

export async function listVenues(params: {
  search?: string;
  city?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Prisma.VenueWhereInput = {};
  if (params.search) {
    const q = params.search.trim();
    where.OR = [
      { name: { contains: q } },
      { address: { contains: q } },
      { city: { contains: q } },
    ];
  }
  if (params.city) {
    where.city = { contains: params.city.trim() };
  }
  if (
    params.status &&
    params.status !== "ALL" &&
    Object.values(VenueStatus).includes(params.status as VenueStatus)
  ) {
    where.status = params.status as VenueStatus;
  }

  const [total, items] = await Promise.all([
    prisma.venue.count({ where }),
    prisma.venue.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { events: true } },
      },
    }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getVenueById(id: string) {
  const venue = await prisma.venue.findUnique({
    where: { id },
    include: {
      events: {
        select: {
          id: true,
          title: true,
          slug: true,
          startAt: true,
          status: true,
        },
        orderBy: { startAt: "asc" },
      },
    },
  });

  if (!venue) {
    throw new AppError("Venue not found.", 404);
  }

  return venue;
}

export async function createVenue(
  input: {
    name: string;
    address: string;
    city: string;
    state?: string | null;
    country?: string;
    postalCode?: string | null;
    capacity: number;
    description?: string | null;
    facilities?: string | null;
    status?: VenueStatus;
  },
  actorId: string,
  ipAddress?: string
) {
  const venue = await prisma.venue.create({
    data: {
      name: input.name,
      address: input.address,
      city: input.city,
      state: input.state ?? null,
      country: input.country ?? "India",
      postalCode: input.postalCode ?? null,
      capacity: input.capacity,
      description: input.description ?? null,
      facilities: input.facilities ?? null,
      status: input.status ?? VenueStatus.AVAILABLE,
    },
  });

  await recordAuditLog({
    actorId,
    action: "CREATE_VENUE",
    entityType: "Venue",
    entityId: venue.id,
    description: `Created venue "${venue.name}"`,
    ipAddress: ipAddress ?? null,
  });

  return venue;
}

export async function updateVenue(
  id: string,
  input: {
    name?: string;
    address?: string;
    city?: string;
    state?: string | null;
    country?: string;
    postalCode?: string | null;
    capacity?: number;
    description?: string | null;
    facilities?: string | null;
    status?: VenueStatus;
  },
  actorId: string,
  ipAddress?: string
) {
  const existing = await prisma.venue.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) {
    throw new AppError("Venue not found.", 404);
  }

  const venue = await prisma.venue.update({
    where: { id },
    data: input,
  });

  await recordAuditLog({
    actorId,
    action: "UPDATE_VENUE",
    entityType: "Venue",
    entityId: venue.id,
    description: `Updated venue "${venue.name}"`,
    ipAddress: ipAddress ?? null,
  });

  return venue;
}

export async function deleteVenue(
  id: string,
  actorId: string,
  ipAddress?: string
) {
  const existing = await prisma.venue.findUnique({
    where: { id },
    select: { id: true, name: true },
  });
  if (!existing) {
    throw new AppError("Venue not found.", 404);
  }

  await prisma.venue.delete({ where: { id } });

  await recordAuditLog({
    actorId,
    action: "DELETE_VENUE",
    entityType: "Venue",
    entityId: id,
    description: `Deleted venue "${existing.name}"`,
    ipAddress: ipAddress ?? null,
  });
}

