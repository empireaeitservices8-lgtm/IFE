import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { cancelBooking } from "@/services/booking.service";
import { handleApiError, ok } from "@/lib/utils/api-response";
import { getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;

    const booking = await cancelBooking(
      id,
      { id: user.id, role: user.role },
      getClientIp(req)
    );
    return ok({ booking }, "Booking cancelled and tickets released.");
  } catch (error) {
    return handleApiError(error);
  }
}

