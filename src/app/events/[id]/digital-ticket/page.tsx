import { notFound } from "next/navigation";
import DigitalTicket from "@/components/events/DigitalTicket";
import { resolveBookingEvent } from "@/lib/events/resolve-booking-event";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DigitalTicketPage({ params }: PageProps) {
  const { id } = await params;
  const event = await resolveBookingEvent(id);

  if (!event) {
    notFound();
  }

  return (
    <DigitalTicket
      eventId={id}
      eventTitle={event.title}
      eventDate={event.date}
      venue={event.venue}
    />
  );
}
