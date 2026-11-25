import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiCalendar, FiMapPin } from "react-icons/fi";

type EventCardProps = {
  href?: string;
  image: string;
  category: string;
  title: string;
  date: string;
  location: string;
  price: string;
};

export default function EventCard({
  href = "/events",
  image,
  category,
  title,
  date,
  location,
  price,
}: EventCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-lg shadow-black/40 transition duration-300 hover:-translate-y-1 hover:border-[#D4AF6A]/60">
      <Link
        href={href}
        className="relative block h-[175px] shrink-0 overflow-hidden"
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/25 to-black/15" />

        <span className="absolute left-3 top-3 rounded-full border border-[#D4AF6A]/50 bg-black/75 px-3 py-0.5 text-[9px] font-semibold uppercase tracking-[2px] text-[#D4AF6A] backdrop-blur-md">
          {category}
        </span>

        <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm transition group-hover:border-[#D4AF6A] group-hover:bg-[#D4AF6A] group-hover:text-black">
          <FiArrowUpRight size={15} />
        </span>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="font-[var(--font-playfair)] text-xl leading-snug text-white transition group-hover:text-[#D4AF6A]">
            <Link href={href}>{title}</Link>
          </h3>

          <div className="mt-3 space-y-1.5 text-xs text-white/65">
            <div className="flex items-center gap-2">
              <FiCalendar size={13} className="shrink-0 text-[#D4AF6A]" />
              <span>{date}</span>
            </div>

            <div className="flex items-center gap-2">
              <FiMapPin size={13} className="shrink-0 text-[#D4AF6A]" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
          <div>
            <p className="text-[9px] uppercase tracking-[2px] text-white/40">
              Starting from
            </p>
            <p className="mt-0.5 text-sm font-semibold text-[#D4AF6A]">
              {price}
            </p>
          </div>

          <Link
            href={href}
            className="inline-flex items-center gap-1 rounded-md bg-[#D4AF6A] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-black transition hover:bg-[#F5E5B5]"
          >
            View Event
            <FiArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  );
}
