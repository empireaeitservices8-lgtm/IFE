import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AttendeeForm from "@/components/events/AttendeeForm";
import { resolveBookingEvent } from "@/lib/events/resolve-booking-event";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
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
    title: event
      ? `Attendee Details | ${event.title} | IFE`
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
  const event = await resolveBookingEvent(id);

  if (!event) {
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
          eventTitle={event.title}
          ticketType={ticketType}
          quantity={parsedQuantity}
        />
      </main>
      <Footer />
    </>
  );
}
