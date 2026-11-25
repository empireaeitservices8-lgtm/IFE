"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiX,
} from "react-icons/fi";
import ScrollReveal from "@/components/ui/ScrollReveal";

type GalleryItem = {
  id: number;
  title: string;
  category: "Fashion" | "Entertainment" | "Awards" | "Backstage";
  subtitle: string;
  image: string;
};

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "The Grand Runway Finale",
    category: "Fashion",
    subtitle: "International Couture Showcase",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=85&w=1200",
  },
  {
    id: 2,
    title: "Spotlight Live Arena",
    category: "Entertainment",
    subtitle: "Headline Concert Production",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=85&w=1200",
  },
  {
    id: 3,
    title: "Excellence Honors Night",
    category: "Awards",
    subtitle: "Red Carpet & Ceremony",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?q=85&w=1200",
  },
  {
    id: 4,
    title: "Editorial Silhouette",
    category: "Fashion",
    subtitle: "Designer Capsule Presentation",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1200",
  },
  {
    id: 5,
    title: "Backstage Preparation",
    category: "Backstage",
    subtitle: "Behind the Scenes",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=85&w=1200",
  },
  {
    id: 6,
    title: "Electric Crowd Energy",
    category: "Entertainment",
    subtitle: "Live Music Experience",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=85&w=1200",
  },
  {
    id: 7,
    title: "Golden Hour Gala",
    category: "Awards",
    subtitle: "VIP Celebration Evening",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=85&w=1200",
  },
  {
    id: 8,
    title: "Runway Lighting & Sound",
    category: "Backstage",
    subtitle: "Stage Direction",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=85&w=1200",
  },
  {
    id: 9,
    title: "Acoustic Stage Session",
    category: "Entertainment",
    subtitle: "Special Guest Performance",
    image:
      "https://images.unsplash.com/photo-1501612780327-45045538702b?q=85&w=1200",
  },
];

const categories = [
  "All",
  "Fashion",
  "Entertainment",
  "Awards",
  "Backstage",
] as const;

export default function GalleryShowcase() {
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return galleryItems;
    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredItems.length
        );
      }
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + filteredItems.length) % filteredItems.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, filteredItems.length]);

  const activeItem =
    selectedIndex !== null ? filteredItems[selectedIndex] : null;

  return (
    <section className="container-main py-10">
      {/* Filter Bar */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  setSelectedIndex(null);
                }}
                className={`rounded-lg px-4 py-2 text-[10px] font-semibold uppercase tracking-[2px] transition ${
                  active
                    ? "bg-[#D4AF6A] text-black"
                    : "border border-white/15 bg-white/[0.03] text-white/70 hover:border-[#D4AF6A]/60 hover:text-white"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <p className="text-xs uppercase tracking-[2px] text-white/45">
          {filteredItems.length} Moments
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, idx) => (
          <ScrollReveal key={item.id} index={idx % 9}>
            <button
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className="group relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#111111] text-left shadow-lg shadow-black/40 transition duration-300 hover:-translate-y-1 hover:border-[#D4AF6A]/60"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                <span className="absolute left-3.5 top-3.5 rounded-full border border-[#D4AF6A]/50 bg-black/75 px-3 py-1 text-[9px] font-semibold uppercase tracking-[2px] text-[#D4AF6A] backdrop-blur-md">
                  {item.category}
                </span>

                <span className="absolute right-3.5 top-3.5 flex size-8 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white/85 opacity-0 backdrop-blur-sm transition group-hover:border-[#D4AF6A] group-hover:bg-[#D4AF6A] group-hover:text-black group-hover:opacity-100">
                  <FiMaximize2 size={14} />
                </span>

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[10px] uppercase tracking-[2.2px] text-white/60">
                    {item.subtitle}
                  </p>
                  <h3 className="mt-1 font-[var(--font-playfair)] text-xl text-white transition group-hover:text-[#D4AF6A]">
                    {item.title}
                  </h3>
                </div>
              </div>
            </button>
          </ScrollReveal>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          onClick={() => setSelectedIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl border border-white/15 bg-[#0B0B0B] p-4 sm:p-6"
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              aria-label="Close preview"
              className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center border border-white/20 bg-black/70 text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
            >
              <FiX size={18} />
            </button>

            <div className="relative h-[55vh] min-h-[320px] w-full overflow-hidden bg-black">
              <Image
                src={activeItem.image}
                alt={activeItem.title}
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#D4AF6A]">
                  {activeItem.category} — {activeItem.subtitle}
                </p>
                <h3 className="mt-1 font-[var(--font-playfair)] text-2xl text-white">
                  {activeItem.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedIndex((prev) =>
                      prev === null
                        ? 0
                        : (prev - 1 + filteredItems.length) %
                          filteredItems.length
                    )
                  }
                  aria-label="Previous image"
                  className="flex size-10 items-center justify-center border border-white/15 text-white/80 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                >
                  <FiChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedIndex((prev) =>
                      prev === null ? 0 : (prev + 1) % filteredItems.length
                    )
                  }
                  aria-label="Next image"
                  className="flex size-10 items-center justify-center border border-white/15 text-white/80 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

