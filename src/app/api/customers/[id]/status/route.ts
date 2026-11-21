import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { updateCustomerStatusSchema } from "@/lib/validations/customer";
import { AppError, handleApiError, ok } from "@/lib/utils/api-response";
import { recordAuditLog } from "@/lib/utils/audit";
import { getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const admin = await requireAdmin();
    const { id } = await context.params;
    const body = await req.json();
    const { status } = updateCustomerStatusSchema.parse(body);

    if (id === admin.id) {
      throw new AppError("You cannot change your own account status.", 400);
    }

    const existing = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true },
    });
    if (!existing) {
      throw new AppError("Customer not found.", 404);
    }

    const customer = await prisma.user.update({
      where: { id },
      data: { status },
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

    await recordAuditLog({
      actorId: admin.id,
      action: "UPDATE_CUSTOMER_STATUS",
      entityType: "User",
      entityId: id,
      description: `Updated status of ${existing.email} to ${status}`,
      ipAddress: getClientIp(req),
    });

    return ok({ customer }, `Customer status updated to ${status}.`);
  } catch (error) {
    return handleApiError(error);
  }
}

