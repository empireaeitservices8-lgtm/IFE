
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
  featured: boolean;
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
  "Awards",
];

function EventCard({ event }: { event: ExplorerEvent }) {
  return (
    <article className="group overflow-hidden border border-white/10 bg-[#111111] transition duration-500 hover:-translate-y-1 hover:border-[#D4AF6A]/60">
      <Link
        href={`/events/${event.id}`}
        aria-label={`View ${event.title}`}
        className="relative block h-[280px] overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url('${event.image}')` }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

        <span className="absolute left-5 top-5 bg-[#D4AF6A] px-4 py-2 text-[9px] font-bold uppercase tracking-[2px] text-black">
          {event.category}
        </span>

        <span className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/50 text-xl text-white transition group-hover:border-[#D4AF6A] group-hover:bg-[#D4AF6A] group-hover:text-black">
          ↗
        </span>
      </Link>

      <div className="p-6">
        <h3 className="font-[var(--font-playfair)] text-2xl text-white transition group-hover:text-[#D4AF6A]">
          {event.title}
        </h3>

        <p className="mt-3 min-h-[48px] text-sm leading-6 text-white/50">
          {event.description}
        </p>

        <div className="mt-5 space-y-3 text-xs text-white/50">
          <p>
            <span className="mr-3 text-[#D4AF6A]">◷</span>
            {event.date}
          </p>
          <p>
            <span className="mr-3 text-[#D4AF6A]">⌖</span>
            {event.location}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
          <div>
            <p className="text-[9px] uppercase tracking-[2px] text-white/40">
              Ticket Price
            </p>
            <p className="mt-1 text-sm font-semibold text-[#D4AF6A]">
              {event.price}
            </p>
          </div>

          <Link
            href={`/events/${event.id}`}
            className="text-[10px] font-semibold uppercase tracking-[2px] text-white transition hover:text-[#D4AF6A]"
          >
            Explore Event ↗
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
          (ev: ApiEventItem, idx: number) => {
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
              featured: idx === 0,
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
    <>
      {/* FEATURED EVENT */}
      <section className="px-6 pb-20 pt-20">
        <div className="container-main">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-[#D4AF6A]" />
            <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
              Featured Experience
            </p>
          </div>

          <div className="relative min-h-[480px] overflow-hidden border border-white/10">
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-700 hover:scale-[1.02]"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1800')",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/10" />

            <div className="relative z-10 flex min-h-[480px] max-w-2xl flex-col justify-center p-8 md:p-16">
              <span className="mb-6 w-fit border border-[#D4AF6A]/60 px-4 py-2 text-[9px] font-semibold uppercase tracking-[3px] text-[#D4AF6A]">
                IFE Featured
              </span>

              <h2 className="font-[var(--font-playfair)] text-4xl leading-tight md:text-6xl">
                A World of
                <br />
                <span className="italic text-[#D4AF6A]">
                  Extraordinary Experiences.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-white/65">
                Discover fashion, entertainment and special experiences
                curated by International Fashion Entertainment.
              </p>

              <Link
                href="#all-events"
                className="mt-9 w-fit bg-[#D4AF6A] px-8 py-4 text-[10px] font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
              >
                Discover Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS FILTER AND LIST */}
      <section id="all-events" className="px-6 pb-28">
        <div className="container-main">
          <div className="mb-12">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#D4AF6A]" />
              <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                Discover IFE
              </p>
            </div>

            <h2 className="font-[var(--font-playfair)] text-4xl md:text-6xl">
              Explore All <span className="italic text-[#D4AF6A]">Events.</span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/50">
              Find experiences that inspire you. Explore our event categories
              and discover what&apos;s coming next.
            </p>
          </div>

          {/* SEARCH AND LOCATION */}
          <div className="mb-8 grid gap-4 md:grid-cols-[1fr_260px]">
            <div className="flex items-center border border-white/15 bg-[#111111] px-5 transition focus-within:border-[#D4AF6A]">
              <span className="mr-4 text-xl text-[#D4AF6A]">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events..."
                aria-label="Search events"
                className="h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </div>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Filter by location"
              className="h-14 border border-white/15 bg-[#111111] px-5 text-sm text-white outline-none focus:border-[#D4AF6A]"
            >
              {locations.map((item) => (
                <option key={item} value={item} className="bg-[#111111]">
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* CATEGORY FILTERS */}
          <div className="mb-10 flex flex-wrap gap-3">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`border px-6 py-3 text-[10px] font-semibold uppercase tracking-[2px] transition ${
                  category === item
                    ? "border-[#D4AF6A] bg-[#D4AF6A] text-black"
                    : "border-white/15 text-white/60 hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* RESULT COUNT */}
          <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-5">
            <p className="text-xs text-white/50">
              Showing{" "}
              <span className="font-semibold text-[#D4AF6A]">
                {filteredEvents.length}
              </span>{" "}
              events
            </p>

            <p className="text-[9px] uppercase tracking-[2px] text-white/35">
              Explore experiences
            </p>
          </div>

          {/* EVENT CARDS */}
          {filteredEvents.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="border border-white/10 bg-[#111111] px-6 py-20 text-center">
              <p className="font-[var(--font-playfair)] text-3xl text-white">
                No Events Found
              </p>
              <p className="mt-4 text-sm text-white/50">
                Try another search or choose a different category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategory("All Events");
                  setSearch("");
                  setLocation("All Locations");
                }}
                className="mt-7 border border-[#D4AF6A] px-7 py-3 text-[10px] font-semibold uppercase tracking-[2px] text-[#D4AF6A] transition hover:bg-[#D4AF6A] hover:text-black"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* DISCOVERY CTA */}
      <section className="border-y border-white/10 bg-[#101010] px-6 py-20">
        <div className="container-main flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
              Stay Connected
            </p>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl">
              Something Extraordinary Awaits.
            </h2>
            <p className="mt-4 text-sm text-white/50">
              Follow the IFE journey and discover future experiences.
            </p>
          </div>

          <Link
            href="/contact"
            className="shrink-0 border border-[#D4AF6A] px-8 py-4 text-[10px] font-semibold uppercase tracking-[2px] text-[#D4AF6A] transition hover:bg-[#D4AF6A] hover:text-black"
          >
            Contact IFE ↗
          </Link>
        </div>
      </section>
    </>
  );
}
