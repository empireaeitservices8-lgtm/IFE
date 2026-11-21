import { NextRequest } from "next/server";
import { requireAdminOrStaff } from "@/lib/auth";
import { createVenueSchema } from "@/lib/validations/venue";
import { createVenue, listVenues } from "@/services/venue.service";
import { created, handleApiError, ok } from "@/lib/utils/api-response";
import { getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const result = await listVenues({
      search: searchParams.get("search") ?? searchParams.get("q") ?? undefined,
      city: searchParams.get("city") ?? undefined,
      status: searchParams.get("status") ?? undefined,
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
    const actor = await requireAdminOrStaff();
    const body = await req.json();
    const input = createVenueSchema.parse(body);

    const venue = await createVenue(input, actor.id, getClientIp(req));
    return created({ venue }, "Venue created successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

