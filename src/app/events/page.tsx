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

      <main className="min-h-screen bg-[#050505] text-white">
        <section className="border-b border-white/10 bg-[#080808] px-6 pb-8 pt-28">
          <div className="container-main flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                International Fashion Entertainment
              </p>
              <h1 className="mt-2 font-[var(--font-playfair)] text-3xl leading-tight md:text-5xl">
                Explore <span className="italic text-[#D4AF6A]">Events</span>
              </h1>
            </div>

            <p className="max-w-md text-xs leading-6 text-white/60 md:text-right md:text-sm">
              Browse upcoming fashion showcases, concerts, entertainment nights,
              and awards experiences.
            </p>
          </div>
        </section>

        <EventExplorer />
      </main>

      <Footer />
    </>
  );
}
