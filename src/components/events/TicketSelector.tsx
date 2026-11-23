"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ResolvedBookingTicket } from "@/lib/events/resolve-booking-event";
import {
  TICKET_PASSES,
  serializeTicketSelection,
  type SelectedTicketItem,
  type TicketOptionId,
} from "@/lib/events/ticket-selection";

type TicketSelectorProps = {
  eventId: string;
  eventTitle: string;
  liveTicketTypes?: ResolvedBookingTicket[];
};

const MAX_TOTAL_PASSES = 10;

export default function TicketSelector({
  eventId,
  eventTitle,
}: TicketSelectorProps) {
  const [quantities, setQuantities] = useState<Record<TicketOptionId, number>>({
    single: 1,
    couple: 0,
    group5: 0,
    vip: 0,
  });

  const selectedItems = useMemo<SelectedTicketItem[]>(() => {
    return TICKET_PASSES.filter((pass) => quantities[pass.id] > 0).map(
      (pass) => ({
        id: pass.id,
        name: pass.name,
        price: pass.price,
        quantity: quantities[pass.id],
      })
    );
  }, [quantities]);

  const totalQuantity = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.quantity, 0),
    [selectedItems]
  );

  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [selectedItems]
  );

  const updateQuantity = (id: TicketOptionId, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id];
      const next = Math.max(0, current + delta);
      const otherTotal = totalQuantity - current;
      if (otherTotal + next > MAX_TOTAL_PASSES) return prev;
      return { ...prev, [id]: next };
    });
  };

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const selectionQuery = serializeTicketSelection(selectedItems);
  const attendeeUrl = selectionQuery
    ? `/events/${eventId}/attendee-details?${selectionQuery}`
    : "#";

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#050505] px-5 py-7 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb + Heading */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-white/45">
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

          <div className="text-right">
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
              Step 01 / Select Passes
            </span>
            <p className="mt-1 text-xs text-white/50">
              Mix any pass types (max {MAX_TOTAL_PASSES} passes total)
            </p>
          </div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1fr_360px]">
          {/* Pass Cards with Per-Card Stepper */}
          <div className="space-y-3">
            {TICKET_PASSES.map((ticket) => {
              const qty = quantities[ticket.id];
              const isSelected = qty > 0;
              const atMaxTotal = totalQuantity >= MAX_TOTAL_PASSES;

              return (
                <div
                  key={ticket.id}
                  className={`rounded-sm border p-4 transition duration-200 md:p-5 ${
                    isSelected
                      ? "border-[#D4AF6A] bg-[#D4AF6A]/[0.06]"
                      : "border-white/10 bg-[#111111] hover:border-white/25"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-[var(--font-playfair)] text-lg md:text-xl">
                          {ticket.name}
                        </h3>
                        {ticket.label && (
                          <span className="border border-[#D4AF6A]/40 px-2 py-0.5 text-[9px] font-bold tracking-[0.18em] text-[#D4AF6A]">
                            {ticket.label}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-white/55">
                        {ticket.description}
                      </p>

                      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
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

                    <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end sm:gap-2">
                      <div className="sm:text-right">
                        <p className="text-lg font-semibold text-[#D4AF6A]">
                          {formatPrice(ticket.price)}
                        </p>
                        <p className="text-[11px] text-white/35">Per pass</p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(ticket.id, -1)}
                          disabled={qty <= 0}
                          aria-label={`Decrease ${ticket.name} quantity`}
                          className="flex h-9 w-9 items-center justify-center border border-white/20 text-base transition hover:border-[#D4AF6A] hover:text-[#D4AF6A] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          −
                        </button>

                        <span className="min-w-6 text-center text-base font-semibold">
                          {qty}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateQuantity(ticket.id, 1)}
                          disabled={atMaxTotal}
                          aria-label={`Increase ${ticket.name} quantity`}
                          className="flex h-9 w-9 items-center justify-center border border-white/20 text-base transition hover:border-[#D4AF6A] hover:text-[#D4AF6A] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booking Summary */}
          <aside className="h-fit border border-white/10 bg-[#111111] p-6 lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF6A]">
              Booking Summary
            </p>

            <h2 className="mt-2 font-[var(--font-playfair)] text-xl leading-snug">
              {eventTitle}
            </h2>

            <div className="my-4 border-t border-white/10" />

            {selectedItems.length === 0 ? (
              <p className="py-4 text-xs text-white/45">
                Select at least 1 pass using the + button to continue.
              </p>
            ) : (
              <div className="space-y-3 text-sm">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-white/75">
                      {item.quantity} × {item.name}
                    </span>
                    <span className="font-medium text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}

                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/45">Total Passes</span>
                    <span>{totalQuantity}</span>
                  </div>
                  <div className="mt-1.5 flex justify-between text-xs">
                    <span className="text-white/45">Taxes &amp; fees</span>
                    <span className="text-white/40">Calculated at checkout</span>
                  </div>
                </div>
              </div>
            )}

            <div className="my-4 border-t border-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Estimated Total</span>
              <span className="text-2xl font-semibold text-[#D4AF6A]">
                {formatPrice(subtotal)}
              </span>
            </div>

            {selectedItems.length > 0 ? (
              <Link
                href={attendeeUrl}
                className="mt-5 flex w-full items-center justify-center bg-[#D4AF6A] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#F5E5B5]"
              >
                Continue to Attendee Details →
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="mt-5 w-full cursor-not-allowed bg-white/10 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white/30"
              >
                Select at Least 1 Pass
              </button>
            )}

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
