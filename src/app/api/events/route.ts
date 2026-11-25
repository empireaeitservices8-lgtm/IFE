import { NextRequest } from "next/server";
import { UserRole } from "@/generated/prisma/enums";
import { getCurrentUser, requireAdminOrStaff } from "@/lib/auth";
import { createEventSchema } from "@/lib/validations/event";
import { createEvent, listEvents } from "@/services/event.service";
import { created, handleApiError, ok } from "@/lib/utils/api-response";
import { getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user = await getCurrentUser();
    const isStaff =
      user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF;

    const result = await listEvents({
      search: searchParams.get("search") ?? searchParams.get("q") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      page: Number(searchParams.get("page") || 1),
      limit: Number(searchParams.get("limit") || 12),
      includeUnpublished: isStaff,
    });

    const response = ok(result);
    if (!isStaff) {
      response.headers.set(
        "Cache-Control",
        "public, s-maxage=30, stale-while-revalidate=60"
      );
    }
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = await requireAdminOrStaff();
    const body = await req.json();
    const input = createEventSchema.parse(body);

    const event = await createEvent(input, actor.id, getClientIp(req));
    return created({ event }, "Event created successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

