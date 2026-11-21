import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole, UserStatus } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { requireAdminOrStaff } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    await requireAdminOrStaff();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 20)));
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      role: UserRole.CUSTOMER,
    };

    const status = searchParams.get("status");
    const search = searchParams.get("search") ?? searchParams.get("q");

    if (
      status &&
      status !== "ALL" &&
      Object.values(UserStatus).includes(status as UserStatus)
    ) {
      where.status = status as UserStatus;
    }

    if (search) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { bookings: true } },
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

