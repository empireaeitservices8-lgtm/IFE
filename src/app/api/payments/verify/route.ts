import { NextRequest } from "next/server";
import { verifyPaymentSchema } from "@/lib/validations/payment";
import { verifyAndCapturePayment } from "@/services/payment.service";
import { handleApiError, ok } from "@/lib/utils/api-response";
import { enforceRateLimit, getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    enforceRateLimit(`payments:verify:${ip}`, 20, 60_000);

    const body = await req.json();
    const input = verifyPaymentSchema.parse(body);

    const result = await verifyAndCapturePayment(input);
    return ok(result, "Payment verified and booking confirmed.");
  } catch (error) {
    return handleApiError(error);
  }
}

