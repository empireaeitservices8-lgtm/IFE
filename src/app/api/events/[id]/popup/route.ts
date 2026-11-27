import { NextRequest } from "next/server";
import { requireAdminOrStaff } from "@/lib/auth";
import { setPopupEventSchema } from "@/lib/validations/event";
import { setEventPopupFeatured } from "@/services/event.service";
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
    const { isPopupFeatured } = setPopupEventSchema.parse(body);

    const event = await setEventPopupFeatured(
      id,
      isPopupFeatured,
      actor.id,
      getClientIp(req)
    );
    return ok(
      { event },
      isPopupFeatured
        ? "Event set as homepage popup."
        : "Event removed from homepage popup."
    );
  } catch (error) {
    return handleApiError(error);
  }
}

