import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PaymentStatus from "@/components/events/PaymentStatus";
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
      ? `Payment Failed | ${event.title} | IFE`
      : "Payment Failed | IFE",
    description: "IFE payment failure page.",
  };
}

export default async function PaymentFailedPage({ params }: PageProps) {
  const { id } = await params;
  const event = await resolveBookingEvent(id);

  if (!event) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        <PaymentStatus
          status="failed"
          eventId={id}
          eventTitle={event.title}
        />
      </main>
      <Footer />
    </>
  );
}
