"use client";

import Link from "next/link";
import { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  FiArrowLeft,
  FiCalendar,
  FiMapPin,
  FiPrinter,
  FiTag,
} from "react-icons/fi";
import { useSessionStorageValue } from "@/lib/hooks/use-session-storage";

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-8 text-white sm:px-6 print:bg-white print:p-0 print:text-black">
      <div className="mx-auto w-full max-w-4xl">
        {/* Compact Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 print:hidden">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF6A]">
              Official Event Pass
            </p>
            <h1 className="font-[var(--font-playfair)] text-2xl sm:text-3xl">
              Your Digital Ticket
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              disabled={attendees.length === 0}
              className="inline-flex items-center gap-2 bg-[#D4AF6A] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-[#F5E5B5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiPrinter size={15} />
              Print Pass
            </button>

            <Link
              href={`/events/${eventId}/booking-confirmation`}
              className="inline-flex items-center gap-2 border border-white/20 px-4 py-2.5 text-xs font-semibold text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
            >
              <FiArrowLeft size={14} />
              Confirmation
            </Link>
          </div>
        </div>

        {attendees.length === 0 ? (
          <div className="border border-white/10 bg-[#111111] p-8 text-center">
            <FiTag size={34} className="mx-auto mb-3 text-[#D4AF6A]" />
            <h2 className="font-[var(--font-playfair)] text-2xl">
              No attendee details found
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Please complete attendee details in the booking flow to view your
              digital pass.
            </p>
            <Link
              href={`/events/${eventId}/tickets`}
              className="mt-5 inline-flex bg-[#D4AF6A] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#F5E5B5]"
            >
              Select Tickets
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {attendees.map((attendee, index) => {
              const ticketReference = `${bookingCode}-${String(index + 1).padStart(2, "0")}`;
              const qrValue = `IFE-PASS|code:${bookingCode}|event:${eventId}|attendee:${index + 1}|ref:${ticketReference}`;

              return (
                <article
                  key={index}
                  className="overflow-hidden border border-[#D4AF6A]/40 bg-[#111111] shadow-2xl print:break-inside-avoid print:border print:border-gray-300 print:bg-white print:text-black print:shadow-none"
                >
                  {/* Ticket Top */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-[#D4AF6A]/40 px-6 py-4 print:border-gray-400">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF6A] print:text-gray-600">
                        IFE • Event Admission
                      </p>
                      <h2 className="mt-1 font-[var(--font-playfair)] text-xl sm:text-2xl">
                        {eventTitle}
                      </h2>
                    </div>

                    <span className="border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 print:border-gray-400 print:text-gray-700">
                      Confirmed Pass
                    </span>
                  </div>

                  {/* Ticket Body */}
                  <div className="grid items-center gap-6 p-6 sm:grid-cols-[1fr_190px]">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 print:text-gray-600">
                          Attendee {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-0.5 text-lg font-semibold">
                          {attendee.fullName ||
                            attendee.name ||
                            `Attendee ${index + 1}`}
                        </h3>
                        <p className="text-xs text-gray-400 print:text-gray-700">
                          {attendee.email || "—"} • {attendee.phone || "—"}
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-start gap-2.5">
                          <FiCalendar
                            size={16}
                            className="mt-0.5 shrink-0 text-[#D4AF6A] print:text-gray-700"
                          />
                          <div>
                            <p className="text-[10px] text-gray-500">
                              Event Date
                            </p>
                            <p className="text-xs text-white/90 print:text-black">
                              {eventDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <FiMapPin
                            size={16}
                            className="mt-0.5 shrink-0 text-[#D4AF6A] print:text-gray-700"
                          />
                          <div>
                            <p className="text-[10px] text-gray-500">Venue</p>
                            <p className="text-xs text-white/90 print:text-black">
                              {venue}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-3 print:border-gray-300">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                          Ticket Reference
                        </p>
                        <p className="mt-0.5 break-all font-mono text-xs font-semibold tracking-wider text-[#D4AF6A] print:text-gray-900">
                          {ticketReference}
                        </p>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center justify-center rounded-lg bg-white p-3.5 text-center">
                      <QRCodeSVG
                        value={qrValue}
                        size={136}
                        level="H"
                        includeMargin
                      />
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-black">
                        Scan at Entry
                      </p>
                    </div>
                  </div>

                  {/* Ticket Footer */}
                  <div className="flex flex-wrap justify-between gap-2 border-t border-white/10 bg-white/[0.03] px-6 py-2.5 text-[11px] text-gray-400 print:border-gray-300 print:bg-gray-100 print:text-gray-700">
                    <span>International Fashion Entertainment</span>
                    <span>
                      Pass {index + 1} of {attendees.length}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
