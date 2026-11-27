"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiSearch,
} from "react-icons/fi";
import { HiOutlineTicket } from "react-icons/hi2";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type LookupBooking = {
  id: string;
  bookingCode: string;
  customerName: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  currency: string;
  event: {
    id: string;
    title: string;
    startAt: string;
    venue: { name: string; city: string } | null;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  payment: {
    gatewayOrderId: string | null;
    gatewayPaymentId: string | null;
    status: string;
  } | null;
};

export default function CheckTicketPage() {
  const [bookingCode, setBookingCode] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<LookupBooking | null>(null);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBooking(null);

    if (!bookingCode.trim() || !contact.trim()) {
      setError("Please enter both your booking code and email or phone number.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/bookings/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingCode: bookingCode.trim(),
          contact: contact.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success || !json.data?.booking) {
        setError(json.message || "Ticket not found.");
        return;
      }
      setBooking(json.data.booking);
    } catch {
      setError("Network error while checking your ticket.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#050505] px-5 pb-16 pt-32 text-white md:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF6A]">
              Guest &amp; Member Lookup
            </p>
            <h1 className="mt-3 font-[var(--font-playfair)] text-3xl sm:text-5xl">
              Check Your <span className="italic text-[#D4AF6A]">Ticket</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">
              Booked as a guest or member? Enter your booking code and the email
              or mobile number used at checkout to view your pass and status.
            </p>
          </div>

          <form
            onSubmit={handleLookup}
            className="mt-8 rounded-2xl border border-white/10 bg-[#101010] p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-xs font-medium text-white/75">
                Booking Code *
                <input
                  required
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value)}
                  placeholder="e.g. IFE-20261126-E6BF9A"
                  className="mt-2 h-11 w-full rounded-lg border border-white/15 bg-[#080808] px-3.5 text-sm uppercase text-white outline-none transition placeholder:normal-case placeholder:text-white/30 focus:border-[#D4AF6A]"
                />
              </label>

              <label className="block text-xs font-medium text-white/75">
                Email or Mobile Number *
                <input
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="you@example.com or 9876543210"
                  className="mt-2 h-11 w-full rounded-lg border border-white/15 bg-[#080808] px-3.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#D4AF6A]"
                />
              </label>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#D4AF6A] text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#F5E5B5] disabled:opacity-60"
            >
              <FiSearch size={15} />
              {loading ? "Checking..." : "Find My Ticket"}
            </button>
          </form>

          {booking && (
            <div className="mt-8 rounded-2xl border border-[#D4AF6A]/40 bg-[#101010] p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4AF6A]">
                    {booking.bookingCode}
                  </p>
                  <h2 className="mt-1 font-[var(--font-playfair)] text-2xl sm:text-3xl">
                    {booking.event.title}
                  </h2>
                  <p className="mt-1 text-xs text-white/55">
                    Booked by {booking.customerName}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${
                    booking.status === "CONFIRMED"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : booking.status === "CANCELLED"
                        ? "bg-red-500/15 text-red-400"
                        : "bg-amber-500/15 text-amber-300"
                  }`}
                >
                  {booking.status === "CONFIRMED" ? (
                    <FiCheckCircle size={13} />
                  ) : (
                    <FiClock size={13} />
                  )}
                  {booking.status}
                </span>
              </div>

              <div className="mt-5 grid gap-4 text-xs text-white/75 sm:grid-cols-2">
                <p className="flex items-center gap-2">
                  <FiCalendar size={14} className="text-[#D4AF6A]" />
                  {new Date(booking.event.startAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="flex items-center gap-2">
                  <FiMapPin size={14} className="text-[#D4AF6A]" />
                  {booking.event.venue
                    ? `${booking.event.venue.name}, ${booking.event.venue.city}`
                    : "Venue TBA"}
                </p>
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-[#080808] p-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Passes Included
                </p>
                <div className="space-y-2 text-sm">
                  {booking.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-white/80">
                        {item.quantity} × {item.name}
                      </span>
                      <span className="font-medium text-white">
                        ₹{item.totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t border-white/10 pt-2.5 text-sm font-semibold text-[#D4AF6A]">
                    <span>Total ({booking.paymentStatus})</span>
                    <span>₹{booking.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/events/${booking.event.id}/digital-ticket?bookingCode=${encodeURIComponent(booking.bookingCode)}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#D4AF6A] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-black transition hover:bg-[#F5E5B5]"
                >
                  <HiOutlineTicket size={16} />
                  View Digital Pass
                </Link>
                <Link
                  href={`/events/${booking.event.id}/booking-confirmation?bookingCode=${encodeURIComponent(booking.bookingCode)}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                >
                  Booking Details
                  <FiArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

