
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  CreditCard,
  CircleDollarSign,
  Clock,
  RotateCcw,
  Eye,
  Download,
  TrendingUp,
} from "lucide-react";

type PaymentStatus = "Successful" | "Pending" | "Failed" | "Refunded";

type Payment = {
  id: string;
  bookingId: string;
  customer: string;
  email: string;
  event: string;
  date: string;
  method: string;
  amount: number;
  status: PaymentStatus;
};

type ApiPayment = {
  id: string;
  gateway: string;
  method: string;
  status: string;
  amount: string | number;
  createdAt: string;
  paidAt: string | null;
  booking?: {
    bookingCode: string;
    customerName: string;
    customerEmail: string;
    event?: { title: string } | null;
  } | null;
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");

  const mapPayments = (items: ApiPayment[]): Payment[] =>
    items.map((p) => ({
      id: p.id,
      bookingId: p.booking?.bookingCode || "—",
      customer: p.booking?.customerName || "Customer",
      email: p.booking?.customerEmail || "—",
      event: p.booking?.event?.title || "Event",
      date: new Date(p.paidAt || p.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      method: p.method && p.method !== "UNKNOWN" ? p.method : p.gateway,
      amount: Number(p.amount),
      status:
        p.status === "CAPTURED" || p.status === "AUTHORIZED"
          ? "Successful"
          : p.status === "REFUNDED" || p.status === "PARTIALLY_REFUNDED"
            ? "Refunded"
            : p.status === "FAILED"
              ? "Failed"
              : "Pending",
    }));

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/payments?limit=100");
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to load payments.");
        return;
      }
      setPayments(mapPayments(json.data.items || []));
    } catch {
      setError("Network error while loading payments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/payments?limit=100")
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        if (json.success) {
          setPayments(mapPayments(json.data.items || []));
        } else {
          setError(json.message || "Failed to load payments.");
        }
      })
      .catch(() => {
        if (active) setError("Network error while loading payments.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const term = search.toLowerCase();

      const matchesSearch =
        payment.id.toLowerCase().includes(term) ||
        payment.bookingId.toLowerCase().includes(term) ||
        payment.customer.toLowerCase().includes(term) ||
        payment.email.toLowerCase().includes(term) ||
        payment.event.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || payment.status === statusFilter;

      const matchesMethod =
        methodFilter === "All" || payment.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, search, statusFilter, methodFilter]);

  const successfulPayments = payments.filter(
    (payment) => payment.status === "Successful"
  );

  const pendingPayments = payments.filter(
    (payment) => payment.status === "Pending"
  );

  const refundedPayments = payments.filter(
    (payment) => payment.status === "Refunded"
  );

  const failedPayments = payments.filter(
    (payment) => payment.status === "Failed"
  );

  const totalRevenue = successfulPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const refundTotal = refundedPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  function viewPayment(payment: Payment) {
    window.alert(
      `Payment ID: ${payment.id}\nBooking Code: ${payment.bookingId}\nCustomer: ${payment.customer}\nEmail: ${payment.email}\nEvent: ${payment.event}\nPayment Method: ${payment.method}\nAmount: ${money(payment.amount)}\nDate: ${payment.date}\nStatus: ${payment.status}${loading ? "" : ""}`
    );
  }

  async function refundPayment(id: string) {
    const payment = payments.find((item) => item.id === id);

    if (!payment || payment.status !== "Successful") return;

    const confirmed = window.confirm(
      `Initiate a full refund of ${money(payment.amount)} for payment ${id} via Razorpay?`
    );

    if (!confirmed) return;

    try {
      setError("");
      const res = await fetch("/api/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: id,
          reason: "Admin initiated refund",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Refund failed.");
        return;
      }
      await loadPayments();
    } catch {
      setError("Network error while processing refund.");
    }
  }

  function statusClass(status: PaymentStatus) {
    switch (status) {
      case "Successful":
        return "bg-emerald-500/10 text-emerald-400";
      case "Pending":
        return "bg-amber-500/10 text-amber-400";
      case "Failed":
        return "bg-red-500/10 text-red-400";
      case "Refunded":
        return "bg-blue-500/10 text-blue-400";
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#0d0d0d] lg:block">
        <div className="border-b border-white/10 px-7 py-7">
          <Link
            href="/admin/dashboard"
            className="text-2xl font-bold tracking-[0.2em] text-[#D4AF6A]"
          >
            IFE<span className="text-white">.</span>
          </Link>
          <p className="mt-1 text-[10px] tracking-[0.25em] text-gray-500">
            ADMINISTRATION
          </p>
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
                name === "Payments"
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
            <p className="text-xs text-gray-500">Admin / Payments</p>
            <h1 className="mt-1 text-lg font-semibold">Payments Management</h1>
          </div>

          <Link
            href="/admin/bookings"
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
          >
            View Bookings
          </Link>
        </header>

        <div className="space-y-8 px-5 py-8 md:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF6A]">
              Financial operations
            </p>
            <h2 className="mt-2 text-3xl font-semibold">
              Payments Overview
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Monitor transactions, payment methods, revenue and refunds.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Successful Revenue",
                value: money(totalRevenue),
                note: "Successful demo transactions",
                icon: CircleDollarSign,
              },
              {
                label: "Successful Payments",
                value: successfulPayments.length,
                note: "Completed transactions",
                icon: CreditCard,
              },
              {
                label: "Pending Payments",
                value: pendingPayments.length,
                note: "Awaiting payment confirmation",
                icon: Clock,
              },
              {
                label: "Refunded Amount",
                value: money(refundTotal),
                note: `${refundedPayments.length} refunded transactions`,
                icon: RotateCcw,
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

          <section className="rounded-2xl border border-white/10 bg-[#101010] p-5 md:p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h3 className="text-lg font-semibold">Transaction Records</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Search and filter payment transactions.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={17}
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search transactions..."
                    className="w-full rounded-xl border border-white/10 bg-[#080808] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#D4AF6A] sm:w-64"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-sm text-gray-300 outline-none focus:border-[#D4AF6A]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Successful">Successful</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>

                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-sm text-gray-300 outline-none focus:border-[#D4AF6A]"
                >
                  <option value="All">All Methods</option>
                  <option value="Razorpay">Razorpay</option>
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                </select>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-4 font-medium">Payment ID</th>
                    <th className="px-4 py-4 font-medium">Customer</th>
                    <th className="px-4 py-4 font-medium">Booking / Event</th>
                    <th className="px-4 py-4 font-medium">Method</th>
                    <th className="px-4 py-4 font-medium">Amount</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-4 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-5 font-medium text-[#D4AF6A]">
                        {payment.id}
                        <p className="mt-1 text-xs font-normal text-gray-600">
                          {payment.date}
                        </p>
                      </td>

                      <td className="px-4 py-5">
                        <p className="font-medium">{payment.customer}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {payment.email}
                        </p>
                      </td>

                      <td className="px-4 py-5">
                        <p className="text-gray-300">{payment.bookingId}</p>
                        <p className="mt-1 max-w-48 text-xs text-gray-500">
                          {payment.event}
                        </p>
                      </td>

                      <td className="px-4 py-5 text-gray-300">
                        {payment.method}
                      </td>

                      <td className="px-4 py-5 font-semibold">
                        {money(payment.amount)}
                      </td>

                      <td className="px-4 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs ${statusClass(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>

                      <td className="px-4 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            title="View payment details"
                            onClick={() => viewPayment(payment)}
                            className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                          >
                            <Eye size={15} />
                          </button>

                          {payment.status === "Successful" && (
                            <button
                              type="button"
                              title="Mark as refunded in demo"
                              onClick={() => refundPayment(payment.id)}
                              className="rounded-lg border border-blue-500/20 p-2 text-blue-400 transition hover:bg-blue-500/10"
                            >
                              <RotateCcw size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPayments.length === 0 && (
                <div className="py-12 text-center text-sm text-gray-500">
                  No transactions match your search.
                </div>
              )}
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#101010] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#D4AF6A]/10 p-3 text-[#D4AF6A]">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Payment Summary</h3>
                  <p className="text-xs text-gray-500">
                    Current demo transaction distribution
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {[
                  ["Successful", successfulPayments.length, "bg-emerald-400"],
                  ["Pending", pendingPayments.length, "bg-amber-400"],
                  ["Failed", failedPayments.length, "bg-red-400"],
                  ["Refunded", refundedPayments.length, "bg-blue-400"],
                ].map(([label, count, color]) => (
                  <div key={String(label)}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-400">{label}</span>
                      <span className="text-white">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${color}`}
                        style={{
                          width: `${
                            payments.length
                              ? (Number(count) / payments.length) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#101010] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#D4AF6A]/10 p-3 text-[#D4AF6A]">
                  <Download size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Payment Reports</h3>
                  <p className="text-xs text-gray-500">
                    Export the currently filtered demo records
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-gray-400">
                Download the visible transaction list as a CSV file for
                reviewing payment records.
              </p>

              <button
                type="button"
                onClick={() => {
                  const headers = [
                    "Payment ID",
                    "Booking ID",
                    "Customer",
                    "Email",
                    "Event",
                    "Date",
                    "Method",
                    "Amount",
                    "Status",
                  ];

                  const rows = filteredPayments.map((payment) => [
                    payment.id,
                    payment.bookingId,
                    payment.customer,
                    payment.email,
                    payment.event,
                    payment.date,
                    payment.method,
                    payment.amount,
                    payment.status,
                  ]);

                  const escapeCsv = (value: string | number) =>
                    `"${String(value).replace(/"/g, '""')}"`;

                  const csv = [headers, ...rows]
                    .map((row) => row.map(escapeCsv).join(","))
                    .join("\n");

                  const blob = new Blob([csv], {
                    type: "text/csv;charset=utf-8;",
                  });

                  const url = URL.createObjectURL(blob);
                  const anchor = document.createElement("a");
                  anchor.href = url;
                  anchor.download = "ife-payment-report.csv";
                  anchor.click();
                  URL.revokeObjectURL(url);
                }}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#D4AF6A]/30 px-4 py-3 text-sm font-medium text-[#D4AF6A] transition hover:bg-[#D4AF6A]/10"
              >
                <Download size={16} />
                Download CSV Report
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[#D4AF6A]/20 bg-[#D4AF6A]/5 p-4 text-sm leading-6 text-[#DCC38F]">
            Demo mode: these are sample transactions. Refund actions only
            change the local page state; they do not initiate real Razorpay
            refunds. Real payment verification, webhook handling, settlement
            reconciliation and refunds must be implemented securely on the
            backend.
          </div>
        </div>
      </main>
    </div>
  );
}
