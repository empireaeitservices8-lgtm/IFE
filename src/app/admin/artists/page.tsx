
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  ClipboardList,
  Users,
  CreditCard,
  Mic2,
  MapPin,
  Image as ImageIcon,
  Settings,
  Search,
  Plus,
  Eye,
  Pencil,
  Mail,
  Phone,
  Filter,
  X,
  CheckCircle2,
  UserX,
  Menu,
  Star,
} from "lucide-react";

type Artist = {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  location: string;
  events: string[];
  rating: number;
  status: "Active" | "Inactive";
  initials: string;
};

type ApiArtist = {
  id: string;
  name: string;
  role: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  isActive: boolean;
  _count?: { events: number };
};

const sidebarItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Tickets", href: "/admin/tickets", icon: Ticket },
  { label: "Bookings", href: "/admin/bookings", icon: ClipboardList },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Artists", href: "/admin/artists", icon: Mic2 },
  { label: "Venues", href: "/admin/venues", icon: MapPin },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mapArtists = (items: ApiArtist[]): Artist[] =>
    items.map((a) => ({
      id: a.id,
      name: a.name,
      category: a.role,
      email: a.email || "—",
      phone: a.phone || "—",
      location: a.location || "India",
      events: Array.from(
        { length: a._count?.events ?? 0 },
        (_, i) => `Event ${i + 1}`
      ),
      rating: 5.0,
      status: a.isActive ? "Active" : "Inactive",
      initials: a.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    }));

  const loadArtists = useCallback(async () => {
    try {
      const res = await fetch("/api/artists?limit=100");
      const json = await res.json();
      if (res.ok && json.success) {
        setArtists(mapArtists(json.data.items || []));
      }
    } catch {}
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/artists?limit=100")
      .then((res) => res.json())
      .then((json) => {
        if (active && json.success) {
          setArtists(mapArtists(json.data.items || []));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const filteredArtists = useMemo(() => {
    return artists.filter((artist) => {
      const term = search.toLowerCase();
      const matchesSearch =
        artist.name.toLowerCase().includes(term) ||
        artist.email.toLowerCase().includes(term) ||
        artist.location.toLowerCase().includes(term) ||
        artist.category.toLowerCase().includes(term);

      const matchesCategory =
        category === "All Categories" || artist.category === category;

      const matchesStatus =
        status === "All Status" || artist.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [artists, search, category, status]);

  const activeCount = artists.filter((artist) => artist.status === "Active").length;
  const inactiveCount = artists.length - activeCount;
  const assignedCount = artists.filter((artist) => artist.events.length > 0).length;

  const toggleStatus = async (id: string) => {
    const target = artists.find((a) => a.id === id);
    if (!target) return;
    const res = await fetch(`/api/artists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: target.status !== "Active" }),
    });
    if (res.ok) await loadArtists();
  };

  return (
    <AdminShell
      title="Artists Management"
      breadcrumb="Admin / Content"
      actions={
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 rounded-lg bg-[#D4AF6A] px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-[#e5c783]"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Assign to Event</span>
          <span className="sm:hidden">Add</span>
        </Link>
      }
    >
      <div className="space-y-7">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF6A]">
              Talent Directory
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">
              Artists & <span className="text-[#D4AF6A]">Performers</span>
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Organise artist profiles and event participation from one place.
            </p>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Artists", value: artists.length, icon: Users },
              { label: "Active Artists", value: activeCount, icon: CheckCircle2 },
              { label: "Inactive Artists", value: inactiveCount, icon: UserX },
              { label: "Assigned to Events", value: assignedCount, icon: CalendarDays },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-[#111] p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{stat.label}</span>
                    <Icon size={19} className="text-[#D4AF6A]" />
                  </div>
                  <p className="mt-4 text-3xl font-semibold">{stat.value}</p>
                </div>
              );
            })}
          </section>

          <section className="rounded-xl border border-white/10 bg-[#111] p-4 md:p-5">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search artist, email, category or location..."
                  className="w-full rounded-lg border border-white/10 bg-[#080808] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#D4AF6A]/60"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-lg border border-white/10 bg-[#080808] px-4 py-3 text-sm text-gray-300 outline-none focus:border-[#D4AF6A]/60"
                >
                  <option>All Categories</option>
                  <option>Fashion Model</option>
                  <option>Singer</option>
                  <option>Fashion Designer</option>
                  <option>DJ</option>
                  <option>Host</option>
                  <option>Performer</option>
                </select>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-lg border border-white/10 bg-[#080808] px-4 py-3 text-sm text-gray-300 outline-none focus:border-[#D4AF6A]/60"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <Filter size={14} />
              Showing {filteredArtists.length} of {artists.length} artists
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-white/10 bg-[#111]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h3 className="font-semibold">Artist Directory</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Artist profiles and assigned events
                </p>
              </div>
              <span className="text-xs text-gray-500">
                {filteredArtists.length} records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Artist</th>
                    <th className="px-5 py-4 font-medium">Category</th>
                    <th className="px-5 py-4 font-medium">Location</th>
                    <th className="px-5 py-4 font-medium">Assigned Events</th>
                    <th className="px-5 py-4 font-medium">Rating</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredArtists.map((artist) => (
                    <tr key={artist.id} className="hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF6A]/30 bg-[#D4AF6A]/10 text-xs font-semibold text-[#D4AF6A]">
                            {artist.initials}
                          </div>
                          <div>
                            <p className="font-medium text-white">{artist.name}</p>
                            <p className="mt-1 text-xs text-gray-500">{artist.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-300">{artist.category}</td>
                      <td className="px-5 py-4 text-gray-400">{artist.location}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">
                          {artist.events.length} event(s)
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 text-[#D4AF6A]">
                          <Star size={14} fill="currentColor" />
                          {artist.rating.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            artist.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-gray-500/10 text-gray-400"
                          }`}
                        >
                          {artist.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedArtist(artist)}
                            title="View artist"
                            className="rounded-lg border border-white/10 p-2 text-gray-400 hover:border-[#D4AF6A]/50 hover:text-[#D4AF6A]"
                          >
                            <Eye size={16} />
                          </button>
                          <Link
                            href={`/admin/artists/${artist.id}/edit`}
                            title="Edit artist"
                            className="rounded-lg border border-white/10 p-2 text-gray-400 hover:border-[#D4AF6A]/50 hover:text-[#D4AF6A]"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => toggleStatus(artist.id)}
                            title="Toggle status"
                            className="rounded-lg border border-white/10 p-2 text-gray-400 hover:text-[#D4AF6A]"
                          >
                            {artist.status === "Active" ? (
                              <UserX size={16} />
                            ) : (
                              <CheckCircle2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredArtists.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                        No artists match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="rounded-xl border border-[#D4AF6A]/20 bg-[#D4AF6A]/5 p-4">
            <p className="text-sm font-medium text-[#D4AF6A]">Demo data notice</p>
            <p className="mt-1 text-xs leading-6 text-gray-400">
              Artist records and status changes currently use local React state.
              They reset when the page is refreshed. Database storage, image
              uploads, and artist profile management will be connected during
              backend integration.
            </p>
          </div>
        </div>

      {selectedArtist && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF6A]">
                  Artist Profile
                </p>
                <h3 className="mt-2 text-2xl font-serif">{selectedArtist.name}</h3>
              </div>
              <button
                onClick={() => setSelectedArtist(null)}
                aria-label="Close profile"
                className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF6A]/10 text-xl font-semibold text-[#D4AF6A]">
                {selectedArtist.initials}
              </div>
              <div>
                <p className="font-medium">{selectedArtist.category}</p>
                <p className="mt-1 text-sm text-gray-500">{selectedArtist.location}</p>
                <span className="mt-2 inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                  {selectedArtist.status}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4 border-t border-white/10 pt-5 text-sm">
              <p className="flex items-center gap-3 text-gray-300">
                <Mail size={16} className="text-[#D4AF6A]" />
                {selectedArtist.email}
              </p>
              <p className="flex items-center gap-3 text-gray-300">
                <Phone size={16} className="text-[#D4AF6A]" />
                {selectedArtist.phone}
              </p>
              <div>
                <p className="mb-2 text-xs uppercase tracking-wider text-gray-500">
                  Assigned Events
                </p>
                {selectedArtist.events.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedArtist.events.map((event) => (
                      <span
                        key={event}
                        className="rounded-full border border-[#D4AF6A]/20 bg-[#D4AF6A]/5 px-3 py-1.5 text-xs text-[#D4AF6A]"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No events assigned.</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedArtist(null)}
              className="mt-7 w-full rounded-lg bg-[#D4AF6A] py-3 text-sm font-semibold text-black hover:bg-[#e5c783]"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
