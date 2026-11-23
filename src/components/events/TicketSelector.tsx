"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ResolvedBookingTicket } from "@/lib/events/resolve-booking-event";

type TicketType = {
  id: "general" | "premium" | "vip";
  name: string;
  price: number;
  description: string;
  benefits: string[];
  label?: string;
};

const defaultTicketTypes: TicketType[] = [
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
    benefits: ["Event entry", "Premium seating area", "Priority entry"],
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
  liveTicketTypes?: ResolvedBookingTicket[];
};

export default function TicketSelector({
  eventId,
  eventTitle,
  liveTicketTypes = [],
}: TicketSelectorProps) {
  const ticketTypes = useMemo(() => {
    if (!liveTicketTypes || liveTicketTypes.length === 0) {
      return defaultTicketTypes;
    }

    const sorted = [...liveTicketTypes].sort((a, b) => a.price - b.price);
    const tierKeys: ("general" | "premium" | "vip")[] = [
      "general",
      "premium",
      "vip",
    ];

    return defaultTicketTypes.map((fallback, index) => {
      const live = sorted[index];
      if (!live) return fallback;
      return {
        ...fallback,
        id: tierKeys[index],
        name: live.name || fallback.name,
        price: live.price > 0 ? live.price : fallback.price,
        description: live.description || fallback.description,
      };
    });
  }, [liveTicketTypes]);

  const [selectedTicket, setSelectedTicket] = useState<
    "general" | "premium" | "vip"
  >("premium");
  const [quantity, setQuantity] = useState(1);

  const selected =
    ticketTypes.find((ticket) => ticket.id === selectedTicket) ||
    ticketTypes[0];

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
    <section className="min-h-[calc(100vh-5rem)] bg-[#050505] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb + Heading */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-white/45">
              <Link href="/events" className="transition hover:text-[#D4AF6A]">
                Events
              </Link>
              <span>/</span>
              <Link
                href={`/events/${eventId}`}
                className="transition hover:text-[#D4AF6A]"
              >
                {eventTitle}
              </Link>
              <span>/</span>
              <span className="text-[#D4AF6A]">Select Tickets</span>
            </div>

            <h1 className="font-[var(--font-playfair)] text-3xl leading-tight md:text-4xl">
              Select Your <span className="text-[#D4AF6A]">Tickets</span>
            </h1>
          </div>

          <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
            Step 01 / Select
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Ticket Selection */}
          <div>
            <div className="space-y-3">
              {ticketTypes.map((ticket) => {
                const isSelected = selectedTicket === ticket.id;

                return (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => setSelectedTicket(ticket.id)}
                    aria-pressed={isSelected}
                    className={`relative w-full rounded-sm border p-4 text-left transition duration-200 md:p-5 ${
                      isSelected
                        ? "border-[#D4AF6A] bg-[#D4AF6A]/[0.06]"
                        : "border-white/10 bg-[#111111] hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          isSelected ? "border-[#D4AF6A]" : "border-white/30"
                        }`}
                      >
                        {isSelected && (
                          <span className="h-2 w-2 rounded-full bg-[#D4AF6A]" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <h3 className="font-[var(--font-playfair)] text-lg md:text-xl">
                                {ticket.name}
                              </h3>
                              {ticket.label && (
                                <span className="border border-[#D4AF6A]/40 px-2 py-0.5 text-[9px] font-bold tracking-[0.18em] text-[#D4AF6A]">
                                  {ticket.label}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-white/50">
                              {ticket.description}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-semibold text-[#D4AF6A]">
                              {formatPrice(ticket.price)}
                            </p>
                            <p className="text-[11px] text-white/35">
                              Per person
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                          {ticket.benefits.map((benefit) => (
                            <span
                              key={benefit}
                              className="flex items-center gap-1.5 text-xs text-white/55"
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
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-white/10 bg-[#111111] p-4 md:p-5">
              <div>
                <h3 className="font-[var(--font-playfair)] text-lg">
                  Number of Tickets
                </h3>
                <p className="text-xs text-white/40">
                  Maximum 10 tickets per booking.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  disabled={quantity <= 1}
                  aria-label="Decrease ticket quantity"
                  className="flex h-10 w-10 items-center justify-center border border-white/20 text-lg transition hover:border-[#D4AF6A] hover:text-[#D4AF6A] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  −
                </button>

                <span className="min-w-6 text-center text-lg font-medium">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => Math.min(10, current + 1))
                  }
                  disabled={quantity >= 10}
                  aria-label="Increase ticket quantity"
                  className="flex h-10 w-10 items-center justify-center border border-white/20 text-lg transition hover:border-[#D4AF6A] hover:text-[#D4AF6A] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <aside className="h-fit border border-white/10 bg-[#111111] p-6 lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF6A]">
              Booking Summary
            </p>

            <h2 className="mt-3 font-[var(--font-playfair)] text-xl leading-snug">
              {eventTitle}
            </h2>

            <div className="my-5 border-t border-white/10" />

            <div className="space-y-3 text-sm">
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

              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between">
                  <span className="text-white/45">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-white/45">Taxes &amp; fees</span>
                  <span className="text-white/40">Calculated at checkout</span>
                </div>
              </div>
            </div>

            <div className="my-5 border-t border-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Estimated Total</span>
              <span className="text-2xl font-semibold text-[#D4AF6A]">
                {formatPrice(subtotal)}
              </span>
            </div>

            <Link
              href={attendeeUrl}
              className="mt-6 flex w-full items-center justify-center bg-[#D4AF6A] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#F5E5B5]"
            >
              Continue to Attendee Details →
            </Link>

            <Link
              href={`/events/${eventId}`}
              className="mt-3 block text-center text-xs text-white/45 transition hover:text-[#D4AF6A]"
            >
              ← Back to Event Details
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
