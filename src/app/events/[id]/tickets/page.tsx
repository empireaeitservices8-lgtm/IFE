import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TicketSelector from "@/components/events/TicketSelector";
import { resolveBookingEvent } from "@/lib/events/resolve-booking-event";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await resolveBookingEvent(id);

  return {
    title: event
      ? `Select Tickets | ${event.title} | IFE`
      : "Select Tickets | IFE",
    description: "Choose your tickets for an exclusive IFE event.",
  };
}

export default async function SelectTicketsPage({ params }: PageProps) {
  const { id } = await params;
  const event = await resolveBookingEvent(id);

  if (!event) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        <TicketSelector
          eventId={id}
          eventTitle={event.title}
          liveTicketTypes={event.ticketTypes}
        />
      </main>
      <Footer />
    </>
  );
}
