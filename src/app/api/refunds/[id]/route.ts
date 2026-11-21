import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getRefundById } from "@/services/refund.service";
import { handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;

    const refund = await getRefundById(id);
    return ok({ refund });
  } catch (error) {
    return handleApiError(error);
  }
}

