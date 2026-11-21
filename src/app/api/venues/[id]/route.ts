import { NextRequest } from "next/server";
import { requireAdmin, requireAdminOrStaff } from "@/lib/auth";
import { updateVenueSchema } from "@/lib/validations/venue";
import {
  deleteVenue,
  getVenueById,
  updateVenue,
} from "@/services/venue.service";
import { handleApiError, ok } from "@/lib/utils/api-response";
import { getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const venue = await getVenueById(id);
    return ok({ venue });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const actor = await requireAdminOrStaff();
    const { id } = await context.params;
    const body = await req.json();
    const input = updateVenueSchema.parse(body);

    const venue = await updateVenue(id, input, actor.id, getClientIp(req));
    return ok({ venue }, "Venue updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const actor = await requireAdmin();
    const { id } = await context.params;

    await deleteVenue(id, actor.id, getClientIp(req));
    return ok({ deleted: true }, "Venue deleted successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

