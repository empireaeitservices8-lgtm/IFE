import { getCurrentUser } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return ok({ user: user ?? null });
  } catch (error) {
    return handleApiError(error);
  }
}

