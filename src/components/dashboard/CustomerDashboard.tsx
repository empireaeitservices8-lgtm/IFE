
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Ticket,
  UserRound,
  Clock,
  ArrowRight,
  MapPin,
  Settings,
  LogOut,
  Heart,
  Bell,
  ChevronRight,
} from "lucide-react";

type DashboardBooking = {
  id: string;
  title: string;
  date: string;
  venue: string;
  status: string;
  category: string;
};

type ApiBooking = {
  id: string;
  bookingCode: string;
  status: string;
  event?: {
    title: string;
    category: string;
    startAt: string;
    venue?: { name: string } | null;
  } | null;
};

const quickLinks = [
  {
    title: "My Bookings",
    description: "View your event reservations",
    href: "/my-bookings",
    icon: CalendarDays,
  },
  {
    title: "My Tickets",
    description: "Access your digital tickets",
    href: "/my-tickets",
    icon: Ticket,
  },
  {
    title: "My Profile",
    description: "Manage your personal details",
    href: "/profile",
    icon: UserRound,
  },
  {
    title: "Wishlist",
    description: "Your saved events",
    href: "/wishlist",
    icon: Heart,
  },
];

export default function CustomerDashboard() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("IFE Customer");
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        if (!json.success || !json.data?.user) {
          router.push("/login");
          return;
        }
        setCustomerName(json.data.user.name);
        return fetch("/api/bookings/my-bookings")
          .then((r) => r.json())
          .then((bJson) => {
            if (!active || !bJson.success) return;
            const mapped: DashboardBooking[] = (bJson.data.items || []).map(
              (b: ApiBooking) => ({
                id: b.bookingCode,
                title: b.event?.title || "Event",
                date: b.event?.startAt
                  ? new Date(b.event.startAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "TBA",
                venue: b.event?.venue?.name || "TBA",
                status: b.status,
                category: b.event?.category || "EVENT",
              })
            );
            setBookings(mapped);
          });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* Dashboard Header */}
      <section className="border-b border-white/10 bg-[#111111]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF6A]">
                Customer Account
              </p>

              <h1 className="font-serif text-3xl sm:text-4xl">
                Welcome back, {customerName}
              </h1>

              <p className="mt-3 text-sm text-gray-400">
                Manage your bookings and discover your next experience.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 bg-[#D4AF6A] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#F5E5B5]"
              >
                Explore Events
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/profile"
                aria-label="Profile settings"
                className="flex h-11 w-11 items-center justify-center border border-white/15 text-gray-300 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
              >
                <Settings size={19} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Demo Notice */}
        <div className="mb-8 border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-sm leading-6 text-amber-300">
            Demo dashboard: Account information and booking
            statistics below are sample data. Live customer
            records will be loaded after backend authentication
            and database integration.
          </p>
        </div>

        {/* Statistics */}
        <section className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Bookings",
              value: "02",
              icon: CalendarDays,
            },
            {
              title: "Upcoming Events",
              value: "02",
              icon: Clock,
            },
            {
              title: "Digital Tickets",
              value: "02",
              icon: Ticket,
            },
            {
              title: "Saved Events",
              value: "03",
              icon: Heart,
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="border border-white/10 bg-[#111111] p-6 transition hover:border-[#D4AF6A]/40"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    {stat.title}
                  </p>
                  <Icon size={21} className="text-[#D4AF6A]" />
                </div>

                <p className="mt-5 font-serif text-4xl">
                  {stat.value}
                </p>

                <p className="mt-2 text-xs text-gray-600">
                  Sample dashboard data
                </p>
              </div>
            );
          })}
        </section>

        {/* Main Content */}
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">

          {/* Bookings */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#D4AF6A]">
                  Your Activity
                </p>
                <h2 className="font-serif text-3xl">
                  Recent Bookings
                </h2>
              </div>

              <Link
                href="/my-bookings"
                className="hidden items-center gap-2 text-sm text-[#D4AF6A] transition hover:text-[#F5E5B5] sm:flex"
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-5">
              {bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="border border-white/10 bg-[#111111] p-5 sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-5 sm:flex-row">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#D4AF6A]/30 bg-[#D4AF6A]/10">
                        <Ticket
                          size={25}
                          className="text-[#D4AF6A]"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF6A]">
                          {booking.category}
                        </span>

                        <h3 className="mt-2 font-serif text-xl">
                          {booking.title}
                        </h3>

                        <p className="mt-2 text-xs text-gray-500">
                          Reference: {booking.id}
                        </p>
                      </div>
                    </div>

                    <span className="h-fit w-fit border border-amber-500/30 px-3 py-1 text-xs text-amber-300">
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <CalendarDays
                        size={17}
                        className="text-[#D4AF6A]"
                      />
                      {booking.date}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <MapPin
                        size={17}
                        className="text-[#D4AF6A]"
                      />
                      {booking.venue}
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <Link
                      href="/my-bookings"
                      className="inline-flex items-center gap-2 text-sm text-[#D4AF6A] hover:text-[#F5E5B5]"
                    >
                      View Booking
                      <ChevronRight size={17} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <Link
              href="/my-bookings"
              className="mt-6 flex items-center justify-center gap-2 border border-white/15 py-4 text-sm text-gray-300 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A] sm:hidden"
            >
              View All Bookings
              <ArrowRight size={17} />
            </Link>
          </section>

          {/* Sidebar */}
          <aside className="space-y-8">

            {/* Profile Card */}
            <div className="border border-white/10 bg-[#111111] p-6">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF6A]/40 bg-[#D4AF6A]/10">
                <UserRound
                  size={29}
                  className="text-[#D4AF6A]"
                />
              </div>

              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                Your Account
              </p>

              <h3 className="mt-2 font-serif text-2xl">
                {customerName}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                customer@example.com
              </p>

              <Link
                href="/profile"
                className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-sm text-[#D4AF6A] hover:text-[#F5E5B5]"
              >
                Edit Profile
                <ArrowRight size={17} />
              </Link>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-5 font-serif text-2xl">
                Quick Access
              </h3>

              <div className="space-y-3">
                {quickLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group flex items-center gap-4 border border-white/10 bg-[#111111] p-4 transition hover:border-[#D4AF6A]/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#D4AF6A]/10">
                        <Icon
                          size={19}
                          className="text-[#D4AF6A]"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {item.description}
                        </p>
                      </div>

                      <ChevronRight
                        size={17}
                        className="text-gray-600 transition group-hover:text-[#D4AF6A]"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Notification */}
            <div className="border border-[#D4AF6A]/20 bg-[#D4AF6A]/5 p-5">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-[#D4AF6A]" />
                <h3 className="font-semibold">Stay Updated</h3>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Keep track of upcoming events and important
                booking updates.
              </p>

              <Link
                href="/notifications"
                className="mt-4 inline-flex items-center gap-2 text-sm text-[#D4AF6A] hover:text-[#F5E5B5]"
              >
                View Notifications
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Sign Out */}
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 border border-white/15 py-4 text-sm text-gray-400 transition hover:border-red-400/50 hover:text-red-400"
            >
              <LogOut size={17} />
              Sign Out
            </Link>
          </aside>
        </div>

        {/* Explore Events CTA */}
        <section className="mt-16 border border-[#D4AF6A]/30 bg-[linear-gradient(120deg,#1b1710,#111111)] p-8 text-center sm:p-12">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D4AF6A]">
            Discover More
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl">
            Your Next Experience Awaits
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-400">
            Explore upcoming fashion shows, entertainment
            events and exclusive IFE experiences.
          </p>

          <Link
            href="/events"
            className="mt-7 inline-flex items-center gap-3 bg-[#D4AF6A] px-8 py-4 text-sm font-semibold text-black transition hover:bg-[#F5E5B5]"
          >
            Explore Events
            <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </main>
  );
}
