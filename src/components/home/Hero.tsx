
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="relative flex min-h-[780px] items-center overflow-hidden bg-black bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.72) 48%, rgba(0,0,0,0.25) 100%), url('https://images.unsplash.com/photo-1506157786151-b8491531f063?q=85&w=2000')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

      <div className="container-main relative z-10 pt-28">
        <div className="max-w-3xl">

          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-12 bg-[#D4AF6A]" />
            <p className="text-xs font-medium uppercase tracking-[5px] text-[#D4AF6A]">
              International Fashion Entertainment
            </p>
          </div>

          <h1 className="font-[var(--font-playfair)] text-5xl leading-[1.12] tracking-tight text-white sm:text-6xl lg:text-8xl">
            Where Fashion
            <br />
            Meets
            <br />
            <span className="italic text-[#D4AF6A]">
              Extraordinary.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-8 text-white/65 md:text-lg">
            Discover extraordinary fashion shows, exclusive
            entertainment experiences and unforgettable
            international events with IFE.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href="/events"
              className="group flex items-center gap-3 bg-[#D4AF6A] px-8 py-4 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
            >
              Explore Events
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/about"
              className="border border-white/30 px-8 py-4 text-xs font-semibold uppercase tracking-[2px] text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
            >
              Discover IFE
            </Link>
          </div>

          <div className="mt-20 flex items-center gap-4 text-white/50">
            <ArrowDown size={17} className="text-[#D4AF6A]" />
            <span className="text-[10px] uppercase tracking-[3px]">
              Scroll to explore
            </span>
          </div>

        </div>
      </div>

      <div className="absolute bottom-12 right-12 hidden text-right lg:block">
        <p className="font-[var(--font-playfair)] text-5xl italic text-white/20">
          IFE
        </p>
        <p className="mt-2 text-[9px] uppercase tracking-[4px] text-white/50">
          Create. Inspire. Celebrate.
        </p>
      </div>
    </section>
  );
}
