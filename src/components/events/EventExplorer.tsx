"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ExplorerEvent = {
  id: string;
  image: string;
  category: string;
  title: string;
  date: string;
  location: string;
  price: string;
  description: string;
};

type ApiEventItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string | null;
  description: string;
  bannerUrl: string | null;
  startAt: string;
  venue?: { name: string; city: string } | null;
  ticketTypes?: { price: string | number }[];
};

const fallbackImages: Record<string, string> = {
  FASHION:
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=85&w=1200",
  ENTERTAINMENT:
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=85&w=1200",
  AWARDS:
    "https://images.unsplash.com/photo-1503095396549-807759245b35?q=85&w=1200",
  CONCERT:
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=85&w=1200",
};

const categories = [
  "All Events",
  "Fashion",
  "Entertainment",
  "Concert",
  "Awards",
];

function EventCard({ event }: { event: ExplorerEvent }) {
  return (
    <article className="group overflow-hidden border border-white/10 bg-[#111111] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF6A]/60">
      <Link
        href={`/events/${event.id}`}
        aria-label={`View ${event.title}`}
        className="relative block h-[220px] overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${event.image}')` }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

        <span className="absolute left-4 top-4 bg-[#D4AF6A] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[2px] text-black">
          {event.category}
        </span>

        <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-lg text-white transition group-hover:border-[#D4AF6A] group-hover:bg-[#D4AF6A] group-hover:text-black">
          ↗
        </span>
      </Link>

      <div className="p-5">
        <h3 className="font-[var(--font-playfair)] text-xl text-white transition group-hover:text-[#D4AF6A]">
          {event.title}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[40px] text-xs leading-5 text-white/55">
          {event.description}
        </p>

        <div className="mt-4 space-y-1.5 text-xs text-white/55">
          <p>
            <span className="mr-2 text-[#D4AF6A]">◷</span>
            {event.date}
          </p>
          <p className="truncate">
            <span className="mr-2 text-[#D4AF6A]">⌖</span>
            {event.location}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <div>
            <p className="text-[9px] uppercase tracking-[2px] text-white/40">
              Tickets
            </p>
            <p className="mt-0.5 text-sm font-semibold text-[#D4AF6A]">
              {event.price}
            </p>
          </div>

          <Link
            href={`/events/${event.id}`}
            className="bg-[#D4AF6A]/10 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[2px] text-[#D4AF6A] transition hover:bg-[#D4AF6A] hover:text-black"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function EventExplorer() {
  const [events, setEvents] = useState<ExplorerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All Events");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All Locations");

  useEffect(() => {
    let active = true;
    fetch("/api/events?limit=50")
      .then((res) => res.json())
      .then((json) => {
        if (!active || !json.success) return;
        const mapped: ExplorerEvent[] = (json.data.items || []).map(
          (ev: ApiEventItem) => {
            const prices = (ev.ticketTypes || []).map((t) => Number(t.price));
            const minPrice = prices.length > 0 ? Math.min(...prices) : null;
            return {
              id: ev.id,
              image:
                ev.bannerUrl ||
                fallbackImages[ev.category] ||
                fallbackImages.FASHION,
              category:
                ev.category.charAt(0) + ev.category.slice(1).toLowerCase(),
              title: ev.title,
              date: new Date(ev.startAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
              location: ev.venue
                ? `${ev.venue.name}, ${ev.venue.city}`
                : "Venue TBA",
              price:
                minPrice !== null
                  ? `From ₹${minPrice.toLocaleString("en-IN")}`
                  : "Coming Soon",
              description: ev.shortDescription || ev.description.slice(0, 120),
            };
          }
        );
        setEvents(mapped);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const locations = [
    "All Locations",
    ...Array.from(new Set(events.map((event) => event.location))),
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        category === "All Events" || event.category === category;

      const matchesSearch =
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase());

      const matchesLocation =
        location === "All Locations" || event.location === location;

      return matchesCategory && matchesSearch && matchesLocation;
    });
  }, [events, category, search, location]);

  return (
    <section id="all-events" className="px-6 py-8 pb-20">
      <div className="container-main">
        {/* SEARCH AND LOCATION */}
        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_240px]">
          <div className="flex items-center border border-white/15 bg-[#111111] px-4 transition focus-within:border-[#D4AF6A]">
            <span className="mr-3 text-lg text-[#D4AF6A]">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events by title or description..."
              aria-label="Search events"
              className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
          </div>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="Filter by location"
            className="h-12 border border-white/15 bg-[#111111] px-4 text-sm text-white outline-none focus:border-[#D4AF6A]"
          >
            {locations.map((item) => (
              <option key={item} value={item} className="bg-[#111111]">
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* CATEGORY FILTERS + COUNT */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`border px-4 py-2 text-[10px] font-semibold uppercase tracking-[2px] transition ${
                  category === item
                    ? "border-[#D4AF6A] bg-[#D4AF6A] text-black"
                    : "border-white/15 text-white/60 hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <p className="text-xs text-white/50">
            Showing{" "}
            <span className="font-semibold text-[#D4AF6A]">
              {filteredEvents.length}
            </span>{" "}
            {filteredEvents.length === 1 ? "event" : "events"}
          </p>
        </div>

        {/* EVENT CARDS */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[400px] animate-pulse border border-white/10 bg-[#111111]"
              />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="border border-white/10 bg-[#111111] px-6 py-14 text-center">
            <p className="font-[var(--font-playfair)] text-2xl text-white">
              No Events Found
            </p>
            <p className="mt-3 text-sm text-white/50">
              Try another search or choose a different category.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory("All Events");
                setSearch("");
                setLocation("All Locations");
              }}
              className="mt-6 border border-[#D4AF6A] px-6 py-3 text-[10px] font-semibold uppercase tracking-[2px] text-[#D4AF6A] transition hover:bg-[#D4AF6A] hover:text-black"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
