import { NextRequest } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import { registerUser } from "@/services/auth.service";
import { isHttpsRequest, setSessionCookie } from "@/lib/auth";
import { created, handleApiError } from "@/lib/utils/api-response";
import { enforceRateLimit, getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    enforceRateLimit(`auth:register:${ip}`, 10, 60_000);

    const body = await req.json();
    const input = registerSchema.parse(body);

    const { user, token } = await registerUser(input);
    await setSessionCookie(token, isHttpsRequest(req));

    return created({ user }, "Account created successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

