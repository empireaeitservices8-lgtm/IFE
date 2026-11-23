
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import {
  Search,
  Plus,
  Image as ImageIcon,
  Video,
  Images,
  Star,
  Eye,
  Pencil,
  Trash2,
  X,
  Play,
  CalendarDays,
  Filter,
  CheckCircle2,
  EyeOff,
} from "lucide-react";

type MediaItem = {
  id: string;
  title: string;
  event: string;
  category: string;
  type: "Image" | "Video";
  date: string;
  status: "Published" | "Draft";
  featured: boolean;
  description: string;
  gradient: string;
};

type ApiGalleryItem = {
  id: string;
  title: string;
  description: string | null;
  type: "IMAGE" | "VIDEO";
  category: string;
  status: string;
  isFeatured: boolean;
  createdAt: string;
  event?: { title: string } | null;
};

const categories = ["All Categories", "Fashion", "Entertainment", "Awards", "Other"];

export default function GalleryManagementPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Status");
  const [selected, setSelected] = useState<MediaItem | null>(null);

  const mapMedia = (items: ApiGalleryItem[]): MediaItem[] =>
    items.map((m) => ({
      id: m.id,
      title: m.title,
      event: m.event?.title || "IFE Showcase",
      category: m.category.charAt(0) + m.category.slice(1).toLowerCase(),
      type: m.type === "VIDEO" ? "Video" : "Image",
      date: new Date(m.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: m.status === "PUBLISHED" ? "Published" : "Draft",
      featured: m.isFeatured,
      description: m.description || "",
      gradient: "from-[#60452c] via-[#241b15] to-[#111]",
    }));

  const loadMedia = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery?limit=100&status=ALL");
      const json = await res.json();
      if (res.ok && json.success) {
        setMedia(mapMedia(json.data.items || []));
      }
    } catch {}
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/gallery?limit=100&status=ALL")
      .then((res) => res.json())
      .then((json) => {
        if (active && json.success) {
          setMedia(mapMedia(json.data.items || []));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const filteredMedia = useMemo(() => {
    const query = search.toLowerCase();

    return media.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.event.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (category === "All Categories" || item.category === category) &&
        (type === "All Types" || item.type === type) &&
        (status === "All Status" || item.status === status)
      );
    });
  }, [media, search, category, type, status]);

  const imageCount = media.filter((item) => item.type === "Image").length;
  const videoCount = media.filter((item) => item.type === "Video").length;
  const featuredCount = media.filter((item) => item.featured).length;
  const publishedCount = media.filter((item) => item.status === "Published").length;

  async function toggleFeatured(id: string) {
    const item = media.find((m) => m.id === id);
    if (!item) return;
    const res = await fetch(`/api/gallery/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !item.featured }),
    });
    if (res.ok) await loadMedia();
  }

  async function toggleStatus(id: string) {
    const item = media.find((m) => m.id === id);
    if (!item) return;
    const nextStatus = item.status === "Published" ? "DRAFT" : "PUBLISHED";
    const res = await fetch(`/api/gallery/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) await loadMedia();
  }

  async function deleteMedia(id: string) {
    if (!window.confirm("Delete this media item from the gallery?")) return;
    const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSelected(null);
      await loadMedia();
    }
  }

  return (
    <AdminShell
      title="Gallery Management"
      breadcrumb="Admin / Content"
      actions={
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF6A] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#e5c27e]"
        >
          <Plus size={17} />
          <span className="hidden sm:inline">View Public Gallery</span>
        </Link>
      }
    >
      <div className="space-y-7">
          <div>
            <p className="text-sm text-gray-400">
              Organize event photographs, videos and featured gallery content.
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Media previews and records on this page are demonstration data.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Media", value: media.length, icon: Images },
              { label: "Images", value: imageCount, icon: ImageIcon },
              { label: "Videos", value: videoCount, icon: Video },
              { label: "Featured Items", value: featuredCount, icon: Star },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-[#111] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">{item.label}</p>
                  <item.icon size={19} className="text-[#D4AF6A]" />
                </div>
                <p className="mt-4 text-3xl font-semibold">{item.value}</p>
                <p className="mt-1 text-xs text-gray-600">Gallery overview</p>
              </div>
            ))}
          </div>

          <section className="rounded-xl border border-white/10 bg-[#111] p-4 md:p-5">
            <div className="mb-5 flex flex-col gap-3 xl:flex-row">
              <div className="relative flex-1">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search media title or event..."
                  className="w-full rounded-lg border border-white/10 bg-[#090909] py-3 pl-10 pr-4 text-sm outline-none placeholder:text-gray-600 focus:border-[#D4AF6A]/60"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="rounded-lg border border-white/10 bg-[#090909] px-3 py-3 text-sm text-gray-300 outline-none focus:border-[#D4AF6A]/60"
                >
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>

                <select
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  className="rounded-lg border border-white/10 bg-[#090909] px-3 py-3 text-sm text-gray-300 outline-none focus:border-[#D4AF6A]/60"
                >
                  <option>All Types</option>
                  <option>Image</option>
                  <option>Video</option>
                </select>

                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="rounded-lg border border-white/10 bg-[#090909] px-3 py-3 text-sm text-gray-300 outline-none focus:border-[#D4AF6A]/60"
                >
                  <option>All Status</option>
                  <option>Published</option>
                  <option>Draft</option>
                </select>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                {filteredMedia.length} media items
              </p>
              <span className="hidden items-center gap-2 text-xs text-gray-500 sm:flex">
                <Filter size={14} /> Filter gallery
              </span>
            </div>

            {filteredMedia.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/10 py-16 text-center">
                <Images size={30} className="mx-auto text-gray-600" />
                <p className="mt-3 text-sm text-gray-400">No media items found.</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("All Categories");
                    setType("All Types");
                    setStatus("All Status");
                  }}
                  className="mt-3 text-sm text-[#D4AF6A] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredMedia.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0b] transition hover:border-[#D4AF6A]/40"
                  >
                    <div className={`relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br ${item.gradient}`}>
                      {item.type === "Image" ? (
                        <ImageIcon size={42} strokeWidth={1} className="text-white/35" />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF6A]/50 bg-black/30 text-[#D4AF6A]">
                          <Play size={23} fill="currentColor" />
                        </div>
                      )}

                      <span className="absolute left-3 top-3 rounded-md border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] text-white">
                        {item.type}
                      </span>

                      {item.featured && (
                        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-[#D4AF6A] px-2.5 py-1 text-[10px] font-semibold text-black">
                          <Star size={11} fill="currentColor" /> Featured
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="mt-1 text-xs text-gray-500">{item.event}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] ${
                          item.status === "Published"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-gray-500/10 text-gray-400"
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                        <span>{item.category}</span>
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={13} /> {item.date}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                        <button
                          onClick={() => setSelected(item)}
                          className="flex items-center justify-center gap-1 rounded-lg border border-white/10 py-2 text-xs text-gray-300 hover:border-[#D4AF6A]/50 hover:text-[#D4AF6A]"
                        >
                          <Eye size={13} /> View
                        </button>
                        <button
                          onClick={() => toggleFeatured(item.id)}
                          className={`flex items-center justify-center gap-1 rounded-lg border py-2 text-xs ${
                            item.featured
                              ? "border-[#D4AF6A]/40 text-[#D4AF6A]"
                              : "border-white/10 text-gray-400 hover:border-[#D4AF6A]/50"
                          }`}
                        >
                          <Star size={13} /> Feature
                        </button>
                        <button
                          onClick={() => toggleStatus(item.id)}
                          className="flex items-center justify-center gap-1 rounded-lg border border-white/10 py-2 text-xs text-gray-400 hover:border-[#D4AF6A]/50 hover:text-[#D4AF6A]"
                        >
                          {item.status === "Published" ? <EyeOff size={13} /> : <CheckCircle2 size={13} />}
                          {item.status === "Published" ? "Hide" : "Publish"}
                        </button>
                      </div>

                      <button
                        onClick={() => deleteMedia(item.id)}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs text-red-400/80 hover:bg-red-500/5 hover:text-red-400"
                      >
                        <Trash2 size={13} /> Delete demo item
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

        </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-2xl">
            <div className={`relative flex aspect-video items-center justify-center bg-gradient-to-br ${selected.gradient}`}>
              {selected.type === "Image" ? (
                <ImageIcon size={48} className="text-white/40" />
              ) : (
                <Play size={40} className="text-[#D4AF6A]" />
              )}
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 rounded-lg bg-black/50 p-2 text-white hover:bg-black/80"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF6A]">Media details</p>
              <h2 className="mt-2 text-xl font-semibold">{selected.title}</h2>
              <p className="mt-1 text-sm text-gray-500">{selected.event}</p>
              <p className="mt-5 text-sm leading-6 text-gray-400">{selected.description}</p>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-sm">
                <div>
                  <p className="text-xs text-gray-600">Category</p>
                  <p className="mt-1 text-gray-300">{selected.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Media type</p>
                  <p className="mt-1 text-gray-300">{selected.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Date added</p>
                  <p className="mt-1 text-gray-300">{selected.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Publication</p>
                  <p className="mt-1 text-gray-300">{selected.status}</p>
                </div>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="mt-6 w-full rounded-lg bg-[#D4AF6A] py-3 text-sm font-semibold text-black hover:bg-[#e5c27e]"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
