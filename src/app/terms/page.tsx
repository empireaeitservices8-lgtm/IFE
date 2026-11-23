import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions | IFE",
  description:
    "Terms and conditions for International Fashion Entertainment event bookings.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050505] px-6 pb-20 pt-28 text-white">
        <div className="container-main max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
            Legal
          </p>
          <h1 className="mt-3 font-[var(--font-playfair)] text-4xl md:text-5xl">
            Terms &amp; Conditions
          </h1>
          <div className="mt-8 space-y-6 border-t border-white/10 pt-8 text-sm leading-7 text-white/70">
            <p>
              All tickets booked through International Fashion Entertainment
              (IFE) are subject to event availability, venue entry rules, and
              confirmed payment verification.
            </p>
            <p>
              Digital passes and QR codes are valid for single entry per
              ticketed guest unless otherwise specified for VIP or multi-day
              passes.
            </p>
            <p>
              For booking support, schedule changes, or accessibility
              requests, please reach out via our{" "}
              <Link href="/contact" className="text-[#D4AF6A] hover:underline">
                Contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

