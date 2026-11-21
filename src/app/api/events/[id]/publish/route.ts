import { NextRequest } from "next/server";
import { EventStatus } from "@/generated/prisma/enums";
import { requireAdminOrStaff } from "@/lib/auth";
import { publishEventSchema } from "@/lib/validations/event";
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

    const rawBody = await req.text();
    const parsed = rawBody
      ? publishEventSchema.parse(JSON.parse(rawBody))
      : { publish: true };

    const targetStatus = parsed.publish
      ? EventStatus.PUBLISHED
      : EventStatus.DRAFT;

    const event = await updateEventStatus(
      id,
      targetStatus,
      actor.id,
      getClientIp(req)
    );

    return ok(
      { event },
      parsed.publish
        ? "Event published successfully."
        : "Event moved to draft."
    );
  } catch (error) {
    return handleApiError(error);
  }
}

