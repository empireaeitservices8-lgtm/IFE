import { NextRequest } from "next/server";
import { requireAdminOrStaff } from "@/lib/auth";
import { listPayments } from "@/services/payment.service";
import { handleApiError, ok } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    await requireAdminOrStaff();
    const { searchParams } = new URL(req.url);

    const result = await listPayments({
      status: searchParams.get("status") ?? undefined,
      gateway: searchParams.get("gateway") ?? undefined,
      search: searchParams.get("search") ?? searchParams.get("q") ?? undefined,
      page: Number(searchParams.get("page") || 1),
      limit: Number(searchParams.get("limit") || 20),
    });

    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}

