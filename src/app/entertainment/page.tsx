import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  FiArrowRight,
  FiAward,
  FiMic,
  FiMusic,
  FiStar,
} from "react-icons/fi";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Entertainment | IFE",
  description:
    "Discover extraordinary live concerts, celebrity performances, and unforgettable entertainment experiences with IFE.",
};

const experiences = [
  {
    number: "01",
    title: "Live Concerts",
    description:
      "Experience unforgettable performances from talented artists and musicians on world-class stages.",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1000",
    icon: FiMusic,
  },
  {
    number: "02",
    title: "Celebrity Performances",
    description:
      "Enjoy spectacular appearances, headline showcases, and exclusive celebrity experiences.",
    image:
      "https://images.unsplash.com/photo-1501612780327-45045538702b?w=1000",
    icon: FiStar,
  },
  {
    number: "03",
    title: "Stage Productions",
    description:
      "Discover energetic performances, curated stage productions, and creative live showcases.",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1000",
    icon: FiMic,
  },
  {
    number: "04",
    title: "Special Experiences",
    description:
      "Explore exclusive entertainment experiences, VIP after-parties, and unforgettable celebrations.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000",
    icon: FiAward,
  },
];

export default function EntertainmentPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
        {/* Hero */}
        <section className="relative flex min-h-[640px] items-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=2000"
            alt="Live entertainment event"
            fill
            priority
            unoptimized
            className="object-cover opacity-40"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />

          <div className="container-main relative z-10 pb-20 pt-36">
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-12 bg-[#D4AF6A]" />
              <p className="text-[11px] font-semibold uppercase tracking-[5px] text-[#D4AF6A]">
                International Fashion Entertainment
              </p>
            </div>

            <h1 className="max-w-4xl font-[var(--font-playfair)] text-5xl leading-[1.1] sm:text-6xl lg:text-8xl">
              Where Entertainment
              <span className="block italic text-[#D4AF6A]">
                Comes Alive.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-white/65 md:text-lg">
              Discover extraordinary performances, spectacular concerts, and
              unforgettable entertainment experiences with IFE.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                href="/events"
                className="inline-flex items-center gap-3 bg-[#D4AF6A] px-8 py-4 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
              >
                Explore Events
                <FiArrowRight size={17} />
              </Link>

              <Link
                href="/gallery"
                className="border border-white/30 px-8 py-4 text-xs font-semibold uppercase tracking-[2px] text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="container-main py-24 text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-9 bg-[#D4AF6A]" />
            <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
              The IFE Experience
            </p>
          </div>

          <h2 className="mt-4 font-[var(--font-playfair)] text-4xl leading-tight sm:text-5xl">
            Entertainment Beyond{" "}
            <span className="italic text-[#D4AF6A]">Expectations</span>
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-white/55 md:text-base">
            IFE brings together creativity, talent, and entertainment to create
            memorable experiences. From live music to spectacular productions,
            explore entertainment that inspires audiences worldwide.
          </p>
        </section>

        {/* Entertainment Categories */}
        <section className="border-y border-white/10 bg-[#0B0B0B] py-24">
          <div className="container-main">
            <div className="mb-14">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-9 bg-[#D4AF6A]" />
                <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                  Discover
                </p>
              </div>
              <h2 className="font-[var(--font-playfair)] text-4xl sm:text-5xl">
                Our Entertainment{" "}
                <span className="italic text-[#D4AF6A]">Experiences</span>
              </h2>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {experiences.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="group overflow-hidden border border-white/10 bg-[#111111] transition duration-500 hover:-translate-y-2 hover:border-[#D4AF6A]/50"
                  >
                    <div className="relative h-72 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      <span className="absolute top-4 right-4 text-[10px] font-semibold tracking-[3px] text-white/60">
                        {item.number}
                      </span>
                      <div className="absolute bottom-5 left-5 flex size-11 items-center justify-center border border-[#D4AF6A]/50 bg-black/60 text-[#D4AF6A] backdrop-blur-sm">
                        <Icon size={20} />
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-[var(--font-playfair)] text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-white/55">
                        {item.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container-main py-28 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
            Be Part of the Experience
          </p>

          <h2 className="mx-auto mt-6 max-w-3xl font-[var(--font-playfair)] text-4xl sm:text-6xl">
            Your Next Unforgettable{" "}
            <span className="italic text-[#D4AF6A]">Moment Awaits.</span>
          </h2>

          <Link
            href="/events"
            className="mt-10 inline-flex items-center gap-3 border border-[#D4AF6A] px-8 py-4 text-xs font-bold uppercase tracking-[2px] text-[#D4AF6A] transition hover:bg-[#D4AF6A] hover:text-black"
          >
            Browse Events
            <FiArrowRight size={16} />
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
