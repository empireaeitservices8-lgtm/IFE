import { NextRequest } from "next/server";
import { requireAdminOrStaff } from "@/lib/auth";
import { confirmBooking } from "@/services/booking.service";
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

    const booking = await confirmBooking(id, actor.id, getClientIp(req));
    return ok({ booking }, "Booking confirmed successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

