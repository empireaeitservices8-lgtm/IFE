"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiEdit2,
  FiMapPin,
  FiTag,
  FiUser,
} from "react-icons/fi";
import {
  serializeTicketSelection,
  type SelectedTicketItem,
} from "@/lib/events/ticket-selection";
import { useSessionStorageValue } from "@/lib/hooks/use-session-storage";

type Attendee = {
  fullName: string;
  email: string;
  phone: string;
};

type BookingSummaryProps = {
  eventId: string;
  eventTitle: string;
  eventDate?: string;
  venue?: string;
  selectedItems: SelectedTicketItem[];
};

export default function BookingSummary({
  eventId,
  eventTitle,
  eventDate = "To be announced",
  venue = "Venue to be announced",
  selectedItems,
}: BookingSummaryProps) {
  const rawAttendees = useSessionStorageValue(`ife-attendees-${eventId}`);

  const attendees = useMemo<Attendee[]>(() => {
    if (!rawAttendees) return [];
    try {
      const parsed: unknown = JSON.parse(rawAttendees);
      return Array.isArray(parsed) ? (parsed as Attendee[]) : [];
    } catch {
      return [];
    }
  }, [rawAttendees]);

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

  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;
  const selectionQuery = serializeTicketSelection(selectedItems);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const hasValidAttendees =
    attendees.length === totalQuantity &&
    attendees.every(
      (attendee) =>
        attendee.fullName?.trim() &&
        attendee.email?.trim() &&
        attendee.phone?.trim()
    );

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#050505] px-5 py-6 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb + Heading */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-white/45">
              <Link href="/events" className="hover:text-[#D4AF6A]">
                Events
              </Link>
              <span>/</span>
              <Link
                href={`/events/${eventId}`}
                className="hover:text-[#D4AF6A]"
              >
                {eventTitle}
              </Link>
              <span>/</span>
              <span className="text-[#D4AF6A]">Booking Summary</span>
            </div>

            <h1 className="font-[var(--font-playfair)] text-3xl md:text-4xl">
              Booking <span className="text-[#D4AF6A]">Summary</span>
            </h1>
          </div>

          <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
            Step 03 / Review
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          {/* Main Content */}
          <div className="space-y-4">
            {/* Event & Pass Summary */}
            <div className="border border-white/10 bg-[#111111] p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4AF6A]">
                    Event &amp; Pass Details
                  </p>
                  <h2 className="mt-1.5 font-[var(--font-playfair)] text-2xl">
                    {eventTitle}
                  </h2>
                </div>

                <Link
                  href={`/events/${eventId}/tickets`}
                  className="inline-flex items-center gap-1.5 border border-white/15 px-3 py-1.5 text-[11px] text-white/75 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                >
                  <FiEdit2 size={12} />
                  Change Passes
                </Link>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="border border-white/10 bg-[#080808] p-3.5">
                  <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/45">
                    <FiCalendar size={12} className="text-[#D4AF6A]" />
                    Date
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-white">
                    {eventDate}
                  </p>
                </div>

                <div className="border border-white/10 bg-[#080808] p-3.5">
                  <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/45">
                    <FiMapPin size={12} className="text-[#D4AF6A]" />
                    Venue
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-white">
                    {venue}
                  </p>
                </div>

                <div className="border border-white/10 bg-[#080808] p-3.5">
                  <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/45">
                    <FiTag size={12} className="text-[#D4AF6A]" />
                    Selected Passes ({totalQuantity})
                  </p>
                  <div className="mt-1.5 space-y-0.5 text-xs font-medium text-[#D4AF6A]">
                    {selectedItems.map((item) => (
                      <p key={item.id}>
                        {item.quantity} × {item.name}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Attendee Information */}
            <div className="border border-white/10 bg-[#111111] p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <FiUser size={15} className="text-[#D4AF6A]" />
                  <h2 className="font-[var(--font-playfair)] text-xl">
                    Attendee Details
                  </h2>
                </div>

                <Link
                  href={`/events/${eventId}/attendee-details?${selectionQuery}`}
                  className="inline-flex items-center gap-1.5 border border-white/15 px-3 py-1.5 text-[11px] text-white/75 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                >
                  <FiEdit2 size={12} />
                  Edit Attendees
                </Link>
              </div>

              {hasValidAttendees ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {attendees.map((attendee, index) => (
                    <div
                      key={index}
                      className="border border-white/10 bg-[#080808] p-4"
                    >
                      <p className="text-[10px] uppercase tracking-widest text-[#D4AF6A]">
                        Attendee {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-1 font-medium text-white">
                        {attendee.fullName}
                      </p>
                      <p className="mt-1 break-all text-xs text-white/55">
                        {attendee.email}
                      </p>
                      <p className="mt-0.5 text-xs text-white/55">
                        {attendee.phone}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-amber-500/30 bg-amber-500/10 p-4">
                  <p className="text-xs leading-6 text-amber-200">
                    Attendee details are missing or incomplete. Please complete
                    attendee information before proceeding to payment.
                  </p>

                  <Link
                    href={`/events/${eventId}/attendee-details?${selectionQuery}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF6A] hover:text-[#F5E5B5]"
                  >
                    Enter Attendee Details
                    <FiArrowRight size={13} />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Price Summary */}
          <aside className="h-fit border border-white/10 bg-[#111111] p-6 lg:sticky lg:top-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF6A]">
              Payment Breakdown
            </p>

            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl">
              Order Summary
            </h2>

            <div className="my-4 border-t border-white/10" />

            <div className="space-y-3 text-sm">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between gap-4">
                  <span className="text-white/60">
                    {item.quantity} × {item.name}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}

              <div className="flex justify-between border-t border-white/10 pt-3">
                <span className="text-white/50">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/50">GST (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="my-4 border-t border-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Total Payable</span>
              <span className="text-2xl font-semibold text-[#D4AF6A]">
                {formatPrice(total)}
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-white/40">
              Includes 18% GST. Instant digital pass issued after payment.
            </p>

            {hasValidAttendees ? (
              <Link
                href={`/events/${eventId}/checkout?${selectionQuery}`}
                className="mt-5 flex w-full items-center justify-center gap-2 bg-[#D4AF6A] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#F5E5B5]"
              >
                Proceed to Checkout
                <FiArrowRight size={15} />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="mt-5 w-full cursor-not-allowed bg-white/10 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white/30"
              >
                Complete Attendee Details
              </button>
            )}

            <Link
              href={`/events/${eventId}/tickets`}
              className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/45 transition hover:text-[#D4AF6A]"
            >
              <FiArrowLeft size={13} />
              Change Tickets
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
