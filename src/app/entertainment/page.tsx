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
import ScrollReveal from "@/components/ui/ScrollReveal";

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
        <section className="relative flex min-h-[380px] items-end overflow-hidden border-b border-white/10">
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

          <div className="container-main relative z-10 pb-10 pt-28">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-[#D4AF6A]" />
              <p className="text-[10px] font-semibold uppercase tracking-[5px] text-[#D4AF6A]">
                International Fashion Entertainment
              </p>
            </div>

            <h1 className="max-w-4xl font-[var(--font-playfair)] text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
              Where Entertainment{" "}
              <span className="italic text-[#D4AF6A]">Comes Alive.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 md:text-base">
              Discover extraordinary performances, spectacular concerts, and
              unforgettable entertainment experiences with IFE.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF6A] px-7 py-3.5 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
              >
                Explore Events
                <FiArrowRight size={15} />
              </Link>

              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-7 py-3.5 text-xs font-semibold uppercase tracking-[2px] text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </section>

        {/* Entertainment Categories */}
        <section className="border-b border-white/10 bg-[#0B0B0B] py-12">
          <div className="container-main">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px w-8 bg-[#D4AF6A]" />
                  <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                    The IFE Experience
                  </p>
                </div>
                <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl">
                  Our Entertainment{" "}
                  <span className="italic text-[#D4AF6A]">Experiences</span>
                </h2>
              </div>

              <p className="max-w-md text-xs leading-6 text-white/55 sm:text-sm">
                From live music concerts to curated stage productions, explore
                entertainment crafted for unforgettable nights.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {experiences.map((item, idx) => {
                const Icon = item.icon;

                return (
                  <ScrollReveal key={item.title} index={idx}>
                    <article className="group h-full overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-lg shadow-black/40 transition duration-300 hover:-translate-y-1 hover:border-[#D4AF6A]/60">
                      <div className="relative h-44 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/25 to-transparent" />
                        <span className="absolute right-3.5 top-3.5 text-[10px] font-semibold tracking-[3px] text-white/70">
                          {item.number}
                        </span>
                        <div className="absolute bottom-3.5 left-3.5 flex size-9 items-center justify-center rounded-lg border border-[#D4AF6A]/50 bg-black/70 text-[#D4AF6A] backdrop-blur-sm">
                          <Icon size={17} />
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-[var(--font-playfair)] text-lg text-white transition group-hover:text-[#D4AF6A]">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs leading-5 text-white/60">
                          {item.description}
                        </p>
                      </div>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-12">
          <div className="container-main relative overflow-hidden rounded-2xl border border-[#D4AF6A]/25 bg-[radial-gradient(ellipse_at_top,rgba(212,175,106,0.14),#0D0D0D_65%)] px-6 py-10 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
              Be Part of the Experience
            </p>

            <h2 className="mx-auto mt-3 max-w-3xl font-[var(--font-playfair)] text-3xl sm:text-4xl">
              Your Next Unforgettable{" "}
              <span className="italic text-[#D4AF6A]">Moment Awaits.</span>
            </h2>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF6A] px-7 py-3.5 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
              >
                Browse Events
                <FiArrowRight size={15} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-7 py-3.5 text-xs font-semibold uppercase tracking-[2px] text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
