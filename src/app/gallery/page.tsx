import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GalleryShowcase from "@/components/gallery/GalleryShowcase";

export const metadata: Metadata = {
  title: "Gallery | IFE",
  description:
    "Explore captured moments from International Fashion Entertainment runway shows, live performances, and award ceremonies.",
};

export default function GalleryPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
        {/* Editorial Hero */}
        <section
          className="relative flex min-h-[260px] items-end border-b border-white/10 bg-cover bg-center sm:min-h-[320px]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.75) 55%, rgba(5,5,5,0.4) 100%), linear-gradient(0deg, #050505, transparent 70%), url('/images/category-fashion-shows.jpg')",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,106,0.16),transparent_60%)]" />

          <div className="container-main relative z-10 pb-7 pt-24 sm:pb-10 sm:pt-28">
            <div className="mb-3 flex items-center gap-3 sm:mb-4">
              <span className="h-px w-10 bg-[#D4AF6A]" />
              <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                IFE Archives &amp; Highlights
              </p>
            </div>

            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <h1 className="font-[var(--font-playfair)] text-3xl leading-[1.08] sm:text-5xl">
                  The IFE{" "}
                  <span className="italic text-[#D4AF6A]">Visual Gallery.</span>
                </h1>
                <p className="mt-3 max-w-xl text-xs leading-6 text-white/70 sm:text-sm">
                  Crowned moments, couture runways, cultural showcases, and
                  celebration nights across International Fashion Entertainment.
                </p>
              </div>

              <Link
                href="/events"
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#D4AF6A]/45 bg-[#D4AF6A]/10 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[2px] text-[#F5E5B5] backdrop-blur-sm transition hover:bg-[#D4AF6A] hover:text-black"
              >
                Upcoming Events
                <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <GalleryShowcase />

        {/* Bottom CTA */}
        <section className="border-t border-white/10 bg-[#080808] py-8 sm:py-12">
          <div className="container-main">
            <div className="relative overflow-hidden rounded-2xl border border-[#D4AF6A]/25 bg-[radial-gradient(ellipse_at_top,rgba(212,175,106,0.14),#0D0D0D_65%)] px-5 py-8 text-center sm:px-6 sm:py-10">
              <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                Experience It Live
              </p>
              <h2 className="mt-2.5 font-[var(--font-playfair)] text-2xl sm:mt-3 sm:text-4xl">
                Be Part of the Next{" "}
                <span className="italic text-[#D4AF6A]">IFE Showcase.</span>
              </h2>
              <p className="mx-auto mt-2.5 max-w-lg text-xs leading-6 text-white/60 sm:mt-3 sm:text-sm">
                Reserve your seats for upcoming fashion showcases, live concerts,
                and awards galas.
              </p>
              <div className="mt-5 flex flex-col justify-center gap-2.5 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3">
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D4AF6A] px-7 py-3 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5] sm:py-3.5"
                >
                  Explore Events
                  <FiArrowRight size={15} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-7 py-3 text-xs font-bold uppercase tracking-[2px] text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A] sm:py-3.5"
                >
                  Contact Concierge
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
