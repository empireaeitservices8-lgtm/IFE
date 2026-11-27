import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiClock,
  FiMapPin,
  FiTag,
} from "react-icons/fi";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getEventByIdOrSlug } from "@/services/event.service";

export const dynamic = "force-dynamic";

type QuickPassView = {
  id: string;
  name: string;
  price: string;
  tag: string;
  availableQuantity: number;
};

type EventView = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: string;
  isComingSoon: boolean;
  image: string;
  description: string;
  fullDescription: string;
  highlights: string[];
  rules: string[];
  schedule: { time: string; title: string }[];
  quickPasses: QuickPassView[];
};

const fallbackImages: Record<string, string> = {
  FASHION:
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=85&w=1800",
  ENTERTAINMENT:
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=85&w=1800",
  AWARDS:
    "https://images.unsplash.com/photo-1503095396549-807759245b35?q=85&w=1800",
  CONCERT:
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=85&w=1800",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getEvent(id: string): Promise<EventView | undefined> {
  try {
    const dbEvent = await getEventByIdOrSlug(id, false);
    const liveTickets = dbEvent.ticketTypes || [];
    const minPrice = liveTickets.length
      ? Math.min(...liveTickets.map((t) => Number(t.price)))
      : null;

    return {
      id: dbEvent.id,
      title: dbEvent.title,
      category:
        dbEvent.category.charAt(0) + dbEvent.category.slice(1).toLowerCase(),
      date: new Date(dbEvent.startAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: `${new Date(dbEvent.startAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })} – ${new Date(dbEvent.endAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      location: dbEvent.venue
        ? `${dbEvent.venue.name}, ${dbEvent.venue.city}`
        : "Venue to be announced",
      price: dbEvent.isComingSoon
        ? "Coming Soon"
        : minPrice !== null
          ? `From ₹${minPrice.toLocaleString("en-IN")}`
          : "Tickets TBA",
      isComingSoon: Boolean(dbEvent.isComingSoon),
      image:
        dbEvent.bannerUrl ||
        fallbackImages[dbEvent.category] ||
        fallbackImages.FASHION,
      description:
        dbEvent.shortDescription || dbEvent.description.slice(0, 160),
      fullDescription: dbEvent.description,
      highlights: dbEvent.highlights
        ? dbEvent.highlights
            .split(/\r?\n/)
            .map((line) => line.replace(/^[-*•\s]+/, "").trim())
            .filter(Boolean)
        : [
            "Curated international showcase",
            "Reserved seating & VIP hospitality",
            "Official digital ticket with QR verification",
            "Exclusive IFE experience",
          ],
      rules: dbEvent.rules
        ? dbEvent.rules
            .split(/\r?\n/)
            .map((line) => line.replace(/^\d+[.)]\s*/, "").trim())
            .filter(Boolean)
        : [],
      schedule: [
        { time: "Doors Open", title: "Guest Registration & Red Carpet" },
        { time: "Main Showcase", title: dbEvent.title },
        { time: "Closing", title: "Networking & Finale" },
      ],
      quickPasses: liveTickets.map((t) => ({
        id: t.id,
        name: t.name,
        price: `₹${Number(t.price).toLocaleString("en-IN")}`,
        tag:
          t.availableQuantity > 0
            ? `${t.availableQuantity} left`
            : "Sold Out",
        availableQuantity: t.availableQuantity,
      })),
    };
  } catch {
    return undefined;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return { title: "Event Not Found | IFE" };
  }

  return {
    title: `${event.title} | IFE`,
    description: event.description,
  };
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#050505] pb-20 text-white lg:pb-0">
        {/* SLIM EVENT HERO */}
        <section
          className="relative border-b border-white/10 bg-cover bg-center pb-6 pt-24 sm:pb-8"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(5,5,5,0.95), rgba(5,5,5,0.7)), linear-gradient(0deg, #050505, transparent 80%), url('${event.image}')`,
          }}
        >
          <div className="container-main relative z-10">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-white/55 sm:mb-4">
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 transition hover:text-[#D4AF6A]"
              >
                <FiArrowLeft size={13} />
                All Events
              </Link>
              <span>/</span>
              <span className="text-[#D4AF6A]">{event.category}</span>
            </div>

            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end lg:gap-6">
              <div className="max-w-3xl">
                <h1 className="font-[var(--font-playfair)] text-2xl leading-tight sm:text-4xl md:text-5xl">
                  {event.title}
                  <span className="text-[#D4AF6A]">.</span>
                </h1>

                <p className="mt-2.5 text-xs leading-5 text-white/75 sm:mt-3 sm:text-sm sm:leading-6 md:text-base">
                  {event.description}
                </p>

                {/* Inline Key Info */}
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-white/80 sm:mt-5 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2.5">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2">
                    <FiCalendar size={14} className="shrink-0 text-[#D4AF6A]" />
                    <span className="truncate">{event.date}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 sm:gap-2">
                    <FiClock size={14} className="shrink-0 text-[#D4AF6A]" />
                    <span className="truncate">{event.time}</span>
                  </span>
                  <span className="col-span-2 inline-flex items-center gap-1.5 sm:col-span-1 sm:gap-2">
                    <FiMapPin size={14} className="shrink-0 text-[#D4AF6A]" />
                    <span className="truncate">{event.location}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[#D4AF6A] sm:gap-2">
                    <FiTag size={14} className="shrink-0" />
                    {event.price}
                  </span>
                </div>
              </div>

              <div className="hidden shrink-0 flex-wrap gap-3 sm:flex">
                {event.isComingSoon ? (
                  <span className="inline-flex items-center gap-2 rounded-lg border border-[#D4AF6A]/45 bg-[#D4AF6A]/15 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-[#F5E5B5]">
                    Coming Soon
                  </span>
                ) : (
                  <Link
                    href={`/events/${event.id}/tickets`}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF6A] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-black transition hover:bg-[#F5E5B5]"
                  >
                    Book Tickets
                    <FiArrowRight size={15} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT + QUICK PASS SIDEBAR */}
        <section className="py-6 sm:px-6 sm:py-10">
          <div className="container-main grid items-start gap-6 lg:grid-cols-[1fr_360px] lg:gap-8">
            {/* LEFT COLUMN: DETAILS, HIGHLIGHTS & SCHEDULE */}
            <div className="space-y-5 sm:space-y-8">
              <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-4 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#D4AF6A]">
                  About This Event
                </p>
                <p className="mt-2.5 text-xs leading-6 text-white/75 sm:mt-3 sm:text-sm sm:leading-7 md:text-base">
                  {event.fullDescription}
                </p>
              </div>

              <div>
                <h2 className="font-[var(--font-playfair)] text-xl sm:text-2xl">
                  What&apos;s Included
                </h2>
                <div className="mt-3 grid gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3">
                  {event.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-[#0d0d0d] px-3.5 py-2.5 sm:gap-3 sm:p-4"
                    >
                      <FiCheck
                        size={15}
                        className="shrink-0 text-[#D4AF6A]"
                      />
                      <p className="text-xs text-white/85 sm:text-sm">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-[var(--font-playfair)] text-xl sm:text-2xl">
                  Event Schedule
                </h2>
                <div className="mt-3 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d] sm:mt-4">
                  {event.schedule.map((item, index) => (
                    <div
                      key={item.title}
                      className="flex items-center gap-4 px-4 py-3 sm:gap-5 sm:px-5 sm:py-4"
                    >
                      <span className="font-[var(--font-playfair)] text-base italic text-[#D4AF6A] sm:text-lg">
                        0{index + 1}
                      </span>
                      <div>
                        <p className="text-[10px] uppercase tracking-[2px] text-white/45 sm:text-[11px]">
                          {item.time}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-white sm:text-sm">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {event.rules.length > 0 && (
                <details className="group overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4">
                    <div>
                      <h2 className="font-[var(--font-playfair)] text-lg text-white sm:text-2xl">
                        Event Rules &amp; Guidelines
                      </h2>
                      <p className="mt-0.5 text-[11px] text-white/50">
                        {event.rules.length} important venue &amp; entry rules
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-[#D4AF6A]/40 bg-[#D4AF6A]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#D4AF6A]">
                      <span className="group-open:hidden">View Rules</span>
                      <span className="hidden group-open:inline">Hide</span>
                    </span>
                  </summary>
                  <ol className="divide-y divide-white/10 border-t border-white/10">
                    {event.rules.map((rule, index) => (
                      <li
                        key={`${index}-${rule.slice(0, 24)}`}
                        className="flex items-start gap-3 px-4 py-2.5 sm:gap-4 sm:px-5 sm:py-3.5"
                      >
                        <span className="mt-0.5 shrink-0 font-[var(--font-playfair)] text-xs font-semibold text-[#D4AF6A] sm:text-sm">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <p className="text-xs leading-5 text-white/80 sm:text-sm sm:leading-6">
                          {rule}
                        </p>
                      </li>
                    ))}
                  </ol>
                </details>
              )}
            </div>

            {/* RIGHT COLUMN: QUICK PASSES & BOOKING (shown first on mobile) */}
            <aside className="order-first lg:order-none lg:sticky lg:top-24">
              <div className="rounded-xl border border-white/10 bg-[#101010] p-4 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#D4AF6A]">
                  Quick Pass Selection
                </p>
                <h3 className="mt-2 font-[var(--font-playfair)] text-2xl">
                  Choose Your Pass
                </h3>
                <p className="mt-1 text-xs text-white/50">
                  Click a pass to start booking or customize quantity.
                </p>

                <div className="mt-5 space-y-2.5">
                  {event.isComingSoon ? (
                    <p className="rounded-lg border border-[#D4AF6A]/35 bg-[#D4AF6A]/10 px-4 py-3 text-xs leading-5 text-[#F5E5B5]">
                      Tickets for this event are coming soon. Stay tuned for
                      pass availability.
                    </p>
                  ) : event.quickPasses.length === 0 ? (
                    <p className="border border-white/10 bg-[#080808] px-4 py-3 text-xs text-white/50">
                      Ticket tiers will be announced soon.
                    </p>
                  ) : (
                    event.quickPasses.map((pass) =>
                      pass.availableQuantity > 0 ? (
                        <Link
                          key={pass.id}
                          href={`/events/${event.id}/attendee-details?ticket=${pass.id}&quantity=1`}
                          className="flex items-center justify-between border border-white/10 bg-[#080808] px-4 py-3 transition hover:border-[#D4AF6A]"
                        >
                          <div>
                            <p className="text-sm font-medium text-white">
                              {pass.name}
                            </p>
                            <p className="text-[11px] text-white/45">
                              {pass.tag}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-[#D4AF6A]">
                            {pass.price}
                          </span>
                        </Link>
                      ) : (
                        <div
                          key={pass.id}
                          className="flex items-center justify-between border border-white/10 bg-[#080808] px-4 py-3 opacity-50"
                        >
                          <div>
                            <p className="text-sm font-medium text-white">
                              {pass.name}
                            </p>
                            <p className="text-[11px] text-red-400">
                              {pass.tag}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-[#D4AF6A]">
                            {pass.price}
                          </span>
                        </div>
                      )
                    )
                  )}
                </div>

                {event.isComingSoon ? (
                  <span className="mt-5 flex w-full items-center justify-center rounded-lg border border-[#D4AF6A]/45 bg-[#D4AF6A]/10 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-[#F5E5B5]">
                    Tickets Coming Soon
                  </span>
                ) : (
                  <Link
                    href={`/events/${event.id}/tickets`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#D4AF6A] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-black transition hover:bg-[#F5E5B5]"
                  >
                    Select Tickets &amp; Quantity
                    <FiArrowRight size={15} />
                  </Link>
                )}
              </div>

              <Link
                href="/events"
                className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-white/15 py-3 text-[11px] font-semibold uppercase tracking-[2px] text-white/60 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
              >
                <FiArrowLeft size={14} />
                Browse More Events
              </Link>
            </aside>
          </div>
        </section>

        {/* Sticky Mobile Bottom Booking Bar */}
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-white/15 bg-[#080808]/95 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div>
            <p className="text-[10px] uppercase tracking-[2px] text-white/50">
              Passes
            </p>
            <p className="text-sm font-semibold text-[#D4AF6A]">{event.price}</p>
          </div>
          {event.isComingSoon ? (
            <span className="inline-flex items-center gap-2 rounded-lg border border-[#D4AF6A]/45 bg-[#D4AF6A]/15 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#F5E5B5]">
              Coming Soon
            </span>
          ) : (
            <Link
              href={`/events/${event.id}/tickets`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF6A] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-black transition hover:bg-[#F5E5B5]"
            >
              Book Tickets
              <FiArrowRight size={14} />
            </Link>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
