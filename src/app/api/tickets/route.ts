import { NextRequest } from "next/server";
import { requireAdminOrStaff } from "@/lib/auth";
import { createTicketSchema } from "@/lib/validations/ticket";
import { createTicket, listTickets } from "@/services/ticket.service";
import { created, handleApiError, ok } from "@/lib/utils/api-response";
import { getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const result = await listTickets({
      eventId: searchParams.get("eventId") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      search: searchParams.get("search") ?? searchParams.get("q") ?? undefined,
      page: Number(searchParams.get("page") || 1),
      limit: Number(searchParams.get("limit") || 50),
    });

    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = await requireAdminOrStaff();
    const body = await req.json();
    const input = createTicketSchema.parse(body);

    const ticket = await createTicket(input, actor.id, getClientIp(req));
    return created({ ticket }, "Ticket type created successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

