import { NextRequest } from "next/server";
import { loginSchema } from "@/lib/validations/auth";
import { loginUser } from "@/services/auth.service";
import { isHttpsRequest, setSessionCookie } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/utils/api-response";
import { enforceRateLimit, getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    enforceRateLimit(`auth:login:${ip}`, 15, 60_000);

    const body = await req.json();
    const input = loginSchema.parse(body);

    const { user, token } = await loginUser(input, ip);
    await setSessionCookie(token, isHttpsRequest(req));

    return ok({ user }, "Signed in successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

