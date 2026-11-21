
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Save,
  ArrowLeft,
  CircleAlert,
  CheckCircle2,
} from "lucide-react";

export default function ProfileForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Kochi",
    state: "Kerala",
    country: "India",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/customers/profile")
      .then((res) => res.json())
      .then((json) => {
        if (!active || !json.success || !json.data?.profile) return;
        const p = json.data.profile;
        setForm((prev) => ({
          ...prev,
          fullName: p.name || "",
          email: p.email || "",
          phone: p.phone || "",
        }));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
    setMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.fullName.trim() || !form.email.trim()) {
      setMessage("Please complete all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/customers/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.fullName.trim(),
          phone: form.phone.trim() || null,
        }),
      });
      const json = await res.json();
      setMessage(
        res.ok && json.success
          ? "Profile updated successfully."
          : json.message || "Failed to update profile."
      );
    } catch {
      setMessage("Network error while saving profile.");
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-12 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF6A]">
            Customer Account
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl">
            My Profile
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-gray-400">
            Manage your personal information and contact details.
          </p>
        </div>

        {/* Demo notice */}
        <div className="mb-8 flex gap-3 border border-[#D4AF6A]/30 bg-[#D4AF6A]/[0.06] p-4">
          <CircleAlert
            size={19}
            className="mt-0.5 shrink-0 text-[#D4AF6A]"
          />
          <div>
            <p className="text-sm font-semibold text-[#F5E5B5]">
              Demo profile
            </p>
            <p className="mt-1 text-xs leading-6 text-gray-400">
              This profile currently uses sample information. Changes are
              validated in the browser but are not saved to a database.
            </p>
          </div>
        </div>

        {/* Profile card */}
        <section className="border border-white/10 bg-[#101010]">
          <div className="flex flex-col items-center gap-5 border-b border-white/10 p-7 sm:flex-row sm:p-9">
            <div className="flex size-20 items-center justify-center rounded-full border border-[#D4AF6A]/50 bg-[#D4AF6A]/10">
              <UserRound size={35} className="text-[#D4AF6A]" />
            </div>

            <div className="text-center sm:text-left">
              <h2 className="font-serif text-2xl text-white">
                {form.fullName || "Your Name"}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                IFE Customer Account
              </p>
              <span className="mt-3 inline-block border border-[#D4AF6A]/30 px-3 py-1 text-[10px] uppercase tracking-widest text-[#D4AF6A]">
                Demo Account
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-9">
            <div className="mb-8">
              <h3 className="font-serif text-xl text-white">
                Personal Information
              </h3>
              <p className="mt-2 text-xs text-gray-500">
                Update the information associated with your customer profile.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Full name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400"
                >
                  Full Name *
                </label>
                <div className="relative">
                  <UserRound
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF6A]"
                  />
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(event) =>
                      handleChange("fullName", event.target.value)
                    }
                    className="w-full border border-white/10 bg-[#080808] py-4 pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#D4AF6A]"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400"
                >
                  Email Address *
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF6A]"
                  />
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) =>
                      handleChange("email", event.target.value)
                    }
                    className="w-full border border-white/10 bg-[#080808] py-4 pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#D4AF6A]"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400"
                >
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF6A]"
                  />
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(event) =>
                      handleChange("phone", event.target.value)
                    }
                    className="w-full border border-white/10 bg-[#080808] py-4 pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#D4AF6A]"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400"
                >
                  City
                </label>
                <div className="relative">
                  <MapPin
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF6A]"
                  />
                  <input
                    id="city"
                    type="text"
                    value={form.city}
                    onChange={(event) =>
                      handleChange("city", event.target.value)
                    }
                    className="w-full border border-white/10 bg-[#080808] py-4 pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#D4AF6A]"
                    placeholder="Enter your city"
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label
                  htmlFor="state"
                  className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400"
                >
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  value={form.state}
                  onChange={(event) =>
                    handleChange("state", event.target.value)
                  }
                  className="w-full border border-white/10 bg-[#080808] px-4 py-4 text-sm text-white outline-none transition focus:border-[#D4AF6A]"
                  placeholder="Enter your state"
                />
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400"
                >
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  value={form.country}
                  onChange={(event) =>
                    handleChange("country", event.target.value)
                  }
                  className="w-full border border-white/10 bg-[#080808] px-4 py-4 text-sm text-white outline-none transition focus:border-[#D4AF6A]"
                  placeholder="Enter your country"
                />
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className="mt-7 flex items-start gap-3 border border-[#D4AF6A]/30 bg-[#D4AF6A]/[0.06] p-4">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-[#D4AF6A]"
                />
                <p className="text-xs leading-6 text-gray-300">
                  {message}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-9 flex flex-col-reverse justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 text-sm text-gray-400 transition hover:text-[#D4AF6A]"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </Link>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-[#D4AF6A] px-7 py-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-[#F5E5B5]"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </form>
        </section>

        {/* Account links */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/my-bookings"
            className="flex items-center justify-between border border-white/10 bg-[#101010] p-5 transition hover:border-[#D4AF6A]/50"
          >
            <div>
              <p className="text-sm font-semibold text-white">
                My Bookings
              </p>
              <p className="mt-1 text-xs text-gray-500">
                View your event booking records
              </p>
            </div>
            <ArrowLeft
              size={17}
              className="rotate-180 text-[#D4AF6A]"
            />
          </Link>

          <Link
            href="/my-tickets"
            className="flex items-center justify-between border border-white/10 bg-[#101010] p-5 transition hover:border-[#D4AF6A]/50"
          >
            <div>
              <p className="text-sm font-semibold text-white">
                My Tickets
              </p>
              <p className="mt-1 text-xs text-gray-500">
                View your ticket records
              </p>
            </div>
            <ArrowLeft
              size={17}
              className="rotate-180 text-[#D4AF6A]"
            />
          </Link>
        </div>
      </div>
    </main>
  );
}
