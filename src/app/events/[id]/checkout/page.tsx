import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CheckoutForm from "@/components/events/CheckoutForm";
import { resolveBookingEvent } from "@/lib/events/resolve-booking-event";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    ticket?: string;
    quantity?: string;
  }>;
};

const allowedTickets = ["single", "couple", "group5", "vip"];

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

  const ticketType = query.ticket || "single";
  const quantity = Number(query.quantity || "1");

  if (
    !allowedTickets.includes(ticketType) ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 10
  ) {
    redirect(`/events/${id}/tickets`);
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        <CheckoutForm
          eventId={id}
          eventTitle={event.title}
          ticketType={ticketType}
          quantity={quantity}
        />
      </main>
      <Footer />
    </>
  );
}
