"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiMapPin, FiSave } from "react-icons/fi";
import AdminShell from "@/components/admin/AdminShell";

export default function EditVenuePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    capacity: "500",
    facilities: "",
    description: "",
    status: "AVAILABLE",
  });

  useEffect(() => {
    let active = true;
    fetch(`/api/venues/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        if (!json.success || !json.data?.venue) {
          setMessageType("error");
          setMessage(json.message || "Venue not found.");
          return;
        }
        const v = json.data.venue;
        setForm({
          name: v.name || "",
          address: v.address || "",
          city: v.city || "",
          state: v.state || "",
          country: v.country || "India",
          postalCode: v.postalCode || "",
          capacity: String(v.capacity ?? 500),
          facilities: v.facilities || "",
          description: v.description || "",
          status: v.status || "AVAILABLE",
        });
      })
      .catch(() => {
        if (active) {
          setMessageType("error");
          setMessage("Failed to load venue details.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!form.name.trim() || !form.address.trim() || !form.city.trim()) {
      setMessageType("error");
      setMessage("Venue name, address, and city are required.");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`/api/venues/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim() || null,
          country: form.country.trim() || "India",
          postalCode: form.postalCode.trim() || null,
          capacity: Number(form.capacity),
          facilities: form.facilities.trim() || null,
          description: form.description.trim() || null,
          status: form.status,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setMessageType("error");
        setMessage(json.message || "Failed to update venue.");
        return;
      }
      setMessageType("success");
      setMessage("Venue updated successfully.");
      setTimeout(() => router.push("/admin/venues"), 700);
    } catch {
      setMessageType("error");
      setMessage("Network error while saving venue.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#D4AF6A]";
  const labelClass = "text-sm font-medium text-gray-300";

  return (
    <AdminShell
      title="Edit Venue"
      breadcrumb="Admin / Venues / Edit"
      actions={
        <Link
          href="/admin/venues"
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
        >
          <FiArrowLeft size={16} />
          Back to Venues
        </Link>
      }
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {message && (
          <div
            className={`rounded-xl border p-4 text-sm ${
              messageType === "error"
                ? "border-red-500/30 bg-red-500/10 text-red-300"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#101010] p-12 text-center text-sm text-gray-400">
            Loading venue details...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-white/10 bg-[#101010] p-6"
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="rounded-xl bg-[#D4AF6A]/10 p-3 text-[#D4AF6A]">
                <FiMapPin size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-white">
                  {form.name || "Venue Details"}
                </h2>
                <p className="text-xs text-gray-500">
                  Update venue address, capacity, facilities, and status
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className={labelClass}>
                Venue Name *
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>

              <label className={labelClass}>
                Status
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="BOOKED">Booked</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </label>

              <label className={`${labelClass} md:col-span-2`}>
                Address *
                <input
                  className={inputClass}
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </label>

              <label className={labelClass}>
                City *
                <input
                  className={inputClass}
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </label>

              <label className={labelClass}>
                State
                <input
                  className={inputClass}
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </label>

              <label className={labelClass}>
                Country
                <input
                  className={inputClass}
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                />
              </label>

              <label className={labelClass}>
                Capacity *
                <input
                  type="number"
                  min="1"
                  className={inputClass}
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({ ...form, capacity: e.target.value })
                  }
                />
              </label>

              <label className={`${labelClass} md:col-span-2`}>
                Facilities (comma separated)
                <input
                  className={inputClass}
                  placeholder="Parking, Stage, Sound System, VIP Lounge"
                  value={form.facilities}
                  onChange={(e) =>
                    setForm({ ...form, facilities: e.target.value })
                  }
                />
              </label>

              <label className={`${labelClass} md:col-span-2`}>
                Description
                <textarea
                  rows={3}
                  className={inputClass}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Link
                href="/admin/venues"
                className="rounded-xl border border-white/15 px-6 py-3 text-sm text-gray-300 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF6A] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e5c783] disabled:opacity-60"
              >
                <FiSave size={16} />
                {saving ? "Saving..." : "Save Venue"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminShell>
  );
}

