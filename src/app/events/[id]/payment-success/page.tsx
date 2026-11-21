
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PaymentStatus from "@/components/events/PaymentStatus";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    paymentId?: string;
    orderId?: string;
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

  return {
    title: events[id]
      ? `Payment Success | ${events[id]} | IFE`
      : "Payment Success | IFE",
    description: "IFE payment status page.",
  };
}

export default async function PaymentSuccessPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const query = await searchParams;

  const eventTitle = events[id];

  if (!eventTitle) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="pt-20">
        <PaymentStatus
          status="success"
          eventId={id}
          eventTitle={eventTitle}
          paymentId={query.paymentId}
          orderId={query.orderId}
        />
      </main>

      <Footer />
    </>
  );
}
