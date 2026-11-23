import { notFound } from "next/navigation";
import BookingConfirmation from "@/components/events/BookingConfirmation";
import { resolveBookingEvent } from "@/lib/events/resolve-booking-event";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BookingConfirmationPage({ params }: PageProps) {
  const { id } = await params;
  const event = await resolveBookingEvent(id);

  if (!event) {
    notFound();
  }

  return (
    <BookingConfirmation
      eventId={id}
      eventTitle={event.title}
      eventDate={event.date}
      venue={event.venue}
    />
  );
}
