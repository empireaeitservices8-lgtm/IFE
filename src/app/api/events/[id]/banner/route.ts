import { NextRequest } from "next/server";
import { requireAdminOrStaff } from "@/lib/auth";
import { setBannerEventSchema } from "@/lib/validations/event";
import { setEventBannerFeatured } from "@/services/event.service";
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
    const { isBannerFeatured } = setBannerEventSchema.parse(body);

    const event = await setEventBannerFeatured(
      id,
      isBannerFeatured,
      actor.id,
      getClientIp(req)
    );
    return ok(
      { event },
      isBannerFeatured
        ? "Event set as homepage banner."
        : "Event removed from homepage banner."
    );
  } catch (error) {
    return handleApiError(error);
  }
}

