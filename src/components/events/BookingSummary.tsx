
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Attendee = {
  fullName: string;
  email: string;
  phone: string;
};

type BookingSummaryProps = {
  eventId: string;
  eventTitle: string;
  ticketType: string;
  quantity: number;
};

const ticketOptions: Record<
  string,
  { name: string; price: number }
> = {
  general: {
    name: "General Admission",
    price: 499,
  },
  premium: {
    name: "Premium Access",
    price: 999,
  },
  vip: {
    name: "VIP Experience",
    price: 1999,
  },
};

export default function BookingSummary({
  eventId,
  eventTitle,
  ticketType,
  quantity,
}: BookingSummaryProps) {
  const [attendees] = useState<Attendee[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = sessionStorage.getItem(`ife-attendees-${eventId}`);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed as Attendee[];
      }
    } catch {}
    return [];
  });
  const attendeesLoaded = true;

  const fallbackTicket = ticketOptions[ticketType] || ticketOptions.general;
  const [ticket, setTicket] = useState<{ name: string; price: number }>(
    fallbackTicket
  );
  const subtotal = ticket.price * quantity;

  // Tax calculation: 18% GST.
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  useEffect(() => {
    let active = true;
    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then((json) => {
        if (!active || !json.success || !json.data?.event?.ticketTypes) return;
        const apiTickets: { name: string; price: string | number }[] =
          json.data.event.ticketTypes;
        const matched =
          apiTickets.find((t) =>
            t.name.toLowerCase().includes(ticketType.toLowerCase())
          ) || apiTickets[0];
        if (matched) {
          setTicket({ name: matched.name, price: Number(matched.price) });
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [eventId, ticketType]);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const hasValidAttendees =
    attendees.length === quantity &&
    attendees.every(
      (attendee) =>
        attendee.fullName?.trim() &&
        attendee.email?.trim() &&
        attendee.phone?.trim()
    );

  return (
    <section className="min-h-screen bg-[#050505] px-5 py-16 text-white md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Breadcrumb */}
        <div className="mb-10 flex flex-wrap items-center gap-3 text-sm text-white/40">
          <Link href="/events" className="hover:text-[#D4AF6A]">
            Events
          </Link>
          <span>/</span>
          <Link
            href={`/events/${eventId}`}
            className="hover:text-[#D4AF6A]"
          >
            Event Details
          </Link>
          <span>/</span>
          <span className="text-[#D4AF6A]">Booking Summary</span>
        </div>

        {/* Heading */}
        <div className="mb-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF6A]">
            Review Your Selection
          </p>

          <h1 className="font-serif text-4xl md:text-6xl">
            Booking <span className="text-[#D4AF6A]">Summary</span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
            Please review your booking information carefully
            before proceeding to payment.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

          {/* Main Content */}
          <div className="space-y-8">

            {/* Event Information */}
            <div className="border border-white/10 bg-[#111111] p-7 md:p-9">
              <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-5">
                <h2 className="font-serif text-2xl">
                  Event Information
                </h2>
                <span className="text-xs uppercase tracking-widest text-[#D4AF6A]">
                  01
                </span>
              </div>

              <h3 className="font-serif text-3xl">
                {eventTitle}
              </h3>

              <p className="mt-3 text-sm text-white/40">
                International Fashion Entertainment
              </p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div className="border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-widest text-white/35">
                    Event Date
                  </p>
                  <p className="mt-3 text-sm">To be announced</p>
                </div>

                <div className="border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-widest text-white/35">
                    Venue
                  </p>
                  <p className="mt-3 text-sm">To be announced</p>
                </div>
              </div>
            </div>

            {/* Ticket Information */}
            <div className="border border-white/10 bg-[#111111] p-7 md:p-9">
              <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-5">
                <h2 className="font-serif text-2xl">
                  Ticket Information
                </h2>
                <span className="text-xs uppercase tracking-widest text-[#D4AF6A]">
                  02
                </span>
              </div>

              <div className="flex flex-col justify-between gap-5 sm:flex-row">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/35">
                    Selected Ticket
                  </p>
                  <h3 className="mt-3 font-serif text-2xl">
                    {ticket.name}
                  </h3>
                  <p className="mt-2 text-sm text-white/40">
                    {quantity} {quantity === 1 ? "Ticket" : "Tickets"}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-xs text-white/35">
                    Price per ticket
                  </p>
                  <p className="mt-3 text-2xl text-[#D4AF6A]">
                    {formatPrice(ticket.price)}
                  </p>
                </div>
              </div>

              <div className="mt-7 border-t border-white/10 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/45">
                    Ticket Subtotal
                  </span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>
            </div>

            {/* Attendee Information */}
            <div className="border border-white/10 bg-[#111111] p-7 md:p-9">
              <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-5">
                <h2 className="font-serif text-2xl">
                  Attendee Information
                </h2>
                <span className="text-xs uppercase tracking-widest text-[#D4AF6A]">
                  03
                </span>
              </div>

              {!attendeesLoaded ? (
                <p className="text-sm text-white/40">
                  Loading attendee details...
                </p>
              ) : hasValidAttendees ? (
                <div className="space-y-5">
                  {attendees.map((attendee, index) => (
                    <div
                      key={index}
                      className="border border-white/10 p-5"
                    >
                      <p className="mb-4 text-xs uppercase tracking-widest text-[#D4AF6A]">
                        Attendee {String(index + 1).padStart(2, "0")}
                      </p>

                      <h3 className="font-serif text-xl">
                        {attendee.fullName}
                      </h3>

                      <p className="mt-3 break-all text-sm text-white/45">
                        {attendee.email}
                      </p>

                      <p className="mt-2 text-sm text-white/45">
                        {attendee.phone}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-sm leading-7 text-white/50">
                    Attendee details are missing or incomplete.
                    Please return to the attendee form and enter
                    the information for all ticket holders.
                  </p>

                  <Link
                    href={`/events/${eventId}/attendee-details?ticket=${ticketType}&quantity=${quantity}`}
                    className="mt-5 inline-block text-sm text-[#D4AF6A] hover:text-[#F5E5B5]"
                  >
                    Update Attendee Details →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Price Summary */}
          <aside className="h-fit border border-white/10 bg-[#111111] p-7 lg:sticky lg:top-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF6A]">
              Payment Breakdown
            </p>

            <h2 className="mt-5 font-serif text-2xl">
              Order Summary
            </h2>

            <div className="my-7 border-t border-white/10" />

            <div className="space-y-5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-white/45">
                  {ticket.name}
                </span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/45">
                  Quantity
                </span>
                <span>{quantity}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/45">
                  Subtotal
                </span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/45">
                  Estimated Tax (18%)
                </span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="my-7 border-t border-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">
                Total Amount
              </span>
              <span className="text-2xl font-semibold text-[#D4AF6A]">
                {formatPrice(total)}
              </span>
            </div>

            <p className="mt-3 text-xs leading-6 text-white/35">
              This is an estimated total for demonstration.
              Final taxes and fees must be confirmed by the booking system.
            </p>

            {hasValidAttendees && attendeesLoaded ? (
              <Link
                href={`/events/${eventId}/checkout?ticket=${ticketType}&quantity=${quantity}`}
                className="mt-8 flex w-full items-center justify-center bg-[#D4AF6A] px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#F5E5B5]"
              >
                Proceed to Checkout →
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="mt-8 w-full cursor-not-allowed bg-white/10 px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white/30"
              >
                Complete Attendee Details
              </button>
            )}

            <Link
              href={`/events/${eventId}/tickets`}
              className="mt-5 block text-center text-xs text-white/40 transition hover:text-[#D4AF6A]"
            >
              ← Change Tickets
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
