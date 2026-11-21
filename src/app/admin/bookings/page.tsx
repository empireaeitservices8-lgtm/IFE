
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  Ticket,
  CircleDollarSign,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

type Booking = {
  id: string;
  bookingCode: string;
  customer: string;
  email: string;
  event: string;
  date: string;
  ticketType: string;
  quantity: number;
  amount: number;
  status: BookingStatus;
};

type ApiBooking = {
  id: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  totalAmount: string | number;
  status: string;
  createdAt: string;
  event?: { title: string } | null;
  items?: { quantity: number; ticketType?: { name: string } | null }[];
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const mapBookings = (items: ApiBooking[]): Booking[] =>
    items.map((b) => {
      const totalQty = (b.items || []).reduce((s, i) => s + i.quantity, 0);
      const ticketNames = (b.items || [])
        .map((i) => i.ticketType?.name)
        .filter(Boolean)
        .join(", ");
      return {
        id: b.id,
        bookingCode: b.bookingCode,
        customer: b.customerName,
        email: b.customerEmail,
        event: b.event?.title || "Event",
        date: new Date(b.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        ticketType: ticketNames || "Ticket",
        quantity: totalQty,
        amount: Number(b.totalAmount),
        status:
          b.status === "CONFIRMED"
            ? "Confirmed"
            : b.status === "CANCELLED" || b.status === "EXPIRED"
              ? "Cancelled"
              : "Pending",
      };
    });

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/bookings?limit=100");
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to load bookings.");
        return;
      }
      setBookings(mapBookings(json.data.items || []));
    } catch {
      setError("Network error while loading bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/bookings?limit=100")
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        if (json.success) {
          setBookings(mapBookings(json.data.items || []));
        } else {
          setError(json.message || "Failed to load bookings.");
        }
      })
      .catch(() => {
        if (active) setError("Network error while loading bookings.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const term = search.toLowerCase();

      const matchesSearch =
        booking.bookingCode.toLowerCase().includes(term) ||
        booking.customer.toLowerCase().includes(term) ||
        booking.email.toLowerCase().includes(term) ||
        booking.event.toLowerCase().includes(term);

      return matchesSearch && (filter === "All" || booking.status === filter);
    });
  }, [bookings, search, filter]);

  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
  const pending = bookings.filter((b) => b.status === "Pending").length;
  const cancelled = bookings.filter((b) => b.status === "Cancelled").length;
  const revenue = bookings
    .filter((b) => b.status === "Confirmed")
    .reduce((sum, b) => sum + b.amount, 0);

  async function updateStatus(id: string, status: BookingStatus) {
    try {
      setError("");
      const endpoint =
        status === "Confirmed"
          ? `/api/bookings/${id}/confirm`
          : `/api/bookings/${id}/cancel`;
      const res = await fetch(endpoint, { method: "PATCH" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to update booking.");
        return;
      }
      await loadBookings();
    } catch {
      setError("Network error while updating booking.");
    }
  }

  function viewBooking(booking: Booking) {
    window.alert(
      `Booking Code: ${booking.bookingCode}\nCustomer: ${booking.customer}\nEmail: ${booking.email}\nEvent: ${booking.event}\nTicket: ${booking.ticketType}\nQuantity: ${booking.quantity}\nAmount: ${money(booking.amount)}\nStatus: ${booking.status}${loading ? "" : ""}`
    );
  }

  function statusClass(status: BookingStatus) {
    if (status === "Confirmed") return "bg-emerald-500/10 text-emerald-400";
    if (status === "Pending") return "bg-amber-500/10 text-amber-400";
    return "bg-red-500/10 text-red-400";
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#0d0d0d] lg:block">
        <div className="border-b border-white/10 px-7 py-7">
          <Link href="/admin/dashboard" className="text-2xl font-bold tracking-[0.2em] text-[#D4AF6A]">
            IFE<span className="text-white">.</span>
          </Link>
          <p className="mt-1 text-[10px] tracking-[0.25em] text-gray-500">ADMINISTRATION</p>
        </div>
        <nav className="space-y-2 px-4 py-6 text-sm">
          {[
            ["Dashboard", "/admin/dashboard"],
            ["Events", "/admin/events"],
            ["Tickets", "/admin/tickets"],
            ["Bookings", "/admin/bookings"],
            ["Customers", "/admin/customers"],
            ["Payments", "/admin/payments"],
            ["Artists", "/admin/artists"],
            ["Venues", "/admin/venues"],
            ["Gallery", "/admin/gallery"],
            ["Settings", "/admin/settings"],
          ].map(([name, href]) => (
            <Link
              key={name}
              href={href}
              className={`block rounded-xl px-4 py-3 transition ${
                name === "Bookings"
                  ? "bg-[#D4AF6A]/10 text-[#D4AF6A]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="lg:ml-64">
        <header className="flex h-20 items-center justify-between border-b border-white/10 px-5 md:px-10">
          <div>
            <p className="text-xs text-gray-500">Admin / Bookings</p>
            <h1 className="mt-1 text-lg font-semibold">Bookings Management</h1>
          </div>
          <Link
            href="/admin/events"
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
          >
            View Events
          </Link>
        </header>

        <div className="space-y-8 px-5 py-8 md:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF6A]">
              Booking operations
            </p>
            <h2 className="mt-2 text-3xl font-semibold">All Bookings</h2>
            <p className="mt-2 text-sm text-gray-500">
              Monitor customer reservations and booking statuses.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Bookings", value: bookings.length, icon: Ticket, note: "All booking records" },
              { label: "Confirmed", value: confirmed, icon: CheckCircle, note: "Confirmed demo bookings" },
              { label: "Pending", value: pending, icon: Clock, note: "Awaiting confirmation" },
              { label: "Confirmed Revenue", value: money(revenue), icon: CircleDollarSign, note: `${cancelled} cancelled bookings excluded` },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#101010] p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <div className="rounded-xl bg-[#D4AF6A]/10 p-3 text-[#D4AF6A]">
                      <Icon size={19} />
                    </div>
                  </div>
                  <p className="mt-5 text-2xl font-semibold">{stat.value}</p>
                  <p className="mt-2 text-xs text-gray-600">{stat.note}</p>
                </div>
              );
            })}
          </div>

          <section className="rounded-2xl border border-white/10 bg-[#101010] p-5 md:p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h3 className="text-lg font-semibold">Booking Records</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Search by booking ID, customer, email or event.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={17} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search bookings..."
                    className="w-full rounded-xl border border-white/10 bg-[#080808] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#D4AF6A] sm:w-64"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-sm text-gray-300 outline-none focus:border-[#D4AF6A]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-4 font-medium">Booking ID</th>
                    <th className="px-4 py-4 font-medium">Customer</th>
                    <th className="px-4 py-4 font-medium">Event</th>
                    <th className="px-4 py-4 font-medium">Ticket</th>
                    <th className="px-4 py-4 font-medium">Amount</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-4 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                      <td className="px-4 py-5 font-medium text-[#D4AF6A]">{booking.id}</td>
                      <td className="px-4 py-5">
                        <p className="font-medium">{booking.customer}</p>
                        <p className="mt-1 text-xs text-gray-500">{booking.email}</p>
                      </td>
                      <td className="px-4 py-5">
                        <p className="max-w-48 text-gray-300">{booking.event}</p>
                        <p className="mt-1 text-xs text-gray-500">{booking.date}</p>
                      </td>
                      <td className="px-4 py-5 text-gray-300">
                        {booking.ticketType} × {booking.quantity}
                      </td>
                      <td className="px-4 py-5 font-medium">{money(booking.amount)}</td>
                      <td className="px-4 py-5">
                        <span className={`rounded-full px-3 py-1.5 text-xs ${statusClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            title="View booking details"
                            onClick={() => viewBooking(booking)}
                            className="rounded-lg border border-white/10 p-2 text-gray-400 hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                          >
                            <Eye size={15} />
                          </button>
                          {booking.status === "Pending" && (
                            <button
                              type="button"
                              title="Confirm booking (demo only)"
                              onClick={() => updateStatus(booking.id, "Confirmed")}
                              className="rounded-lg border border-emerald-500/20 p-2 text-emerald-400 hover:bg-emerald-500/10"
                            >
                              <CheckCircle size={15} />
                            </button>
                          )}
                          {booking.status !== "Cancelled" && (
                            <button
                              type="button"
                              title="Cancel booking (demo only)"
                              onClick={() => updateStatus(booking.id, "Cancelled")}
                              className="rounded-lg border border-red-500/20 p-2 text-red-400 hover:bg-red-500/10"
                            >
                              <XCircle size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredBookings.length === 0 && (
                <div className="py-12 text-center text-sm text-gray-500">
                  No bookings found.
                </div>
              )}
            </div>
          </section>

          <div className="rounded-xl border border-[#D4AF6A]/20 bg-[#D4AF6A]/5 p-4 text-sm text-[#DCC38F]">
            Demo mode: booking records and status changes are stored only in page state. Payment verification, customer notifications, refunds and permanent booking records are not connected.
          </div>
        </div>
      </main>
    </div>
  );
}
