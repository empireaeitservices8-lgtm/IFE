
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  Users,
  CreditCard,
  Wallet,
  Image,
  Mic2,
  MapPin,
  Settings,
  Menu,
  X,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Filter,
  ChevronDown,
  ArrowUpRight,
  CalendarCheck,
} from "lucide-react";

type EventStatus = "Published" | "Draft" | "Completed" | "Cancelled";

type EventItem = {
  id: string;
  title: string;
  bannerUrl: string | null;
  category: string;
  date: string;
  venue: string;
  ticketsSold: number;
  totalTickets: number;
  revenue: number;
  status: EventStatus;
  isPopupFeatured: boolean;
  isBannerFeatured: boolean;
  isComingSoon: boolean;
};

type ApiEvent = {
  id: string;
  title: string;
  bannerUrl?: string | null;
  category: string;
  startAt: string;
  status: string;
  isPopupFeatured?: boolean;
  isBannerFeatured?: boolean;
  isComingSoon?: boolean;
  venue?: { name: string } | null;
  ticketTypes?: { price: string | number; totalQuantity: number; soldQuantity: number }[];
};

function mapEventStatus(status: string): EventStatus {
  switch (status) {
    case "PUBLISHED":
      return "Published";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Draft";
  }
}

function mapCategoryLabel(category: string): string {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

const navigation = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Events",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    label: "Tickets",
    href: "/admin/tickets",
    icon: Ticket,
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    icon: CreditCard,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: Wallet,
  },
  {
    label: "Artists",
    href: "/admin/artists",
    icon: Mic2,
  },
  {
    label: "Venues",
    href: "/admin/venues",
    icon: MapPin,
  },
  {
    label: "Gallery",
    href: "/admin/gallery",
    icon: Image,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/10 bg-[#0A0A0A] transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-7">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center border border-[#D4AF6A]/50 font-serif text-xl text-[#D4AF6A]">
              I
            </div>
            <div>
              <p className="font-serif text-lg tracking-wider">IFE</p>
              <p className="text-[8px] uppercase tracking-[0.25em] text-[#D4AF6A]">
                Admin Portal
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="text-gray-500 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-7">
          <p className="mb-4 px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-gray-600">
            Main Menu
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;
            const active = item.label === "Events";

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-xs transition ${
                  active
                    ? "border border-[#D4AF6A]/20 bg-[#D4AF6A]/10 text-[#D4AF6A]"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 bg-white/[0.03] p-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#D4AF6A]/15 text-xs font-bold text-[#D4AF6A]">
              AD
            </div>
            <div>
              <p className="text-xs font-semibold">Administrator</p>
              <p className="text-[10px] text-gray-500">
                admin@example.com
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function AdminEventsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Statuses");
  const [menuEventId, setMenuEventId] = useState<string | null>(null);

  const mapEvents = (items: ApiEvent[]): EventItem[] =>
    items.map((ev) => {
      const ticketsSold = (ev.ticketTypes || []).reduce(
        (s, t) => s + t.soldQuantity,
        0
      );
      const totalTickets = (ev.ticketTypes || []).reduce(
        (s, t) => s + t.totalQuantity,
        0
      );
      const revenue = (ev.ticketTypes || []).reduce(
        (s, t) => s + t.soldQuantity * Number(t.price),
        0
      );
      return {
        id: ev.id,
        title: ev.title,
        bannerUrl: ev.bannerUrl || null,
        category: mapCategoryLabel(ev.category),
        date: new Date(ev.startAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        venue: ev.venue?.name || "TBA",
        ticketsSold,
        totalTickets,
        revenue,
        status: mapEventStatus(ev.status),
        isPopupFeatured: Boolean(ev.isPopupFeatured),
        isBannerFeatured: Boolean(ev.isBannerFeatured),
        isComingSoon: Boolean(ev.isComingSoon),
      };
    });

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/events?limit=100");
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to load events.");
        return;
      }
      setEvents(mapEvents(json.data.items || []));
    } catch {
      setError("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/events?limit=100")
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        if (json.success) {
          setEvents(mapEvents(json.data.items || []));
        } else {
          setError(json.message || "Failed to load events.");
        }
      })
      .catch(() => {
        if (active) setError("Failed to fetch events.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.venue.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All Categories" || event.category === category;

      const matchesStatus =
        status === "All Statuses" || event.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [events, search, category, status]);

  const publishedCount = events.filter(
    (event) => event.status === "Published"
  ).length;

  const draftCount = events.filter(
    (event) => event.status === "Draft"
  ).length;

  const completedCount = events.filter(
    (event) => event.status === "Completed"
  ).length;

  const togglePublish = async (id: string) => {
    const target = events.find((e) => e.id === id);
    if (!target) return;
    const publish = target.status !== "Published";
    setMenuEventId(null);

    try {
      const res = await fetch(`/api/events/${id}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to update event status.");
        return;
      }
      await loadEvents();
    } catch {
      setError("Network error while updating event.");
    }
  };

  const setPopupEvent = async (id: string, isPopupFeatured: boolean) => {
    setMenuEventId(null);
    setError("");
    try {
      const res = await fetch(`/api/events/${id}/popup`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPopupFeatured }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to update homepage popup.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      await loadEvents();
    } catch {
      setError("Network error while updating homepage popup.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const setBannerEvent = async (id: string, isBannerFeatured: boolean) => {
    setMenuEventId(null);
    setError("");
    try {
      const res = await fetch(`/api/events/${id}/banner`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBannerFeatured }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to update homepage banner.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      await loadEvents();
    } catch {
      setError("Network error while updating homepage banner.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const setComingSoonEvent = async (id: string, isComingSoon: boolean) => {
    setMenuEventId(null);
    setError("");
    try {
      const res = await fetch(`/api/events/${id}/coming-soon`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isComingSoon }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to update Coming Soon status.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      await loadEvents();
    } catch {
      setError("Network error while updating Coming Soon status.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const cancelEvent = async (id: string) => {
    setMenuEventId(null);
    try {
      const res = await fetch(`/api/events/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to cancel event.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      await loadEvents();
    } catch {
      setError("Network error while cancelling event.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const deleteEvent = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;
    setMenuEventId(null);

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        if (res.status === 409) {
          const shouldCancel = window.confirm(
            `${json.message || "This event has existing bookings."}\n\nWould you like to cancel and hide it from the public website instead?`
          );
          if (shouldCancel) {
            await cancelEvent(id);
            return;
          }
        }
        setError(json.message || "Failed to delete event.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      await loadEvents();
    } catch {
      setError("Network error while deleting event.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <AdminShell
      title="Event Management"
      breadcrumb="IFE Administration"
      actions={
        <div className="hidden items-center gap-2 border border-white/10 px-3 py-2 sm:flex">
          <Search size={15} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-36 bg-transparent text-xs outline-none placeholder:text-gray-600"
          />
        </div>
      }
    >
      <div className="space-y-8">
          {/* Heading */}
          <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-xs text-gray-500">
                Manage your platform events
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
                All <span className="text-[#D4AF6A]">Events</span>
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Create, update, publish and manage IFE events.
              </p>
            </div>

            <Link
              href="/admin/events/new"
              className="inline-flex items-center justify-center gap-2 bg-[#D4AF6A] px-5 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-[#F5E5B5]"
            >
              <Plus size={16} />
              Create New Event
            </Link>
          </section>

          {error && (
            <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              {error}
            </div>
          )}

          {loading && (
            <div className="border border-white/10 bg-[#101010] px-4 py-3 text-xs text-gray-400">
              Loading events from database...
            </div>
          )}

          {/* Summary Cards */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Total Events",
                value: events.length,
                description: "All event records",
              },
              {
                label: "Published",
                value: publishedCount,
                description: "Visible event records",
              },
              {
                label: "Drafts",
                value: draftCount,
                description: "Unpublished records",
              },
              {
                label: "Completed",
                value: completedCount,
                description: "Past event records",
              },
            ].map((item) => (
              <article
                key={item.label}
                className="border border-white/10 bg-[#101010] p-5"
              >
                <p className="text-xs text-gray-500">{item.label}</p>
                <h3 className="mt-4 text-3xl font-semibold">
                  {item.value}
                </h3>
                <p className="mt-2 text-[10px] text-gray-600">
                  {item.description}
                </p>
              </article>
            ))}
          </section>

          {/* Event List */}
          <section className="border border-white/10 bg-[#101010]">
            <div className="flex flex-col gap-5 border-b border-white/10 p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">
                    Event Directory
                  </h3>
                  <p className="mt-1 text-[10px] text-gray-500">
                    {filteredEvents.length} events found
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Filter size={15} />
                  Filters
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="flex items-center gap-2 border border-white/10 bg-black px-3 md:hidden">
                  <Search size={15} className="text-gray-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search events..."
                    className="w-full bg-transparent py-3 text-xs outline-none placeholder:text-gray-600"
                  />
                </div>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border border-white/10 bg-black px-4 py-3 text-xs text-gray-300 outline-none focus:border-[#D4AF6A]"
                >
                  <option>All Categories</option>
                  <option>Fashion</option>
                  <option>Entertainment</option>
                  <option>Awards</option>
                </select>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-white/10 bg-black px-4 py-3 text-xs text-gray-300 outline-none focus:border-[#D4AF6A]"
                >
                  <option>All Statuses</option>
                  <option>Published</option>
                  <option>Draft</option>
                  <option>Completed</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All Categories");
                    setStatus("All Statuses");
                  }}
                  className="border border-white/10 px-4 py-3 text-xs text-gray-400 transition hover:border-[#D4AF6A]/50 hover:text-[#D4AF6A]"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-gray-500">
                    <th className="px-7 py-5 font-medium">Event</th>
                    <th className="px-5 py-5 font-medium">Category</th>
                    <th className="px-5 py-5 font-medium">Date & Venue</th>
                    <th className="px-5 py-5 font-medium">Tickets</th>
                    <th className="px-5 py-5 font-medium">Revenue</th>
                    <th className="px-5 py-5 font-medium">Status</th>
                    <th className="px-5 py-5 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-white/[0.06] transition hover:bg-white/[0.02]"
                    >
                      <td className="px-7 py-5">
                        <div className="flex items-center gap-3">
                          {event.bannerUrl ? (
                            <img
                              src={event.bannerUrl}
                              alt={event.title}
                              className="size-11 shrink-0 rounded-md border border-white/10 object-cover"
                            />
                          ) : (
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-xs text-[#D4AF6A]">
                              <CalendarDays size={16} />
                            </div>
                          )}
                          <div>
                            <p className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white">
                              {event.title}
                              {event.isPopupFeatured && (
                                <span className="rounded-full border border-[#D4AF6A]/40 bg-[#D4AF6A]/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#D4AF6A]">
                                  Popup
                                </span>
                              )}
                              {event.isBannerFeatured && (
                                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-300">
                                  Banner
                                </span>
                              )}
                              {event.isComingSoon && (
                                <span className="rounded-full border border-sky-500/40 bg-sky-500/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-sky-300">
                                  Coming Soon
                                </span>
                              )}
                            </p>
                            <p className="mt-1 text-[10px] text-gray-600">
                              ID: {event.id.slice(0, 10)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <span className="border border-[#D4AF6A]/20 bg-[#D4AF6A]/10 px-3 py-1 text-[9px] text-[#D4AF6A]">
                          {event.category}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-xs text-gray-300">
                          {event.date}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-600">
                          {event.venue}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-xs text-gray-300">
                          {event.ticketsSold} / {event.totalTickets}
                        </p>
                        <div className="mt-2 h-1 w-24 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full bg-[#D4AF6A]"
                            style={{
                              width: `${
                                event.totalTickets
                                  ? Math.min(
                                      (event.ticketsSold / event.totalTickets) * 100,
                                      100
                                    )
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </td>

                      <td className="px-5 py-5 text-xs font-medium">
                        {formatCurrency(event.revenue)}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-[9px] font-semibold ${
                            event.status === "Published"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : event.status === "Draft"
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-gray-500/10 text-gray-400"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>

                      <td className="relative px-5 py-5">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/events/${event.id}`}
                            target="_blank"
                            title="Preview event"
                            className="text-gray-500 transition hover:text-[#D4AF6A]"
                          >
                            <Eye size={16} />
                          </Link>

                          <Link
                            href={`/admin/events/${event.id}/edit`}
                            title="Edit event"
                            className="text-gray-500 transition hover:text-[#D4AF6A]"
                          >
                            <Pencil size={16} />
                          </Link>

                          <button
                            type="button"
                            title="More actions"
                            onClick={() =>
                              setMenuEventId(
                                menuEventId === event.id ? null : event.id
                              )
                            }
                            className="text-gray-500 transition hover:text-white"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                        </div>

                        {menuEventId === event.id && (
                          <div className="absolute right-8 top-12 z-20 w-44 border border-white/10 bg-[#181818] p-2 shadow-xl">
                            <button
                              type="button"
                              onClick={() => togglePublish(event.id)}
                              className="w-full px-3 py-3 text-left text-[11px] text-gray-300 transition hover:bg-white/5 hover:text-[#D4AF6A]"
                            >
                              {event.status === "Published"
                                ? "Move to Draft"
                                : "Publish Event"}
                            </button>

                            {event.status === "Published" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPopupEvent(event.id, !event.isPopupFeatured)
                                  }
                                  className="w-full px-3 py-3 text-left text-[11px] text-[#D4AF6A] transition hover:bg-[#D4AF6A]/10"
                                >
                                  {event.isPopupFeatured
                                    ? "Remove from Popup"
                                    : "Set as Homepage Popup"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setBannerEvent(
                                      event.id,
                                      !event.isBannerFeatured
                                    )
                                  }
                                  className="w-full px-3 py-3 text-left text-[11px] text-emerald-300 transition hover:bg-emerald-500/10"
                                >
                                  {event.isBannerFeatured
                                    ? "Remove from Banner"
                                    : "Set as Homepage Banner"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setComingSoonEvent(
                                      event.id,
                                      !event.isComingSoon
                                    )
                                  }
                                  className="w-full px-3 py-3 text-left text-[11px] text-sky-300 transition hover:bg-sky-500/10"
                                >
                                  {event.isComingSoon
                                    ? "Remove Coming Soon"
                                    : "Mark as Coming Soon"}
                                </button>
                              </>
                            )}

                            {event.status !== "Cancelled" && (
                              <button
                                type="button"
                                onClick={() => cancelEvent(event.id)}
                                className="w-full px-3 py-3 text-left text-[11px] text-amber-300 transition hover:bg-amber-500/10"
                              >
                                Cancel Event
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => deleteEvent(event.id)}
                              className="flex w-full items-center gap-2 px-3 py-3 text-left text-[11px] text-red-400 transition hover:bg-red-500/10"
                            >
                              <Trash2 size={14} />
                              Delete Event
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  {filteredEvents.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-14 text-center text-xs text-gray-500"
                      >
                        No events match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
      </div>
    </AdminShell>
  );
}
