import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingSummary from "@/components/events/BookingSummary";
import { resolveBookingEvent } from "@/lib/events/resolve-booking-event";
import { parseTicketSelection } from "@/lib/events/ticket-selection";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    items?: string;
    ticket?: string;
    quantity?: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await resolveBookingEvent(id);

  return {
    title: event
      ? `Booking Summary | ${event.title} | IFE`
      : "Booking Summary | IFE",
    description: "Review your IFE event booking before checkout.",
  };
}

export default async function BookingSummaryPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const query = await searchParams;
  const event = await resolveBookingEvent(id);

  if (!event) {
    notFound();
  }

  const selectedItems = parseTicketSelection(
    {
      items: query.items,
      ticket: query.ticket,
      quantity: query.quantity,
    },
    event.ticketTypes
  );

  if (selectedItems.length === 0) {
    redirect(`/events/${id}/tickets`);
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        <BookingSummary
          eventId={id}
          eventTitle={event.title}
          eventDate={event.date}
          venue={event.venue}
          selectedItems={selectedItems}
        />
      </main>
      <Footer />
    </>
  );
}
