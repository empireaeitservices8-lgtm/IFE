"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiMenu,
  FiSearch,
  FiUser,
  FiX,
} from "react-icons/fi";
import { HiOutlineTicket } from "react-icons/hi2";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Fashion Shows", href: "/fashion-shows" },
  { name: "Entertainment", href: "/entertainment" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

const quickExploreLinks = [
  { name: "Upcoming Events", href: "/events" },
  { name: "Fashion Shows", href: "/fashion-shows" },
  { name: "Live Entertainment", href: "/entertainment" },
  { name: "My Tickets", href: "/my-tickets" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 60);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    setSearchOpen(false);
    setSearchQuery("");
    router.push(
      trimmed ? `/events?q=${encodeURIComponent(trimmed)}` : "/events"
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${scrolled
            ? "border-b border-white/15 bg-[#050505]/90 shadow-[0_12px_36px_rgba(0,0,0,0.55)] backdrop-blur-xl"
            : "border-b border-white/10 bg-black/45 backdrop-blur-md"
          }`}
      >
        <div
          className={`container-main flex items-center justify-between transition-all duration-300 ${scrolled ? "h-20" : "h-24"
            }`}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            className="relative h-14 w-28 shrink-0 transition-opacity hover:opacity-90 sm:h-16 sm:w-32"
            aria-label="IFE Home"
          >
            <Image
              src="/logo/ife-logo.png"
              alt="IFE International Fashion Entertainment"
              fill
              priority
              className="object-contain object-left"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            {navLinks.map((link) => {
              const active = isActiveLink(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative py-2 text-[11px] font-medium uppercase tracking-[1.8px] transition-colors ${active
                      ? "text-[#D4AF6A]"
                      : "text-white/75 hover:text-white"
                    }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-[#D4AF6A] transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
              className={`flex h-10 w-10 items-center justify-center border transition-colors ${searchOpen
                  ? "border-[#D4AF6A] bg-[#D4AF6A]/10 text-[#D4AF6A]"
                  : "border-white/15 bg-white/[0.03] text-white/80 hover:border-[#D4AF6A]/60 hover:text-[#D4AF6A]"
                }`}
            >
              {searchOpen ? <FiX size={17} /> : <FiSearch size={17} />}
            </button>

            <Link
              href="/dashboard"
              aria-label="Account dashboard"
              className="flex h-10 w-10 items-center justify-center border border-white/15 bg-white/[0.03] text-white/80 transition-colors hover:border-[#D4AF6A]/60 hover:text-[#D4AF6A]"
            >
              <FiUser size={17} />
            </Link>

            <Link
              href="/events"
              className="ml-1 flex items-center gap-2.5 bg-[#D4AF6A] px-5 py-3 text-[11px] font-bold uppercase tracking-[1.8px] text-black transition-all hover:bg-[#F5E5B5]"
            >
              <HiOutlineTicket size={16} />
              Book Tickets
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setSearchOpen((prev) => !prev);
              }}
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
              className="flex h-10 w-10 items-center justify-center border border-white/15 bg-white/[0.03] text-white/85 transition-colors hover:border-[#D4AF6A]/60 hover:text-[#D4AF6A]"
            >
              {searchOpen ? <FiX size={18} /> : <FiSearch size={18} />}
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setMobileOpen((prev) => !prev);
              }}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-drawer"
              className="flex h-10 w-10 items-center justify-center border border-white/15 bg-white/[0.03] text-white transition-colors hover:border-[#D4AF6A]/60 hover:text-[#D4AF6A]"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-white/10 bg-[#080808]/95 backdrop-blur-xl"
            >
              <div className="container-main py-5">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center gap-3 border-b border-white/20 pb-3 focus-within:border-[#D4AF6A]"
                >
                  <FiSearch size={18} className="shrink-0 text-[#D4AF6A]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search fashion shows, live experiences, awards..."
                    className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 bg-[#D4AF6A] px-4 py-2 text-[11px] font-semibold uppercase tracking-[1.5px] text-black transition-colors hover:bg-[#F5E5B5]"
                  >
                    Search
                  </button>
                </form>

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[2.5px] text-white/40">
                    Quick Explore
                  </span>
                  {quickExploreLinks.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSearchOpen(false)}
                      className="inline-flex items-center gap-1 text-xs text-white/70 transition-colors hover:text-[#D4AF6A]"
                    >
                      {item.name}
                      <FiArrowUpRight size={13} />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-[#050505]/98 pt-24 backdrop-blur-2xl lg:hidden"
          >
            <div className="container-main flex h-[calc(100dvh-6rem)] flex-col justify-between overflow-y-auto py-8">
              <nav aria-label="Mobile navigation" className="space-y-1">
                {navLinks.map((link) => {
                  const active = isActiveLink(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between border-b border-white/10 py-4 transition-colors ${active
                          ? "text-[#D4AF6A]"
                          : "text-white/80 hover:text-white"
                        }`}
                    >
                      <span className="font-[var(--font-playfair)] text-2xl tracking-tight">
                        {link.name}
                      </span>
                      <FiArrowUpRight
                        size={18}
                        className={active ? "text-[#D4AF6A]" : "text-white/35"}
                      />
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 border border-white/15 bg-white/[0.03] px-4 py-3 text-xs font-medium uppercase tracking-[1.5px] text-white/85 transition-colors hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                  >
                    <FiUser size={15} />
                    Account
                  </Link>
                  <Link
                    href="/my-tickets"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 border border-white/15 bg-white/[0.03] px-4 py-3 text-xs font-medium uppercase tracking-[1.5px] text-white/85 transition-colors hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                  >
                    <HiOutlineTicket size={15} />
                    My Tickets
                  </Link>
                </div>

                <Link
                  href="/events"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2.5 bg-[#D4AF6A] px-6 py-4 text-xs font-bold uppercase tracking-[2px] text-black transition-colors hover:bg-[#F5E5B5]"
                >
                  <HiOutlineTicket size={16} />
                  Book Tickets
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
