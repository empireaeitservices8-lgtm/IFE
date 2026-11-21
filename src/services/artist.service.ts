import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { AppError } from "@/lib/utils/api-response";
import { recordAuditLog } from "@/lib/utils/audit";

export async function listArtists(params: {
  search?: string;
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Prisma.ArtistWhereInput = {};
  if (params.search) {
    const q = params.search.trim();
    where.OR = [
      { name: { contains: q } },
      { role: { contains: q } },
      { location: { contains: q } },
    ];
  }
  if (params.role) {
    where.role = { contains: params.role.trim() };
  }
  if (typeof params.isActive === "boolean") {
    where.isActive = params.isActive;
  }

  const [total, items] = await Promise.all([
    prisma.artist.count({ where }),
    prisma.artist.findMany({
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

export async function getArtistById(id: string) {
  const artist = await prisma.artist.findUnique({
    where: { id },
    include: {
      events: {
        include: {
          event: {
            select: {
              id: true,
              title: true,
              slug: true,
              startAt: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!artist) {
    throw new AppError("Artist not found.", 404);
  }

  return artist;
}

export async function createArtist(
  input: {
    name: string;
    email?: string | null;
    phone?: string | null;
    role: string;
    location?: string | null;
    imageUrl?: string | null;
    bio?: string | null;
    isActive?: boolean;
  },
  actorId: string,
  ipAddress?: string
) {
  if (input.email) {
    const exists = await prisma.artist.findUnique({
      where: { email: input.email },
      select: { id: true },
    });
    if (exists) {
      throw new AppError("An artist with this email already exists.", 409);
    }
  }

  const artist = await prisma.artist.create({
    data: {
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      role: input.role,
      location: input.location ?? null,
      imageUrl: input.imageUrl ?? null,
      bio: input.bio ?? null,
      isActive: input.isActive ?? true,
    },
  });

  await recordAuditLog({
    actorId,
    action: "CREATE_ARTIST",
    entityType: "Artist",
    entityId: artist.id,
    description: `Created artist "${artist.name}"`,
    ipAddress: ipAddress ?? null,
  });

  return artist;
}

export async function updateArtist(
  id: string,
  input: {
    name?: string;
    email?: string | null;
    phone?: string | null;
    role?: string;
    location?: string | null;
    imageUrl?: string | null;
    bio?: string | null;
    isActive?: boolean;
  },
  actorId: string,
  ipAddress?: string
) {
  const existing = await prisma.artist.findUnique({
    where: { id },
    select: { id: true, email: true },
  });
  if (!existing) {
    throw new AppError("Artist not found.", 404);
  }

  if (input.email && input.email !== existing.email) {
    const duplicate = await prisma.artist.findUnique({
      where: { email: input.email },
      select: { id: true },
    });
    if (duplicate) {
      throw new AppError("An artist with this email already exists.", 409);
    }
  }

  const artist = await prisma.artist.update({
    where: { id },
    data: input,
  });

  await recordAuditLog({
    actorId,
    action: "UPDATE_ARTIST",
    entityType: "Artist",
    entityId: artist.id,
    description: `Updated artist "${artist.name}"`,
    ipAddress: ipAddress ?? null,
  });

  return artist;
}

export async function deleteArtist(
  id: string,
  actorId: string,
  ipAddress?: string
) {
  const existing = await prisma.artist.findUnique({
    where: { id },
    select: { id: true, name: true },
  });
  if (!existing) {
    throw new AppError("Artist not found.", 404);
  }

  await prisma.artist.delete({ where: { id } });

  await recordAuditLog({
    actorId,
    action: "DELETE_ARTIST",
    entityType: "Artist",
    entityId: id,
    description: `Deleted artist "${existing.name}"`,
    ipAddress: ipAddress ?? null,
  });
}

