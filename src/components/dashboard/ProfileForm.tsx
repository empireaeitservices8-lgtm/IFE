"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiArrowRight,
  FiBell,
  FiCalendar,
  FiCheckCircle,
  FiLock,
  FiLogOut,
  FiMail,
  FiPhone,
  FiRotateCcw,
  FiSave,
  FiShield,
  FiUser,
} from "react-icons/fi";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    bookings: number;
    notifications: number;
  };
}

function getInitials(name: string, email: string): string {
  const source = name.trim() || email.trim();
  if (!source) return "U";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProfileForm() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/customers/profile")
      .then(async (res) => {
        if (res.status === 401) {
          router.replace("/login?redirect=/profile");
          return null;
        }
        const json = await res.json();
        return { ok: res.ok, json };
      })
      .then((result) => {
        if (!active || !result) return;
        if (!result.ok || !result.json?.success || !result.json?.data?.profile) {
          setFeedback({
            type: "error",
            text: result.json?.message || "Unable to load your profile.",
          });
          setLoading(false);
          return;
        }

        const loaded: ProfileData = result.json.data.profile;
        setProfile(loaded);
        setFullName(loaded.name || "");
        setPhone(loaded.phone || "");
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setFeedback({
          type: "error",
          text: "Network error while loading your profile.",
        });
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  const normalizedOriginalName = (profile?.name || "").trim();
  const normalizedOriginalPhone = (profile?.phone || "").trim();
  const hasChanges =
    Boolean(profile) &&
    (fullName.trim() !== normalizedOriginalName ||
      phone.trim() !== normalizedOriginalPhone);

  const handleReset = () => {
    if (!profile) return;
    setFullName(profile.name || "");
    setPhone(profile.phone || "");
    setFeedback(null);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();

    if (trimmedName.length < 2) {
      setFeedback({
        type: "error",
        text: "Please enter your full name (at least 2 characters).",
      });
      return;
    }

    if (trimmedPhone && trimmedPhone.length < 7) {
      setFeedback({
        type: "error",
        text: "Please enter a valid phone number or leave it blank.",
      });
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/customers/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          phone: trimmedPhone || null,
        }),
      });
      const json = await res.json();

      if (res.status === 401) {
        router.replace("/login?redirect=/profile");
        return;
      }

      if (!res.ok || !json.success) {
        setFeedback({
          type: "error",
          text: json.message || "Unable to update profile.",
        });
        return;
      }

      const updated: ProfileData = json.data?.profile || {
        ...(profile as ProfileData),
        name: trimmedName,
        phone: trimmedPhone || null,
      };
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              ...updated,
              _count: prev._count,
            }
          : updated
      );
      setFullName(updated.name || trimmedName);
      setPhone(updated.phone || "");
      setFeedback({
        type: "success",
        text: json.message || "Profile updated successfully.",
      });
    } catch {
      setFeedback({
        type: "error",
        text: "Unable to reach the server. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080808] px-4 py-12 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="h-8 w-44 animate-pulse rounded bg-white/5" />
          <div className="h-12 w-72 animate-pulse rounded bg-white/10" />
          <div className="h-64 animate-pulse border border-white/10 bg-[#101010]" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-12 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        {/* Top Navigation */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-gray-400 transition hover:text-[#D4AF6A]"
          >
            <FiArrowLeft size={15} />
            Back to Dashboard
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex items-center gap-2 border border-white/15 bg-[#101010] px-4 py-2 text-xs uppercase tracking-[0.18em] text-gray-300 transition hover:border-red-400/50 hover:text-red-300 disabled:opacity-50"
          >
            <FiLogOut size={14} />
            {signingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF6A]">
            My Account
          </p>
          <h1 className="font-[var(--font-playfair)] text-4xl sm:text-5xl">
            Profile &amp; Settings
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-400">
            Manage your personal contact information and view your IFE account
            activity.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Link
            href="/my-bookings"
            className="group flex items-center justify-between border border-white/10 bg-[#101010] p-5 transition hover:border-[#D4AF6A]/40"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">
                My Bookings
              </p>
              <p className="mt-2 font-[var(--font-playfair)] text-3xl text-white">
                {profile?._count?.bookings ?? 0}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center border border-[#D4AF6A]/30 bg-[#D4AF6A]/10 text-[#D4AF6A] transition group-hover:bg-[#D4AF6A] group-hover:text-black">
              <FiCalendar size={18} />
            </div>
          </Link>

          <Link
            href="/notifications"
            className="group flex items-center justify-between border border-white/10 bg-[#101010] p-5 transition hover:border-[#D4AF6A]/40"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">
                Notifications
              </p>
              <p className="mt-2 font-[var(--font-playfair)] text-3xl text-white">
                {profile?._count?.notifications ?? 0}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center border border-[#D4AF6A]/30 bg-[#D4AF6A]/10 text-[#D4AF6A] transition group-hover:bg-[#D4AF6A] group-hover:text-black">
              <FiBell size={18} />
            </div>
          </Link>

          <Link
            href="/my-tickets"
            className="group flex items-center justify-between border border-white/10 bg-[#101010] p-5 transition hover:border-[#D4AF6A]/40"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">
                Event Passes
              </p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#D4AF6A]">
                View My Tickets
                <FiArrowRight size={14} />
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center border border-[#D4AF6A]/30 bg-[#D4AF6A]/10 text-[#D4AF6A] transition group-hover:bg-[#D4AF6A] group-hover:text-black">
              <FiShield size={18} />
            </div>
          </Link>
        </div>

        {/* Profile Card */}
        <section className="border border-white/10 bg-[#101010]">
          {/* Identity Banner */}
          <div className="flex flex-col items-center justify-between gap-5 border-b border-white/10 p-7 sm:flex-row sm:p-9">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#D4AF6A]/50 bg-[#D4AF6A]/10 font-[var(--font-playfair)] text-2xl font-semibold text-[#D4AF6A]">
                {getInitials(fullName || profile?.name || "", profile?.email || "")}
              </div>

              <div className="text-center sm:text-left">
                <h2 className="font-[var(--font-playfair)] text-2xl text-white">
                  {fullName.trim() || profile?.name || "IFE Member"}
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  {profile?.email || "—"}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="inline-block border border-[#D4AF6A]/30 bg-[#D4AF6A]/10 px-3 py-1 text-[10px] uppercase tracking-widest text-[#D4AF6A]">
                    {profile?.status || "ACTIVE"}
                  </span>
                  <span className="inline-block border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-widest text-gray-400">
                    Member since {formatDate(profile?.createdAt || "")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-7 sm:p-9">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Full Name
                </label>
                <div className="flex items-center gap-3 border border-white/15 bg-[#080808] px-4 transition focus-within:border-[#D4AF6A]">
                  <FiUser size={17} className="shrink-0 text-[#D4AF6A]" />
                  <input
                    id="profile-name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (feedback) setFeedback(null);
                    }}
                    className="h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="profile-phone"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Phone Number
                </label>
                <div className="flex items-center gap-3 border border-white/15 bg-[#080808] px-4 transition focus-within:border-[#D4AF6A]">
                  <FiPhone size={17} className="shrink-0 text-[#D4AF6A]" />
                  <input
                    id="profile-phone"
                    type="tel"
                    maxLength={25}
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (feedback) setFeedback(null);
                    }}
                    className="h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-500">
                  Used for booking confirmations and event updates.
                </p>
              </div>

              {/* Email (Read-only) */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Email Address
                </label>
                <div className="flex items-center gap-3 border border-white/10 bg-[#080808]/60 px-4 opacity-80">
                  <FiMail size={17} className="shrink-0 text-gray-500" />
                  <input
                    id="profile-email"
                    type="email"
                    readOnly
                    disabled
                    value={profile?.email || ""}
                    className="h-14 w-full cursor-not-allowed bg-transparent text-sm text-gray-400 outline-none"
                  />
                  <FiLock
                    size={15}
                    className="shrink-0 text-gray-500"
                    title="Email address cannot be changed"
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-500">
                  Your primary sign-in email cannot be changed here. Contact IFE
                  support if you need to transfer your account.
                </p>
              </div>
            </div>

            {/* Feedback Banner */}
            {feedback && (
              <div
                role={feedback.type === "error" ? "alert" : "status"}
                className={`mt-7 flex items-start gap-3 border p-4 ${
                  feedback.type === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                    : "border-red-500/30 bg-red-500/10 text-red-200"
                }`}
              >
                {feedback.type === "success" ? (
                  <FiCheckCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />
                ) : (
                  <FiAlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-400"
                  />
                )}
                <p className="text-xs leading-6">{feedback.text}</p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-9 flex flex-col-reverse justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                {hasChanges ? (
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={saving}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gray-400 transition hover:text-white disabled:opacity-50"
                  >
                    <FiRotateCcw size={14} />
                    Discard Changes
                  </button>
                ) : (
                  <span className="text-xs text-gray-500">
                    Last updated {formatDate(profile?.updatedAt || "")}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={saving || !hasChanges}
                className="inline-flex items-center justify-center gap-2 bg-[#D4AF6A] px-7 py-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-[#F5E5B5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiSave size={16} />
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
