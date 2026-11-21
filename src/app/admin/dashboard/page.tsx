
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  MoreHorizontal,
  Eye,
  Plus,
  LogOut,
  BarChart3,
} from "lucide-react";

const navigation = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Events", href: "/admin/events", icon: CalendarDays },
      { label: "Tickets", href: "/admin/tickets", icon: Ticket },
      { label: "Bookings", href: "/admin/bookings", icon: CreditCard },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Payments", href: "/admin/payments", icon: Wallet },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Artists", href: "/admin/artists", icon: Mic2 },
      { label: "Venues", href: "/admin/venues", icon: MapPin },
      { label: "Gallery", href: "/admin/gallery", icon: Image },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

type DashboardStats = {
  netRevenue: number;
  totalBookings: number;
  confirmedBookings: number;
  totalCustomers: number;
  publishedEvents: number;
  ticketsSold: number;
  totalTicketCapacity: number;
};

type DashboardBooking = {
  id: string;
  bookingCode: string;
  customerName: string;
  totalAmount: string | number;
  status: string;
  createdAt: string;
  event: { id: string; title: string };
};

type RevenueMonth = {
  month: string;
  revenue: number;
};

type UpcomingEventItem = {
  id: string;
  title: string;
  category: string;
  startAt: string;
  soldTickets: number;
  totalTickets: number;
};

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function Sidebar({
  open,
  onClose,
  adminUser,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  adminUser: { name: string; email: string } | null;
  onLogout: () => void;
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
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-white/10 bg-[#0A0A0A] transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-7">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center border border-[#D4AF6A]/50 font-serif text-xl text-[#D4AF6A]">
              I
            </div>
            <div>
              <p className="font-serif text-lg tracking-wider text-white">
                IFE
              </p>
              <p className="text-[8px] uppercase tracking-[0.25em] text-[#D4AF6A]">
                Admin Portal
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-7">
          {navigation.map((group) => (
            <div key={group.title} className="mb-8">
              <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-gray-600">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = item.label === "Dashboard";

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
                      {active && (
                        <span className="ml-auto size-1.5 rounded-full bg-[#D4AF6A]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Admin Profile */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] p-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#D4AF6A]/15 text-xs font-bold text-[#D4AF6A]">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {adminUser?.name || "Administrator"}
              </p>
              <p className="truncate text-[10px] text-gray-500">
                {adminUser?.email || "admin@ife-events.com"}
              </p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              aria-label="Admin sign out"
              title="Admin sign out"
              className="text-gray-500 transition hover:text-red-400"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState("This year");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<DashboardBooking[]>([]);
  const [revenueMonths, setRevenueMonths] = useState<RevenueMonth[]>([]);
  const [upcomingEventsList, setUpcomingEventsList] = useState<UpcomingEventItem[]>([]);

  useEffect(() => {
    let active = true;
    async function loadDashboard() {
      try {
        setLoading(true);
        const meRes = await fetch("/api/auth/me");
        const meJson = await meRes.json();
        if (
          !meRes.ok ||
          !meJson.success ||
          (meJson.data?.user?.role !== "ADMIN" &&
            meJson.data?.user?.role !== "STAFF")
        ) {
          router.push("/admin/login");
          return;
        }
        if (active) {
          setAdminUser({
            name: meJson.data.user.name,
            email: meJson.data.user.email,
          });
        }

        const [statsRes, revRes, bookRes, upRes] = await Promise.all([
          fetch("/api/admin/dashboard/stats"),
          fetch("/api/admin/dashboard/revenue"),
          fetch("/api/admin/dashboard/recent-bookings"),
          fetch("/api/admin/dashboard/upcoming-events"),
        ]);

        const [statsJson, revJson, bookJson, upJson] = await Promise.all([
          statsRes.json(),
          revRes.json(),
          bookRes.json(),
          upRes.json(),
        ]);

        if (!active) return;
        if (statsJson.success) setStatsData(statsJson.data.stats);
        if (revJson.success) setRevenueMonths(revJson.data.monthly || []);
        if (bookJson.success) setRecentBookings(bookJson.data.items || []);
        if (upJson.success) setUpcomingEventsList(upJson.data.items || []);
      } catch {
        if (active) setError("Failed to load live dashboard metrics.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadDashboard();
    return () => {
      active = false;
    };
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const statCards = [
    {
      label: "Total Revenue",
      value: formatINR(statsData?.netRevenue ?? 0),
      change: "Live",
      positive: true,
      icon: Wallet,
      description: "Captured net revenue",
    },
    {
      label: "Total Bookings",
      value: String(statsData?.totalBookings ?? 0),
      change: `${statsData?.confirmedBookings ?? 0} confirmed`,
      positive: true,
      icon: Ticket,
      description: "Across all events",
    },
    {
      label: "Total Customers",
      value: String(statsData?.totalCustomers ?? 0),
      change: "Active",
      positive: true,
      icon: Users,
      description: "Registered accounts",
    },
    {
      label: "Active Events",
      value: String(statsData?.publishedEvents ?? 0),
      change: `${statsData?.ticketsSold ?? 0} sold`,
      positive: true,
      icon: CalendarDays,
      description: "Published showcases",
    },
  ];

  const maxRev = Math.max(1, ...revenueMonths.map((m) => m.revenue));
  const chartBars =
    revenueMonths.length > 0
      ? revenueMonths.map((m) => ({
          month: m.month,
          value: Math.max(8, Math.round((m.revenue / maxRev) * 100)),
          raw: m.revenue,
        }))
      : [{ month: "No Data", value: 8, raw: 0 }];

  const filteredBookings = recentBookings.filter((booking) =>
    `${booking.bookingCode} ${booking.customerName} ${booking.event?.title ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        adminUser={adminUser}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="min-h-screen lg:pl-[270px]">

        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-white/10 bg-[#080808]/95 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="text-[#D4AF6A] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={23} />
            </button>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                IFE Administration
              </p>
              <h1 className="mt-1 text-lg font-semibold text-white">
                Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden items-center gap-2 border border-white/10 px-3 py-2 md:flex">
              <Search size={15} className="text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bookings..."
                className="w-36 bg-transparent text-xs text-white outline-none placeholder:text-gray-600"
              />
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="relative text-gray-400 transition hover:text-[#D4AF6A]"
            >
              <Bell size={19} />
              <span className="absolute -right-1 -top-1 size-2 rounded-full bg-[#D4AF6A]" />
            </button>

            <div className="hidden h-8 w-px bg-white/10 sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-full bg-[#D4AF6A]/15 text-xs font-bold text-[#D4AF6A]">
                AD
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold">Admin</p>
                <p className="text-[10px] text-gray-500">Administrator</p>
              </div>
              <ChevronDown size={14} className="hidden text-gray-500 sm:block" />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] space-y-8 px-5 py-8 sm:px-8">

          {/* Welcome */}
          <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-xs text-gray-500">
                Saturday, November 21, 2026
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
                Welcome back, <span className="text-[#D4AF6A]">Admin.</span>
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Here&apos;s what&apos;s happening with your event platform.
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

          {/* Statistics */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.label}
                  className="border border-white/10 bg-[#101010] p-5 transition hover:border-[#D4AF6A]/40"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <div className="flex size-10 items-center justify-center border border-[#D4AF6A]/20 bg-[#D4AF6A]/10 text-[#D4AF6A]">
                      <Icon size={18} />
                    </div>
                  </div>

                  <h3 className="mt-5 text-2xl font-semibold tracking-tight">
                    {stat.value}
                  </h3>

                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1 text-[10px] font-semibold ${
                        stat.positive ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {stat.positive ? (
                        <ArrowUpRight size={13} />
                      ) : (
                        <ArrowDownRight size={13} />
                      )}
                      {stat.change}
                    </span>
                    <span className="text-[10px] text-gray-600">
                      {stat.description}
                    </span>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Revenue Chart and Summary */}
          <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">

            {/* Revenue Chart */}
            <div className="border border-white/10 bg-[#101010] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500">Revenue Overview</p>
                  <h3 className="mt-2 text-2xl font-semibold">
                    {formatINR(statsData?.netRevenue ?? 0)}
                  </h3>
                  <p className="mt-1 text-[10px] text-emerald-400">
                    {loading ? "Loading..." : "Live database revenue"}
                  </p>
                </div>

                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="border border-white/10 bg-[#080808] px-3 py-2 text-xs text-gray-300 outline-none focus:border-[#D4AF6A]"
                >
                  <option>This year</option>
                  <option>Last 6 months</option>
                </select>
              </div>

              <div className="mt-10 flex h-56 items-end gap-2 border-b border-white/10 pb-2 sm:gap-4">
                {chartBars.map((item) => (
                  <div
                    key={item.month}
                    className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div
                      className="relative w-full max-w-10 rounded-t-sm bg-gradient-to-t from-[#8E6C34] to-[#E6C27C] opacity-70 transition duration-300 group-hover:opacity-100"
                      style={{ height: `${item.value}%` }}
                      title={`${item.month}: ${formatINR(item.raw)}`}
                    />
                    <span className="text-[9px] text-gray-600">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between text-[10px] text-gray-500">
                <span>Monthly revenue performance</span>
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#D4AF6A]" />
                  Revenue
                </span>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="border border-white/10 bg-[#101010] p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Booking Summary</h3>
                <MoreHorizontal size={19} className="text-gray-500" />
              </div>

              <div className="mt-9 flex items-center justify-center">
                <div className="relative flex size-48 items-center justify-center rounded-full bg-[conic-gradient(#D4AF6A_0deg_230deg,#87652F_230deg_300deg,#292929_300deg_360deg)]">
                  <div className="flex size-36 flex-col items-center justify-center rounded-full bg-[#101010]">
                    <span className="text-3xl font-semibold">
                      {statsData?.totalBookings ?? 0}
                    </span>
                    <span className="mt-1 text-[10px] text-gray-500">
                      Total Bookings
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  {
                    label: "Confirmed",
                    count: String(statsData?.confirmedBookings ?? 0),
                    color: "bg-[#D4AF6A]",
                  },
                  {
                    label: "Tickets Sold",
                    count: String(statsData?.ticketsSold ?? 0),
                    color: "bg-[#87652F]",
                  },
                  {
                    label: "Total Capacity",
                    count: String(statsData?.totalTicketCapacity ?? 0),
                    color: "bg-gray-700",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`size-2 rounded-full ${item.color}`} />
                      <span className="text-xs text-gray-400">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-xs font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recent Bookings */}
          <section className="border border-white/10 bg-[#101010]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-7">
              <div>
                <h3 className="text-sm font-semibold">Recent Bookings</h3>
                <p className="mt-1 text-[10px] text-gray-500">
                  Latest customer booking activity
                </p>
              </div>

              <Link
                href="/admin/bookings"
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#D4AF6A] transition hover:text-white"
              >
                View All
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-gray-500">
                    <th className="px-7 py-4 font-medium">Booking ID</th>
                    <th className="px-5 py-4 font-medium">Customer</th>
                    <th className="px-5 py-4 font-medium">Event</th>
                    <th className="px-5 py-4 font-medium">Date</th>
                    <th className="px-5 py-4 font-medium">Amount</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-white/[0.06] text-xs transition hover:bg-white/[0.02]"
                    >
                      <td className="px-7 py-5 font-medium text-[#D4AF6A]">
                        {booking.bookingCode}
                      </td>
                      <td className="px-5 py-5 text-gray-300">
                        {booking.customerName}
                      </td>
                      <td className="px-5 py-5 text-gray-400">
                        {booking.event?.title ?? "—"}
                      </td>
                      <td className="px-5 py-5 text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-5 font-semibold">
                        {formatINR(Number(booking.totalAmount))}
                      </td>
                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-[9px] font-semibold ${
                            booking.status === "CONFIRMED"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : booking.status === "PENDING"
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-5 py-5">
                        <Link
                          href="/admin/bookings"
                          aria-label={`View ${booking.bookingCode}`}
                          className="text-gray-500 transition hover:text-[#D4AF6A]"
                        >
                          <Eye size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {filteredBookings.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-10 text-center text-xs text-gray-500"
                      >
                        {loading ? "Loading recent bookings..." : "No bookings found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Upcoming Events */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Upcoming Events</h3>
                <p className="mt-1 text-[10px] text-gray-500">
                  Events scheduled on your platform
                </p>
              </div>

              <Link
                href="/admin/events"
                className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF6A] hover:text-white"
              >
                Manage Events
              </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {upcomingEventsList.map((event) => (
                <article
                  key={event.id}
                  className="border border-white/10 bg-[#101010] p-5 transition hover:border-[#D4AF6A]/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="border border-[#D4AF6A]/20 bg-[#D4AF6A]/10 px-3 py-1 text-[9px] uppercase tracking-wider text-[#D4AF6A]">
                      {event.category}
                    </span>
                    <CalendarDays size={17} className="text-gray-600" />
                  </div>

                  <h4 className="mt-5 font-serif text-xl">
                    {event.title}
                  </h4>

                  <p className="mt-3 text-xs text-gray-500">
                    {new Date(event.startAt).toLocaleDateString()}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-[10px] text-gray-500">
                      Tickets sold
                    </span>
                    <span className="text-xs font-semibold text-[#D4AF6A]">
                      {event.soldTickets} / {event.totalTickets}
                    </span>
                  </div>
                </article>
              ))}
              {!loading && upcomingEventsList.length === 0 && (
                <div className="col-span-full border border-white/10 bg-[#101010] p-8 text-center text-xs text-gray-500">
                  No upcoming events scheduled yet.
                </div>
              )}
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-white/10 py-6 text-center text-[10px] tracking-wider text-gray-600">
            © {new Date().getFullYear()} IFE ADMINISTRATION PORTAL. ALL RIGHTS RESERVED.
          </footer>
        </main>
      </div>
    </div>
  );
}
