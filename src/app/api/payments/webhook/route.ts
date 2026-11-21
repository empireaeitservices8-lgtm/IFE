import { NextRequest } from "next/server";
import { processRazorpayWebhook } from "@/services/payment.service";
import { fail, handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return fail("Missing Razorpay webhook signature header.", 400);
    }

    const rawBody = await req.text();
    const result = await processRazorpayWebhook(rawBody, signature);
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}

