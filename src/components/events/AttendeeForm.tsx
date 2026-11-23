
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Attendee = {
  fullName: string;
  email: string;
  phone: string;
};

type AttendeeFormProps = {
  eventId: string;
  eventTitle: string;
  ticketType: string;
  quantity: number;
};

const ticketNames: Record<string, string> = {
  single: "Single Entry",
  couple: "Couple Entry",
  group5: "Group of 5",
  vip: "VIP Pass",
};

export default function AttendeeForm({
  eventId,
  eventTitle,
  ticketType,
  quantity,
}: AttendeeFormProps) {
  const router = useRouter();

  const [attendees, setAttendees] = useState<Attendee[]>(
    Array.from({ length: quantity }, () => ({
      fullName: "",
      email: "",
      phone: "",
    }))
  );

  const [error, setError] = useState("");

  const updateAttendee = (
    index: number,
    field: keyof Attendee,
    value: string
  ) => {
    setAttendees((current) =>
      current.map((attendee, i) =>
        i === index
          ? { ...attendee, [field]: value }
          : attendee
      )
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const invalidAttendee = attendees.some(
      (attendee) =>
        !attendee.fullName.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendee.email) ||
        !/^[0-9+\-\s()]{7,15}$/.test(attendee.phone)
    );

    if (invalidAttendee) {
      setError(
        "Please enter valid details for every attendee."
      );
      return;
    }

    // Demo only: keep personal information out of the URL.
    // Production bookings should save this data securely on the server.
    try {
      sessionStorage.setItem(
        `ife-attendees-${eventId}`,
        JSON.stringify(attendees)
      );
    } catch {
      setError("Unable to save attendee details. Please try again.");
      return;
    }

    const params = new URLSearchParams({
      ticket: ticketType,
      quantity: String(quantity),
    });

    router.push(
      `/events/${eventId}/booking-summary?${params.toString()}`
    );
  };

  const ticketName = ticketNames[ticketType] || "Selected Ticket";

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#050505] px-5 py-6 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb + Heading */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-white/45">
              <Link href="/events" className="hover:text-[#D4AF6A]">
                Events
              </Link>
              <span>/</span>
              <Link
                href={`/events/${eventId}`}
                className="hover:text-[#D4AF6A]"
              >
                {eventTitle}
              </Link>
              <span>/</span>
              <span className="text-[#D4AF6A]">Attendee Details</span>
            </div>

            <h1 className="font-[var(--font-playfair)] text-3xl md:text-4xl">
              Attendee <span className="text-[#D4AF6A]">Details</span>
            </h1>
          </div>

          <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
            Step 02 / Attendees
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
          {/* Attendee Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {attendees.map((attendee, index) => (
              <div
                key={index}
                className="border border-white/10 bg-[#111111] p-5 md:p-6"
              >
                <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF6A]">
                      Attendee {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-white/20">•</span>
                    <h2 className="font-[var(--font-playfair)] text-lg">
                      Personal Information
                    </h2>
                  </div>

                  <span className="text-xs text-white/40">{ticketName}</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`name-${index}`}
                      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/60"
                    >
                      Full Name *
                    </label>

                    <input
                      id={`name-${index}`}
                      type="text"
                      value={attendee.fullName}
                      onChange={(e) =>
                        updateAttendee(index, "fullName", e.target.value)
                      }
                      placeholder="Enter attendee's full name"
                      autoComplete="name"
                      required
                      maxLength={100}
                      className="w-full border border-white/10 bg-[#080808] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor={`email-${index}`}
                      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/60"
                    >
                      Email Address *
                    </label>

                    <input
                      id={`email-${index}`}
                      type="email"
                      value={attendee.email}
                      onChange={(e) =>
                        updateAttendee(index, "email", e.target.value)
                      }
                      placeholder="Enter email address"
                      autoComplete="email"
                      required
                      maxLength={254}
                      className="w-full border border-white/10 bg-[#080808] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor={`phone-${index}`}
                      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/60"
                    >
                      Mobile Number *
                    </label>

                    <input
                      id={`phone-${index}`}
                      type="tel"
                      value={attendee.phone}
                      onChange={(e) =>
                        updateAttendee(index, "phone", e.target.value)
                      }
                      placeholder="Enter mobile number"
                      autoComplete="tel"
                      required
                      maxLength={15}
                      className="w-full border border-white/10 bg-[#080808] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                    />
                  </div>
                </div>
              </div>
            ))}

            {error && (
              <p
                role="alert"
                className="border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse justify-between gap-3 pt-1 sm:flex-row sm:items-center">
              <Link
                href={`/events/${eventId}/tickets`}
                className="text-xs text-white/50 transition hover:text-[#D4AF6A]"
              >
                ← Back to Ticket Selection
              </Link>

              <button
                type="submit"
                className="bg-[#D4AF6A] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#F5E5B5]"
              >
                Continue to Booking Summary →
              </button>
            </div>
          </form>

          {/* Summary Sidebar */}
          <aside className="h-fit border border-white/10 bg-[#111111] p-5 lg:sticky lg:top-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF6A]">
              Your Booking
            </p>

            <h2 className="mt-2 font-[var(--font-playfair)] text-xl leading-snug">
              {eventTitle}
            </h2>

            <div className="my-4 border-t border-white/10" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-white/45">Ticket Type</span>
                <span className="text-right">{ticketName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/45">Number of Passes</span>
                <span>{quantity}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/45">Attendees</span>
                <span>{attendees.length}</span>
              </div>
            </div>

            <div className="my-4 border-t border-white/10" />

            <div className="space-y-2 text-xs text-white/45">
              <div className="flex items-center gap-2">
                <span className="text-[#D4AF6A]">✓</span>
                <p>Attendee info is used for pass generation.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#D4AF6A]">✓</span>
                <p>Review details before payment.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
