
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PaymentStatus from "@/components/events/PaymentStatus";

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

  return {
    title: events[id]
      ? `Payment Failed | ${events[id]} | IFE`
      : "Payment Failed | IFE",
    description: "IFE payment failure page.",
  };
}

export default async function PaymentFailedPage({
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
        <PaymentStatus
          status="failed"
          eventId={id}
          eventTitle={eventTitle}
        />
      </main>

      <Footer />
    </>
  );
}
