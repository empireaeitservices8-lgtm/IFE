
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  CalendarDays,
  MapPin,
  Ticket,
  Trash2,
  ArrowRight,
  CircleAlert,
  Sparkles,
} from "lucide-react";

type WishlistEvent = {
  id: string;
  title: string;
  category: string;
  date: string;
  venue: string;
  description: string;
  startingPrice: number;
  image: string;
};

const initialWishlist: WishlistEvent[] = [
  {
    id: "1",
    title: "The IFE Fashion Showcase",
    category: "Fashion Show",
    date: "Date to be announced",
    venue: "Venue to be announced",
    description:
      "An exclusive fashion experience celebrating creativity, style and emerging talent.",
    startingPrice: 499,
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "2",
    title: "Live Beyond",
    category: "Entertainment",
    date: "Date to be announced",
    venue: "Venue to be announced",
    description:
      "A live entertainment experience featuring music, performances and unforgettable moments.",
    startingPrice: 999,
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "4",
    title: "Runway Stories",
    category: "Fashion",
    date: "Date to be announced",
    venue: "Venue to be announced",
    description:
      "Discover fashion stories through runway presentations and artistic expression.",
    startingPrice: 499,
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=85",
  },
];

export default function Wishlist() {
  const [events, setEvents] = useState(initialWishlist);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [removedEvent, setRemovedEvent] = useState("");

  const categories = [
    "all",
    ...Array.from(new Set(events.map((event) => event.category))),
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = [
        event.title,
        event.category,
        event.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "all" || event.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [events, search, category]);

  const removeEvent = (id: string, title: string) => {
    setEvents((previous) =>
      previous.filter((event) => event.id !== id)
    );
    setRemovedEvent(`${title} was removed from your wishlist.`);
  };

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-12 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF6A]">
            Customer Account
          </p>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl">
                My Wishlist
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-gray-400">
                Keep track of the events you love and come back to book your
                tickets whenever you're ready.
              </p>
            </div>

            <Link
              href="/events"
              className="inline-flex w-fit items-center gap-2 border border-[#D4AF6A] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[#D4AF6A] transition hover:bg-[#D4AF6A] hover:text-black"
            >
              Discover Events
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Demo notice */}
        <div className="mb-8 flex gap-3 border border-[#D4AF6A]/30 bg-[#D4AF6A]/[0.06] p-4">
          <CircleAlert
            size={19}
            className="mt-0.5 shrink-0 text-[#D4AF6A]"
          />
          <div>
            <p className="text-sm font-semibold text-[#F5E5B5]">
              Demonstration wishlist
            </p>
            <p className="mt-1 text-xs leading-6 text-gray-400">
              These are sample saved events. Removing an event updates this
              page's temporary browser state only. Your changes are not
              permanently stored or linked to a customer account.
            </p>
          </div>
        </div>

        {/* Removal message */}
        {removedEvent && (
          <div
            role="status"
            className="mb-6 flex items-center justify-between gap-4 border border-white/10 bg-[#111111] p-4"
          >
            <p className="text-xs text-gray-300">{removedEvent}</p>
            <button
              type="button"
              onClick={() => setRemovedEvent("")}
              className="shrink-0 text-xs text-[#D4AF6A] hover:text-[#F5E5B5]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Wishlist stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="border border-white/10 bg-[#101010] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-gray-500">
                Saved Events
              </p>
              <Heart size={19} className="text-[#D4AF6A]" />
            </div>
            <p className="mt-3 font-serif text-3xl text-white">
              {events.length.toString().padStart(2, "0")}
            </p>
          </div>

          <div className="border border-white/10 bg-[#101010] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-gray-500">
                Categories
              </p>
              <Sparkles size={19} className="text-[#D4AF6A]" />
            </div>
            <p className="mt-3 font-serif text-3xl text-white">
              {new Set(events.map((event) => event.category)).size
                .toString()
                .padStart(2, "0")}
            </p>
          </div>

          <div className="border border-white/10 bg-[#101010] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-gray-500">
                Matching Results
              </p>
              <Ticket size={19} className="text-[#D4AF6A]" />
            </div>
            <p className="mt-3 font-serif text-3xl text-white">
              {filteredEvents.length.toString().padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Search and category */}
        <div className="mb-8 grid gap-4 sm:grid-cols-[1fr_240px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search saved events..."
              className="w-full border border-white/10 bg-[#111111] py-4 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#D4AF6A]"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full border border-white/10 bg-[#111111] px-4 py-4 text-sm text-gray-300 outline-none focus:border-[#D4AF6A]"
          >
            <option value="all">All Categories</option>
            {categories
              .filter((item) => item !== "all")
              .map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
          </select>
        </div>

        {/* Events */}
        {filteredEvents.length > 0 ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <article
                key={event.id}
                className="group overflow-hidden border border-white/10 bg-[#101010] transition hover:border-[#D4AF6A]/50"
              >
                {/* Event image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  <span className="absolute bottom-4 left-4 border border-[#D4AF6A]/50 bg-black/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#F5E5B5]">
                    {event.category}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeEvent(event.id, event.title)}
                    aria-label={`Remove ${event.title} from wishlist`}
                    title="Remove from wishlist"
                    className="absolute right-4 top-4 flex size-10 items-center justify-center border border-white/20 bg-black/70 text-white transition hover:border-red-400 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                {/* Event information */}
                <div className="p-6">
                  <h2 className="font-serif text-2xl text-white">
                    {event.title}
                  </h2>

                  <p className="mt-3 min-h-12 text-sm leading-6 text-gray-400">
                    {event.description}
                  </p>

                  <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <CalendarDays
                        size={16}
                        className="text-[#D4AF6A]"
                      />
                      {event.date}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <MapPin size={16} className="text-[#D4AF6A]" />
                      {event.venue}
                    </div>
                  </div>

                  <div className="mt-6 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500">
                        Starting From
                      </p>
                      <p className="mt-1 text-xl font-semibold text-[#F5E5B5]">
                        ₹{event.startingPrice.toLocaleString("en-IN")}
                      </p>
                      <p className="mt-1 text-[10px] text-gray-600">
                        Illustrative price
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Link
                      href={`/events/${event.id}`}
                      className="flex items-center justify-center border border-white/15 px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-200 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                    >
                      View Event
                    </Link>

                    <Link
                      href={`/events/${event.id}/tickets`}
                      className="flex items-center justify-center gap-2 bg-[#D4AF6A] px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-black transition hover:bg-[#F5E5B5]"
                    >
                      Book Tickets
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-white/10 bg-[#101010] px-5 py-16 text-center">
            <Heart size={36} className="mx-auto text-gray-600" />
            <h3 className="mt-5 font-serif text-2xl text-white">
              {events.length === 0
                ? "Your wishlist is empty"
                : "No matching events found"}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              {events.length === 0
                ? "Explore our events and save the experiences you would love to attend."
                : "Try a different search term or select another category."}
            </p>
            <Link
              href="/events"
              className="mt-7 inline-flex items-center gap-2 bg-[#D4AF6A] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-[#F5E5B5]"
            >
              Explore Events
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Bottom navigation */}
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 transition hover:text-[#D4AF6A]"
          >
            ← Back to Dashboard
          </Link>

          <Link
            href="/my-bookings"
            className="inline-flex items-center gap-2 text-sm text-[#D4AF6A] transition hover:text-[#F5E5B5]"
          >
            View My Bookings
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
