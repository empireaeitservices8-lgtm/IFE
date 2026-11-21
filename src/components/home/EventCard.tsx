
import Image from "next/image";
import Link from "next/link";
import { MapPin, CalendarDays, ArrowUpRight } from "lucide-react";

type EventCardProps = {
  image: string;
  category: string;
  title: string;
  date: string;
  location: string;
  price: string;
};

export default function EventCard({
  image,
  category,
  title,
  date,
  location,
  price,
}: EventCardProps) {
  return (
    <article className="group overflow-hidden border border-white/10 bg-[#111111] transition hover:border-[#D4AF6A]/50">

      <Link href="/events" className="relative block h-[280px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <span className="absolute left-5 top-5 bg-[#D4AF6A] px-4 py-2 text-[9px] font-bold uppercase tracking-[2px] text-black">
          {category}
        </span>

        <span className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/50 text-white transition group-hover:border-[#D4AF6A] group-hover:bg-[#D4AF6A] group-hover:text-black">
          <ArrowUpRight size={19} />
        </span>
      </Link>

      <div className="p-6">
        <h3 className="font-[var(--font-playfair)] text-2xl text-white transition group-hover:text-[#D4AF6A]">
          {title}
        </h3>

        <div className="mt-5 space-y-3 text-xs text-white/50">
          <div className="flex items-center gap-3">
            <CalendarDays size={15} className="text-[#D4AF6A]" />
            {date}
          </div>

          <div className="flex items-center gap-3">
            <MapPin size={15} className="text-[#D4AF6A]" />
            {location}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
          <div>
            <p className="text-[9px] uppercase tracking-[2px] text-white/40">
              Starting from
            </p>
            <p className="mt-1 text-lg font-semibold text-[#D4AF6A]">
              {price}
            </p>
          </div>

          <Link
            href="/events"
            className="text-[10px] font-semibold uppercase tracking-[2px] text-white transition hover:text-[#D4AF6A]"
          >
            View Event
          </Link>
        </div>
      </div>
    </article>
  );
}
