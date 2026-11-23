"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiEye,
  FiSearch,
  FiTag,
  FiUser,
  FiX,
  FiXCircle,
} from "react-icons/fi";

type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

type BookingLineItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type BookingPaymentInfo = {
  gatewayOrderId: string | null;
  gatewayPaymentId: string | null;
  method: string;
  status: string;
  amount: number;
};

type Booking = {
  id: string;
  bookingCode: string;
  customer: string;
  email: string;
  phone: string;
  event: string;
  eventDate: string;
  createdAt: string;
  items: BookingLineItem[];
  quantity: number;
  subtotal: number;
  taxAmount: number;
  amount: number;
  status: BookingStatus;
  paymentStatus: string;
  payment: BookingPaymentInfo | null;
};

type ApiBooking = {
  id: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subtotal: string | number;
  taxAmount: string | number;
  totalAmount: string | number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  event?: { title: string; startAt?: string } | null;
  items?: {
    id: string;
    quantity: number;
    unitPrice: string | number;
    totalPrice: string | number;
    ticketType?: { name: string } | null;
  }[];
  payments?: {
    gatewayOrderId: string | null;
    gatewayPaymentId: string | null;
    method: string;
    status: string;
    amount: string | number;
  }[];
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (next: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-w-[175px]">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-[#080808] px-4 py-3 text-sm transition ${
          open
            ? "border-[#D4AF6A] text-white"
            : "border-white/10 text-gray-300 hover:border-[#D4AF6A]/60"
        }`}
      >
        <span className="truncate">{value}</span>
        <FiChevronDown
          size={16}
          className={`shrink-0 text-[#D4AF6A] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-[#D4AF6A]/30 bg-[#0D0D0D] p-1.5 shadow-2xl shadow-black/80"
        >
          {options.map((option) => {
            const active = option === value;
            return (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                    active
                      ? "bg-[#D4AF6A]/15 font-medium text-[#D4AF6A]"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="truncate">{option}</span>
                  {active && <FiCheck size={14} className="shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function mapBookings(items: ApiBooking[]): Booking[] {
  return items.map((b) => {
    const mappedItems: BookingLineItem[] = (b.items || []).map((item) => ({
      id: item.id,
      name: item.ticketType?.name || "Event Pass",
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
    }));
    const totalQty = mappedItems.reduce((s, i) => s + i.quantity, 0);
    const latestPayment = b.payments?.[0];

    return {
      id: b.id,
      bookingCode: b.bookingCode,
      customer: b.customerName,
      email: b.customerEmail,
      phone: b.customerPhone || "—",
      event: b.event?.title || "Event",
      eventDate: b.event?.startAt
        ? new Date(b.event.startAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "TBA",
      createdAt: new Date(b.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      items: mappedItems,
      quantity: totalQty,
      subtotal: Number(b.subtotal),
      taxAmount: Number(b.taxAmount),
      amount: Number(b.totalAmount),
      status:
        b.status === "CONFIRMED"
          ? "Confirmed"
          : b.status === "CANCELLED" || b.status === "EXPIRED"
            ? "Cancelled"
            : "Pending",
      paymentStatus: b.paymentStatus || "PENDING",
      payment: latestPayment
        ? {
            gatewayOrderId: latestPayment.gatewayOrderId,
            gatewayPaymentId: latestPayment.gatewayPaymentId,
            method: latestPayment.method,
            status: latestPayment.status,
            amount: Number(latestPayment.amount),
          }
        : null,
    };
  });
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [ticketFilter, setTicketFilter] = useState("All Ticket Types");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
      const mapped = mapBookings(json.data.items || []);
      setBookings(mapped);
      setSelectedBooking((prev) =>
        prev ? mapped.find((b) => b.id === prev.id) || null : null
      );
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

  const ticketTypeOptions = useMemo(() => {
    const names = new Set<string>();
    for (const b of bookings) {
      for (const item of b.items) {
        names.add(item.name);
      }
    }
    return ["All Ticket Types", ...Array.from(names).sort()];
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const term = search.toLowerCase();

      const matchesSearch =
        booking.bookingCode.toLowerCase().includes(term) ||
        booking.id.toLowerCase().includes(term) ||
        booking.customer.toLowerCase().includes(term) ||
        booking.email.toLowerCase().includes(term) ||
        booking.event.toLowerCase().includes(term) ||
        booking.items.some((i) => i.name.toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "All Statuses" || booking.status === statusFilter;

      const matchesTicket =
        ticketFilter === "All Ticket Types" ||
        booking.items.some((i) => i.name === ticketFilter);

      return matchesSearch && matchesStatus && matchesTicket;
    });
  }, [bookings, search, statusFilter, ticketFilter]);

  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
  const pending = bookings.filter((b) => b.status === "Pending").length;
  const cancelled = bookings.filter((b) => b.status === "Cancelled").length;
  const revenue = bookings
    .filter((b) => b.status === "Confirmed")
    .reduce((sum, b) => sum + b.amount, 0);

  async function updateStatus(id: string, status: BookingStatus) {
    try {
      setUpdatingId(id);
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
    } finally {
      setUpdatingId(null);
    }
  }

  function statusClass(status: BookingStatus) {
    if (status === "Confirmed") return "bg-emerald-500/10 text-emerald-400";
    if (status === "Pending") return "bg-amber-500/10 text-amber-400";
    return "bg-red-500/10 text-red-400";
  }

  return (
    <AdminShell
      title="Bookings Management"
      breadcrumb="Admin / Bookings"
      actions={
        <Link
          href="/admin/events"
          className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
        >
          View Events
        </Link>
      }
    >
      <div className="space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF6A]">
            Booking operations
          </p>
          <h2 className="mt-2 text-3xl font-semibold">All Bookings</h2>
          <p className="mt-2 text-sm text-gray-500">
            Monitor customer reservations, booked ticket types, and payment
            statuses.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Bookings",
              value: bookings.length,
              icon: FiTag,
              note: "All booking records",
            },
            {
              label: "Confirmed",
              value: confirmed,
              icon: FiCheckCircle,
              note: "Verified bookings",
            },
            {
              label: "Pending",
              value: pending,
              icon: FiClock,
              note: "Awaiting confirmation",
            },
            {
              label: "Confirmed Revenue",
              value: money(revenue),
              icon: FiDollarSign,
              note: `${cancelled} cancelled excluded`,
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-[#101010] p-5"
              >
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

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-white/10 bg-[#101010] p-5 md:p-6">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div>
              <h3 className="text-lg font-semibold">Booking Records</h3>
              <p className="mt-1 text-xs text-gray-500">
                Search by booking code, customer, email, event, or ticket type.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <div className="relative">
                <FiSearch
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search bookings..."
                  className="w-full rounded-xl border border-white/10 bg-[#080808] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#D4AF6A] sm:w-64"
                />
              </div>

              <FilterDropdown
                label="Filter by ticket type"
                value={ticketFilter}
                options={ticketTypeOptions}
                onChange={setTicketFilter}
              />

              <FilterDropdown
                label="Filter by status"
                value={statusFilter}
                options={["All Statuses", "Confirmed", "Pending", "Cancelled"]}
                onChange={setStatusFilter}
              />
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-4 font-medium">Booking Code</th>
                  <th className="px-4 py-4 font-medium">Customer</th>
                  <th className="px-4 py-4 font-medium">Event</th>
                  <th className="px-4 py-4 font-medium">Booked Tickets</th>
                  <th className="px-4 py-4 font-medium">Amount</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-sm text-gray-500"
                    >
                      Loading bookings...
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-4">
                        <p className="font-mono text-xs font-semibold text-[#D4AF6A]">
                          {booking.bookingCode}
                        </p>
                        <p className="mt-1 text-[11px] text-gray-600">
                          {booking.createdAt}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-medium text-white">
                          {booking.customer}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {booking.email}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p className="max-w-48 text-gray-200">{booking.event}</p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {booking.eventDate}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {booking.items.length > 0 ? (
                            booking.items.map((item) => (
                              <span
                                key={item.id}
                                className="inline-flex items-center gap-1 rounded-md border border-[#D4AF6A]/25 bg-[#D4AF6A]/10 px-2.5 py-1 text-xs text-[#F5E5B5]"
                              >
                                <span className="font-semibold">
                                  {item.quantity}×
                                </span>
                                <span>{item.name}</span>
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500">
                              No items
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4 font-medium text-white">
                        {money(booking.amount)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            title="View full booking & ticket details"
                            onClick={() => setSelectedBooking(booking)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                          >
                            <FiEye size={14} />
                            Details
                          </button>
                          {booking.status === "Pending" && (
                            <button
                              type="button"
                              title="Confirm booking"
                              disabled={updatingId === booking.id}
                              onClick={() =>
                                updateStatus(booking.id, "Confirmed")
                              }
                              className="rounded-lg border border-emerald-500/20 p-2 text-emerald-400 transition hover:bg-emerald-500/10 disabled:opacity-50"
                            >
                              <FiCheckCircle size={15} />
                            </button>
                          )}
                          {booking.status !== "Cancelled" && (
                            <button
                              type="button"
                              title="Cancel booking"
                              disabled={updatingId === booking.id}
                              onClick={() =>
                                updateStatus(booking.id, "Cancelled")
                              }
                              className="rounded-lg border border-red-500/20 p-2 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                            >
                              <FiXCircle size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {!loading && filteredBookings.length === 0 && (
              <div className="py-12 text-center text-sm text-gray-500">
                No bookings match your filters.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Detailed Booking Modal */}
      {selectedBooking && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Booking details for ${selectedBooking.bookingCode}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#D4AF6A]/40 bg-[#0D0D0D] p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF6A]">
                  Booking Details
                </p>
                <h3 className="mt-1 font-mono text-xl font-semibold text-white">
                  {selectedBooking.bookingCode}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Booked on {selectedBooking.createdAt}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                    selectedBooking.status
                  )}`}
                >
                  {selectedBooking.status}
                </span>
                <button
                  type="button"
                  aria-label="Close booking details"
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:border-[#D4AF6A] hover:text-white"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* Customer & Event Info */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-[#141414] p-4">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[#D4AF6A]">
                  <FiUser size={13} />
                  Customer
                </p>
                <p className="mt-2 font-medium text-white">
                  {selectedBooking.customer}
                </p>
                <p className="mt-1 break-all text-xs text-gray-400">
                  {selectedBooking.email}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {selectedBooking.phone}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#141414] p-4">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[#D4AF6A]">
                  <FiCalendar size={13} />
                  Event
                </p>
                <p className="mt-2 font-medium text-white">
                  {selectedBooking.event}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Event Date: {selectedBooking.eventDate}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Total Passes: {selectedBooking.quantity}
                </p>
              </div>
            </div>

            {/* Ticket Breakdown */}
            <div className="mt-5 rounded-xl border border-white/10 bg-[#141414] p-4">
              <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[#D4AF6A]">
                <FiTag size={13} />
                Booked Tickets Breakdown
              </p>

              <div className="divide-y divide-white/10 text-sm">
                {selectedBooking.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-2.5"
                  >
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × {money(item.unitPrice)}
                      </p>
                    </div>
                    <p className="font-medium text-[#F5E5B5]">
                      {money(item.totalPrice)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{money(selectedBooking.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax / GST</span>
                  <span>{money(selectedBooking.taxAmount)}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-semibold text-[#D4AF6A]">
                  <span>Total Amount</span>
                  <span>{money(selectedBooking.amount)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mt-5 rounded-xl border border-white/10 bg-[#141414] p-4">
              <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[#D4AF6A]">
                <FiCreditCard size={13} />
                Payment Summary
              </p>
              <div className="grid gap-2 text-xs text-gray-300 sm:grid-cols-2">
                <p>
                  <span className="text-gray-500">Payment Status: </span>
                  {selectedBooking.paymentStatus}
                </p>
                <p>
                  <span className="text-gray-500">Method: </span>
                  {selectedBooking.payment?.method || "—"}
                </p>
                <p className="break-all">
                  <span className="text-gray-500">Order ID: </span>
                  {selectedBooking.payment?.gatewayOrderId || "—"}
                </p>
                <p className="break-all">
                  <span className="text-gray-500">Payment ID: </span>
                  {selectedBooking.payment?.gatewayPaymentId || "—"}
                </p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-4">
              {selectedBooking.status === "Pending" && (
                <button
                  type="button"
                  disabled={updatingId === selectedBooking.id}
                  onClick={() => updateStatus(selectedBooking.id, "Confirmed")}
                  className="rounded-xl bg-emerald-500/20 px-4 py-2.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/30 disabled:opacity-50"
                >
                  Confirm Booking
                </button>
              )}
              {selectedBooking.status !== "Cancelled" && (
                <button
                  type="button"
                  disabled={updatingId === selectedBooking.id}
                  onClick={() => updateStatus(selectedBooking.id, "Cancelled")}
                  className="rounded-xl bg-red-500/20 px-4 py-2.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/30 disabled:opacity-50"
                >
                  Cancel Booking
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl bg-[#D4AF6A] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-[#F5E5B5]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
