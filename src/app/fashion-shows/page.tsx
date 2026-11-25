import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiCalendar,
  FiCamera,
  FiLayers,
  FiMapPin,
  FiScissors,
  FiStar,
} from "react-icons/fi";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { listEvents } from "@/services/event.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fashion Shows | IFE",
  description:
    "Explore upcoming runway showcases, couture presentations, and exclusive fashion events by International Fashion Entertainment.",
};

const runwayExperiences = [
  {
    number: "01",
    title: "Couture Runways",
    description:
      "International designers presenting seasonal collections on bespoke IFE runways.",
    icon: FiScissors,
  },
  {
    number: "02",
    title: "Designer Collections",
    description:
      "Curated showcases spotlighting emerging and established creative houses.",
    icon: FiLayers,
  },
  {
    number: "03",
    title: "Editorial & Press",
    description:
      "Dedicated media pit, backstage photography, and red-carpet coverage.",
    icon: FiCamera,
  },
  {
    number: "04",
    title: "VIP Front Row",
    description:
      "Priority entry, reserved front-row seating, and private lounge hospitality.",
    icon: FiStar,
  },
];

const FALLBACK_FASHION_IMAGE =
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=85&w=1400";

export default async function FashionShowsPage() {
  let fashionEvents: Awaited<ReturnType<typeof listEvents>>["items"] = [];
  try {
    const result = await listEvents({
      category: "FASHION",
      limit: 12,
      includeUnpublished: false,
    });
    fashionEvents = result.items;
  } catch {
    fashionEvents = [];
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#050505] text-white">
        {/* Compact Hero */}
        <section className="relative flex min-h-[340px] items-end overflow-hidden border-b border-white/10">
          <Image
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=2000"
            alt="IFE Fashion Shows Runway"
            fill
            priority
            unoptimized
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />

          <div className="container-main relative z-10 pb-8 pt-28">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-10 bg-[#D4AF6A]" />
              <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                International Fashion Entertainment
              </p>
            </div>

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <h1 className="font-[var(--font-playfair)] text-4xl leading-tight md:text-5xl">
                  Runway &amp;{" "}
                  <span className="italic text-[#D4AF6A]">Fashion Shows.</span>
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
                  Experience signature couture showcases, contemporary designer
                  presentations, and front-row hospitality with IFE.
                </p>
              </div>

              <Link
                href="/events"
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#D4AF6A] px-6 py-3 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
              >
                Explore All Events
                <FiArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* Live Fashion Events */}
        <section className="container-main py-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#D4AF6A]">
                Live Lineup
              </p>
              <h2 className="mt-1 font-[var(--font-playfair)] text-2xl md:text-3xl">
                Upcoming Fashion Showcases
              </h2>
            </div>

            <span className="text-xs text-white/50">
              {fashionEvents.length}{" "}
              {fashionEvents.length === 1 ? "showcase" : "showcases"} available
            </span>
          </div>

          {fashionEvents.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {fashionEvents.map((ev, idx) => {
                const dateLabel = new Date(ev.startAt).toLocaleDateString(
                  "en-IN",
                  { day: "2-digit", month: "short", year: "numeric" }
                );
                const venueLabel = ev.venue
                  ? `${ev.venue.name}, ${ev.venue.city}`
                  : "Venue TBA";

                return (
                  <ScrollReveal key={ev.id} index={idx % 6}>
                    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-lg shadow-black/40 transition duration-300 hover:-translate-y-1 hover:border-[#D4AF6A]/60">
                    <Link
                      href={`/events/${ev.id}`}
                      className="relative block h-[175px] shrink-0 overflow-hidden"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                        style={{
                          backgroundImage: `url('${ev.bannerUrl || FALLBACK_FASHION_IMAGE}')`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/30 to-black/20" />
                      <span className="absolute left-3 top-3 rounded-full border border-[#D4AF6A]/50 bg-black/75 px-3 py-0.5 text-[9px] font-semibold uppercase tracking-[2px] text-[#D4AF6A] backdrop-blur-md">
                        Fashion
                      </span>
                      <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm transition group-hover:border-[#D4AF6A] group-hover:bg-[#D4AF6A] group-hover:text-black">
                        <FiArrowUpRight size={15} />
                      </span>
                    </Link>

                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <h3 className="font-[var(--font-playfair)] text-lg leading-snug text-white transition group-hover:text-[#D4AF6A]">
                          <Link href={`/events/${ev.id}`}>{ev.title}</Link>
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-[11px] leading-4 text-white/60">
                          {ev.shortDescription || ev.description.slice(0, 110)}
                        </p>
                        <div className="mt-3 space-y-1.5 text-[11px] text-white/65">
                          <p className="flex items-center gap-2">
                            <FiCalendar
                              size={13}
                              className="shrink-0 text-[#D4AF6A]"
                            />
                            <span>{dateLabel}</span>
                          </p>
                          <p className="flex items-center gap-2 truncate">
                            <FiMapPin
                              size={13}
                              className="shrink-0 text-[#D4AF6A]"
                            />
                            <span className="truncate">{venueLabel}</span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                        <div>
                          <p className="text-[9px] uppercase tracking-[2px] text-white/40">
                            Passes
                          </p>
                          <p className="text-xs font-semibold text-[#D4AF6A]">
                            From ₹1,499
                          </p>
                        </div>

                        <Link
                          href={`/events/${ev.id}/tickets`}
                          className="inline-flex items-center gap-1 rounded-md bg-[#D4AF6A] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-black transition hover:bg-[#F5E5B5]"
                        >
                          Book Tickets
                          <FiArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </article>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-[#101010] p-8 text-center">
              <p className="font-[var(--font-playfair)] text-2xl text-white">
                New Runway Dates Coming Soon
              </p>
              <p className="mt-2 text-sm text-white/55">
                Explore all upcoming IFE experiences or contact our concierge
                for designer and VIP enquiries.
              </p>
              <Link
                href="/events"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#D4AF6A] px-6 py-3 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
              >
                Browse All Events
                <FiArrowRight size={14} />
              </Link>
            </div>
          )}
        </section>

        {/* Runway Pillars */}
        <section className="border-t border-white/10 bg-[#080808] py-10">
          <div className="container-main">
            <div className="mb-6">
              <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#D4AF6A]">
                The Runway Experience
              </p>
              <h2 className="mt-1 font-[var(--font-playfair)] text-2xl md:text-3xl">
                Curated for Fashion &amp; Creativity
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {runwayExperiences.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal key={item.number} index={idx}>
                    <div className="h-full rounded-xl border border-white/10 bg-[#101010] p-5 transition hover:border-[#D4AF6A]/50">
                      <div className="flex items-center justify-between">
                        <div className="flex size-9 items-center justify-center rounded-lg border border-[#D4AF6A]/40 bg-black/60 text-[#D4AF6A]">
                          <Icon size={16} />
                        </div>
                        <span className="font-[var(--font-playfair)] text-sm italic text-[#D4AF6A]">
                          {item.number}
                        </span>
                      </div>
                      <h3 className="mt-4 font-[var(--font-playfair)] text-lg text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-5 text-white/60">
                        {item.description}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

