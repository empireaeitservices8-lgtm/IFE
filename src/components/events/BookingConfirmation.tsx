"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiMapPin,
  FiTag,
  FiUsers,
} from "react-icons/fi";
import { useSessionStorageValue } from "@/lib/hooks/use-session-storage";

type Attendee = {
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
};

type Props = {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
};

export default function BookingConfirmation({
  eventId,
  eventTitle,
  eventDate,
  venue,
}: Props) {
  const rawAttendees = useSessionStorageValue(`ife-attendees-${eventId}`);
  const rawBooking = useSessionStorageValue(`ife-booking-${eventId}`);

  const attendees = useMemo<Attendee[]>(() => {
    if (!rawAttendees) return [];
    try {
      const parsed: unknown = JSON.parse(rawAttendees);
      return Array.isArray(parsed) ? (parsed as Attendee[]) : [];
    } catch {
      return [];
    }
  }, [rawAttendees]);

  const bookingCode = useMemo<string>(() => {
    if (rawBooking) {
      try {
        const parsed = JSON.parse(rawBooking) as { bookingCode?: string };
        if (parsed.bookingCode) return parsed.bookingCode;
      } catch {}
    }
    return `IFE-${eventId.slice(0, 6).toUpperCase()}`;
  }, [rawBooking, eventId]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto w-full max-w-4xl">
        {/* Compact Success Header */}
        <div className="mb-6 flex flex-col items-center justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:text-left">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D4AF6A]/40 bg-[#D4AF6A]/10 text-[#D4AF6A]">
              <FiCheckCircle size={24} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF6A]">
                Booking Confirmed
              </p>
              <h1 className="font-[var(--font-playfair)] text-2xl sm:text-3xl">
                {eventTitle}
              </h1>
            </div>
          </div>

          <div className="border border-[#D4AF6A]/40 bg-[#111111] px-4 py-2.5 text-center sm:text-right">
            <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400">
              Booking Reference
            </p>
            <p className="mt-0.5 font-mono text-base font-semibold tracking-wider text-[#D4AF6A]">
              {bookingCode}
            </p>
          </div>
        </div>

        {/* 2-Column Main Grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Event Details */}
          <section className="border border-white/10 bg-[#111111] p-5">
            <h2 className="mb-4 font-[var(--font-playfair)] text-lg text-white">
              Event Details
            </h2>

            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3">
                <FiCalendar className="mt-0.5 shrink-0 text-[#D4AF6A]" size={16} />
                <div>
                  <p className="text-[11px] text-gray-400">Event Date</p>
                  <p className="text-white">{eventDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 shrink-0 text-[#D4AF6A]" size={16} />
                <div>
                  <p className="text-[11px] text-gray-400">Venue</p>
                  <p className="text-white">{venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiTag className="mt-0.5 shrink-0 text-[#D4AF6A]" size={16} />
                <div>
                  <p className="text-[11px] text-gray-400">Status</p>
                  <p className="font-medium text-emerald-400">Confirmed &amp; Paid</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiUsers className="mt-0.5 shrink-0 text-[#D4AF6A]" size={16} />
                <div>
                  <p className="text-[11px] text-gray-400">Attendees</p>
                  <p className="text-white">{attendees.length}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Attendee Information */}
          <section className="border border-white/10 bg-[#111111] p-5">
            <h2 className="mb-4 font-[var(--font-playfair)] text-lg text-white">
              Attendee Information
            </h2>

            {attendees.length > 0 ? (
              <div className="max-h-56 space-y-2.5 overflow-y-auto pr-1">
                {attendees.map((attendee, index) => (
                  <div
                    key={index}
                    className="border border-white/10 bg-[#080808] p-3"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-[#D4AF6A]">
                      Attendee {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-white">
                      {attendee.fullName || attendee.name || "Guest"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {attendee.email || "—"} • {attendee.phone || "—"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs leading-6 text-gray-400">
                Your booking ({bookingCode}) is confirmed. Present your booking
                reference or digital pass at venue check-in.
              </p>
            )}
          </section>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={`/events/${eventId}/digital-ticket`}
            className="inline-flex items-center justify-center gap-2 bg-[#D4AF6A] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-black transition hover:bg-[#F5E5B5]"
          >
            View Digital Ticket
            <FiArrowRight size={16} />
          </Link>

          <Link
            href="/my-bookings"
            className="inline-flex items-center justify-center border border-white/20 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
          >
            My Bookings
          </Link>

          <Link
            href="/events"
            className="inline-flex items-center justify-center border border-white/20 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
          >
            Explore Events
          </Link>
        </div>
      </div>
    </main>
  );
}
