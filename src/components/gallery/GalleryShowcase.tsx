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
  id: string;
  title: string;
  category: string;
  subtitle: string;
  image: string;
};

type ApiGalleryItem = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  url?: string | null;
  thumbnailUrl?: string | null;
  event?: { title: string } | null;
};

function formatCategory(cat: string): string {
  if (!cat) return "Events";
  return cat.charAt(0) + cat.slice(1).toLowerCase();
}

export default function GalleryShowcase() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/gallery?limit=50")
      .then((res) => res.json())
      .then((json) => {
        if (!active || !json.success) return;
        const mapped: GalleryItem[] = (json.data?.items || [])
          .map((g: ApiGalleryItem) => ({
            id: g.id,
            title: g.title,
            category: formatCategory(g.category),
            subtitle: g.description || g.event?.title || "IFE Showcase",
            image: (g.url || g.thumbnailUrl || "").trim(),
          }))
          .filter((item: GalleryItem) => item.image.length > 0);
        setItems(mapped);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.category)))],
    [items]
  );

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

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
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-60 animate-pulse rounded-xl border border-white/10 bg-[#111111]"
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#101010] p-10 text-center">
          <p className="font-[var(--font-playfair)] text-2xl text-white">
            Gallery Moments Coming Soon
          </p>
          <p className="mt-2 text-sm text-white/55">
            Official event photography and highlights will appear here once
            published.
          </p>
        </div>
      ) : (
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
      )}

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

