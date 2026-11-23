"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiCalendar,
  FiCreditCard,
  FiGrid,
  FiImage,
  FiLogOut,
  FiMapPin,
  FiMenu,
  FiMic,
  FiSettings,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { HiOutlineTicket } from "react-icons/hi2";

const navigationGroups = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: FiGrid },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Events", href: "/admin/events", icon: FiCalendar },
      { label: "Tickets", href: "/admin/tickets", icon: HiOutlineTicket },
      { label: "Bookings", href: "/admin/bookings", icon: FiCreditCard },
      { label: "Customers", href: "/admin/customers", icon: FiUsers },
      { label: "Payments", href: "/admin/payments", icon: FiCreditCard },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Artists", href: "/admin/artists", icon: FiMic },
      { label: "Venues", href: "/admin/venues", icon: FiMapPin },
      { label: "Gallery", href: "/admin/gallery", icon: FiImage },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: FiSettings },
    ],
  },
];

type AdminShellProps = {
  title: string;
  breadcrumb?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function AdminShell({
  title,
  breadcrumb = "IFE Administration",
  actions,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((json) => {
        if (!active || !json.success || !json.data?.user) return;
        const u = json.data.user;
        setAdminUser({ name: u.name, email: u.email, role: u.role });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const initials = adminUser?.name
    ? adminUser.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Unified Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-white/10 bg-[#0A0A0A] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center border border-[#D4AF6A]/50 bg-[#D4AF6A]/10 font-[var(--font-playfair)] text-xl text-[#D4AF6A]">
              I
            </div>
            <div>
              <p className="font-[var(--font-playfair)] text-lg tracking-wider text-white">
                IFE
              </p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF6A]">
                Admin Portal
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
            className="text-gray-500 transition hover:text-white lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {navigationGroups.map((group) => (
            <div key={group.title} className="mb-7 last:mb-0">
              <p className="mb-2.5 px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-gray-600">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition ${
                        active
                          ? "border border-[#D4AF6A]/25 bg-[#D4AF6A]/10 text-[#D4AF6A]"
                          : "border border-transparent text-gray-400 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                      {active && (
                        <span className="ml-auto size-1.5 rounded-full bg-[#D4AF6A]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#D4AF6A]/15 text-xs font-bold text-[#D4AF6A]">
              {initials}
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
              onClick={handleLogout}
              aria-label="Sign out"
              title="Sign out"
              className="text-gray-500 transition hover:text-red-400"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-col lg:pl-[270px]">
        <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between gap-4 border-b border-white/10 bg-[#080808]/95 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="flex size-10 items-center justify-center border border-white/10 text-[#D4AF6A] transition hover:border-[#D4AF6A] lg:hidden"
            >
              <FiMenu size={20} />
            </button>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                {breadcrumb}
              </p>
              <h1 className="mt-1 text-lg font-semibold text-white">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">{actions}</div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] flex-1 px-5 py-8 sm:px-8">
          {children}
        </main>

        <footer className="border-t border-white/10 px-5 py-6 text-center text-[10px] tracking-wider text-gray-600 sm:px-8">
          © {new Date().getFullYear()} IFE ADMINISTRATION PORTAL. ALL RIGHTS RESERVED.
        </footer>
      </div>
    </div>
  );
}

