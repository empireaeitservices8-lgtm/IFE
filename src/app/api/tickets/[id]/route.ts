import { NextRequest } from "next/server";
import { requireAdmin, requireAdminOrStaff } from "@/lib/auth";
import { updateTicketSchema } from "@/lib/validations/ticket";
import {
  deleteTicket,
  getTicketById,
  updateTicket,
} from "@/services/ticket.service";
import { handleApiError, ok } from "@/lib/utils/api-response";
import { getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const ticket = await getTicketById(id);
    return ok({ ticket });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const actor = await requireAdminOrStaff();
    const { id } = await context.params;
    const body = await req.json();
    const input = updateTicketSchema.parse(body);

    const ticket = await updateTicket(id, input, actor.id, getClientIp(req));
    return ok({ ticket }, "Ticket type updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const actor = await requireAdmin();
    const { id } = await context.params;

    await deleteTicket(id, actor.id, getClientIp(req));
    return ok({ deleted: true }, "Ticket type deleted successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

