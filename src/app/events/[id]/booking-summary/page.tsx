
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingSummary from "@/components/events/BookingSummary";

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
      ? `Booking Summary | ${events[id]} | IFE`
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
        <BookingSummary
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
