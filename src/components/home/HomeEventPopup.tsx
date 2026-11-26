"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiCalendar,
  FiMapPin,
  FiTag,
  FiX,
} from "react-icons/fi";

export type PopupEvent = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  date: string;
  venue: string;
  price?: string;
};

type ApiEventItem = {
  id: string;
  title: string;
  category: string;
  shortDescription: string | null;
  description: string;
  bannerUrl: string | null;
  startAt: string;
  venue?: { name: string; city: string } | null;
  ticketTypes?: { price: string | number }[];
};

const POPUP_DISMISSED_KEY = "ife_home_popup_dismissed";
const noopSubscribe = () => () => {};

const fallbackImages: Record<string, string> = {
  FASHION:
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=85&w=1200",
  ENTERTAINMENT:
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=85&w=1200",
  AWARDS:
    "https://images.unsplash.com/photo-1503095396549-807759245b35?q=85&w=1200",
  CONCERT:
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=85&w=1200",
};

export default function HomeEventPopup({
  initialEvent = null,
}: {
  initialEvent?: PopupEvent | null;
}) {
  const [fetchedEvent, setFetchedEvent] = useState<PopupEvent | null>(null);
  const [closed, setClosed] = useState(false);

  const dismissed = useSyncExternalStore(
    noopSubscribe,
    () => {
      try {
        return window.sessionStorage.getItem(POPUP_DISMISSED_KEY);
      } catch {
        return null;
      }
    },
    () => "1"
  );

  const event = initialEvent ?? fetchedEvent;
  const open = Boolean(event) && !closed && dismissed !== "1";

  useEffect(() => {
    if (initialEvent || dismissed === "1") return;

    let active = true;
    fetch("/api/events?limit=1")
      .then((res) => res.json())
      .then((json) => {
        if (!active || !json.success) return;
        const item: ApiEventItem | undefined = json.data?.items?.[0];
        if (!item) return;

        setFetchedEvent({
          id: item.id,
          title: item.title,
          category:
            item.category.charAt(0) + item.category.slice(1).toLowerCase(),
          description:
            item.shortDescription || item.description.slice(0, 130),
          image:
            item.bannerUrl ||
            fallbackImages[item.category] ||
            fallbackImages.FASHION,
          date: new Date(item.startAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          venue: item.venue
            ? `${item.venue.name}, ${item.venue.city}`
            : "Venue to be announced",
        });
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [initialEvent, dismissed]);

  const closePopup = () => {
    setClosed(true);
    try {
      window.sessionStorage.setItem(POPUP_DISMISSED_KEY, "1");
    } catch {}
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePopup();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!open || !event) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Featured Event: ${event.title}`}
      onClick={closePopup}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#D4AF6A]/45 bg-[#0C0C0C] text-white shadow-2xl shadow-black/80"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closePopup}
          aria-label="Close popup"
          className="absolute right-3.5 top-3.5 z-20 flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white/85 backdrop-blur-md transition hover:border-[#D4AF6A] hover:bg-[#D4AF6A] hover:text-black"
        >
          <FiX size={17} />
        </button>

        {/* Event Banner */}
        <div className="relative h-48 w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${event.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-black/35 to-black/25" />

          <span className="absolute left-4 top-4 rounded-full border border-[#D4AF6A]/50 bg-black/75 px-3 py-1 text-[9px] font-bold uppercase tracking-[2px] text-[#D4AF6A] backdrop-blur-md">
            Upcoming • {event.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#D4AF6A]">
            Featured IFE Showcase
          </p>

          <h2 className="mt-1.5 font-[var(--font-playfair)] text-2xl leading-snug text-white sm:text-3xl">
            {event.title}
          </h2>

          <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/65 sm:text-sm">
            {event.description}
          </p>

          <div className="mt-4 grid gap-2 border-y border-white/10 py-3 text-xs text-white/75 sm:grid-cols-3">
            <span className="flex items-center gap-2">
              <FiCalendar size={13} className="shrink-0 text-[#D4AF6A]" />
              {event.date}
            </span>
            <span className="flex items-center gap-2 truncate sm:col-span-2">
              <FiMapPin size={13} className="shrink-0 text-[#D4AF6A]" />
              <span className="truncate">{event.venue}</span>
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF6A]">
              <FiTag size={13} />
              {event.price || "Passes Available"}
            </span>

            <div className="flex flex-wrap gap-2.5">
              <Link
                href={`/events/${event.id}`}
                onClick={closePopup}
                className="inline-flex items-center justify-center rounded-lg border border-white/20 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
              >
                Details
              </Link>

              <Link
                href={`/events/${event.id}/tickets`}
                onClick={closePopup}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#D4AF6A] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[1.8px] text-black transition hover:bg-[#F5E5B5]"
              >
                Book Tickets
                <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
