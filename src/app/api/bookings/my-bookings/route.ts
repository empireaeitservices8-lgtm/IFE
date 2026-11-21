import { requireAuth } from "@/lib/auth";
import { listMyBookings } from "@/services/booking.service";
import { handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireAuth();
    const items = await listMyBookings(user.id);
    return ok({ items });
  } catch (error) {
    return handleApiError(error);
  }
}

