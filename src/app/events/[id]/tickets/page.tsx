
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TicketSelector from "@/components/events/TicketSelector";

type PageProps = {
  params: Promise<{ id: string }>;
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
      ? `Select Tickets | ${eventTitle} | IFE`
      : "Select Tickets | IFE",
    description: "Choose your tickets for an exclusive IFE event.",
  };
}

export default async function SelectTicketsPage({
  params,
}: PageProps) {
  const { id } = await params;
  const eventTitle = events[id];

  if (!eventTitle) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="pt-20">
        <TicketSelector
          eventId={id}
          eventTitle={eventTitle}
        />
      </main>

      <Footer />
    </>
  );
}
