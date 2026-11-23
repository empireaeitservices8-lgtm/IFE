
"use client";

import Link from "next/link";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  CalendarDays,
  MapPin,
  Ticket,
  Printer,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

type Attendee = {
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
};

type Props = {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
};

export default function DigitalTicket({
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
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed as Attendee[];
        }
      }
    } catch (error) {
      console.error("Unable to load attendee details:", error);
    }
    return [];
  });
  const loaded = true;

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-14 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">

        {/* Page Heading */}
        <div className="mb-10 text-center print:hidden">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF6A]">
            International Fashion Entertainment
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl">
            Your Digital Ticket
          </h1>

          <p className="mt-4 text-sm text-gray-400">
            Your event ticket preview is displayed below.
          </p>
        </div>

        {/* Demo Notice */}
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 print:hidden">
          <div className="flex items-start gap-3">
            <ShieldCheck
              className="mt-1 shrink-0 text-amber-400"
              size={21}
            />
            <div>
              <h2 className="font-semibold text-amber-300">
                Demo QR ticket
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                This QR code contains a demonstration ticket
                reference only. It cannot be used for event
                entry or verified by event staff.
              </p>
            </div>
          </div>
        </div>

        {!loaded ? (
          <div className="rounded-xl border border-white/10 bg-[#111111] p-10 text-center text-gray-400">
            Loading ticket details...
          </div>
        ) : attendees.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#111111] p-8 text-center">
            <Ticket
              size={42}
              className="mx-auto mb-4 text-[#D4AF6A]"
            />
            <h2 className="font-serif text-2xl">
              No attendee details found
            </h2>
            <p className="mt-3 text-sm text-gray-400">
              Please complete the attendee details step in
              the booking flow before viewing this ticket.
            </p>
            <Link
              href={`/events/${eventId}/tickets`}
              className="mt-6 inline-flex bg-[#D4AF6A] px-6 py-3 text-sm font-semibold text-black hover:bg-[#F5E5B5]"
            >
              Select Tickets
            </Link>
          </div>
        ) : (
          <div className="space-y-7">
            {attendees.map((attendee, index) => {
              const ticketReference =
                `IFE-DEMO-${eventId.padStart(3, "0")}-${String(
                  index + 1
                ).padStart(3, "0")}`;

              const qrValue =
                `IFE-DEMO-TICKET|event:${eventId}|attendee:${index + 1}|reference:${ticketReference}`;

              return (
                <article
                  key={index}
                  className="overflow-hidden rounded-2xl border border-[#D4AF6A]/40 bg-[#111111] shadow-2xl print:break-inside-avoid print:border print:border-gray-300 print:bg-white print:text-black print:shadow-none"
                >
                  {/* Ticket Top */}
                  <div className="border-b border-dashed border-[#D4AF6A]/40 p-6 sm:p-8 print:border-gray-400">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF6A] print:text-gray-600">
                          IFE • Event Admission
                        </p>
                        <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
                          {eventTitle}
                        </h2>
                      </div>

                      <div className="w-fit rounded-full border border-[#D4AF6A]/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF6A] print:border-gray-400 print:text-gray-700">
                        Demo Ticket
                      </div>
                    </div>
                  </div>

                  {/* Ticket Body */}
                  <div className="grid gap-8 p-6 sm:grid-cols-[1fr_220px] sm:p-8">
                    <div>
                      <div className="mb-7">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 print:text-gray-600">
                          Attendee
                        </p>
                        <h3 className="mt-2 text-xl font-semibold">
                          {attendee.fullName ||
                            attendee.name ||
                            `Attendee ${index + 1}`}
                        </h3>
                        <p className="mt-1 text-sm text-gray-400 print:text-gray-700">
                          {attendee.email || "Email not available"}
                        </p>
                        <p className="mt-1 text-sm text-gray-400 print:text-gray-700">
                          {attendee.phone || "Phone not available"}
                        </p>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                          <CalendarDays
                            size={19}
                            className="mt-1 text-[#D4AF6A] print:text-gray-700"
                          />
                          <div>
                            <p className="text-xs text-gray-500">
                              Event Date
                            </p>
                            <p className="mt-1 text-sm">
                              {eventDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin
                            size={19}
                            className="mt-1 text-[#D4AF6A] print:text-gray-700"
                          />
                          <div>
                            <p className="text-xs text-gray-500">
                              Venue
                            </p>
                            <p className="mt-1 text-sm">
                              {venue}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 border-t border-white/10 pt-5 print:border-gray-300">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          Ticket Reference
                        </p>
                        <p className="mt-2 break-all font-mono text-sm font-semibold tracking-wider text-[#D4AF6A] print:text-gray-900">
                          {ticketReference}
                        </p>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center justify-center rounded-xl bg-white p-5 text-center">
                      <QRCodeSVG
                        value={qrValue}
                        size={160}
                        level="H"
                        includeMargin
                      />
                      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-black">
                        Demo QR Code
                      </p>
                      <p className="mt-1 text-[10px] text-gray-600">
                        Not valid for entry
                      </p>
                    </div>
                  </div>

                  {/* Ticket Footer */}
                  <div className="flex flex-col justify-between gap-2 border-t border-white/10 bg-white/[0.03] px-6 py-4 text-xs text-gray-500 sm:flex-row print:border-gray-300 print:bg-gray-100 print:text-gray-700">
                    <span>International Fashion Entertainment</span>
                    <span>Attendee {index + 1} of {attendees.length}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            disabled={!loaded || attendees.length === 0}
            className="inline-flex items-center justify-center gap-2 bg-[#D4AF6A] px-7 py-4 text-sm font-semibold text-black transition hover:bg-[#F5E5B5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Printer size={18} />
            Print Digital Ticket
          </button>

          <Link
            href={`/events/${eventId}/booking-confirmation`}
            className="inline-flex items-center justify-center gap-2 border border-white/20 px-7 py-4 text-sm font-semibold text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
          >
            <ArrowLeft size={18} />
            Back to Confirmation
          </Link>

          <Link
            href="/events"
            className="inline-flex items-center justify-center border border-white/20 px-7 py-4 text-sm font-semibold text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
          >
            Explore Events
          </Link>
        </div>
      </div>
    </main>
  );
}
