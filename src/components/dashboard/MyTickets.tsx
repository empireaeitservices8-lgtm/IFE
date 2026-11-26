
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Ticket,
  CalendarDays,
  MapPin,
  QrCode,
  ArrowRight,
  UserRound,
} from "lucide-react";

type TicketRecord = {
  id: string;
  eventId: string;
  eventTitle: string;
  reference: string;
  attendee: string;
  ticketType: string;
  eventDate: string;
  venue: string;
  category: string;
};

type ApiBookingForTicket = {
  id: string;
  eventId: string;
  bookingCode: string;
  customerName: string;
  status: string;
  event?: {
    title: string;
    category: string;
    startAt: string;
    venue?: { name: string } | null;
  } | null;
  items?: { id: string; quantity: number; ticketType?: { name: string } | null }[];
};

export default function MyTickets() {
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/bookings/my-bookings")
      .then((res) => res.json())
      .then((json) => {
        if (!active || !json.success) return;
        const records: TicketRecord[] = [];
        for (const b of (json.data.items || []) as ApiBookingForTicket[]) {
          if (b.status === "CANCELLED") continue;
          for (const item of b.items || []) {
            records.push({
              id: `${b.id}-${item.id}`,
              eventId: b.eventId,
              eventTitle: b.event?.title || "Event",
              reference: b.bookingCode,
              attendee: b.customerName,
              ticketType: `${item.ticketType?.name || "Ticket"} (x${item.quantity})`,
              eventDate: b.event?.startAt
                ? new Date(b.event.startAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "TBA",
              venue: b.event?.venue?.name || "Venue TBA",
              category: b.event?.category || "EVENT",
            });
          }
        }
        setTickets(records);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const filteredTickets = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return tickets;

    return tickets.filter((ticket) =>
      [
        ticket.eventTitle,
        ticket.reference,
        ticket.attendee,
        ticket.ticketType,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [tickets, search]);

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-12 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF6A]">
            Customer Account
          </p>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl">
                My Tickets
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-gray-400">
                Find your event tickets and attendee information in one place.
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

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search event, attendee or ticket reference..."
              className="w-full border border-white/10 bg-[#111111] py-4 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#D4AF6A]"
            />
          </div>
        </div>

        {/* Count */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {filteredTickets.length}{" "}
            {filteredTickets.length === 1 ? "ticket" : "tickets"}
          </p>
        </div>

        {/* Ticket list */}
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredTickets.map((ticket) => (
            <article
              key={ticket.id}
              className="overflow-hidden border border-white/10 bg-[#101010] transition hover:border-[#D4AF6A]/50"
            >
              <div className="p-5 sm:p-7">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="border border-[#D4AF6A]/40 bg-[#D4AF6A]/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#D4AF6A]">
                    Digital Pass
                  </span>
                  <span className="text-xs text-gray-500">
                    {ticket.category}
                  </span>
                </div>

                <h2 className="font-serif text-2xl leading-tight text-white">
                  {ticket.eventTitle}
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <UserRound
                      size={17}
                      className="mt-0.5 text-[#D4AF6A]"
                    />
                    <div>
                      <p className="text-xs text-gray-500">Attendee</p>
                      <p className="mt-1 text-sm text-gray-200">
                        {ticket.attendee}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Ticket
                      size={17}
                      className="mt-0.5 text-[#D4AF6A]"
                    />
                    <div>
                      <p className="text-xs text-gray-500">Ticket Type</p>
                      <p className="mt-1 text-sm text-gray-200">
                        {ticket.ticketType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarDays
                      size={17}
                      className="mt-0.5 text-[#D4AF6A]"
                    />
                    <div>
                      <p className="text-xs text-gray-500">Event Date</p>
                      <p className="mt-1 text-sm text-gray-200">
                        {ticket.eventDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin
                      size={17}
                      className="mt-0.5 text-[#D4AF6A]"
                    />
                    <div>
                      <p className="text-xs text-gray-500">Venue</p>
                      <p className="mt-1 text-sm text-gray-200">
                        {ticket.venue}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ticket reference */}
                <div className="mt-7 border-t border-dashed border-white/20 pt-5">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">
                    Ticket Reference
                  </p>
                  <p className="mt-2 break-all text-sm font-semibold tracking-wider text-[#F5E5B5]">
                    {ticket.reference}
                  </p>
                </div>
              </div>

              {/* QR and actions */}
              <div className="flex flex-col gap-4 border-t border-white/10 bg-[#151515] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center border border-[#D4AF6A]/30 bg-black">
                    <QrCode size={23} className="text-[#D4AF6A]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-200">
                      QR Entry Pass
                    </p>
                    <p className="mt-1 text-[10px] text-gray-500">
                      Present at venue entry
                    </p>
                  </div>
                </div>

                <Link
                  href={`/events/${ticket.eventId}/digital-ticket`}
                  className="inline-flex items-center justify-center gap-2 bg-[#D4AF6A] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-[#F5E5B5]"
                >
                  View QR Ticket
                  <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {filteredTickets.length === 0 && (
          <div className="border border-white/10 bg-[#101010] px-5 py-16 text-center">
            <Ticket size={34} className="mx-auto text-gray-600" />
            <h3 className="mt-5 font-serif text-2xl text-white">
              No tickets found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try searching with another event name or ticket reference.
            </p>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-6 border border-[#D4AF6A] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[#D4AF6A] transition hover:bg-[#D4AF6A] hover:text-black"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Footer navigation */}
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 transition hover:text-[#D4AF6A]"
          >
            ← Back to Dashboard
          </Link>

          <Link
            href="/my-bookings"
            className="inline-flex items-center gap-2 text-sm text-[#D4AF6A] transition hover:text-[#F5E5B5]"
          >
            View My Bookings
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
