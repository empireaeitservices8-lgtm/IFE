import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CheckoutForm from "@/components/events/CheckoutForm";
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
    title: event ? `Checkout | ${event.title} | IFE` : "Checkout | IFE",
    description: "Complete your IFE event booking checkout.",
  };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const query = await searchParams;
  const event = await resolveBookingEvent(id);

  if (!event) {
    notFound();
  }

  const selectedItems = parseTicketSelection({
    items: query.items,
    ticket: query.ticket,
    quantity: query.quantity,
  });

  if (selectedItems.length === 0) {
    redirect(`/events/${id}/tickets`);
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        <CheckoutForm
          eventId={id}
          eventTitle={event.title}
          selectedItems={selectedItems}
        />
      </main>
      <Footer />
    </>
  );
}
