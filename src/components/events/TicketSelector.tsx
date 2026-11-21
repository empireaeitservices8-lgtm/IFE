
"use client";

import { useState } from "react";
import Link from "next/link";

type TicketType = {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  label?: string;
};

const ticketTypes: TicketType[] = [
  {
    id: "general",
    name: "General Admission",
    price: 499,
    description: "Standard access to the event.",
    benefits: ["Event entry", "General seating area"],
  },
  {
    id: "premium",
    name: "Premium Access",
    price: 999,
    description: "An enhanced event experience.",
    benefits: [
      "Event entry",
      "Premium seating area",
      "Priority entry",
    ],
    label: "POPULAR",
  },
  {
    id: "vip",
    name: "VIP Experience",
    price: 1999,
    description: "Enjoy an exclusive VIP experience.",
    benefits: [
      "VIP event entry",
      "Reserved VIP seating",
      "Priority entry",
      "Exclusive lounge access",
    ],
    label: "EXCLUSIVE",
  },
];

type TicketSelectorProps = {
  eventId: string;
  eventTitle: string;
};

export default function TicketSelector({
  eventId,
  eventTitle,
}: TicketSelectorProps) {
  const [selectedTicket, setSelectedTicket] = useState("premium");
  const [quantity, setQuantity] = useState(1);

  const selected = ticketTypes.find(
    (ticket) => ticket.id === selectedTicket
  )!;

  const subtotal = selected.price * quantity;

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const attendeeUrl =
    `/events/${eventId}/attendee-details` +
    `?ticket=${encodeURIComponent(selectedTicket)}` +
    `&quantity=${quantity}`;

  return (
    <section className="min-h-screen bg-[#050505] px-5 py-16 text-white md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Breadcrumb */}
        <div className="mb-10 flex flex-wrap items-center gap-3 text-sm text-white/40">
          <Link href="/events" className="transition hover:text-[#D4AF6A]">
            Events
          </Link>
          <span>/</span>
          <Link
            href={`/events/${eventId}`}
            className="transition hover:text-[#D4AF6A]"
          >
            Event Details
          </Link>
          <span>/</span>
          <span className="text-[#D4AF6A]">Select Tickets</span>
        </div>

        {/* Heading */}
        <div className="mb-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF6A]">
            Your Experience Starts Here
          </p>

          <h1 className="font-serif text-4xl leading-tight md:text-6xl">
            Select Your <span className="text-[#D4AF6A]">Tickets</span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
            Choose your preferred ticket category and quantity
            to continue your booking.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">

          {/* Ticket Selection */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl">
                Available Ticket Types
              </h2>
              <span className="text-xs tracking-wider text-white/40">
                01 / SELECT
              </span>
            </div>

            <div className="space-y-5">
              {ticketTypes.map((ticket) => {
                const isSelected = selectedTicket === ticket.id;

                return (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => setSelectedTicket(ticket.id)}
                    aria-pressed={isSelected}
                    className={`relative w-full rounded-sm border p-6 text-left transition duration-300 md:p-8 ${
                      isSelected
                        ? "border-[#D4AF6A] bg-[#D4AF6A]/[0.06]"
                        : "border-white/10 bg-[#111111] hover:border-white/30"
                    }`}
                  >
                    {ticket.label && (
                      <span className="absolute right-5 top-5 text-[9px] font-bold tracking-[0.2em] text-[#D4AF6A]">
                        {ticket.label}
                      </span>
                    )}

                    <div className="flex items-start gap-5">
                      <div
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-[#D4AF6A]"
                            : "border-white/30"
                        }`}
                      >
                        {isSelected && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[#D4AF6A]" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row">
                          <div>
                            <h3 className="font-serif text-xl md:text-2xl">
                              {ticket.name}
                            </h3>
                            <p className="mt-2 text-sm text-white/45">
                              {ticket.description}
                            </p>
                          </div>

                          <div className="sm:text-right">
                            <p className="text-xl font-semibold text-[#D4AF6A]">
                              {formatPrice(ticket.price)}
                            </p>
                            <p className="mt-1 text-xs text-white/35">
                              Per person
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                          {ticket.benefits.map((benefit) => (
                            <span
                              key={benefit}
                              className="flex items-center gap-2 text-xs text-white/55"
                            >
                              <span className="text-[#D4AF6A]">✓</span>
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quantity */}
            <div className="mt-10 rounded-sm border border-white/10 bg-[#111111] p-6 md:p-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-serif text-xl">
                    Number of Tickets
                  </h3>
                  <p className="mt-2 text-sm text-white/40">
                    Select how many tickets you need.
                  </p>
                </div>

                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                    disabled={quantity <= 1}
                    aria-label="Decrease ticket quantity"
                    className="flex h-11 w-11 items-center justify-center border border-white/20 text-xl transition hover:border-[#D4AF6A] hover:text-[#D4AF6A] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    −
                  </button>

                  <span className="min-w-6 text-center text-xl">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) => Math.min(10, current + 1))
                    }
                    disabled={quantity >= 10}
                    aria-label="Increase ticket quantity"
                    className="flex h-11 w-11 items-center justify-center border border-white/20 text-xl transition hover:border-[#D4AF6A] hover:text-[#D4AF6A] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="mt-4 text-xs text-white/30">
                Maximum 10 tickets per booking.
              </p>
            </div>
          </div>

          {/* Booking Summary */}
          <aside className="h-fit border border-white/10 bg-[#111111] p-7 lg:sticky lg:top-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF6A]">
              Booking Summary
            </p>

            <h2 className="mt-5 font-serif text-2xl leading-snug">
              {eventTitle}
            </h2>

            <div className="my-7 border-t border-white/10" />

            <div className="space-y-5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-white/45">Ticket Type</span>
                <span className="text-right">{selected.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/45">Price per ticket</span>
                <span>{formatPrice(selected.price)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/45">Quantity</span>
                <span>{quantity}</span>
              </div>

              <div className="border-t border-white/10 pt-5">
                <div className="flex justify-between">
                  <span className="text-white/45">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="mt-3 flex justify-between">
                  <span className="text-white/45">Taxes & fees</span>
                  <span className="text-white/40">Calculated later</span>
                </div>
              </div>
            </div>

            <div className="my-7 border-t border-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Estimated Total</span>
              <span className="text-2xl font-semibold text-[#D4AF6A]">
                {formatPrice(subtotal)}
              </span>
            </div>

            <Link
              href={attendeeUrl}
              className="mt-8 flex w-full items-center justify-center bg-[#D4AF6A] px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#F5E5B5]"
            >
              Continue to Attendee Details
              <span className="ml-3 text-lg">→</span>
            </Link>

            <p className="mt-5 text-center text-xs leading-6 text-white/30">
              Your booking is not confirmed until the payment
              process is completed.
            </p>
          </aside>
        </div>

        {/* Back */}
        <div className="mt-12">
          <Link
            href={`/events/${eventId}`}
            className="text-sm text-white/45 transition hover:text-[#D4AF6A]"
          >
            ← Back to Event Details
          </Link>
        </div>
      </div>
    </section>
  );
}
