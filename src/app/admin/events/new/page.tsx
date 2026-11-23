
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Ticket,
  ImagePlus,
  Save,
  Send,
} from "lucide-react";

type VenueOption = {
  id: string;
  name: string;
  city: string;
  address: string;
};

const categoryMap: Record<string, string> = {
  Fashion: "FASHION",
  Entertainment: "ENTERTAINMENT",
  Awards: "AWARDS",
  Concert: "CONCERT",
  Cultural: "CULTURAL",
  Other: "OTHER",
};

export default function NewEventPage() {
  const router = useRouter();
  const [venues, setVenues] = useState<VenueOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Fashion",
    shortDescription: "",
    description: "",
    bannerUrl: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    venueId: "",
    venue: "",
    address: "",
    capacity: "500",
    generalPrice: "499",
    premiumPrice: "999",
    vipPrice: "1999",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    fetch("/api/venues?limit=100")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.items) {
          setVenues(json.data.items);
        }
      })
      .catch(() => {});
  }, []);

  function updateField(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage("");
    try {
      setUploadingBanner(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "ife-events/events");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.success || !json.data?.url) {
        setMessageType("error");
        setMessage(json.message || "Failed to upload banner image.");
        return;
      }
      updateField("bannerUrl", json.data.url);
      setMessageType("success");
      setMessage("Banner image uploaded to Cloudinary.");
    } catch {
      setMessageType("error");
      setMessage("Network error while uploading banner image.");
    } finally {
      setUploadingBanner(false);
    }
  }

  async function handleSubmit(status: "Draft" | "Published") {
    setMessage("");

    if (
      !form.title.trim() ||
      !form.startDate ||
      !form.startTime ||
      !form.capacity
    ) {
      setMessageType("error");
      setMessage(
        "Please complete the event title, start date, start time, and capacity."
      );
      return;
    }

    if (!form.venueId && !form.venue.trim()) {
      setMessageType("error");
      setMessage("Please select an existing venue or enter a venue name.");
      return;
    }

    const totalCapacity = Number(form.capacity);
    if (totalCapacity <= 0) {
      setMessageType("error");
      setMessage("Ticket capacity must be greater than zero.");
      return;
    }

    if (
      form.generalPrice === "" ||
      Number(form.generalPrice) < 0 ||
      Number(form.premiumPrice) < 0 ||
      Number(form.vipPrice) < 0
    ) {
      setMessageType("error");
      setMessage("Please enter valid ticket prices.");
      return;
    }

    try {
      setSubmitting(true);
      let resolvedVenueId: string | null = form.venueId || null;

      if (!resolvedVenueId && form.venue.trim()) {
        const venueRes = await fetch("/api/venues", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.venue.trim(),
            address: form.address.trim() || form.venue.trim(),
            city: "Kochi",
            capacity: totalCapacity,
          }),
        });
        const venueJson = await venueRes.json();
        if (venueRes.ok && venueJson.success && venueJson.data?.venue?.id) {
          resolvedVenueId = venueJson.data.venue.id;
        }
      }

      const startAt = new Date(`${form.startDate}T${form.startTime}:00`);
      const endDateVal = form.endDate || form.startDate;
      const endTimeVal = form.endTime || "23:00";
      let endAt = new Date(`${endDateVal}T${endTimeVal}:00`);
      if (endAt <= startAt) {
        endAt = new Date(startAt.getTime() + 3 * 60 * 60 * 1000);
      }

      const generalQty = Math.max(1, Math.floor(totalCapacity * 0.5));
      const premiumQty = Math.max(1, Math.floor(totalCapacity * 0.3));
      const vipQty = Math.max(1, totalCapacity - generalQty - premiumQty);

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          category: categoryMap[form.category] || "OTHER",
          shortDescription: form.shortDescription.trim() || null,
          description:
            form.description.trim() ||
            form.shortDescription.trim() ||
            `${form.title.trim()} presented by International Fashion Entertainment.`,
          bannerUrl: form.bannerUrl.trim() || null,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          capacity: totalCapacity,
          status: status === "Published" ? "PUBLISHED" : "DRAFT",
          venueId: resolvedVenueId,
          ticketTypes: [
            {
              name: "General Admission",
              price: Number(form.generalPrice),
              totalQuantity: generalQty,
            },
            {
              name: "Premium Access",
              price: Number(form.premiumPrice || form.generalPrice),
              totalQuantity: premiumQty,
            },
            {
              name: "VIP Experience",
              price: Number(form.vipPrice || form.premiumPrice || form.generalPrice),
              totalQuantity: vipQty,
            },
          ],
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setMessageType("error");
        setMessage(json.message || "Failed to create event.");
        return;
      }

      setMessageType("success");
      setMessage(`Event "${json.data.event.title}" saved as ${status}.`);
      setTimeout(() => router.push("/admin/events"), 800);
    } catch {
      setMessageType("error");
      setMessage("An unexpected error occurred while creating the event.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#D4AF6A]";
  const labelClass = "text-sm font-medium text-gray-300";

  return (
    <AdminShell
      title="Add New Event"
      breadcrumb="Admin / Events / Create"
      actions={
        <Link
          href="/admin/events"
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
        >
          <ArrowLeft size={16} />
          Back to Events
        </Link>
      }
    >
      <div className="mx-auto max-w-6xl space-y-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF6A]">
              Event creation
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Create an experience</h2>
            <p className="mt-2 text-sm text-gray-500">
              Add the information required to list a new IFE event.
            </p>
          </div>

          {message && (
            <div
              className={`rounded-xl border p-4 text-sm ${
                messageType === "error"
                  ? "border-red-500/30 bg-red-500/10 text-red-300"
                  : "border-[#D4AF6A]/30 bg-[#D4AF6A]/10 text-[#F5E5B5]"
              }`}
            >
              {message}
            </div>
          )}

          <section className="rounded-2xl border border-white/10 bg-[#101010] p-5 md:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-[#D4AF6A]/10 p-3 text-[#D4AF6A]">
                <CalendarDays size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Basic Information</h3>
                <p className="text-xs text-gray-500">Event name and description</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className={labelClass}>
                Event Title *
                <input
                  className={inputClass}
                  placeholder="e.g. The IFE Fashion Showcase"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />
              </label>

              <label className={labelClass}>
                Event Category *
                <select
                  className={inputClass}
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  <option>Fashion</option>
                  <option>Entertainment</option>
                  <option>Awards</option>
                  <option>Music</option>
                  <option>Corporate</option>
                  <option>Other</option>
                </select>
              </label>

              <label className={`${labelClass} md:col-span-2`}>
                Short Description
                <textarea
                  rows={2}
                  className={inputClass}
                  placeholder="Write a short introduction for the event..."
                  value={form.shortDescription}
                  onChange={(e) => updateField("shortDescription", e.target.value)}
                />
              </label>

              <label className={`${labelClass} md:col-span-2`}>
                Full Description
                <textarea
                  rows={5}
                  className={inputClass}
                  placeholder="Describe the event, activities, performers and experience..."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#101010] p-5 md:p-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#D4AF6A]/10 p-3 text-[#D4AF6A]">
                  <ImagePlus size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Event Banner</h3>
                  <p className="text-xs text-gray-500">
                    Upload an image to Cloudinary or paste an image URL
                  </p>
                </div>
              </div>

              <label className="cursor-pointer rounded-xl border border-[#D4AF6A]/40 bg-[#D4AF6A]/10 px-4 py-2.5 text-xs font-semibold text-[#D4AF6A] transition hover:bg-[#D4AF6A] hover:text-black">
                {uploadingBanner ? "Uploading..." : "Upload to Cloudinary"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  disabled={uploadingBanner}
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </label>
            </div>

            <label className={labelClass}>
              Banner Image URL
              <input
                className={inputClass}
                placeholder="https://res.cloudinary.com/diy4ratd/..."
                value={form.bannerUrl}
                onChange={(e) => updateField("bannerUrl", e.target.value)}
              />
            </label>

            {form.bannerUrl && (
              <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                <img
                  src={form.bannerUrl}
                  alt="Event banner preview"
                  className="h-48 w-full object-cover"
                />
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#101010] p-5 md:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-[#D4AF6A]/10 p-3 text-[#D4AF6A]">
                <CalendarDays size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Event Schedule</h3>
                <p className="text-xs text-gray-500">Set the event start and end times</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className={labelClass}>
                Start Date *
                <input
                  type="date"
                  className={inputClass}
                  value={form.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                />
              </label>
              <label className={labelClass}>
                Start Time *
                <input
                  type="time"
                  className={inputClass}
                  value={form.startTime}
                  onChange={(e) => updateField("startTime", e.target.value)}
                />
              </label>
              <label className={labelClass}>
                End Date
                <input
                  type="date"
                  className={inputClass}
                  value={form.endDate}
                  onChange={(e) => updateField("endDate", e.target.value)}
                />
              </label>
              <label className={labelClass}>
                End Time
                <input
                  type="time"
                  className={inputClass}
                  value={form.endTime}
                  onChange={(e) => updateField("endTime", e.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#101010] p-5 md:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-[#D4AF6A]/10 p-3 text-[#D4AF6A]">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Venue Details</h3>
                <p className="text-xs text-gray-500">Where the event will take place</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className={labelClass}>
                Venue Name *
                <input
                  className={inputClass}
                  placeholder="e.g. Grand Convention Centre"
                  value={form.venue}
                  onChange={(e) => updateField("venue", e.target.value)}
                />
              </label>
              <label className={labelClass}>
                Venue Address
                <input
                  className={inputClass}
                  placeholder="Street, city, state"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#101010] p-5 md:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-[#D4AF6A]/10 p-3 text-[#D4AF6A]">
                <Ticket size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Ticket Configuration</h3>
                <p className="text-xs text-gray-500">Set the capacity and ticket prices</p>
              </div>
            </div>

            <label className={`${labelClass} block max-w-sm`}>
              Total Ticket Capacity *
              <input
                type="number"
                min="1"
                className={inputClass}
                value={form.capacity}
                onChange={(e) => updateField("capacity", e.target.value)}
              />
            </label>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {[
                ["General Ticket", "generalPrice"],
                ["Premium Ticket", "premiumPrice"],
                ["VIP Ticket", "vipPrice"],
              ].map(([label, name]) => (
                <label key={name} className={labelClass}>
                  {label} (₹)
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={form[name as keyof typeof form]}
                    onChange={(e) => updateField(name, e.target.value)}
                  />
                </label>
              ))}
            </div>
          </section>

          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#101010] p-5 sm:flex-row sm:items-center md:p-7">
            <div>
              <h3 className="font-semibold">Ready to create your event?</h3>
              <p className="mt-1 text-xs text-gray-500">
                Choose whether to keep it as a draft or mark it as published.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit("Draft")}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A] disabled:opacity-50"
              >
                <Save size={16} />
                {submitting ? "Saving..." : "Save Draft"}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit("Published")}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#D4AF6A] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#e5c783] disabled:opacity-50"
              >
                <Send size={16} />
                {submitting ? "Publishing..." : "Publish Event"}
              </button>
            </div>
          </div>
        </div>
    </AdminShell>
  );
}
