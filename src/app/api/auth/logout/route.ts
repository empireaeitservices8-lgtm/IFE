import { clearSessionCookie } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function POST() {
  try {
    await clearSessionCookie();
    return ok({ loggedOut: true }, "Signed out successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

