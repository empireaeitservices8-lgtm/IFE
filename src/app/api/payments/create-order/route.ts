import { NextRequest } from "next/server";
import { createOrderSchema } from "@/lib/validations/payment";
import { createRazorpayOrder } from "@/services/payment.service";
import { created, handleApiError } from "@/lib/utils/api-response";
import { enforceRateLimit, getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    enforceRateLimit(`payments:order:${ip}`, 20, 60_000);

    const body = await req.json();
    const { bookingId } = createOrderSchema.parse(body);

    const order = await createRazorpayOrder(bookingId);
    return created(order, "Payment order created.");
  } catch (error) {
    return handleApiError(error);
  }
}

