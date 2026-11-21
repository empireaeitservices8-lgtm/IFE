import { NextRequest } from "next/server";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { resetUserPassword } from "@/services/auth.service";
import { handleApiError, ok } from "@/lib/utils/api-response";
import { enforceRateLimit, getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    enforceRateLimit(`auth:reset:${ip}`, 10, 60_000);

    const body = await req.json();
    const input = resetPasswordSchema.parse(body);

    await resetUserPassword(input);

    return ok({ reset: true }, "Password has been reset successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

