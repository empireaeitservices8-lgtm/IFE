import { NextRequest } from "next/server";
import { requireAdminOrStaff } from "@/lib/auth";
import { setComingSoonEventSchema } from "@/lib/validations/event";
import { setEventComingSoon } from "@/services/event.service";
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
    const { isComingSoon } = setComingSoonEventSchema.parse(body);

    const event = await setEventComingSoon(
      id,
      isComingSoon,
      actor.id,
      getClientIp(req)
    );
    return ok(
      { event },
      isComingSoon
        ? "Event marked as Coming Soon."
        : "Coming Soon removed from event."
    );
  } catch (error) {
    return handleApiError(error);
  }
}

