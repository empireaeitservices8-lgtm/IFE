
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import EventCard from "@/components/home/EventCard";
import SectionHeading from "@/components/ui/SectionHeading";

const events = [
  {
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=85&w=1000",
    category: "Fashion",
    title: "The Grand Fashion Night",
    date: "Coming Soon",
    location: "International Venue",
    price: "Coming Soon",
  },
  {
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=85&w=1000",
    category: "Entertainment",
    title: "The Ultimate Live Experience",
    date: "Coming Soon",
    location: "International Venue",
    price: "Coming Soon",
  },
  {
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=85&w=1000",
    category: "Special Event",
    title: "The Celebration Experience",
    date: "Coming Soon",
    location: "International Venue",
    price: "Coming Soon",
  },
];

const categories = [
  {
    number: "01",
    title: "Fashion Shows",
    description: "Experience creativity, elegance and global fashion.",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=85&w=900",
    href: "/fashion-shows",
  },
  {
    number: "02",
    title: "Entertainment",
    description: "Unforgettable performances and live experiences.",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=85&w=900",
    href: "/entertainment",
  },
  {
    number: "03",
    title: "Award Shows",
    description: "Celebrate excellence and extraordinary talent.",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?q=85&w=900",
    href: "/events",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* HERO */}
        <Hero />

        {/* INTRO */}
        <section className="section-padding bg-[#080808]">
          <div className="container-main grid items-center gap-14 lg:grid-cols-2">

            <div>
              <SectionHeading
                eyebrow="Welcome to IFE"
                title="Creating Moments Beyond Imagination"
                description="IFE brings together fashion, entertainment and extraordinary experiences to create memorable events that inspire audiences and celebrate creativity."
              />

              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-3 border-b border-[#D4AF6A] pb-3 text-xs font-semibold uppercase tracking-[2px] text-[#D4AF6A] hover:text-[#F5E5B5]"
              >
                Discover Our Story
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="relative h-[420px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1200"
                alt="Fashion runway experience"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 border border-[#D4AF6A]/30" />
              <div className="absolute bottom-6 left-6 bg-black/80 px-6 py-5 backdrop-blur">
                <p className="font-[var(--font-playfair)] text-2xl italic text-[#D4AF6A]">
                  Beyond Ordinary
                </p>
                <p className="mt-2 text-[9px] uppercase tracking-[3px] text-white/60">
                  The IFE Experience
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* EVENTS */}
        <section className="section-padding bg-[#050505]">
          <div className="container-main">

            <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                eyebrow="Discover What's Next"
                title="Featured Events"
                description="Explore experiences designed to inspire, entertain and bring people together."
              />

              <Link
                href="/events"
                className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[2px] text-[#D4AF6A] hover:text-[#F5E5B5]"
              >
                View All Events
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.title} {...event} />
              ))}
            </div>

          </div>
        </section>

        {/* CATEGORIES */}
        <section className="section-padding bg-[#101010]">
          <div className="container-main">

            <div className="mb-14 text-center">
              <SectionHeading
                eyebrow="Explore IFE"
                title="Discover Our Experiences"
                description="From the runway to the stage, discover the experiences that make every moment extraordinary."
                centered
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {categories.map((category) => (
                <Link
                  href={category.href}
                  key={category.number}
                  className="group relative h-[440px] overflow-hidden"
                >
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/5" />

                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <p className="mb-5 text-xs tracking-[3px] text-[#D4AF6A]">
                      {category.number}
                    </p>

                    <h3 className="font-[var(--font-playfair)] text-3xl text-white">
                      {category.title}
                    </h3>

                    <p className="mt-4 text-sm leading-6 text-white/60">
                      {category.description}
                    </p>

                    <div className="mt-7 flex items-center gap-3 text-xs uppercase tracking-[2px] text-[#D4AF6A]">
                      Explore More
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>

        {/* EXPERIENCE BANNER */}
        <section className="relative overflow-hidden bg-[#080808] py-32">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=85&w=1800')",
            }}
          />

          <div className="absolute inset-0 bg-black/65" />

          <div className="container-main relative z-10 text-center">
            <Sparkles className="mx-auto mb-7 text-[#D4AF6A]" size={30} />

            <p className="mb-6 text-xs uppercase tracking-[5px] text-[#D4AF6A]">
              More Than Just Events
            </p>

            <h2 className="mx-auto max-w-4xl font-[var(--font-playfair)] text-4xl leading-tight text-white md:text-6xl">
              Experience The Extraordinary.
            </h2>

            <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-white/60">
              Be part of unforgettable moments. Discover new experiences
              and explore the world of IFE.
            </p>

            <Link
              href="/events"
              className="mt-10 inline-flex items-center gap-3 bg-[#D4AF6A] px-9 py-4 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
            >
              Explore Events
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="bg-[#111111] py-24">
          <div className="container-main text-center">
            <SectionHeading
              eyebrow="Stay Connected"
              title="Be The First To Know"
              description="Stay updated with upcoming events, exclusive announcements and special experiences from IFE."
              centered
            />

            <form className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="min-w-0 flex-1 border border-white/15 bg-black px-6 py-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#D4AF6A]"
              />

              <button
                type="submit"
                className="bg-[#D4AF6A] px-8 py-4 text-xs font-bold uppercase tracking-[2px] text-black hover:bg-[#F5E5B5]"
              >
                Subscribe
              </button>
            </form>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
