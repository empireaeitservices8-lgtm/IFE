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
        {/* Hero */}
        <section
          className="relative flex min-h-[300px] items-end border-b border-white/10 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,0.92), rgba(0,0,0,0.45)), linear-gradient(0deg, #050505, transparent 70%), url('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=2000')",
          }}
        >
          <div className="container-main relative z-10 pb-8 pt-28">
            <div className="mb-4 flex items-center gap-4">
              <span className="h-px w-10 bg-[#D4AF6A]" />
              <p className="text-[10px] font-semibold uppercase tracking-[5px] text-[#D4AF6A]">
                Curated Moments
              </p>
            </div>

            <h1 className="font-[var(--font-playfair)] text-4xl leading-[1.1] md:text-5xl">
              The IFE{" "}
              <span className="italic text-[#D4AF6A]">Visual Gallery.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">
              A curated collection of runway highlights, live entertainment
              stages, and unforgettable celebrations from our international
              events.
            </p>
          </div>
        </section>

        <GalleryShowcase />

        {/* Bottom CTA */}
        <section className="border-t border-white/10 bg-[#080808] px-6 py-12">
          <div className="container-main relative overflow-hidden rounded-2xl border border-[#D4AF6A]/25 bg-[radial-gradient(ellipse_at_top,rgba(212,175,106,0.14),#0D0D0D_65%)] px-6 py-10 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
              Experience It Live
            </p>
            <h2 className="mt-3 font-[var(--font-playfair)] text-3xl sm:text-4xl">
              Be Part of the Next{" "}
              <span className="italic text-[#D4AF6A]">IFE Showcase.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-xs leading-6 text-white/60 sm:text-sm">
              Reserve your seats for upcoming fashion showcases, live concerts,
              and awards galas across India.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF6A] px-7 py-3.5 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
              >
                Explore Events
                <FiArrowRight size={15} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-7 py-3.5 text-xs font-bold uppercase tracking-[2px] text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
              >
                Contact Concierge
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

