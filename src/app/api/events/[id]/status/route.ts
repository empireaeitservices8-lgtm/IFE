import { NextRequest } from "next/server";
import { requireAdminOrStaff } from "@/lib/auth";
import { updateEventStatusSchema } from "@/lib/validations/event";
import { updateEventStatus } from "@/services/event.service";
import { handleApiError, ok } from "@/lib/utils/api-response";
import { getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const actor = await requireAdminOrStaff();
    const { id } = await context.params;
    const body = await req.json();
    const { status } = updateEventStatusSchema.parse(body);

    const event = await updateEventStatus(id, status, actor.id, getClientIp(req));
    return ok({ event }, `Event status updated to ${status}.`);
  } catch (error) {
    return handleApiError(error);
  }
}

