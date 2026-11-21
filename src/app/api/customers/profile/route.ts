import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validations/customer";
import { AppError, handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireAuth();
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            bookings: true,
            notifications: true,
          },
        },
      },
    });

    if (!profile) {
      throw new AppError("Profile not found.", 404);
    }

    return ok({ profile });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const input = updateProfileSchema.parse(body);

    if (input.phone && input.phone !== user.phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone: input.phone },
        select: { id: true },
      });
      if (existingPhone && existingPhone.id !== user.id) {
        throw new AppError("This phone number is already in use.", 409);
      }
    }

    const profile = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: input.name,
        phone: input.phone ?? null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return ok({ profile }, "Profile updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

