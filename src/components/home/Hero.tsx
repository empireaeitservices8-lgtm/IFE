"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowDown, FiArrowRight } from "react-icons/fi";

const leftColumnCards = [
  {
    title: "Couture Runways",
    category: "Fashion Shows",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=85&w=900",
    href: "/fashion-shows",
  },
  {
    title: "Neon & UV Nights",
    category: "Trippy Events",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=85&w=900",
    href: "/events",
  },
  {
    title: "Editorial Showcases",
    category: "Fashion Shows",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=900",
    href: "/fashion-shows",
  },
];

const rightColumnCards = [
  {
    title: "Live Concert Arenas",
    category: "Entertainment",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=85&w=900",
    href: "/entertainment",
  },
  {
    title: "Psychedelic Visuals",
    category: "Trippy Events",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=85&w=900",
    href: "/events",
  },
  {
    title: "Stage Productions",
    category: "Entertainment",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=85&w=900",
    href: "/entertainment",
  },
];

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(Math.min(window.scrollY, 700));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const progress = Math.min(1, scrollY / 500);

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden bg-black pb-10 pt-24">
      {/* Parallax Background Image */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center will-change-transform motion-reduce:transform-none"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.78) 52%, rgba(0,0,0,0.45) 100%), url('https://images.unsplash.com/photo-1506157786151-b8491531f063?q=85&w=2000')",
          transform: `translate3d(0, ${scrollY * 0.16}px, 0) scale(${1 + progress * 0.06})`,
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,106,0.16),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />

      <div className="container-main relative z-10 grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
        {/* Left Copy with Scroll Fade & Lift */}
        <div
          className="max-w-2xl will-change-transform motion-reduce:transform-none motion-reduce:opacity-100"
          style={{
            transform: `translate3d(0, ${-scrollY * 0.08}px, 0)`,
            opacity: Math.max(0.25, 1 - progress * 0.65),
          }}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-[#D4AF6A]" />
            <p className="text-[11px] font-semibold uppercase tracking-[5px] text-[#D4AF6A]">
              International Fashion Entertainment
            </p>
          </div>

          <h1 className="font-[var(--font-playfair)] text-4xl leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Where Fashion
            <br />
            Meets{" "}
            <span className="italic text-[#D4AF6A]">Extraordinary.</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/70 md:text-base">
            Discover haute couture fashion shows, live entertainment, and
            immersive trippy night experiences curated by IFE.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href="/events"
              className="group flex items-center gap-3 rounded-lg bg-[#D4AF6A] px-7 py-3.5 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
            >
              Explore Events
              <FiArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/about"
              className="rounded-lg border border-white/30 bg-black/30 px-7 py-3.5 text-xs font-semibold uppercase tracking-[2px] text-white backdrop-blur-sm transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
            >
              Discover IFE
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2.5 text-[10px] uppercase tracking-[2.2px] text-white/65">
            <span className="rounded-full border border-white/15 bg-black/55 px-3.5 py-1.5">
              Fashion Runways
            </span>
            <span className="rounded-full border border-white/15 bg-black/55 px-3.5 py-1.5">
              Live Entertainment
            </span>
            <span className="rounded-full border border-[#D4AF6A]/40 bg-[#D4AF6A]/10 px-3.5 py-1.5 text-[#F5E5B5]">
              Trippy Nights
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: window.innerHeight - 64,
                behavior: "smooth",
              })
            }
            className="mt-8 inline-flex items-center gap-2.5 text-white/55 transition hover:text-[#D4AF6A]"
          >
            <FiArrowDown
              size={15}
              className="animate-bounce text-[#D4AF6A] motion-reduce:animate-none"
            />
            <span className="text-[10px] uppercase tracking-[3px]">
              Scroll to explore
            </span>
          </button>
        </div>

        {/* Right Opposing Scroll-Parallax Visual Showcase */}
        <div className="relative hidden h-[520px] overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
          {/* Top & Bottom Fade Masks */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-black to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[#050505] to-transparent" />

          {/* Left Column (moves up on scroll) */}
          <div
            className="flex flex-col gap-4 will-change-transform motion-reduce:transform-none"
            style={{
              transform: `translate3d(0, ${-scrollY * 0.14}px, 0)`,
            }}
          >
            {leftColumnCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group relative h-44 overflow-hidden rounded-xl border border-white/15 bg-[#101010] transition hover:border-[#D4AF6A]/70"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  unoptimized
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="220px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[2px] text-[#D4AF6A]">
                    {card.category}
                  </p>
                  <p className="mt-0.5 font-[var(--font-playfair)] text-base text-white">
                    {card.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Column (moves down on scroll) */}
          <div
            className="-mt-8 flex flex-col gap-4 will-change-transform motion-reduce:transform-none"
            style={{
              transform: `translate3d(0, ${scrollY * 0.14}px, 0)`,
            }}
          >
            {rightColumnCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group relative h-44 overflow-hidden rounded-xl border border-white/15 bg-[#101010] transition hover:border-[#D4AF6A]/70"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  unoptimized
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="220px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[2px] text-[#D4AF6A]">
                    {card.category}
                  </p>
                  <p className="mt-0.5 font-[var(--font-playfair)] text-base text-white">
                    {card.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Compact Visual Strip */}
      <div className="container-main relative z-10 mt-8 grid grid-cols-3 gap-2.5 lg:hidden">
        {[leftColumnCards[0], rightColumnCards[0], leftColumnCards[1]].map(
          (card) => (
            <Link
              key={card.title}
              href={card.href}
              className="relative h-28 overflow-hidden rounded-lg border border-white/15"
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                unoptimized
                className="object-cover"
                sizes="33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="truncate text-[8px] font-semibold uppercase tracking-wider text-[#D4AF6A]">
                  {card.category}
                </p>
                <p className="truncate text-[11px] font-medium text-white">
                  {card.title}
                </p>
              </div>
            </Link>
          )
        )}
      </div>
    </section>
  );
}
