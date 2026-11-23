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

type EventView = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: string;
  image: string;
  description: string;
  fullDescription: string;
  highlights: string[];
  schedule: { time: string; title: string }[];
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

const quickPasses = [
  { id: "single", name: "Single Entry", price: "₹1,499", tag: "1 Guest" },
  { id: "couple", name: "Couple Entry", price: "₹2,699", tag: "2 Guests" },
  { id: "group5", name: "Group of 5", price: "₹6,999", tag: "5 Guests" },
  { id: "vip", name: "VIP Pass", price: "₹3,499", tag: "VIP Lounge" },
];

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getEvent(id: string): Promise<EventView | undefined> {
  try {
    const dbEvent = await getEventByIdOrSlug(id, false);

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
      price: "From ₹1,499",
      image:
        dbEvent.bannerUrl ||
        fallbackImages[dbEvent.category] ||
        fallbackImages.FASHION,
      description:
        dbEvent.shortDescription || dbEvent.description.slice(0, 160),
      fullDescription: dbEvent.description,
      highlights: [
        "Curated international showcase",
        "Reserved seating & VIP hospitality",
        "Official digital ticket with QR verification",
        "Exclusive IFE experience",
      ],
      schedule: [
        { time: "Doors Open", title: "Guest Registration & Red Carpet" },
        { time: "Main Showcase", title: dbEvent.title },
        { time: "Closing", title: "Networking & Finale" },
      ],
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

      <main className="min-h-screen bg-[#050505] text-white">
        {/* SLIM EVENT HERO */}
        <section
          className="relative border-b border-white/10 bg-cover bg-center pb-8 pt-24"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(5,5,5,0.95), rgba(5,5,5,0.7)), linear-gradient(0deg, #050505, transparent 80%), url('${event.image}')`,
          }}
        >
          <div className="container-main relative z-10">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-white/55">
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

            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <h1 className="font-[var(--font-playfair)] text-3xl leading-tight md:text-5xl">
                  {event.title}
                  <span className="text-[#D4AF6A]">.</span>
                </h1>

                <p className="mt-3 text-sm leading-6 text-white/75 md:text-base">
                  {event.description}
                </p>

                {/* Inline Key Info */}
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2.5 text-xs text-white/80">
                  <span className="inline-flex items-center gap-2">
                    <FiCalendar size={14} className="text-[#D4AF6A]" />
                    {event.date}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <FiClock size={14} className="text-[#D4AF6A]" />
                    {event.time}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <FiMapPin size={14} className="text-[#D4AF6A]" />
                    {event.location}
                  </span>
                  <span className="inline-flex items-center gap-2 font-semibold text-[#D4AF6A]">
                    <FiTag size={14} />
                    {event.price}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <Link
                  href={`/events/${event.id}/tickets`}
                  className="inline-flex items-center gap-2 bg-[#D4AF6A] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-black transition hover:bg-[#F5E5B5]"
                >
                  Book Tickets
                  <FiArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT + QUICK PASS SIDEBAR */}
        <section className="px-6 py-10">
          <div className="container-main grid items-start gap-8 lg:grid-cols-[1fr_360px]">
            {/* LEFT COLUMN: DETAILS, HIGHLIGHTS & SCHEDULE */}
            <div className="space-y-8">
              <div className="border border-white/10 bg-[#0d0d0d] p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#D4AF6A]">
                  About This Event
                </p>
                <p className="mt-3 text-sm leading-7 text-white/75 md:text-base">
                  {event.fullDescription}
                </p>
              </div>

              <div>
                <h2 className="font-[var(--font-playfair)] text-2xl">
                  What&apos;s Included
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {event.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-center gap-3 border border-white/10 bg-[#0d0d0d] p-4"
                    >
                      <FiCheck
                        size={16}
                        className="shrink-0 text-[#D4AF6A]"
                      />
                      <p className="text-sm text-white/80">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-[var(--font-playfair)] text-2xl">
                  Event Schedule
                </h2>
                <div className="mt-4 divide-y divide-white/10 border border-white/10 bg-[#0d0d0d]">
                  {event.schedule.map((item, index) => (
                    <div
                      key={item.title}
                      className="flex items-center gap-5 px-5 py-4"
                    >
                      <span className="font-[var(--font-playfair)] text-lg italic text-[#D4AF6A]">
                        0{index + 1}
                      </span>
                      <div>
                        <p className="text-[11px] uppercase tracking-[2px] text-white/45">
                          {item.time}
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-white">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: QUICK PASSES & BOOKING */}
            <aside className="lg:sticky lg:top-24">
              <div className="border border-white/10 bg-[#101010] p-6">
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
                  {quickPasses.map((pass) => (
                    <Link
                      key={pass.id}
                      href={`/events/${event.id}/attendee-details?ticket=${pass.id}&quantity=1`}
                      className="flex items-center justify-between border border-white/10 bg-[#080808] px-4 py-3 transition hover:border-[#D4AF6A]"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">
                          {pass.name}
                        </p>
                        <p className="text-[11px] text-white/45">{pass.tag}</p>
                      </div>
                      <span className="text-sm font-semibold text-[#D4AF6A]">
                        {pass.price}
                      </span>
                    </Link>
                  ))}
                </div>

                <Link
                  href={`/events/${event.id}/tickets`}
                  className="mt-5 flex w-full items-center justify-center gap-2 bg-[#D4AF6A] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-black transition hover:bg-[#F5E5B5]"
                >
                  Select Tickets &amp; Quantity
                  <FiArrowRight size={15} />
                </Link>
              </div>

              <Link
                href="/events"
                className="mt-3 flex items-center justify-center gap-2 border border-white/15 py-3 text-[11px] font-semibold uppercase tracking-[2px] text-white/60 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
              >
                <FiArrowLeft size={14} />
                Browse More Events
              </Link>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
