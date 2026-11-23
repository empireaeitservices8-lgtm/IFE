import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | IFE",
  description:
    "Privacy policy for International Fashion Entertainment (IFE).",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050505] px-6 pb-20 pt-28 text-white">
        <div className="container-main max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
            Legal
          </p>
          <h1 className="mt-3 font-[var(--font-playfair)] text-4xl md:text-5xl">
            Privacy Policy
          </h1>
          <div className="mt-8 space-y-6 border-t border-white/10 pt-8 text-sm leading-7 text-white/70">
            <p>
              International Fashion Entertainment (IFE) collects only the
              contact, attendee, and booking information needed to issue event
              tickets, verify entry, and send important event updates.
            </p>
            <p>
              We do not sell personal guest information to third parties.
              Payment details are processed securely through our payment
              partners.
            </p>
            <p>
              If you have questions about your data, please contact our team on
              the{" "}
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

