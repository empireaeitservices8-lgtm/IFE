import { NextRequest } from "next/server";
import { requireAdminOrStaff } from "@/lib/auth";
import { createArtistSchema } from "@/lib/validations/artist";
import { createArtist, listArtists } from "@/services/artist.service";
import { created, handleApiError, ok } from "@/lib/utils/api-response";
import { getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeParam = searchParams.get("isActive");

    const result = await listArtists({
      search: searchParams.get("search") ?? searchParams.get("q") ?? undefined,
      role: searchParams.get("role") ?? undefined,
      isActive:
        activeParam === "true"
          ? true
          : activeParam === "false"
            ? false
            : undefined,
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
    const input = createArtistSchema.parse(body);

    const artist = await createArtist(input, actor.id, getClientIp(req));
    return created({ artist }, "Artist created successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

