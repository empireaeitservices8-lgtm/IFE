
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  CalendarDays,
  MapPin,
  Ticket,
  ArrowRight,
  Eye,
  Clock,
} from "lucide-react";

type Booking = {
  id: string;
  eventId: string;
  eventTitle: string;
  reference: string;
  date: string;
  venue: string;
  ticketType: string;
  quantity: number;
  amount: number;
  category: string;
  status: string;
  paymentStatus: string;
};

type ApiMyBooking = {
  id: string;
  eventId: string;
  bookingCode: string;
  totalAmount: string | number;
  status?: string;
  paymentStatus?: string;
  event?: {
    title: string;
    category: string;
    startAt: string;
    venue?: { name: string } | null;
  } | null;
  items?: { quantity: number; ticketType?: { name: string } | null }[];
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let active = true;
    fetch("/api/bookings/my-bookings")
      .then((res) => res.json())
      .then((json) => {
        if (!active || !json.success) return;
        const mapped: Booking[] = (json.data.items || []).map(
          (b: ApiMyBooking) => ({
            id: b.id,
            eventId: b.eventId,
            eventTitle: b.event?.title || "Event",
            reference: b.bookingCode,
            date: b.event?.startAt
              ? new Date(b.event.startAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "TBA",
            venue: b.event?.venue?.name || "Venue TBA",
            ticketType:
              (b.items || [])
                .map((i) => i.ticketType?.name)
                .filter(Boolean)
                .join(", ") || "Ticket",
            quantity: (b.items || []).reduce((s, i) => s + i.quantity, 0),
            amount: Number(b.totalAmount),
            category: b.event?.category || "EVENT",
            status: b.status || "PENDING",
            paymentStatus: b.paymentStatus || "PENDING",
          })
        );
        setBookings(mapped);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch = [
        booking.eventTitle,
        booking.reference,
        booking.category,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" || booking.category.toLowerCase() === filter;

      return matchesSearch && matchesFilter;
    });
  }, [bookings, search, filter]);

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-12 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF6A]">
            Customer Account
          </p>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="font-serif text-4xl text-white sm:text-5xl">
                My Bookings
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-gray-400">
                View your event booking details, ticket information and
                booking references in one place.
              </p>
            </div>

            <Link
              href="/events"
              className="inline-flex w-fit items-center gap-2 border border-[#D4AF6A] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[#D4AF6A] transition hover:bg-[#D4AF6A] hover:text-black"
            >
              Explore Events
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Search and filter */}
        <div className="mb-8 grid gap-4 sm:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search event name or booking reference..."
              className="w-full border border-white/10 bg-[#111111] py-4 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#D4AF6A]"
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="w-full border border-white/10 bg-[#111111] px-4 py-4 text-sm text-gray-300 outline-none focus:border-[#D4AF6A]"
          >
            <option value="all">All Categories</option>
            <option value="fashion">Fashion</option>
            <option value="entertainment">Entertainment</option>
            <option value="concert">Concert</option>
            <option value="awards">Awards</option>
          </select>
        </div>

        {/* Booking count */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing{" "}
            <span className="font-semibold text-white">
              {filteredBookings.length}
            </span>{" "}
            {filteredBookings.length === 1 ? "booking" : "bookings"}
          </p>
        </div>

        {/* Booking cards */}
        <div className="space-y-5">
          {filteredBookings.map((booking) => (
            <article
              key={booking.id}
              className="border border-white/10 bg-[#101010] p-5 transition hover:border-[#D4AF6A]/50 sm:p-7"
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row">
                <div className="min-w-0 flex-1">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="border border-[#D4AF6A]/40 bg-[#D4AF6A]/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#D4AF6A]">
                      {booking.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {booking.category}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl text-white sm:text-3xl">
                    {booking.eventTitle}
                  </h2>

                  <p className="mt-3 text-xs text-gray-500">
                    Booking Reference:{" "}
                    <span className="font-semibold tracking-wider text-[#D4AF6A]">
                      {booking.reference}
                    </span>
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <CalendarDays
                        size={18}
                        className="mt-0.5 shrink-0 text-[#D4AF6A]"
                      />
                      <div>
                        <p className="text-xs text-gray-500">Event Date</p>
                        <p className="mt-1 text-sm text-gray-200">
                          {booking.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin
                        size={18}
                        className="mt-0.5 shrink-0 text-[#D4AF6A]"
                      />
                      <div>
                        <p className="text-xs text-gray-500">Venue</p>
                        <p className="mt-1 text-sm text-gray-200">
                          {booking.venue}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Ticket
                        size={18}
                        className="mt-0.5 shrink-0 text-[#D4AF6A]"
                      />
                      <div>
                        <p className="text-xs text-gray-500">Ticket Details</p>
                        <p className="mt-1 text-sm text-gray-200">
                          {booking.ticketType} × {booking.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock
                        size={18}
                        className="mt-0.5 shrink-0 text-[#D4AF6A]"
                      />
                      <div>
                        <p className="text-xs text-gray-500">Booking Status</p>
                        <p className="mt-1 text-sm text-[#D4AF6A]">
                          {booking.status} ({booking.paymentStatus})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amount and actions */}
                <div className="flex flex-col justify-between gap-5 border-t border-white/10 pt-5 lg:w-52 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      Total Paid
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-[#F5E5B5]">
                      ₹{booking.amount.toLocaleString("en-IN")}
                    </p>
                    <p className="mt-1 text-[10px] text-gray-600">
                      Payment: {booking.paymentStatus}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Link
                      href={`/events/${booking.eventId}`}
                      className="flex items-center justify-center gap-2 border border-white/15 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-200 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                    >
                      <Eye size={15} />
                      View Event
                    </Link>

                    <Link
                      href={`/events/${booking.eventId}/booking-confirmation?bookingCode=${encodeURIComponent(booking.reference)}`}
                      className="flex items-center justify-center gap-2 bg-[#D4AF6A] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-[#F5E5B5]"
                    >
                      Booking Details
                      <ArrowRight size={15} />
                    </Link>

                    <Link
                      href={`/events/${booking.eventId}/digital-ticket?bookingCode=${encodeURIComponent(booking.reference)}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-xs text-gray-400 transition hover:text-[#D4AF6A]"
                    >
                      <Ticket size={15} />
                      View Digital Ticket
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {/* Empty state */}
          {filteredBookings.length === 0 && (
            <div className="border border-white/10 bg-[#101010] px-5 py-16 text-center">
              <Search
                size={32}
                className="mx-auto text-gray-600"
              />
              <h3 className="mt-5 font-serif text-2xl text-white">
                No bookings found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Try another search term to find a booking record.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="mt-6 border border-[#D4AF6A] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[#D4AF6A] transition hover:bg-[#D4AF6A] hover:text-black"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Bottom navigation */}
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 transition hover:text-[#D4AF6A]"
          >
            ← Back to Dashboard
          </Link>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-[#D4AF6A] transition hover:text-[#F5E5B5]"
          >
            Discover More Events
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
