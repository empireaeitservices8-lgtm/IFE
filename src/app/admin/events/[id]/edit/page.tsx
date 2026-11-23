"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCalendar,
  FiImage,
  FiMapPin,
  FiSave,
  FiUpload,
} from "react-icons/fi";
import { HiOutlineTicket } from "react-icons/hi2";
import AdminShell from "@/components/admin/AdminShell";

type VenueOption = { id: string; name: string; city: string };
type TicketRow = {
  id: string;
  name: string;
  price: string;
  totalQuantity: string;
  status: string;
};

function toDateInput(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function toTimeInput(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [venues, setVenues] = useState<VenueOption[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const [form, setForm] = useState({
    title: "",
    category: "FASHION",
    shortDescription: "",
    description: "",
    bannerUrl: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    capacity: "500",
    status: "DRAFT",
    venueId: "",
  });

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch(`/api/events/${id}`).then((r) => r.json()),
      fetch("/api/venues?limit=100").then((r) => r.json()),
    ])
      .then(([evJson, venJson]) => {
        if (!active) return;
        if (venJson.success && venJson.data?.items) {
          setVenues(venJson.data.items);
        }
        if (!evJson.success || !evJson.data?.event) {
          setMessageType("error");
          setMessage(evJson.message || "Event not found.");
          return;
        }
        const ev = evJson.data.event;
        setForm({
          title: ev.title || "",
          category: ev.category || "FASHION",
          shortDescription: ev.shortDescription || "",
          description: ev.description || "",
          bannerUrl: ev.bannerUrl || "",
          startDate: toDateInput(ev.startAt),
          startTime: toTimeInput(ev.startAt),
          endDate: toDateInput(ev.endAt),
          endTime: toTimeInput(ev.endAt),
          capacity: String(ev.capacity ?? 500),
          status: ev.status || "DRAFT",
          venueId: ev.venueId || "",
        });
        setTicketTypes(
          (ev.ticketTypes || []).map(
            (t: {
              id: string;
              name: string;
              price: string | number;
              totalQuantity: number;
              status: string;
            }) => ({
              id: t.id,
              name: t.name,
              price: String(t.price),
              totalQuantity: String(t.totalQuantity),
              status: t.status,
            })
          )
        );
      })
      .catch(() => {
        if (active) {
          setMessageType("error");
          setMessage("Failed to load event details.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage("");
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "ife-events/events");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.success || !json.data?.url) {
        setMessageType("error");
        setMessage(json.message || "Failed to upload image.");
        return;
      }
      setForm((prev) => ({ ...prev, bannerUrl: json.data.url }));
      setMessageType("success");
      setMessage("Banner uploaded to Cloudinary.");
    } catch {
      setMessageType("error");
      setMessage("Network error while uploading image.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!form.title.trim() || !form.startDate || !form.startTime) {
      setMessageType("error");
      setMessage("Please fill in title, start date, and start time.");
      return;
    }

    try {
      setSaving(true);
      const startAt = new Date(`${form.startDate}T${form.startTime}:00`);
      const endAt = new Date(
        `${form.endDate || form.startDate}T${form.endTime || "23:00"}:00`
      );

      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category,
          shortDescription: form.shortDescription.trim() || null,
          description: form.description.trim(),
          bannerUrl: form.bannerUrl.trim() || null,
          startAt: startAt.toISOString(),
          endAt: (endAt > startAt
            ? endAt
            : new Date(startAt.getTime() + 3 * 3600_000)
          ).toISOString(),
          capacity: Number(form.capacity),
          status: form.status,
          venueId: form.venueId || null,
          ticketTypes: ticketTypes.map((t) => ({
            id: t.id,
            name: t.name,
            price: Number(t.price),
            totalQuantity: Number(t.totalQuantity),
            status: t.status,
          })),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setMessageType("error");
        setMessage(json.message || "Failed to update event.");
        return;
      }

      setMessageType("success");
      setMessage("Event updated successfully.");
      setTimeout(() => router.push("/admin/events"), 700);
    } catch {
      setMessageType("error");
      setMessage("Network error while saving event.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#D4AF6A]";
  const labelClass = "text-sm font-medium text-gray-300";

  return (
    <AdminShell
      title="Edit Event"
      breadcrumb="Admin / Events / Edit"
      actions={
        <Link
          href="/admin/events"
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
        >
          <FiArrowLeft size={16} />
          Back to Events
        </Link>
      }
    >
      <div className="mx-auto max-w-5xl space-y-6">
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
            Loading event details...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-[#101010] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-[#D4AF6A]/10 p-3 text-[#D4AF6A]">
                  <FiCalendar size={19} />
                </div>
                <h2 className="font-semibold">Basic Information</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className={labelClass}>
                  Event Title *
                  <input
                    className={inputClass}
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className={labelClass}>
                    Category
                    <select
                      className={inputClass}
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    >
                      <option value="FASHION">Fashion</option>
                      <option value="ENTERTAINMENT">Entertainment</option>
                      <option value="AWARDS">Awards</option>
                      <option value="CONCERT">Concert</option>
                      <option value="CULTURAL">Cultural</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </label>

                  <label className={labelClass}>
                    Status
                    <select
                      className={inputClass}
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </label>
                </div>

                <label className={`${labelClass} md:col-span-2`}>
                  Short Description
                  <textarea
                    rows={2}
                    className={inputClass}
                    value={form.shortDescription}
                    onChange={(e) =>
                      setForm({ ...form, shortDescription: e.target.value })
                    }
                  />
                </label>

                <label className={`${labelClass} md:col-span-2`}>
                  Full Description *
                  <textarea
                    rows={4}
                    className={inputClass}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#101010] p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#D4AF6A]/10 p-3 text-[#D4AF6A]">
                    <FiImage size={19} />
                  </div>
                  <div>
                    <h2 className="font-semibold">Event Banner</h2>
                    <p className="text-xs text-gray-500">
                      Upload a new banner to Cloudinary or update the URL
                    </p>
                  </div>
                </div>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#D4AF6A]/40 bg-[#D4AF6A]/10 px-4 py-2.5 text-xs font-semibold text-[#D4AF6A] transition hover:bg-[#D4AF6A] hover:text-black">
                  <FiUpload size={14} />
                  {uploading ? "Uploading..." : "Upload to Cloudinary"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    disabled={uploading}
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <label className={labelClass}>
                Banner Image URL
                <input
                  className={inputClass}
                  value={form.bannerUrl}
                  onChange={(e) =>
                    setForm({ ...form, bannerUrl: e.target.value })
                  }
                />
              </label>

              {form.bannerUrl && (
                <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                  <img
                    src={form.bannerUrl}
                    alt={form.title || "Event banner"}
                    className="h-48 w-full object-cover"
                  />
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#101010] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-[#D4AF6A]/10 p-3 text-[#D4AF6A]">
                  <FiMapPin size={19} />
                </div>
                <h2 className="font-semibold">Schedule &amp; Venue</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className={labelClass}>
                  Start Date *
                  <input
                    type="date"
                    className={inputClass}
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Start Time *
                  <input
                    type="time"
                    className={inputClass}
                    value={form.startTime}
                    onChange={(e) =>
                      setForm({ ...form, startTime: e.target.value })
                    }
                  />
                </label>
                <label className={labelClass}>
                  End Date
                  <input
                    type="date"
                    className={inputClass}
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                  />
                </label>
                <label className={labelClass}>
                  End Time
                  <input
                    type="time"
                    className={inputClass}
                    value={form.endTime}
                    onChange={(e) =>
                      setForm({ ...form, endTime: e.target.value })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Venue
                  <select
                    className={inputClass}
                    value={form.venueId}
                    onChange={(e) =>
                      setForm({ ...form, venueId: e.target.value })
                    }
                  >
                    <option value="">No venue assigned</option>
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.city})
                      </option>
                    ))}
                  </select>
                </label>
                <label className={labelClass}>
                  Total Capacity *
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
              </div>
            </section>

            {ticketTypes.length > 0 && (
              <section className="rounded-2xl border border-white/10 bg-[#101010] p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-[#D4AF6A]/10 p-3 text-[#D4AF6A]">
                    <HiOutlineTicket size={19} />
                  </div>
                  <h2 className="font-semibold">Ticket Tiers</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {ticketTypes.map((ticket, idx) => (
                    <div
                      key={ticket.id}
                      className="space-y-3 rounded-xl border border-white/10 bg-black/40 p-4"
                    >
                      <p className="text-sm font-semibold text-[#D4AF6A]">
                        {ticket.name}
                      </p>
                      <label className="block text-xs text-gray-400">
                        Price (₹)
                        <input
                          type="number"
                          min="0"
                          className={inputClass}
                          value={ticket.price}
                          onChange={(e) =>
                            setTicketTypes((prev) =>
                              prev.map((row, i) =>
                                i === idx
                                  ? { ...row, price: e.target.value }
                                  : row
                              )
                            )
                          }
                        />
                      </label>
                      <label className="block text-xs text-gray-400">
                        Quantity
                        <input
                          type="number"
                          min="1"
                          className={inputClass}
                          value={ticket.totalQuantity}
                          onChange={(e) =>
                            setTicketTypes((prev) =>
                              prev.map((row, i) =>
                                i === idx
                                  ? { ...row, totalQuantity: e.target.value }
                                  : row
                              )
                            )
                          }
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="flex justify-end gap-3">
              <Link
                href="/admin/events"
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
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminShell>
  );
}

