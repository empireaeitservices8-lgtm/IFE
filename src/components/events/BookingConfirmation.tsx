
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  CalendarDays,
  MapPin,
  Ticket,
  Users,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

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
  const [attendees] = useState<Attendee[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = sessionStorage.getItem(`ife-attendees-${eventId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed as Attendee[];
      }
    } catch {}
    return [];
  });
  const loaded = true;
  const [bookingCode] = useState<string>(() => {
    if (typeof window === "undefined") {
      return `IFE-${eventId.slice(0, 6).toUpperCase()}`;
    }
    const fromQuery = new URLSearchParams(window.location.search).get(
      "bookingCode"
    );
    if (fromQuery) return fromQuery;
    try {
      const saved = sessionStorage.getItem(`ife-booking-${eventId}`);
      if (saved) {
        const parsed = JSON.parse(saved) as { bookingCode?: string };
        if (parsed.bookingCode) return parsed.bookingCode;
      }
    } catch {}
    return `IFE-${eventId.slice(0, 6).toUpperCase()}`;
  });

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-16 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">

        {/* Success Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF6A]/40 bg-[#D4AF6A]/10">
            <CheckCircle2
              size={42}
              className="text-[#D4AF6A]"
            />
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF6A]">
            IFE Event Booking
          </p>

          <h1 className="mb-4 font-serif text-4xl sm:text-5xl">
            Booking Confirmation
          </h1>

          <p className="mx-auto max-w-xl text-sm leading-7 text-gray-400">
            Your demo booking confirmation page is ready.
            Actual booking confirmation will be available
            after payment verification is connected.
          </p>
        </div>

        {/* Demo Notice */}
        <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck
              className="mt-1 shrink-0 text-amber-400"
              size={22}
            />
            <div>
              <h2 className="mb-1 font-semibold text-amber-300">
                Demo confirmation
              </h2>
              <p className="text-sm leading-6 text-gray-400">
                This is a frontend demonstration only.
                No verified payment or confirmed booking
                has been created yet.
              </p>
            </div>
          </div>
        </div>

        {/* Booking Reference */}
        <section className="mb-8 rounded-xl border border-[#D4AF6A]/30 bg-[#111111] p-6 text-center sm:p-8">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gray-500">
            Booking Reference
          </p>

          <h2 className="font-serif text-2xl tracking-wider text-[#D4AF6A]">
            {bookingCode}
          </h2>

          <p className="mt-3 text-xs text-gray-500">
            Present this reference at venue check-in
          </p>
        </section>

        {/* Event Details */}
        <section className="mb-8 rounded-xl border border-white/10 bg-[#111111] p-6 sm:p-8">
          <h2 className="mb-6 font-serif text-2xl">
            Event Details
          </h2>

          <h3 className="mb-6 text-xl font-semibold text-[#D4AF6A]">
            {eventTitle}
          </h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <CalendarDays
                className="mt-1 text-[#D4AF6A]"
                size={20}
              />
              <div>
                <p className="text-xs text-gray-500">Event Date</p>
                <p className="mt-1 text-sm">{eventDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin
                className="mt-1 text-[#D4AF6A]"
                size={20}
              />
              <div>
                <p className="text-xs text-gray-500">Venue</p>
                <p className="mt-1 text-sm">{venue}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Ticket
                className="mt-1 text-[#D4AF6A]"
                size={20}
              />
              <div>
                <p className="text-xs text-gray-500">Booking Status</p>
                <p className="mt-1 text-sm text-amber-300">
                  Awaiting payment integration
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users
                className="mt-1 text-[#D4AF6A]"
                size={20}
              />
              <div>
                <p className="text-xs text-gray-500">Attendees</p>
                <p className="mt-1 text-sm">
                  {loaded ? attendees.length : "Loading..."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Attendee Details */}
        <section className="mb-8 rounded-xl border border-white/10 bg-[#111111] p-6 sm:p-8">
          <h2 className="mb-6 font-serif text-2xl">
            Attendee Information
          </h2>

          {!loaded ? (
            <p className="text-sm text-gray-400">
              Loading attendee information...
            </p>
          ) : attendees.length > 0 ? (
            <div className="space-y-4">
              {attendees.map((attendee, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-white/10 p-4"
                >
                  <p className="mb-3 text-xs uppercase tracking-wider text-[#D4AF6A]">
                    Attendee {index + 1}
                  </p>

                  <p className="font-medium">
                    {attendee.fullName ||
                      attendee.name ||
                      "Name not available"}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    {attendee.email || "Email not available"}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    {attendee.phone || "Phone not available"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              No attendee details were found in this browser session.
            </p>
          )}
        </section>

        {/* Next Steps */}
        <section className="mb-10 rounded-xl border border-white/10 bg-[#111111] p-6 sm:p-8">
          <h2 className="mb-4 font-serif text-2xl">
            What Happens Next?
          </h2>

          <ul className="space-y-3 text-sm leading-6 text-gray-400">
            <li>
              • Razorpay payment verification will be connected
              during backend integration.
            </li>
            <li>
              • A confirmed booking will receive a unique
              booking reference.
            </li>
            <li>
              • A digital ticket with a QR code will be
              generated after successful verification.
            </li>
            <li>
              • Booking confirmation emails will be sent
              after the email service is integrated.
            </li>
          </ul>
        </section>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href={`/events/${eventId}/digital-ticket`}
            className="inline-flex items-center justify-center gap-2 bg-[#D4AF6A] px-7 py-4 text-sm font-semibold text-black transition hover:bg-[#F5E5B5]"
          >
            View Digital Ticket
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/events"
            className="inline-flex items-center justify-center gap-2 border border-white/20 px-7 py-4 text-sm font-semibold text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
          >
            Explore More Events
          </Link>
        </div>

      </div>
    </main>
  );
}
