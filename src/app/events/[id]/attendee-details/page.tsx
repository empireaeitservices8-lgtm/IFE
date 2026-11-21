
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AttendeeForm from "@/components/events/AttendeeForm";

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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const eventTitle = events[id];

  return {
    title: eventTitle
      ? `Attendee Details | ${eventTitle} | IFE`
      : "Attendee Details | IFE",
    description: "Enter attendee details for your IFE event booking.",
  };
}

export default async function AttendeeDetailsPage({
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
  const allowedTickets = ["general", "premium", "vip"];

  if (!allowedTickets.includes(ticketType)) {
    redirect(`/events/${id}/tickets`);
  }

  const parsedQuantity = Number(query.quantity || "1");

  if (
    !Number.isInteger(parsedQuantity) ||
    parsedQuantity < 1 ||
    parsedQuantity > 10
  ) {
    redirect(`/events/${id}/tickets`);
  }

  return (
    <>
      <Header />

      <main className="pt-20">
        <AttendeeForm
          eventId={id}
          eventTitle={eventTitle}
          ticketType={ticketType}
          quantity={parsedQuantity}
        />
      </main>

      <Footer />
    </>
  );
}
