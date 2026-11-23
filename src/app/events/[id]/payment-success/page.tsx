import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PaymentStatus from "@/components/events/PaymentStatus";
import { resolveBookingEvent } from "@/lib/events/resolve-booking-event";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    paymentId?: string;
    orderId?: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await resolveBookingEvent(id);

  return {
    title: event
      ? `Payment Success | ${event.title} | IFE`
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
  const event = await resolveBookingEvent(id);

  if (!event) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        <PaymentStatus
          status="success"
          eventId={id}
          eventTitle={event.title}
          paymentId={query.paymentId}
          orderId={query.orderId}
        />
      </main>
      <Footer />
    </>
  );
}
