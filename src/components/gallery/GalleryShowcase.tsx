"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiSearch,
  FiX,
} from "react-icons/fi";
import ScrollReveal from "@/components/ui/ScrollReveal";

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  image: string;
  isFeatured: boolean;
};

type ApiGalleryItem = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  url?: string | null;
  thumbnailUrl?: string | null;
  isFeatured?: boolean;
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
  const [search, setSearch] = useState("");
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
            isFeatured: Boolean(g.isFeatured),
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
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCat =
        activeCategory === "All" || item.category === activeCategory;
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [activeCategory, items, search]);

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
    <section className="container-main py-6 sm:py-10">
      {/* Filter & Search Toolbar */}
      <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:mb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const active = activeCategory === category;
            const count =
              category === "All"
                ? items.length
                : items.filter((i) => i.category === category).length;

            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  setSelectedIndex(null);
                }}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[2px] transition ${
                  active
                    ? "bg-[#D4AF6A] text-black shadow-[0_6px_20px_rgba(212,175,106,0.25)]"
                    : "border border-white/15 bg-white/[0.03] text-white/75 hover:border-[#D4AF6A]/60 hover:text-white"
                }`}
              >
                <span>{category}</span>
                <span
                  className={`text-[9px] ${
                    active ? "text-black/70" : "text-white/40"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <FiSearch
              size={14}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(null);
              }}
              placeholder="Search gallery..."
              className="h-10 w-full rounded-lg border border-white/15 bg-[#0D0D0D] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-white/35 focus:border-[#D4AF6A]"
            />
          </div>
          <p className="hidden shrink-0 text-[11px] uppercase tracking-[2px] text-white/45 sm:block">
            {filteredItems.length} {filteredItems.length === 1 ? "Moment" : "Moments"}
          </p>
        </div>
      </div>

      {/* Editorial Bento Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-64 animate-pulse rounded-2xl border border-white/10 bg-[#111111]"
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#101010] p-10 text-center">
          <p className="font-[var(--font-playfair)] text-2xl text-white">
            No Gallery Moments Found
          </p>
          <p className="mt-2 text-sm text-white/55">
            {items.length === 0
              ? "Official event photography and highlights will appear here once published."
              : "Try clearing your search or selecting another category."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {filteredItems.map((item, idx) => {
            const isHeroTile = idx === 0 && filteredItems.length >= 4;
            return (
              <ScrollReveal
                key={item.id}
                index={idx % 9}
                className={
                  isHeroTile ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""
                }
              >
                <button
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111111] text-left shadow-lg shadow-black/40 transition duration-300 hover:-translate-y-1 hover:border-[#D4AF6A]/60 ${
                    isHeroTile
                      ? "h-72 sm:h-96 lg:h-full lg:min-h-[440px]"
                      : "h-64 sm:h-72"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover object-top transition duration-700 group-hover:scale-105"
                    sizes={
                      isHeroTile
                        ? "(max-width: 1024px) 100vw, 66vw"
                        : "(max-width: 640px) 100vw, 33vw"
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  <div className="absolute left-3.5 right-3.5 top-3.5 flex items-center justify-between gap-2">
                    <span className="rounded-full border border-[#D4AF6A]/50 bg-black/75 px-3 py-1 text-[9px] font-semibold uppercase tracking-[2px] text-[#D4AF6A] backdrop-blur-md">
                      {item.category}
                    </span>

                    <span className="flex size-8 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white/85 backdrop-blur-sm transition group-hover:border-[#D4AF6A] group-hover:bg-[#D4AF6A] group-hover:text-black sm:opacity-0 sm:group-hover:opacity-100">
                      <FiMaximize2 size={13} />
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="line-clamp-1 text-[10px] uppercase tracking-[2px] text-white/65">
                      {item.subtitle}
                    </p>
                    <h3
                      className={`mt-1 font-[var(--font-playfair)] text-white transition group-hover:text-[#D4AF6A] ${
                        isHeroTile ? "text-xl sm:text-3xl" : "text-lg sm:text-xl"
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>
                </button>
              </ScrollReveal>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeItem && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          onClick={() => setSelectedIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-3 backdrop-blur-md sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#0B0B0B] p-4 shadow-2xl sm:p-6"
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              aria-label="Close preview"
              className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-lg border border-white/20 bg-black/75 text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A] sm:right-5 sm:top-5 sm:size-10"
            >
              <FiX size={18} />
            </button>

            <div className="relative h-[52vh] min-h-[260px] w-full overflow-hidden rounded-xl bg-black sm:h-[60vh]">
              <Image
                src={activeItem.image}
                alt={activeItem.title}
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 sm:mt-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#D4AF6A]">
                  {activeItem.category} • {selectedIndex + 1} /{" "}
                  {filteredItems.length}
                </p>
                <h3 className="mt-1 font-[var(--font-playfair)] text-xl text-white sm:text-2xl">
                  {activeItem.title}
                </h3>
                <p className="mt-1 text-xs text-white/60">
                  {activeItem.subtitle}
                </p>
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
                  className="flex size-10 items-center justify-center rounded-lg border border-white/15 text-white/80 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
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
                  className="flex size-10 items-center justify-center rounded-lg border border-white/15 text-white/80 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
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
