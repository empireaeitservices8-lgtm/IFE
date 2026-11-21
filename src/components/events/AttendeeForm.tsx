
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
  general: "General Admission",
  premium: "Premium Access",
  vip: "VIP Experience",
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
    <section className="min-h-screen bg-[#050505] px-5 py-16 text-white md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Breadcrumb */}
        <div className="mb-10 flex flex-wrap items-center gap-3 text-sm text-white/40">
          <Link href="/events" className="hover:text-[#D4AF6A]">
            Events
          </Link>
          <span>/</span>
          <Link
            href={`/events/${eventId}`}
            className="hover:text-[#D4AF6A]"
          >
            Event Details
          </Link>
          <span>/</span>
          <span className="text-[#D4AF6A]">
            Attendee Details
          </span>
        </div>

        {/* Heading */}
        <div className="mb-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF6A]">
            Almost There
          </p>

          <h1 className="font-serif text-4xl md:text-6xl">
            Attendee <span className="text-[#D4AF6A]">Details</span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
            Please provide the details of each attendee.
            Make sure the information is accurate before continuing.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">

          {/* Attendee Form */}
          <form onSubmit={handleSubmit} className="space-y-7">

            {attendees.map((attendee, index) => (
              <div
                key={index}
                className="border border-white/10 bg-[#111111] p-6 md:p-9"
              >
                <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF6A]">
                      Attendee {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-2 font-serif text-2xl">
                      Personal Information
                    </h2>
                  </div>

                  <span className="text-xs text-white/30">
                    {ticketName}
                  </span>
                </div>

                <div className="space-y-6">

                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor={`name-${index}`}
                      className="mb-3 block text-xs font-semibold uppercase tracking-wider text-white/60"
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
                      className="w-full border border-white/10 bg-[#080808] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor={`email-${index}`}
                      className="mb-3 block text-xs font-semibold uppercase tracking-wider text-white/60"
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
                      className="w-full border border-white/10 bg-[#080808] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor={`phone-${index}`}
                      className="mb-3 block text-xs font-semibold uppercase tracking-wider text-white/60"
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
                      className="w-full border border-white/10 bg-[#080808] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                    />
                  </div>

                </div>
              </div>
            ))}

            {error && (
              <p
                role="alert"
                className="border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col justify-between gap-5 pt-3 sm:flex-row sm:items-center">
              <Link
                href={`/events/${eventId}/tickets`}
                className="text-sm text-white/50 transition hover:text-[#D4AF6A]"
              >
                ← Back to Ticket Selection
              </Link>

              <button
                type="submit"
                className="bg-[#D4AF6A] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#F5E5B5]"
              >
                Continue to Booking Summary →
              </button>
            </div>
          </form>

          {/* Summary Sidebar */}
          <aside className="h-fit border border-white/10 bg-[#111111] p-7 lg:sticky lg:top-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF6A]">
              Your Booking
            </p>

            <h2 className="mt-5 font-serif text-2xl leading-snug">
              {eventTitle}
            </h2>

            <div className="my-7 border-t border-white/10" />

            <div className="space-y-5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-white/45">Ticket Type</span>
                <span className="text-right">{ticketName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/45">Number of Tickets</span>
                <span>{quantity}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/45">Attendees</span>
                <span>{attendees.length}</span>
              </div>
            </div>

            <div className="my-7 border-t border-white/10" />

            <div className="flex items-center gap-3">
              <span className="text-[#D4AF6A]">✓</span>
              <p className="text-xs text-white/45">
                Attendee information is required for booking.
              </p>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-[#D4AF6A]">✓</span>
              <p className="text-xs text-white/45">
                Review your details before payment.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
