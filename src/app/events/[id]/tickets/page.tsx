import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TicketSelector from "@/components/events/TicketSelector";
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
      ? `Select Tickets | ${event.title} | IFE`
      : "Select Tickets | IFE",
    description: "Choose your tickets for an exclusive IFE event.",
  };
}

export default async function SelectTicketsPage({ params }: PageProps) {
  const { id } = await params;
  const event = await resolveBookingEvent(id);

  if (!event) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {event.isComingSoon ? (
          <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#050505] px-5 py-16 text-white">
            <div className="max-w-lg rounded-2xl border border-[#D4AF6A]/35 bg-[#101010] p-8 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4AF6A]">
                Coming Soon
              </p>
              <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-white">
                {event.title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Tickets for this event are not open for booking yet. Check back
                soon for pass announcements.
              </p>
              <Link
                href={`/events/${id}`}
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#D4AF6A] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-black transition hover:bg-[#F5E5B5]"
              >
                Back to Event Details
              </Link>
            </div>
          </section>
        ) : (
          <TicketSelector
            eventId={id}
            eventTitle={event.title}
            liveTicketTypes={event.ticketTypes}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
