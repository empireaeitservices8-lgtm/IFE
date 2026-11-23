"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiSave, FiUpload, FiUser } from "react-icons/fi";
import AdminShell from "@/components/admin/AdminShell";

export default function EditArtistPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    location: "",
    imageUrl: "",
    bio: "",
    isActive: true,
  });

  useEffect(() => {
    let active = true;
    fetch(`/api/artists/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        if (!json.success || !json.data?.artist) {
          setMessageType("error");
          setMessage(json.message || "Artist not found.");
          return;
        }
        const a = json.data.artist;
        setForm({
          name: a.name || "",
          role: a.role || "",
          email: a.email || "",
          phone: a.phone || "",
          location: a.location || "",
          imageUrl: a.imageUrl || "",
          bio: a.bio || "",
          isActive: Boolean(a.isActive),
        });
      })
      .catch(() => {
        if (active) {
          setMessageType("error");
          setMessage("Failed to load artist details.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage("");
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "ife-events/artists");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.success || !json.data?.url) {
        setMessageType("error");
        setMessage(json.message || "Failed to upload portrait.");
        return;
      }
      setForm((prev) => ({ ...prev, imageUrl: json.data.url }));
      setMessageType("success");
      setMessage("Artist photo uploaded to Cloudinary.");
    } catch {
      setMessageType("error");
      setMessage("Network error while uploading photo.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!form.name.trim() || !form.role.trim()) {
      setMessageType("error");
      setMessage("Artist name and role are required.");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`/api/artists/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          role: form.role.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          location: form.location.trim() || null,
          imageUrl: form.imageUrl.trim() || null,
          bio: form.bio.trim() || null,
          isActive: form.isActive,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setMessageType("error");
        setMessage(json.message || "Failed to update artist.");
        return;
      }
      setMessageType("success");
      setMessage("Artist updated successfully.");
      setTimeout(() => router.push("/admin/artists"), 700);
    } catch {
      setMessageType("error");
      setMessage("Network error while saving artist.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#D4AF6A]";
  const labelClass = "text-sm font-medium text-gray-300";

  return (
    <AdminShell
      title="Edit Artist"
      breadcrumb="Admin / Artists / Edit"
      actions={
        <Link
          href="/admin/artists"
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
        >
          <FiArrowLeft size={16} />
          Back to Artists
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
            Loading artist details...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-white/10 bg-[#101010] p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-4">
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt={form.name}
                    className="size-16 rounded-full border border-[#D4AF6A]/50 object-cover"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-full border border-[#D4AF6A]/40 bg-[#D4AF6A]/10 text-[#D4AF6A]">
                    <FiUser size={24} />
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-white">
                    {form.name || "Artist Profile"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Update profile details and Cloudinary portrait
                  </p>
                </div>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#D4AF6A]/40 bg-[#D4AF6A]/10 px-4 py-2.5 text-xs font-semibold text-[#D4AF6A] transition hover:bg-[#D4AF6A] hover:text-black">
                <FiUpload size={14} />
                {uploading ? "Uploading..." : "Upload Portrait"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  disabled={uploading}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className={labelClass}>
                Name *
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>

              <label className={labelClass}>
                Role / Category *
                <input
                  className={inputClass}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </label>

              <label className={labelClass}>
                Email
                <input
                  type="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>

              <label className={labelClass}>
                Phone
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>

              <label className={labelClass}>
                Location
                <input
                  className={inputClass}
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </label>

              <label className={labelClass}>
                Status
                <select
                  className={inputClass}
                  value={form.isActive ? "ACTIVE" : "INACTIVE"}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.value === "ACTIVE" })
                  }
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </label>

              <label className={`${labelClass} md:col-span-2`}>
                Portrait Image URL
                <input
                  className={inputClass}
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                />
              </label>

              <label className={`${labelClass} md:col-span-2`}>
                Bio
                <textarea
                  rows={4}
                  className={inputClass}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Link
                href="/admin/artists"
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
                {saving ? "Saving..." : "Save Artist"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminShell>
  );
}

