import { NextRequest } from "next/server";
import { requireAdminOrStaff } from "@/lib/auth";
import { updateTicketStatusSchema } from "@/lib/validations/ticket";
import { updateTicketStatus } from "@/services/ticket.service";
import { handleApiError, ok } from "@/lib/utils/api-response";
import { getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const actor = await requireAdminOrStaff();
    const { id } = await context.params;
    const body = await req.json();
    const { status } = updateTicketStatusSchema.parse(body);

    const ticket = await updateTicketStatus(
      id,
      status,
      actor.id,
      getClientIp(req)
    );
    return ok({ ticket }, `Ticket status updated to ${status}.`);
  } catch (error) {
    return handleApiError(error);
  }
}

