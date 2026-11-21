import { NextRequest } from "next/server";
import { getCurrentUser, requireAdminOrStaff } from "@/lib/auth";
import { createBookingSchema } from "@/lib/validations/booking";
import { createBooking, listBookings } from "@/services/booking.service";
import { created, handleApiError, ok } from "@/lib/utils/api-response";
import { enforceRateLimit, getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    await requireAdminOrStaff();
    const { searchParams } = new URL(req.url);

    const result = await listBookings({
      status: searchParams.get("status") ?? undefined,
      paymentStatus: searchParams.get("paymentStatus") ?? undefined,
      eventId: searchParams.get("eventId") ?? undefined,
      search: searchParams.get("search") ?? searchParams.get("q") ?? undefined,
      page: Number(searchParams.get("page") || 1),
      limit: Number(searchParams.get("limit") || 20),
    });

    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    enforceRateLimit(`bookings:create:${ip}`, 20, 60_000);

    const user = await getCurrentUser();
    const body = await req.json();
    const input = createBookingSchema.parse(body);

    const booking = await createBooking(input, user?.id ?? null);
    return created({ booking }, "Booking created successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

