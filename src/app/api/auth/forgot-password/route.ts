import { NextRequest } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { requestPasswordReset } from "@/services/auth.service";
import { handleApiError, ok } from "@/lib/utils/api-response";
import { enforceRateLimit, getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    enforceRateLimit(`auth:forgot:${ip}`, 5, 60_000);

    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    const result = await requestPasswordReset(email);

    // Never leak whether an email exists; only surface resetToken in non-production for local testing
    return ok(
      {
        requested: true,
        ...(process.env.NODE_ENV !== "production" && result.resetToken
          ? { devResetToken: result.resetToken }
          : {}),
      },
      "If an account exists for that email, a password reset link has been prepared."
    );
  } catch (error) {
    return handleApiError(error);
  }
}

