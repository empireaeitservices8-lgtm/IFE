import { NextRequest } from "next/server";
import { clearSessionCookie, isHttpsRequest } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await clearSessionCookie(isHttpsRequest(req));
    return ok({ loggedOut: true }, "Signed out successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

