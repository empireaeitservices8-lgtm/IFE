import { notFound } from "next/navigation";
import DigitalTicket, {
  type DigitalTicketInitialBooking,
} from "@/components/events/DigitalTicket";
import { resolveBookingEvent } from "@/lib/events/resolve-booking-event";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ bookingCode?: string }>;
};

export default async function DigitalTicketPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { bookingCode } = await searchParams;

  let initialBooking: DigitalTicketInitialBooking | null = null;
  let dbBookingEvent: {
    id: string;
    title: string;
    date: string;
    venue: string;
  } | null = null;

  if (bookingCode?.trim()) {
    const normalizedCode = bookingCode.trim().toUpperCase();
    const booking = await prisma.booking.findUnique({
      where: { bookingCode: normalizedCode },
      include: {
        event: {
          include: {
            venue: { select: { name: true, city: true } },
          },
        },
        items: {
          include: {
            ticketType: { select: { name: true } },
          },
        },
      },
    });

    if (booking && booking.eventId === id) {
      const start = new Date(booking.event.startAt);
      dbBookingEvent = {
        id: booking.event.id,
        title: booking.event.title,
        date: start.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        venue: booking.event.venue
          ? `${booking.event.venue.name}, ${booking.event.venue.city}`
          : "Venue to be announced",
      };

      const passes: DigitalTicketInitialBooking["passes"] = [];
      for (const item of booking.items) {
        const count = Math.max(1, item.quantity);
        for (let i = 0; i < count; i++) {
          passes.push({
            fullName: booking.customerName,
            email: booking.customerEmail,
            phone: booking.customerPhone,
            passName: item.ticketType?.name || "Event Pass",
          });
        }
      }

      if (passes.length === 0) {
        passes.push({
          fullName: booking.customerName,
          email: booking.customerEmail,
          phone: booking.customerPhone,
          passName: "Event Pass",
        });
      }

      initialBooking = {
        bookingCode: booking.bookingCode,
        status: booking.status,
        passes,
      };
    }
  }

  const event = dbBookingEvent ?? (await resolveBookingEvent(id));

  if (!event) {
    notFound();
  }

  return (
    <DigitalTicket
      eventId={event.id}
      eventTitle={event.title}
      eventDate={event.date}
      venue={event.venue}
      initialBooking={initialBooking}
    />
  );
}
