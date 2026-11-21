
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EventExplorer from "@/components/events/EventExplorer";

export const metadata: Metadata = {
  title: "Explore Events | IFE",
  description:
    "Discover fashion shows, live entertainment and exclusive experiences with International Fashion Entertainment.",
};

export default function EventsPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
        {/* PAGE HERO */}
        <section
          className="relative flex min-h-[540px] items-end bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,0.9), rgba(0,0,0,0.35)), linear-gradient(0deg, #050505, transparent 65%), url('https://images.unsplash.com/photo-1506157786151-b8491531f063?q=85&w=2000')",
          }}
        >
          <div className="container-main relative z-10 pb-16 pt-40">
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-12 bg-[#D4AF6A]" />

              <p className="text-[10px] font-semibold uppercase tracking-[5px] text-[#D4AF6A]">
                International Fashion Entertainment
              </p>
            </div>

            <h1 className="font-[var(--font-playfair)] text-5xl leading-[1.1] md:text-7xl lg:text-8xl">
              Discover
              <br />
              <span className="italic text-[#D4AF6A]">
                Extraordinary Events.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-7 text-white/65 md:text-base">
              Explore fashion, entertainment and exclusive experiences.
              Find your next unforgettable moment with IFE.
            </p>

            <div className="mt-10 flex flex-wrap gap-8 text-[10px] uppercase tracking-[3px] text-white/60">
              <span>Fashion</span>
              <span className="text-[#D4AF6A]">✦</span>
              <span>Entertainment</span>
              <span className="text-[#D4AF6A]">✦</span>
              <span>Awards</span>
            </div>
          </div>
        </section>

        <EventExplorer />
      </main>

      <Footer />
    </>
  );
}
