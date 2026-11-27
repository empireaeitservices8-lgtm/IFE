"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export type NewYearGalaBannerProps = {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  venue: string;
  price: string;
};

export function NewYearGalaBanner({
  id,
  title,
  description,
  image,
  date,
  venue,
  price,
}: NewYearGalaBannerProps) {
  return (
    <section className="border-t border-white/10 bg-[#050505] py-10 sm:py-12">
      <ScrollReveal className="container-main">
        <div className="relative overflow-hidden rounded-2xl border border-[#D4AF6A]/40 bg-[#080706] shadow-[0_24px_70px_rgba(0,0,0,0.7)]">
          {/* Generated New Year Gala Background */}
          <Image
            src="/images/new-year-gala-bg.jpg"
            alt="New Year Gala celebration background"
            fill
            unoptimized
            className="object-cover object-center opacity-55"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/80 to-[#050505]/50" />

          <div className="relative z-10 grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            {/* Left Content */}
            <div>
              <p className="inline-block rounded-full border border-[#D4AF6A]/45 bg-[#D4AF6A]/10 px-4 py-1 text-[10px] font-semibold uppercase tracking-[2.8px] text-[#F5E5B5] backdrop-blur-sm">
                New Year Eve Showcase
              </p>

              <h2 className="mt-4 font-[var(--font-playfair)] text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
                {title}
                <span className="mt-1 block text-2xl italic text-[#D4AF6A] sm:text-3xl">
                  Celebrate the New Year in Style.
                </span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
                {description}
              </p>

              {/* Event Meta Pills (No Icons) */}
              <div className="mt-5 flex flex-wrap gap-2.5 text-xs text-white/90">
                <span className="rounded-lg border border-white/15 bg-black/55 px-3.5 py-2 backdrop-blur-sm">
                  <span className="mr-1.5 text-[10px] uppercase tracking-wider text-[#D4AF6A]">
                    Date:
                  </span>
                  {date}
                </span>
                <span className="rounded-lg border border-white/15 bg-black/55 px-3.5 py-2 backdrop-blur-sm">
                  <span className="mr-1.5 text-[10px] uppercase tracking-wider text-[#D4AF6A]">
                    Venue:
                  </span>
                  {venue}
                </span>
                <span className="rounded-lg border border-[#D4AF6A]/45 bg-[#D4AF6A]/15 px-3.5 py-2 font-semibold text-[#F5E5B5] backdrop-blur-sm">
                  {price}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/events/${id}/tickets`}
                  className="inline-flex items-center justify-center rounded-lg bg-[#D4AF6A] px-6 py-3.5 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
                >
                  Book Gala Passes
                </Link>
                <Link
                  href={`/events/${id}`}
                  className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-black/45 px-6 py-3.5 text-xs font-semibold uppercase tracking-[2px] text-white backdrop-blur-sm transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                >
                  View Gala Details
                </Link>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="relative h-64 overflow-hidden rounded-xl border border-white/15 sm:h-72 lg:h-80">
              <Image
                src={image}
                alt={title}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 rounded-lg border border-white/15 bg-black/75 px-4 py-3 backdrop-blur-md">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[2.5px] text-[#D4AF6A]">
                    New Year Edition
                  </p>
                  <p className="mt-0.5 font-[var(--font-playfair)] text-lg text-white">
                    Limited VIP &amp; Couple Passes
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-[#D4AF6A]/50 bg-[#D4AF6A]/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#F5E5B5]">
                  Live Booking
                </span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default NewYearGalaBanner;

