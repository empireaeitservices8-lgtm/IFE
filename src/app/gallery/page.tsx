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
          className="relative flex min-h-[500px] items-end bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,0.92), rgba(0,0,0,0.45)), linear-gradient(0deg, #050505, transparent 65%), url('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=2000')",
          }}
        >
          <div className="container-main relative z-10 pb-16 pt-40">
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-12 bg-[#D4AF6A]" />
              <p className="text-[10px] font-semibold uppercase tracking-[5px] text-[#D4AF6A]">
                Curated Moments
              </p>
            </div>

            <h1 className="font-[var(--font-playfair)] text-5xl leading-[1.1] md:text-7xl lg:text-8xl">
              The IFE
              <br />
              <span className="italic text-[#D4AF6A]">Visual Gallery.</span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-7 text-white/65 md:text-base">
              A curated collection of runway highlights, live entertainment
              stages, and unforgettable celebrations from our international
              events.
            </p>
          </div>
        </section>

        <GalleryShowcase />

        {/* Bottom CTA */}
        <section className="border-t border-white/10 bg-[#0B0B0B] py-20 text-center">
          <div className="container-main">
            <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
              Experience It Live
            </p>
            <h2 className="mt-4 font-[var(--font-playfair)] text-3xl sm:text-5xl">
              Be Part of the Next{" "}
              <span className="italic text-[#D4AF6A]">IFE Showcase.</span>
            </h2>
            <Link
              href="/events"
              className="mt-8 inline-flex items-center gap-3 bg-[#D4AF6A] px-8 py-4 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
            >
              Explore Events
              <FiArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

