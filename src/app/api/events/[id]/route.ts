import { NextRequest } from "next/server";
import { UserRole } from "@/generated/prisma/enums";
import { getCurrentUser, requireAdmin, requireAdminOrStaff } from "@/lib/auth";
import { updateEventSchema } from "@/lib/validations/event";
import {
  deleteEvent,
  getEventByIdOrSlug,
  updateEvent,
} from "@/services/event.service";
import { handleApiError, ok } from "@/lib/utils/api-response";
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

    const event = await getEventByIdOrSlug(id, isStaff);
    return ok({ event });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const actor = await requireAdminOrStaff();
    const { id } = await context.params;
    const body = await req.json();
    const input = updateEventSchema.parse(body);

    const event = await updateEvent(id, input, actor.id, getClientIp(req));
    return ok({ event }, "Event updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const actor = await requireAdmin();
    const { id } = await context.params;

    await deleteEvent(id, actor.id, getClientIp(req));
    return ok({ deleted: true }, "Event deleted successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

