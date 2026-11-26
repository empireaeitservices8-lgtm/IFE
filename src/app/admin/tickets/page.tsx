
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
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
  PauseCircle,
  PlayCircle,
  X,
} from "lucide-react";

type TicketRecord = {
  id: string;
  eventId: string;
  event: string;
  category: string;
  price: number;
  total: number;
  sold: number;
  status: "Active" | "Paused" | "Sold Out";
  rawStatus: "ACTIVE" | "PAUSED" | "SOLD_OUT";
};

type ApiTicket = {
  id: string;
  eventId: string;
  name: string;
  price: string | number;
  totalQuantity: number;
  soldQuantity: number;
  status: "ACTIVE" | "PAUSED" | "SOLD_OUT";
  event?: { id: string; title: string } | null;
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
  const [editing, setEditing] = useState<{
    id: string;
    event: string;
    name: string;
    price: string;
    totalQuantity: string;
    status: "ACTIVE" | "PAUSED" | "SOLD_OUT";
  } | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const mapTickets = (items: ApiTicket[]): TicketRecord[] =>
    items.map((t) => ({
      id: t.id,
      eventId: t.event?.id || t.eventId,
      event: t.event?.title || "Unassigned Event",
      category: t.name,
      price: Number(t.price),
      total: t.totalQuantity,
      sold: t.soldQuantity,
      rawStatus: t.status,
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

  async function saveTicketEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setError("");
    try {
      setSavingEdit(true);
      const res = await fetch(`/api/tickets/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editing.name.trim(),
          price: Number(editing.price),
          totalQuantity: Number(editing.totalQuantity),
          status: editing.status,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to update ticket.");
        return;
      }
      setEditing(null);
      await loadTickets();
    } catch {
      setError("Network error while saving ticket changes.");
    } finally {
      setSavingEdit(false);
    }
  }

  const statusStyle = (status: TicketRecord["status"]) => {
    if (status === "Active") return "bg-emerald-500/10 text-emerald-400";
    if (status === "Paused") return "bg-amber-500/10 text-amber-400";
    return "bg-red-500/10 text-red-400";
  };

  return (
    <AdminShell
      title="Ticket Management"
      breadcrumb="Admin / Tickets"
      actions={
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 rounded-xl bg-[#D4AF6A] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#e5c783]"
        >
          <Plus size={17} />
          Create Event
        </Link>
      }
    >
      <div className="space-y-8">
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
                              title="Edit ticket"
                              onClick={() =>
                                setEditing({
                                  id: ticket.id,
                                  event: ticket.event,
                                  name: ticket.category,
                                  price: String(ticket.price),
                                  totalQuantity: String(ticket.total),
                                  status: ticket.rawStatus,
                                })
                              }
                              className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              title={ticket.status === "Active" ? "Pause ticket sales" : "Activate ticket sales"}
                              onClick={() => toggleStatus(ticket.id)}
                              disabled={ticket.status === "Sold Out"}
                              className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              {ticket.status === "Active" ? (
                                <PauseCircle size={15} />
                              ) : (
                                <PlayCircle size={15} />
                              )}
                            </button>
                            {ticket.eventId && (
                              <Link
                                href={`/admin/events/${ticket.eventId}/edit`}
                                title="View & edit event"
                                className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                              >
                                <Eye size={15} />
                              </Link>
                            )}
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

        </div>

        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <form
              onSubmit={saveTicketEdit}
              className="w-full max-w-md rounded-2xl border border-white/15 bg-[#101010] p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF6A]">
                    Edit Ticket Tier
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">
                    {editing.event}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-lg border border-white/10 p-1.5 text-gray-400 hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block text-xs font-medium text-gray-300">
                  Ticket Name
                  <input
                    required
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#080808] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#D4AF6A]"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs font-medium text-gray-300">
                    Price (₹)
                    <input
                      type="number"
                      min="0"
                      required
                      value={editing.price}
                      onChange={(e) =>
                        setEditing({ ...editing, price: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#080808] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#D4AF6A]"
                    />
                  </label>

                  <label className="block text-xs font-medium text-gray-300">
                    Total Quantity
                    <input
                      type="number"
                      min="1"
                      required
                      value={editing.totalQuantity}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          totalQuantity: e.target.value,
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#080808] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#D4AF6A]"
                    />
                  </label>
                </div>

                <label className="block text-xs font-medium text-gray-300">
                  Status
                  <select
                    value={editing.status}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        status: e.target.value as "ACTIVE" | "PAUSED" | "SOLD_OUT",
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#080808] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#D4AF6A]"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PAUSED">Paused</option>
                    <option value="SOLD_OUT">Sold Out</option>
                  </select>
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-gray-300 hover:border-[#D4AF6A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="rounded-xl bg-[#D4AF6A] px-5 py-2 text-xs font-semibold text-black hover:bg-[#e5c783] disabled:opacity-60"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
    </AdminShell>
  );
}
