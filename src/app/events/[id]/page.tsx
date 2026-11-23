
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getEventByIdOrSlug } from "@/services/event.service";

export const dynamic = "force-dynamic";

const events = [
  {
    id: "1",
    title: "The IFE Fashion Showcase",
    category: "Fashion",
    date: "Coming Soon",
    time: "To Be Announced",
    location: "Location to be announced",
    price: "Coming Soon",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=85&w=1800",
    description:
      "An inspiring celebration of fashion, design and creative expression.",
    fullDescription:
      "The IFE Fashion Showcase is envisioned as a celebration of creativity, individuality and contemporary fashion. Bringing together designers, models, creative professionals and fashion enthusiasts, this experience aims to showcase unique perspectives and inspiring runway moments.",
    highlights: [
      "Fashion runway presentations",
      "Designer and creative showcases",
      "Fashion and style experiences",
      "Networking opportunities",
    ],
    schedule: [
      { time: "To Be Announced", title: "Guest Registration" },
      { time: "To Be Announced", title: "Opening Ceremony" },
      { time: "To Be Announced", title: "Fashion Showcase" },
      { time: "To Be Announced", title: "Closing Ceremony" },
    ],
  },
  {
    id: "2",
    title: "Live Beyond",
    category: "Entertainment",
    date: "Coming Soon",
    time: "To Be Announced",
    location: "Location to be announced",
    price: "Coming Soon",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=85&w=1800",
    description:
      "A live entertainment experience bringing music and audiences together.",
    fullDescription:
      "Live Beyond is an entertainment experience designed to bring audiences together through music, performances and unforgettable moments. Discover a vibrant atmosphere where creativity and entertainment come alive.",
    highlights: [
      "Live music performances",
      "Entertainment showcases",
      "Audience experiences",
      "Special stage presentations",
    ],
    schedule: [
      { time: "To Be Announced", title: "Guest Registration" },
      { time: "To Be Announced", title: "Opening Performance" },
      { time: "To Be Announced", title: "Live Entertainment" },
      { time: "To Be Announced", title: "Closing Performance" },
    ],
  },
  {
    id: "3",
    title: "Excellence Awards",
    category: "Awards",
    date: "Coming Soon",
    time: "To Be Announced",
    location: "Location to be announced",
    price: "Coming Soon",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?q=85&w=1800",
    description:
      "A celebration recognising creativity, talent and outstanding achievement.",
    fullDescription:
      "The Excellence Awards is envisioned as a prestigious celebration of talent, creativity and achievement. The event aims to recognise individuals and contributions that inspire excellence across creative and entertainment communities.",
    highlights: [
      "Award presentations",
      "Special guest appearances",
      "Celebration of creative talent",
      "Exclusive event experience",
    ],
    schedule: [
      { time: "To Be Announced", title: "Guest Registration" },
      { time: "To Be Announced", title: "Opening Ceremony" },
      { time: "To Be Announced", title: "Award Presentations" },
      { time: "To Be Announced", title: "Closing Ceremony" },
    ],
  },
  {
    id: "4",
    title: "Runway Stories",
    category: "Fashion",
    date: "Coming Soon",
    time: "To Be Announced",
    location: "Location to be announced",
    price: "Coming Soon",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=85&w=1800",
    description:
      "A creative runway experience celebrating style and individuality.",
    fullDescription:
      "Runway Stories celebrates the art of fashion through creative presentations, individual style and contemporary design. It is an opportunity to experience the creativity and expression behind the fashion industry.",
    highlights: [
      "Contemporary fashion presentations",
      "Creative designer showcases",
      "Runway experiences",
      "Fashion community connections",
    ],
    schedule: [
      { time: "To Be Announced", title: "Guest Registration" },
      { time: "To Be Announced", title: "Opening Presentation" },
      { time: "To Be Announced", title: "Runway Showcase" },
      { time: "To Be Announced", title: "Closing Presentation" },
    ],
  },
  {
    id: "5",
    title: "The Grand Celebration",
    category: "Entertainment",
    date: "Coming Soon",
    time: "To Be Announced",
    location: "Location to be announced",
    price: "Coming Soon",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=85&w=1800",
    description:
      "An immersive celebration filled with entertainment and memorable moments.",
    fullDescription:
      "The Grand Celebration is designed as an immersive event experience bringing people together through entertainment, creativity and celebration. Discover an atmosphere created for connection and memorable moments.",
    highlights: [
      "Special entertainment performances",
      "Immersive event atmosphere",
      "Audience engagement",
      "Memorable celebration experiences",
    ],
    schedule: [
      { time: "To Be Announced", title: "Guest Registration" },
      { time: "To Be Announced", title: "Welcome Ceremony" },
      { time: "To Be Announced", title: "Main Celebration" },
      { time: "To Be Announced", title: "Closing Ceremony" },
    ],
  },
  {
    id: "6",
    title: "Creative Icons",
    category: "Awards",
    date: "Coming Soon",
    time: "To Be Announced",
    location: "Location to be announced",
    price: "Coming Soon",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=85&w=1800",
    description:
      "Honouring creative voices and contributions across the entertainment world.",
    fullDescription:
      "Creative Icons is envisioned as a platform celebrating inspiring creative voices and outstanding contributions. The experience brings together talent, creativity and recognition in an elegant event setting.",
    highlights: [
      "Creative recognition",
      "Special presentations",
      "Industry networking",
      "Celebration of talent",
    ],
    schedule: [
      { time: "To Be Announced", title: "Guest Registration" },
      { time: "To Be Announced", title: "Welcome Ceremony" },
      { time: "To Be Announced", title: "Recognition Presentations" },
      { time: "To Be Announced", title: "Closing Ceremony" },
    ],
  },
];

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

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getEvent(id: string): Promise<EventView | undefined> {
  try {
    const dbEvent = await getEventByIdOrSlug(id, false);
    const prices = dbEvent.ticketTypes.map((t) => Number(t.price));
    const minPrice = prices.length > 0 ? Math.min(...prices) : null;

    return {
      id: dbEvent.id,
      title: dbEvent.title,
      category:
        dbEvent.category.charAt(0) + dbEvent.category.slice(1).toLowerCase(),
      date: new Date(dbEvent.startAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
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
      price:
        minPrice !== null
          ? `From ₹${minPrice.toLocaleString("en-IN")}`
          : "Coming Soon",
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

      <main className="min-h-screen overflow-hidden bg-[#050505] text-white">

        {/* COMPACT EVENT HERO */}
        <section
          className="relative flex min-h-[380px] items-end bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.92), rgba(0,0,0,0.45)), linear-gradient(0deg, #050505, transparent 75%), url('${event.image}')`,
          }}
        >
          <div className="container-main relative z-10 pb-10 pt-28">
            <Link
              href="/events"
              className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[2px] text-white/60 transition hover:text-[#D4AF6A]"
            >
              <span>←</span> Back to Events
            </Link>

            <div className="mb-4">
              <span className="border border-[#D4AF6A]/60 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[3px] text-[#D4AF6A]">
                {event.category}
              </span>
            </div>

            <h1 className="max-w-4xl font-[var(--font-playfair)] text-4xl leading-tight md:text-6xl">
              {event.title}
              <span className="text-[#D4AF6A]">.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
              {event.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/events/${event.id}/tickets`}
                className="bg-[#D4AF6A] px-7 py-3.5 text-[10px] font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
              >
                Book Tickets →
              </Link>

              <a
                href="#event-schedule"
                className="border border-white/35 px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[2px] text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
              >
                Event Schedule
              </a>
            </div>
          </div>
        </section>

        {/* EVENT INFORMATION BAR */}
        <section className="border-y border-white/10 bg-[#101010]">
          <div className="container-main grid grid-cols-2 gap-6 py-6 md:grid-cols-4">
            {[
              { label: "Event Date", value: event.date, icon: "◷" },
              { label: "Event Time", value: event.time, icon: "◴" },
              { label: "Venue", value: event.location, icon: "⌖" },
              { label: "Ticket Price", value: event.price, icon: "◇" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] uppercase tracking-[2px] text-white/45">
                  <span className="mr-1.5 text-[#D4AF6A]">{item.icon}</span>
                  {item.label}
                </p>
                <p className="mt-1.5 text-sm font-medium text-white/90">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* MAIN EVENT CONTENT */}
        <section
          id="event-information"
          className="px-6 py-12 md:py-14"
        >
          <div className="container-main grid items-start gap-10 lg:grid-cols-[1fr_340px]">

            {/* LEFT CONTENT */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#D4AF6A]" />
                <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                  About This Experience
                </p>
              </div>

              <h2 className="max-w-2xl font-[var(--font-playfair)] text-3xl leading-tight md:text-4xl">
                Experience Something{" "}
                <span className="italic text-[#D4AF6A]">
                  Extraordinary.
                </span>
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/65 md:text-base">
                {event.fullDescription}
              </p>

              {/* EVENT HIGHLIGHTS */}
              <div className="mt-10">
                <h3 className="font-[var(--font-playfair)] text-2xl">
                  Event Highlights
                </h3>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {event.highlights.map((highlight, index) => (
                    <div
                      key={highlight}
                      className="flex items-center gap-3 border border-white/10 bg-[#111111] p-4"
                    >
                      <span className="font-[var(--font-playfair)] text-lg italic text-[#D4AF6A]">
                        0{index + 1}
                      </span>

                      <p className="text-sm text-white/75">
                        {highlight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SCHEDULE */}
              <div id="event-schedule" className="mt-10">
                <h3 className="font-[var(--font-playfair)] text-2xl">
                  Event Schedule
                </h3>

                <div className="mt-4">
                  {event.schedule.map((item, index) => (
                    <div
                      key={item.title}
                      className="flex gap-5 border-b border-white/10 py-4"
                    >
                      <span className="font-[var(--font-playfair)] text-lg italic text-[#D4AF6A]">
                        0{index + 1}
                      </span>

                      <div>
                        <p className="text-xs uppercase tracking-[2px] text-white/40">
                          {item.time}
                        </p>
                        <h4 className="mt-1 text-base text-white">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="lg:sticky lg:top-24">
              <div className="border border-white/10 bg-[#111111]">
                <div
                  className="h-[190px] bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${event.image}')`,
                  }}
                />

                <div className="p-6">
                  <p className="text-[9px] font-semibold uppercase tracking-[3px] text-[#D4AF6A]">
                    Event Overview
                  </p>

                  <h3 className="mt-2 font-[var(--font-playfair)] text-xl">
                    {event.title}
                  </h3>

                  <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-xs">
                    <div className="flex justify-between gap-4">
                      <span className="text-white/40">Category</span>
                      <span className="text-white/80">{event.category}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-white/40">Date</span>
                      <span className="text-white/80">{event.date}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-white/40">Venue</span>
                      <span className="max-w-[170px] text-right text-white/80">
                        {event.location}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-white/40">Price</span>
                      <span className="font-semibold text-[#D4AF6A]">
                        {event.price}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/events/${event.id}/tickets`}
                    className="mt-6 flex w-full items-center justify-center bg-[#D4AF6A] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#F5E5B5]"
                  >
                    Select Tickets →
                  </Link>
                </div>
              </div>

              <Link
                href="/events"
                className="mt-4 flex items-center justify-center gap-3 border border-white/15 py-3.5 text-[10px] font-semibold uppercase tracking-[2px] text-white/60 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
              >
                ← Browse More Events
              </Link>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
