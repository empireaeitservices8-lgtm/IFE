import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import EventCard from "@/components/home/EventCard";
import HomeEventPopup, {
  type PopupEvent,
} from "@/components/home/HomeEventPopup";
import NewYearGalaBanner, {
  type NewYearGalaBannerProps,
} from "@/components/home/NewYearGalaBanner";
import NewsletterBox from "@/components/home/NewsletterBox";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { listEvents } from "@/services/event.service";

export const dynamic = "force-dynamic";

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
  {
    number: "01",
    title: "Fashion Shows",
    description: "Experience creativity, elegance and global fashion.",
    image: "/images/category-fashion-shows.jpg",
    href: "/fashion-shows",
  },
  {
    number: "02",
    title: "Entertainment",
    description: "Unforgettable performances and live experiences.",
    image: "/images/category-entertainment.jpg",
    href: "/entertainment",
  },
  {
    number: "03",
    title: "Award Shows",
    description: "Celebrate excellence and extraordinary talent.",
    image: "/images/new-year-gala-bg.jpg",
    href: "/events",
  },
];

type FeaturedEventItem = {
  href: string;
  image: string;
  category: string;
  title: string;
  date: string;
  location: string;
  price: string;
};

export default async function Home() {
  let featuredEvents: FeaturedEventItem[] = [];
  let popupEvent: PopupEvent | null = null;
  let galaBanner: NewYearGalaBannerProps | null = null;

  try {
    const result = await listEvents({ limit: 12, includeUnpublished: false });
    if (result.items.length > 0) {
      const galaSource =
        result.items.find((ev) => ev.isBannerFeatured) ??
        result.items.find((ev) =>
          ev.title.toLowerCase().includes("goodbye gala")
        ) ??
        result.items.find((ev) => ev.title.toLowerCase().includes("new year")) ??
        null;

      if (galaSource) {
        const galaMinPrice = galaSource.ticketTypes?.length
          ? Math.min(...galaSource.ticketTypes.map((t) => Number(t.price)))
          : null;
        galaBanner = {
          id: galaSource.id,
          title: galaSource.title,
          description:
            galaSource.shortDescription ||
            galaSource.description.slice(0, 170),
          image:
            galaSource.bannerUrl ||
            fallbackImages[galaSource.category] ||
            fallbackImages.AWARDS,
          date: new Date(galaSource.startAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          venue: galaSource.venue
            ? `${galaSource.venue.name}, ${galaSource.venue.city}`
            : "Venue to be announced",
          price:
            galaMinPrice !== null
              ? `Passes from ₹${galaMinPrice.toLocaleString("en-IN")}`
              : "Tickets TBA",
        };
      }

      const first =
        result.items.find((ev) => ev.isPopupFeatured) ?? result.items[0];
      const firstMinPrice = first.ticketTypes?.length
        ? Math.min(...first.ticketTypes.map((t) => Number(t.price)))
        : null;
      popupEvent = {
        id: first.id,
        title: first.title,
        category:
          first.category.charAt(0) + first.category.slice(1).toLowerCase(),
        description:
          first.shortDescription || first.description.slice(0, 130),
        image:
          first.bannerUrl ||
          fallbackImages[first.category] ||
          fallbackImages.FASHION,
        date: new Date(first.startAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        venue: first.venue
          ? `${first.venue.name}, ${first.venue.city}`
          : "Venue to be announced",
        price:
          firstMinPrice !== null
            ? `Passes from ₹${firstMinPrice.toLocaleString("en-IN")}`
            : "Passes Available",
      };

      featuredEvents = result.items.slice(0, 3).map((ev) => {
        const minPrice = ev.ticketTypes?.length
          ? Math.min(...ev.ticketTypes.map((t) => Number(t.price)))
          : null;
        return {
          href: `/events/${ev.id}`,
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
              : "Tickets TBA",
        };
      });
    }
  } catch {
    featuredEvents = [];
  }

  return (
    <>
      <Header />
      <HomeEventPopup initialEvent={popupEvent} />

      <main>
        {/* HERO */}
        <Hero />

        {/* NEW YEAR GALA BANNER */}
        {galaBanner && <NewYearGalaBanner {...galaBanner} />}

        {/* INTRO */}
        <section className="section-padding border-t border-white/10 bg-[#080808]">
          <ScrollReveal className="container-main grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Welcome to IFE"
                title="Creating Moments Beyond Imagination"
                description="IFE brings together fashion, entertainment and extraordinary experiences to create memorable events that inspire audiences and celebrate creativity."
              />

              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-2.5 rounded-lg border border-[#D4AF6A]/50 bg-[#D4AF6A]/10 px-6 py-3 text-xs font-semibold uppercase tracking-[2px] text-[#D4AF6A] transition hover:bg-[#D4AF6A] hover:text-black"
              >
                Discover Our Story
                <FiArrowRight size={15} />
              </Link>

              <div className="mt-7 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                <div className="rounded-lg border border-white/10 bg-[#101010] p-3">
                  <p className="font-[var(--font-playfair)] text-lg text-[#D4AF6A]">
                    Runway
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/55">
                    Global Couture
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#101010] p-3">
                  <p className="font-[var(--font-playfair)] text-lg text-[#D4AF6A]">
                    Live Stage
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/55">
                    Curated Artists
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#101010] p-3">
                  <p className="font-[var(--font-playfair)] text-lg text-[#D4AF6A]">
                    QR Pass
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/55">
                    Instant Entry
                  </p>
                </div>
              </div>
            </div>

            <div className="relative h-[340px] overflow-hidden rounded-xl border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1200"
                alt="Fashion runway experience"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15" />
              <div className="absolute bottom-5 left-5 rounded-lg border border-white/10 bg-black/80 px-5 py-4 backdrop-blur-md">
                <p className="font-[var(--font-playfair)] text-2xl italic text-[#D4AF6A]">
                  Beyond Ordinary
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[3px] text-white/60">
                  The IFE Experience
                </p>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* EVENTS */}
        <section className="section-padding border-t border-white/10 bg-[#050505]">
          <div className="container-main">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <SectionHeading
                eyebrow="Discover What's Next"
                title="Featured Events"
                description="Explore experiences designed to inspire, entertain and bring people together."
              />

              <Link
                href="/events"
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-xs font-semibold uppercase tracking-[2px] text-[#D4AF6A] transition hover:border-[#D4AF6A] hover:bg-[#D4AF6A] hover:text-black"
              >
                View All Events
                <FiArrowUpRight size={16} />
              </Link>
            </div>

            {featuredEvents.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {featuredEvents.map((event, idx) => (
                  <ScrollReveal key={event.title} index={idx}>
                    <EventCard {...event} />
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-[#101010] p-8 text-center">
                <p className="font-[var(--font-playfair)] text-2xl text-white">
                  Upcoming Events Coming Soon
                </p>
                <p className="mt-2 text-sm text-white/55">
                  New experiences are being curated. Check back soon or reach
                  out to our team.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="section-padding border-t border-white/10 bg-[#101010]">
          <div className="container-main">
            <div className="mb-8 text-center">
              <SectionHeading
                eyebrow="Explore IFE"
                title="Discover Our Experiences"
                description="From the runway to the stage, discover the experiences that make every moment extraordinary."
                centered
              />
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {categories.map((category, idx) => (
                <ScrollReveal key={category.number} index={idx}>
                  <Link
                    href={category.href}
                    className="group relative block h-[300px] overflow-hidden rounded-xl border border-white/10 transition hover:-translate-y-1 hover:border-[#D4AF6A]/60"
                  >
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />

                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="mb-1.5 text-xs tracking-[3px] text-[#D4AF6A]">
                        {category.number}
                      </p>

                      <h3 className="font-[var(--font-playfair)] text-2xl text-white transition group-hover:text-[#D4AF6A]">
                        {category.title}
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-white/65">
                        {category.description}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[2px] text-[#D4AF6A]">
                        Explore More
                        <FiArrowUpRight size={15} />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE BANNER */}
        <section
          className="relative overflow-hidden border-t border-white/10 bg-cover bg-center px-6 py-16"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.8) 55%, rgba(5,5,5,0.6) 100%), url('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=85&w=1800')",
          }}
        >
          <div className="container-main relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-8 bg-[#D4AF6A]" />
                <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                  More Than Just Events
                </p>
              </div>

              <h2 className="font-[var(--font-playfair)] text-3xl leading-tight text-white md:text-5xl">
                Experience The{" "}
                <span className="italic text-[#D4AF6A]">Extraordinary.</span>
              </h2>

              <p className="mt-3 max-w-xl text-xs leading-6 text-white/70 sm:text-sm">
                Be part of unforgettable moments. Discover new experiences and
                explore the world of IFE.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF6A] px-7 py-3.5 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
              >
                Explore Events
                <FiArrowRight size={15} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-black/40 px-7 py-3.5 text-xs font-semibold uppercase tracking-[2px] text-white backdrop-blur-sm transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
              >
                Contact Concierge
              </Link>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="border-t border-white/10 bg-[#0B0B0B] px-6 py-12">
          <div className="container-main grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                Stay Connected
              </p>
              <h2 className="mt-2 font-[var(--font-playfair)] text-3xl text-white md:text-4xl">
                Be The First To Know
              </h2>
              <p className="mt-2 max-w-md text-xs leading-6 text-white/60 sm:text-sm">
                Stay updated with upcoming events, exclusive announcements, and
                VIP pass releases from IFE.
              </p>
            </div>

            <NewsletterBox />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
