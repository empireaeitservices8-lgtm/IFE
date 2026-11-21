import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminOrStaff } from "@/lib/auth";
import { AppError, handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    await requireAdminOrStaff();
    const { id } = await context.params;

    const customer = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        bookings: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: {
            event: { select: { id: true, title: true, startAt: true } },
          },
        },
      },
    });

    if (!customer) {
      throw new AppError("Customer not found.", 404);
    }

    return ok({ customer });
  } catch (error) {
    return handleApiError(error);
  }
}

