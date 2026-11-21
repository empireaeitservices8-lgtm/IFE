
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CheckoutForm from "@/components/events/CheckoutForm";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    ticket?: string;
    quantity?: string;
  }>;
};

const events: Record<string, string> = {
  "1": "The IFE Fashion Showcase",
  "2": "Live Beyond",
  "3": "Excellence Awards",
  "4": "Runway Stories",
  "5": "The Grand Celebration",
  "6": "Creative Icons",
};

const allowedTickets = ["general", "premium", "vip"];

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: events[id]
      ? `Checkout | ${events[id]} | IFE`
      : "Checkout | IFE",
    description:
      "Complete your IFE event booking checkout.",
  };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const query = await searchParams;

  const eventTitle = events[id];

  if (!eventTitle) {
    notFound();
  }

  const ticketType = query.ticket || "premium";
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
          eventTitle={eventTitle}
          ticketType={ticketType}
          quantity={quantity}
        />
      </main>

      <Footer />
    </>
  );
}
