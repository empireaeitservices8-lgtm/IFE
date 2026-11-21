"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Mail,
  Phone,
  LayoutDashboard,
} from "lucide-react";

type CustomerRecord = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  createdAt: string;
  _count: { bookings: number };
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({ limit: "50" });
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/customers?${params.toString()}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to load customers.");
        return;
      }
      setCustomers(json.data.items || []);
    } catch {
      setError("Network error while loading customers.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({ limit: "50" });
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (search.trim()) params.set("search", search.trim());

    fetch(`/api/customers?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        if (json.success) {
          setCustomers(json.data.items || []);
          setError("");
        } else {
          setError(json.message || "Failed to load customers.");
        }
      })
      .catch(() => {
        if (active) setError("Network error while loading customers.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [search, statusFilter]);

  async function updateStatus(
    id: string,
    status: "ACTIVE" | "INACTIVE" | "BLOCKED"
  ) {
    try {
      setFeedback("");
      setError("");
      const res = await fetch(`/api/customers/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to update customer status.");
        return;
      }
      setFeedback(json.message || "Customer status updated.");
      await loadCustomers();
    } catch {
      setError("Unable to update customer status.");
    }
  }

  const activeCount = customers.filter((c) => c.status === "ACTIVE").length;
  const blockedCount = customers.filter((c) => c.status === "BLOCKED").length;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#080808]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-10">
          <div>
            <p className="text-xs text-gray-500">Admin / Customers</p>
            <h1 className="mt-1 text-lg font-semibold">Customers Management</h1>
          </div>
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-7 px-5 py-8 md:px-10">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { label: "Total Customers", value: customers.length, icon: Users },
            { label: "Active Accounts", value: activeCount, icon: UserCheck },
            { label: "Blocked Accounts", value: blockedCount, icon: UserX },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-[#101010] p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
                    {item.label}
                  </span>
                  <Icon size={18} className="text-[#D4AF6A]" />
                </div>
                <p className="mt-4 text-3xl font-semibold">{item.value}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#101010] p-5 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-black px-4 py-2.5">
            <Search size={16} className="text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-black px-4 py-2.5 text-sm text-white outline-none focus:border-[#D4AF6A]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}
        {feedback && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            {feedback}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101010]">
          {loading ? (
            <div className="p-10 text-center text-sm text-gray-400">
              Loading customers...
            </div>
          ) : customers.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-400">
              No customers found matching your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 bg-black/40 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Bookings</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{customer.name}</p>
                        <p className="text-xs text-gray-500">
                          Joined{" "}
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-300">
                        <div className="flex items-center gap-2">
                          <Mail size={13} className="text-[#D4AF6A]" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="mt-1 flex items-center gap-2 text-gray-500">
                            <Phone size={13} />
                            {customer.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {customer._count.bookings}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            customer.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : customer.status === "BLOCKED"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {customer.status === "ACTIVE" ? (
                          <button
                            type="button"
                            onClick={() => updateStatus(customer.id, "BLOCKED")}
                            className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10"
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateStatus(customer.id, "ACTIVE")}
                            className="rounded-lg border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-400 transition hover:bg-emerald-500/10"
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

