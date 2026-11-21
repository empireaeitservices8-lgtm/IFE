
import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Fashion Shows", href: "/fashion-shows" },
  { name: "Entertainment", href: "/entertainment" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#090909]">
      <div className="container-main py-20">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand Information */}
          <div>
            <div className="relative mb-6 h-20 w-36">
              <Image
                src="/logo/ife-logo.png"
                alt="IFE Logo"
                fill
                className="object-contain object-left"
              />
            </div>

            <p className="max-w-xs text-sm leading-7 text-white/50">
              Creating extraordinary experiences through fashion,
              entertainment and world-class events.
            </p>

            {/* Social Media */}
            <div className="mt-7 flex gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xs font-semibold text-white/60 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
              >
                IG
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xs font-semibold text-white/60 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
              >
                FB
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xs font-semibold text-white/60 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
              >
                YT
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-7 text-xs font-semibold uppercase tracking-[3px] text-[#D4AF6A]">
              Quick Links
            </h3>

            <div className="space-y-4">
              {footerLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-sm text-white/55 transition hover:text-[#D4AF6A]"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Experiences */}
          <div>
            <h3 className="mb-7 text-xs font-semibold uppercase tracking-[3px] text-[#D4AF6A]">
              Experiences
            </h3>

            <div className="space-y-4 text-sm text-white/55">
              <p>Fashion Shows</p>
              <p>Live Entertainment</p>
              <p>Award Ceremonies</p>
              <p>Exclusive Events</p>
              <p>Special Experiences</p>
            </div>
          </div>

          {/* Stay Connected */}
          <div>
            <h3 className="mb-7 text-xs font-semibold uppercase tracking-[3px] text-[#D4AF6A]">
              Stay Connected
            </h3>

            <p className="mb-5 text-sm leading-7 text-white/50">
              Discover upcoming events and exclusive experiences.
            </p>

            <Link
              href="/events"
              className="inline-flex items-center gap-3 border-b border-[#D4AF6A] pb-2 text-xs font-semibold uppercase tracking-[2px] text-[#D4AF6A] transition hover:text-[#F5E5B5]"
            >
              Explore Events
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 flex flex-col justify-between gap-5 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
          <p>
            © {new Date().getFullYear()} IFE. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="transition hover:text-[#D4AF6A]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-[#D4AF6A]"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
