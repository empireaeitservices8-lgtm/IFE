import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createRefundSchema } from "@/lib/validations/payment";
import { createRefund, listRefunds } from "@/services/refund.service";
import { created, handleApiError, ok } from "@/lib/utils/api-response";
import { getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);

    const result = await listRefunds({
      status: searchParams.get("status") ?? undefined,
      paymentId: searchParams.get("paymentId") ?? undefined,
      page: Number(searchParams.get("page") || 1),
      limit: Number(searchParams.get("limit") || 20),
    });

    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const input = createRefundSchema.parse(body);

    const refund = await createRefund(input, admin.id, getClientIp(req));
    return created({ refund }, "Refund initiated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

