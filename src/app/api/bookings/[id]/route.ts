import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getBookingById } from "@/services/booking.service";
import { handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;

    const booking = await getBookingById(id, { id: user.id, role: user.role });
    return ok({ booking });
  } catch (error) {
    return handleApiError(error);
  }
}

