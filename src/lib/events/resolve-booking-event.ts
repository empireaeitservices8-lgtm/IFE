import { getEventByIdOrSlug } from "@/services/event.service";

export interface ResolvedBookingTicket {
  id: string;
  name: string;
  price: number;
  description: string | null;
  availableQuantity: number;
}

export interface ResolvedBookingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  isComingSoon: boolean;
  ticketTypes: ResolvedBookingTicket[];
}

export async function resolveBookingEvent(
  idOrSlug: string
): Promise<ResolvedBookingEvent | null> {
  try {
    const dbEvent = await getEventByIdOrSlug(idOrSlug, false);
    const start = new Date(dbEvent.startAt);
    return {
      id: dbEvent.id,
      title: dbEvent.title,
      date: start.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      }),
      time: start.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      }),
      venue: dbEvent.venue
        ? `${dbEvent.venue.name}, ${dbEvent.venue.city}`
        : "Venue to be announced",
      isComingSoon: Boolean(dbEvent.isComingSoon),
      ticketTypes: (dbEvent.ticketTypes || []).map((t) => ({
        id: t.id,
        name: t.name,
        price: Number(t.price),
        description: t.description ?? null,
        availableQuantity: t.availableQuantity,
      })),
    };
  } catch {
    return null;
  }
}

