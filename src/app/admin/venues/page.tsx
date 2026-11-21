
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
  X,
  CheckCircle2,
  Clock,
  Menu,
  UsersRound,
  Building2,
  Armchair,
  MapPinned,
  Filter,
} from "lucide-react";

type Venue = {
  id: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
  eventCount: number;
  facilities: string[];
  contact: string;
  email: string;
  status: "Available" | "Booked" | "Maintenance";
};

type ApiVenue = {
  id: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
  facilities: string | null;
  status: "AVAILABLE" | "BOOKED" | "MAINTENANCE" | "INACTIVE";
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

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mapVenues = (items: ApiVenue[]): Venue[] =>
    items.map((v) => ({
      id: v.id,
      name: v.name,
      city: v.city,
      address: v.address,
      capacity: v.capacity,
      eventCount: v._count?.events ?? 0,
      facilities: v.facilities
        ? v.facilities.split(",").map((f) => f.trim()).filter(Boolean)
        : [],
      contact: "—",
      email: "—",
      status:
        v.status === "BOOKED"
          ? "Booked"
          : v.status === "MAINTENANCE"
            ? "Maintenance"
            : "Available",
    }));

  const loadVenues = useCallback(async () => {
    try {
      const res = await fetch("/api/venues?limit=100");
      const json = await res.json();
      if (res.ok && json.success) {
        setVenues(mapVenues(json.data.items || []));
      }
    } catch {}
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/venues?limit=100")
      .then((res) => res.json())
      .then((json) => {
        if (active && json.success) {
          setVenues(mapVenues(json.data.items || []));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      const term = search.toLowerCase();
      const matchesSearch =
        venue.name.toLowerCase().includes(term) ||
        venue.city.toLowerCase().includes(term) ||
        venue.address.toLowerCase().includes(term);

      const matchesStatus =
        status === "All Status" || venue.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [venues, search, status]);

  const totalCapacity = venues.reduce((sum, venue) => sum + venue.capacity, 0);
  const availableCount = venues.filter((venue) => venue.status === "Available").length;
  const bookedCount = venues.filter((venue) => venue.status === "Booked").length;
  const maintenanceCount = venues.filter(
    (venue) => venue.status === "Maintenance"
  ).length;

  const changeStatus = async (id: string, nextStatus: Venue["status"]) => {
    const apiStatus =
      nextStatus === "Booked"
        ? "BOOKED"
        : nextStatus === "Maintenance"
          ? "MAINTENANCE"
          : "AVAILABLE";
    const res = await fetch(`/api/venues/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: apiStatus }),
    });
    if (res.ok) await loadVenues();
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0d0d0d] transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center border-b border-white/10 px-7">
          <span className="font-serif text-3xl tracking-[0.2em] text-[#D4AF6A]">
            IFE
          </span>
          <span className="ml-3 text-[10px] tracking-[0.2em] text-gray-400">
            ADMIN PANEL
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
            Management
          </p>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = item.label === "Venues";
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                  active
                    ? "bg-[#D4AF6A]/10 text-[#D4AF6A]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-5">
          <p className="text-xs text-gray-500">IFE Management System</p>
          <p className="mt-1 text-xs text-[#D4AF6A]">Admin Workspace</p>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#080808]/95 px-5 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="text-gray-300 lg:hidden"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-lg font-semibold">Venues Management</h1>
              <p className="hidden text-xs text-gray-500 sm:block">
                Manage event locations, facilities and venue availability
              </p>
            </div>
          </div>
          <Link
            href="/admin/venues/new"
            className="flex items-center gap-2 rounded-lg bg-[#D4AF6A] px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-[#e5c783]"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Venue</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </header>

        <div className="space-y-7 p-5 md:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF6A]">
              Venue Directory
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">
              Event <span className="text-[#D4AF6A]">Locations</span>
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Keep venue information, capacity and availability organised.
            </p>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Venues", value: venues.length, icon: Building2 },
              { label: "Available", value: availableCount, icon: CheckCircle2 },
              { label: "Currently Booked", value: bookedCount, icon: CalendarDays },
              { label: "Under Maintenance", value: maintenanceCount, icon: Clock },
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

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-[#111] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[#D4AF6A]/10 p-3 text-[#D4AF6A]">
                  <UsersRound size={21} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Combined Venue Capacity</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {totalCapacity.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#111] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[#D4AF6A]/10 p-3 text-[#D4AF6A]">
                  <Armchair size={21} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Events Hosted</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {venues.reduce((sum, venue) => sum + venue.eventCount, 0)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-[#111] p-4 md:p-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search venue name, city or address..."
                  className="w-full rounded-lg border border-white/10 bg-[#080808] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#D4AF6A]/60"
                />
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-white/10 bg-[#080808] px-4 py-3 text-sm text-gray-300 outline-none focus:border-[#D4AF6A]/60"
              >
                <option>All Status</option>
                <option>Available</option>
                <option>Booked</option>
                <option>Maintenance</option>
              </select>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <Filter size={14} />
              Showing {filteredVenues.length} of {venues.length} venues
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            {filteredVenues.map((venue) => (
              <article
                key={venue.id}
                className="overflow-hidden rounded-xl border border-white/10 bg-[#111] transition hover:border-[#D4AF6A]/30"
              >
                <div className="flex min-h-36 items-center justify-between bg-gradient-to-br from-[#282116] via-[#15120d] to-[#101010] p-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF6A]">
                      IFE Venue
                    </p>
                    <h3 className="mt-3 max-w-xs font-serif text-2xl">
                      {venue.name}
                    </h3>
                    <p className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                      <MapPin size={13} />
                      {venue.city}
                    </p>
                  </div>
                  <div className="hidden rounded-xl border border-[#D4AF6A]/20 bg-black/20 p-4 text-[#D4AF6A] sm:block">
                    <Building2 size={32} />
                  </div>
                </div>

                <div className="space-y-5 p-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Maximum Capacity</p>
                      <p className="mt-1 flex items-center gap-2 font-semibold">
                        <UsersRound size={15} className="text-[#D4AF6A]" />
                        {venue.capacity.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Events Hosted</p>
                      <p className="mt-1 flex items-center gap-2 font-semibold">
                        <CalendarDays size={15} className="text-[#D4AF6A]" />
                        {venue.eventCount}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs text-gray-500">Facilities</p>
                    <div className="flex flex-wrap gap-2">
                      {venue.facilities.map((facility) => (
                        <span
                          key={facility}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-gray-300"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-xs ${
                        venue.status === "Available"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : venue.status === "Booked"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {venue.status}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedVenue(venue)}
                        className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 hover:border-[#D4AF6A]/50 hover:text-[#D4AF6A]"
                      >
                        <Eye size={14} />
                        View
                      </button>
                      <Link
                        href={`/admin/venues/${venue.id}/edit`}
                        className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 hover:border-[#D4AF6A]/50 hover:text-[#D4AF6A]"
                      >
                        <Pencil size={14} />
                        Edit
                      </Link>
                      <select
                        aria-label={`Change ${venue.name} status`}
                        value={venue.status}
                        onChange={(e) =>
                          changeStatus(
                            venue.id,
                            e.target.value as Venue["status"]
                          )
                        }
                        className="max-w-36 rounded-lg border border-white/10 bg-[#080808] px-2 py-2 text-xs text-gray-300 outline-none"
                      >
                        <option>Available</option>
                        <option>Booked</option>
                        <option>Maintenance</option>
                      </select>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {filteredVenues.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-[#111] p-10 text-center text-sm text-gray-500 xl:col-span-2">
                No venues match your search.
              </div>
            )}
          </section>

          <div className="rounded-xl border border-[#D4AF6A]/20 bg-[#D4AF6A]/5 p-4">
            <p className="text-sm font-medium text-[#D4AF6A]">Demo data notice</p>
            <p className="mt-1 text-xs leading-6 text-gray-400">
              Venue details and availability changes currently use local React
              state and reset on refresh. Venue booking calendars, database
              storage, image uploads and event-to-venue assignment are not yet
              connected.
            </p>
          </div>
        </div>
      </main>

      {selectedVenue && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF6A]">
                  Venue Details
                </p>
                <h3 className="mt-2 font-serif text-2xl">
                  {selectedVenue.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVenue(null)}
                aria-label="Close venue details"
                className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-5 text-sm">
              <div>
                <p className="text-xs text-gray-500">Full Address</p>
                <p className="mt-1 flex items-start gap-2 text-gray-300">
                  <MapPinned size={16} className="mt-0.5 shrink-0 text-[#D4AF6A]" />
                  {selectedVenue.address}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Capacity</p>
                  <p className="mt-1 font-semibold">
                    {selectedVenue.capacity.toLocaleString("en-IN")} people
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Events Hosted</p>
                  <p className="mt-1 font-semibold">{selectedVenue.eventCount}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Contact Number</p>
                <p className="mt-1 text-gray-300">{selectedVenue.contact}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="mt-1 text-gray-300">{selectedVenue.email}</p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500">Available Facilities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedVenue.facilities.map((facility) => (
                    <span
                      key={facility}
                      className="rounded-full border border-[#D4AF6A]/20 bg-[#D4AF6A]/5 px-3 py-1.5 text-xs text-[#D4AF6A]"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Current Status</p>
                <p className="mt-1 font-medium">{selectedVenue.status}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedVenue(null)}
              className="mt-7 w-full rounded-lg bg-[#D4AF6A] py-3 text-sm font-semibold text-black hover:bg-[#e5c783]"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
