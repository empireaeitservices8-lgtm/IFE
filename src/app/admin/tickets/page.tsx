
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Ticket,
  Users,
  CircleDollarSign,
  TrendingUp,
  Download,
  Plus,
  Eye,
  Pencil,
  LayoutDashboard,
} from "lucide-react";

type TicketRecord = {
  id: string;
  event: string;
  category: string;
  price: number;
  total: number;
  sold: number;
  status: "Active" | "Paused" | "Sold Out";
};

type ApiTicket = {
  id: string;
  name: string;
  price: string | number;
  totalQuantity: number;
  soldQuantity: number;
  status: "ACTIVE" | "PAUSED" | "SOLD_OUT";
  event?: { title: string } | null;
};

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function TicketManagementPage() {
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const mapTickets = (items: ApiTicket[]): TicketRecord[] =>
    items.map((t) => ({
      id: t.id,
      event: t.event?.title || "Unassigned Event",
      category: t.name,
      price: Number(t.price),
      total: t.totalQuantity,
      sold: t.soldQuantity,
      status:
        t.status === "ACTIVE"
          ? "Active"
          : t.status === "PAUSED"
            ? "Paused"
            : "Sold Out",
    }));

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/tickets?limit=100");
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to load tickets.");
        return;
      }
      setTickets(mapTickets(json.data.items || []));
    } catch {
      setError("Network error while loading tickets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/tickets?limit=100")
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        if (json.success) {
          setTickets(mapTickets(json.data.items || []));
        } else {
          setError(json.message || "Failed to load tickets.");
        }
      })
      .catch(() => {
        if (active) setError("Network error while loading tickets.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.id.toLowerCase().includes(search.toLowerCase()) ||
        ticket.event.toLowerCase().includes(search.toLowerCase()) ||
        ticket.category.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || ticket.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, search, statusFilter]);

  const totalTickets = tickets.reduce((sum, ticket) => sum + ticket.total, 0);
  const totalSold = tickets.reduce((sum, ticket) => sum + ticket.sold, 0);
  const totalRevenue = tickets.reduce(
    (sum, ticket) => sum + ticket.sold * ticket.price,
    0
  );

  async function toggleStatus(id: string) {
    const target = tickets.find((t) => t.id === id);
    if (!target || target.status === "Sold Out") return;
    const nextStatus = target.status === "Active" ? "PAUSED" : "ACTIVE";

    try {
      const res = await fetch(`/api/tickets/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to update ticket status.");
        return;
      }
      await loadTickets();
    } catch {
      setError("Network error while updating ticket status.");
    }
  }

  const statusStyle = (status: TicketRecord["status"]) => {
    if (status === "Active") return "bg-emerald-500/10 text-emerald-400";
    if (status === "Paused") return "bg-amber-500/10 text-amber-400";
    return "bg-red-500/10 text-red-400";
  };

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
                name === "Tickets"
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
            <p className="text-xs text-gray-500">Admin / Tickets</p>
            <h1 className="mt-1 text-lg font-semibold">Ticket Management</h1>
          </div>
          <Link
            href="/admin/events/new"
            className="flex items-center gap-2 rounded-xl bg-[#D4AF6A] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#e5c783]"
          >
            <Plus size={17} />
            Create Event
          </Link>
        </header>

        <div className="space-y-8 px-5 py-8 md:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF6A]">
              Ticket operations
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Tickets Overview</h2>
            <p className="mt-2 text-sm text-gray-500">
              Monitor ticket inventory, sales, and availability across events.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Total Capacity",
                value: totalTickets.toLocaleString("en-IN"),
                icon: Ticket,
                note: loading ? "Loading..." : "Across all ticket types",
              },
              {
                label: "Tickets Sold",
                value: totalSold.toLocaleString("en-IN"),
                icon: Users,
                note: `${totalTickets ? Math.round((totalSold / totalTickets) * 100) : 0}% of capacity`,
              },
              {
                label: "Available Tickets",
                value: (totalTickets - totalSold).toLocaleString("en-IN"),
                icon: TrendingUp,
                note: "Remaining inventory",
              },
              {
                label: "Ticket Revenue",
                value: money(totalRevenue),
                icon: CircleDollarSign,
                note: "Calculated from ticket sales",
              },
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
                <h3 className="text-lg font-semibold">Ticket Inventory</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Search and manage ticket categories for each event.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={17} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tickets or events..."
                    className="w-full rounded-xl border border-white/10 bg-[#080808] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#D4AF6A] sm:w-64"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-sm text-gray-300 outline-none focus:border-[#D4AF6A]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-4 font-medium">Ticket ID</th>
                    <th className="px-4 py-4 font-medium">Event / Category</th>
                    <th className="px-4 py-4 font-medium">Price</th>
                    <th className="px-4 py-4 font-medium">Sales</th>
                    <th className="px-4 py-4 font-medium">Availability</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-4 py-4 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => {
                    const percentage = Math.round((ticket.sold / ticket.total) * 100);
                    return (
                      <tr key={ticket.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                        <td className="px-4 py-5 font-medium text-[#D4AF6A]">{ticket.id}</td>
                        <td className="px-4 py-5">
                          <p className="font-medium text-white">{ticket.event}</p>
                          <p className="mt-1 text-xs text-gray-500">{ticket.category}</p>
                        </td>
                        <td className="px-4 py-5 text-gray-300">{money(ticket.price)}</td>
                        <td className="px-4 py-5 text-gray-300">
                          {ticket.sold} / {ticket.total}
                        </td>
                        <td className="px-4 py-5">
                          <div className="w-32">
                            <div className="mb-2 flex justify-between text-xs text-gray-500">
                              <span>{percentage}% sold</span>
                              <span>{ticket.total - ticket.sold} left</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-[#D4AF6A]"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <span className={`rounded-full px-3 py-1.5 text-xs ${statusStyle(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-4 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              title={ticket.status === "Active" ? "Pause ticket sales" : "Activate ticket sales"}
                              onClick={() => toggleStatus(ticket.id)}
                              disabled={ticket.status === "Sold Out"}
                              className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              title="View ticket"
                              onClick={() => window.alert(`Demo ticket: ${ticket.id}`)}
                              className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                            >
                              <Eye size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredTickets.length === 0 && (
                <div className="py-12 text-center text-sm text-gray-500">
                  No tickets match your search.
                </div>
              )}
            </div>
          </section>

          <div className="rounded-xl border border-[#D4AF6A]/20 bg-[#D4AF6A]/5 p-4 text-sm text-[#DCC38F]">
            Demo data only. Ticket status changes are temporary and reset on refresh. Live inventory, booking deductions, refunds, and payment reconciliation require backend integration.
          </div>
        </div>
      </main>
    </div>
  );
}
