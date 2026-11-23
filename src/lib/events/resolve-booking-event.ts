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
  ticketTypes: ResolvedBookingTicket[];
}

const legacyDemoEvents: Record<
  string,
  { title: string; date: string; time: string; venue: string }
> = {
  "1": {
    title: "The IFE Fashion Showcase",
    date: "Date to be announced",
    time: "To Be Announced",
    venue: "Venue to be announced",
  },
  "2": {
    title: "Live Beyond",
    date: "Date to be announced",
    time: "To Be Announced",
    venue: "Venue to be announced",
  },
  "3": {
    title: "Excellence Awards",
    date: "Date to be announced",
    time: "To Be Announced",
    venue: "Venue to be announced",
  },
  "4": {
    title: "Runway Stories",
    date: "Date to be announced",
    time: "To Be Announced",
    venue: "Venue to be announced",
  },
  "5": {
    title: "The Grand Celebration",
    date: "Date to be announced",
    time: "To Be Announced",
    venue: "Venue to be announced",
  },
  "6": {
    title: "Creative Icons",
    date: "Date to be announced",
    time: "To Be Announced",
    venue: "Venue to be announced",
  },
};

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
      }),
      time: start.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      venue: dbEvent.venue
        ? `${dbEvent.venue.name}, ${dbEvent.venue.city}`
        : "Venue to be announced",
      ticketTypes: (dbEvent.ticketTypes || []).map((t) => ({
        id: t.id,
        name: t.name,
        price: Number(t.price),
        description: t.description ?? null,
        availableQuantity: t.availableQuantity,
      })),
    };
  } catch {
    const legacy = legacyDemoEvents[idOrSlug];
    if (!legacy) return null;
    return {
      id: idOrSlug,
      title: legacy.title,
      date: legacy.date,
      time: legacy.time,
      venue: legacy.venue,
      ticketTypes: [],
    };
  }
}

