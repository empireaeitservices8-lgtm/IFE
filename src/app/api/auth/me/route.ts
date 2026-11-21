import { getCurrentUser } from "@/lib/auth";
import { fail, handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return fail("Not authenticated.", 401);
    }
    return ok({ user });
  } catch (error) {
    return handleApiError(error);
  }
}

