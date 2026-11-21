import { NextRequest } from "next/server";
import { requireAdmin, requireAdminOrStaff } from "@/lib/auth";
import { updateArtistSchema } from "@/lib/validations/artist";
import {
  deleteArtist,
  getArtistById,
  updateArtist,
} from "@/services/artist.service";
import { handleApiError, ok } from "@/lib/utils/api-response";
import { getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const artist = await getArtistById(id);
    return ok({ artist });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const actor = await requireAdminOrStaff();
    const { id } = await context.params;
    const body = await req.json();
    const input = updateArtistSchema.parse(body);

    const artist = await updateArtist(id, input, actor.id, getClientIp(req));
    return ok({ artist }, "Artist updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const actor = await requireAdmin();
    const { id } = await context.params;

    await deleteArtist(id, actor.id, getClientIp(req));
    return ok({ deleted: true }, "Artist deleted successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

