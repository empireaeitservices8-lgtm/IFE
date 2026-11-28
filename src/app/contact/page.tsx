"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiCamera,
  FiCheck,
  FiClock,
  FiMail,
  FiMapPin,
  FiMinus,
  FiPhone,
  FiPlus,
  FiSend,
} from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa6";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const enquiryChannels = [
  {
    title: "Event Bookings & VIP",
    subject: "Event Booking",
    description:
      "Private tables, group reservations, and bespoke VIP hospitality for upcoming IFE showcases.",
    icon: FiCalendar,
  },
  {
    title: "Partnerships & Sponsors",
    subject: "Partnership",
    description:
      "Collaborate with International Fashion Entertainment on brand activations and runway sponsorships.",
    icon: FiBriefcase,
  },
  {
    title: "Press & Media",
    subject: "Media Enquiry",
    description:
      "Media accreditation, press kits, interviews, and backstage photography requests.",
    icon: FiCamera,
  },
];

const faqs = [
  {
    question: "How can I reserve VIP tickets or group tables?",
    answer:
      "You can browse upcoming showcases on our Events page or select 'Event Booking' in the enquiry form above. Our hospitality team will follow up with tailored seating and VIP access options.",
  },
  {
    question: "How do designers or brands apply to participate?",
    answer:
      "Choose 'Partnership' or 'Sponsorship' in the form and share a brief overview of your brand or collection. Our curation team reviews all submissions ahead of each season.",
  },
  {
    question: "Do you offer press and photographer accreditation?",
    answer:
      "Yes. Accredited journalists, stylists, and photographers can request media passes by selecting 'Media Enquiry' with their publication or portfolio link.",
  },
  {
    question: "What is the typical response time for enquiries?",
    answer:
      "Our team responds to all general, booking, and partnership enquiries within 1 to 2 business days.",
  },
];

const subjects = [
  "General Enquiry",
  "Event Booking",
  "Partnership",
  "Sponsorship",
  "Media Enquiry",
];

export default function ContactPage() {
  const formSectionRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Enquiry",
    message: "",
  });

  const handleSelectChannel = (subject: string) => {
    setSubmitted(false);
    setForm((prev) => ({ ...prev, subject }));
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
        {/* Hero */}
        <section
          className="relative flex min-h-[300px] items-end overflow-hidden border-b border-white/10 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.78) 55%, rgba(5,5,5,0.45) 100%), linear-gradient(0deg, #050505 0%, transparent 65%), url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=85&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,106,0.16),transparent_60%)]" />

          <div className="container-main relative z-10 pb-8 pt-28">
            <div className="mb-4 flex items-center gap-4">
              <span className="h-px w-10 bg-[#D4AF6A]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#D4AF6A]">
                Concierge &amp; Enquiries
              </p>
            </div>

            <h1 className="max-w-3xl font-[var(--font-playfair)] text-4xl leading-[1.1] sm:text-5xl">
              Let&apos;s Start a{" "}
              <span className="italic text-[#D4AF6A]">Conversation.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">
              Whether you are planning a VIP attendance, exploring a brand
              partnership, or requesting press credentials, our team is here to
              help create something extraordinary.
            </p>
          </div>
        </section>

        {/* Department / Enquiry Channels */}
        <section className="border-b border-white/10 bg-[#080808] py-10">
          <div className="container-main grid gap-5 md:grid-cols-3">
            {enquiryChannels.map((channel) => {
              const Icon = channel.icon;
              const isSelected = form.subject === channel.subject;

              return (
                <button
                  key={channel.title}
                  type="button"
                  onClick={() => handleSelectChannel(channel.subject)}
                  className={`group flex flex-col justify-between rounded-xl border p-5 text-left transition duration-300 hover:-translate-y-0.5 ${
                    isSelected
                      ? "border-[#D4AF6A] bg-[#D4AF6A]/[0.08] shadow-lg shadow-[#D4AF6A]/5"
                      : "border-white/10 bg-[#101010] hover:border-[#D4AF6A]/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className={`flex size-10 items-center justify-center rounded-lg border transition ${
                          isSelected
                            ? "border-[#D4AF6A] bg-[#D4AF6A] text-black"
                            : "border-[#D4AF6A]/40 bg-black/60 text-[#D4AF6A] group-hover:border-[#D4AF6A]"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      {isSelected ? (
                        <span className="rounded-full border border-[#D4AF6A]/40 bg-[#D4AF6A]/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#D4AF6A]">
                          Selected
                        </span>
                      ) : (
                        <FiArrowRight
                          size={15}
                          className="text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-[#D4AF6A]"
                        />
                      )}
                    </div>

                    <h2 className="mt-4 font-[var(--font-playfair)] text-xl text-white transition group-hover:text-[#D4AF6A]">
                      {channel.title}
                    </h2>
                    <p className="mt-2 text-xs leading-5 text-white/60">
                      {channel.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[2px] text-[#D4AF6A]">
                      {isSelected ? "Active Channel" : `Select ${channel.subject}`}
                    </span>
                    <FiArrowRight
                      size={13}
                      className="text-[#D4AF6A] transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Contact Content */}
        <section
          ref={formSectionRef}
          className="container-main grid items-start gap-8 py-10 lg:grid-cols-[0.82fr_1.18fr]"
        >
          {/* Contact Information */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-8 bg-[#D4AF6A]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF6A]">
                  Get In Touch
                </p>
              </div>

              <h2 className="font-[var(--font-playfair)] text-3xl leading-tight">
                Connect With{" "}
                <span className="italic text-[#D4AF6A]">IFE.</span>
              </h2>

              <p className="mt-3 max-w-md text-xs leading-6 text-white/60 sm:text-sm">
                Our dedicated team assists guests, designers, sponsors, and
                media partners across international events.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#0B0B0B] p-3.5 transition hover:border-[#D4AF6A]/40">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#D4AF6A]/40 bg-black text-[#D4AF6A]">
                    <FiMail size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[2px] text-white/45">
                      Email
                    </p>
                    <a
                      href="mailto:ifeentertainments24@gmail.com"
                      className="text-sm text-white transition hover:text-[#D4AF6A]"
                    >
                      ifeentertainments24@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#0B0B0B] p-3.5 transition hover:border-[#D4AF6A]/40">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#D4AF6A]/40 bg-black text-[#D4AF6A]">
                    <FiPhone size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[2px] text-white/45">
                      Phone
                    </p>
                    <div className="flex flex-wrap gap-x-2 text-sm text-white">
                      <a
                        href="tel:+917012699060"
                        className="transition hover:text-[#D4AF6A]"
                      >
                        7012699060
                      </a>
                      <span className="text-white/30">/</span>
                      <a
                        href="tel:+917025256662"
                        className="transition hover:text-[#D4AF6A]"
                      >
                        7025256662
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#0B0B0B] p-3.5 transition hover:border-[#D4AF6A]/40">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#D4AF6A]/40 bg-black text-[#D4AF6A]">
                    <FiMapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[2px] text-white/45">
                      Location
                    </p>
                    <p className="text-sm text-white">
                      Kaloor, Ernakulam
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#0B0B0B] p-3.5 transition hover:border-[#D4AF6A]/40">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#D4AF6A]/40 bg-black text-[#D4AF6A]">
                    <FiClock size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[2px] text-white/45">
                      Hours
                    </p>
                    <p className="text-sm text-white">
                      11:30 AM – 07:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Follow */}
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-[3px] text-white/45">
                Follow IFE
              </p>
              <div className="flex gap-2.5">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.02] text-white/70 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                >
                  <FaInstagram size={15} />
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.02] text-white/70 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                >
                  <FaFacebookF size={14} />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.02] text-white/70 transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                >
                  <FaYoutube size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-xl border border-white/10 bg-[#0D0D0D] p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-[var(--font-playfair)] text-2xl">
                  Send Us a Message
                </h3>
                <p className="mt-1 text-xs text-white/50">
                  Fill in the details below and our team will respond promptly.
                </p>
              </div>
              <span className="rounded-full border border-[#D4AF6A]/40 bg-[#D4AF6A]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[2px] text-[#D4AF6A]">
                {form.subject}
              </span>
            </div>

            {submitted ? (
              <div className="mt-6 rounded-xl border border-[#D4AF6A]/35 bg-[#D4AF6A]/[0.05] p-6 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-[#D4AF6A] text-[#D4AF6A]">
                  <FiCheck size={20} />
                </div>

                <h4 className="mt-4 font-[var(--font-playfair)] text-2xl">
                  Enquiry Received
                </h4>

                <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-white/65 sm:text-sm">
                  Thank you, <span className="text-white">{form.name}</span>.
                  Your{" "}
                  <span className="text-[#D4AF6A]">{form.subject}</span>{" "}
                  message has been received. Our concierge team will follow up
                  shortly.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "General Enquiry",
                      message: "",
                    });
                  }}
                  className="mt-5 inline-flex items-center gap-2 border border-[#D4AF6A] px-5 py-2.5 text-xs font-bold uppercase tracking-[2px] text-[#D4AF6A] transition hover:bg-[#D4AF6A] hover:text-black"
                >
                  <FiSend size={13} />
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {/* Subject Pills */}
                <div>
                  <label className="mb-2 block text-xs text-white/60">
                    Enquiry Topic
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject) => {
                      const active = form.subject === subject;
                      return (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => setForm({ ...form, subject })}
                          className={`rounded-md px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[1.5px] transition ${
                            active
                              ? "bg-[#D4AF6A] font-semibold text-black"
                              : "border border-white/15 bg-black text-white/65 hover:border-[#D4AF6A]/50 hover:text-white"
                          }`}
                        >
                          {subject}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-1.5 block text-xs text-white/60"
                    >
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Enter your name"
                      className="w-full rounded-lg border border-white/10 bg-black px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#D4AF6A]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-xs text-white/60"
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-white/10 bg-black px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#D4AF6A]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="mb-1.5 block text-xs text-white/60"
                    >
                      Phone (Optional)
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="Phone number"
                      className="w-full rounded-lg border border-white/10 bg-black px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#D4AF6A]"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="contact-message"
                      className="text-xs text-white/60"
                    >
                      Your Message *
                    </label>
                    <span className="text-[11px] text-white/35">
                      {form.message.length} / 1000
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    required
                    maxLength={1000}
                    rows={3}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Tell us about your event, partnership idea, or enquiry..."
                    className="w-full resize-none rounded-lg border border-white/10 bg-black px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#D4AF6A]"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#D4AF6A] px-7 py-3.5 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
                >
                  Submit Enquiry
                  <FiArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="border-t border-white/10 bg-[#080808] py-12">
          <div className="container-main grid items-start gap-8 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-8 bg-[#D4AF6A]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF6A]">
                  Frequently Asked
                </p>
              </div>
              <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl">
                Quick Answers{" "}
                <span className="italic text-[#D4AF6A]">Before You Write.</span>
              </h2>
              <p className="mt-3 max-w-sm text-xs leading-6 text-white/60 sm:text-sm">
                Find immediate details on VIP reservations, brand partnerships,
                and press accreditation.
              </p>

              <Link
                href="/events"
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#D4AF6A]/40 bg-[#D4AF6A]/10 px-5 py-2.5 text-xs font-bold uppercase tracking-[2px] text-[#D4AF6A] transition hover:bg-[#D4AF6A] hover:text-black"
              >
                Explore Events
                <FiArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.question}
                    className={`rounded-xl border transition duration-200 ${
                      isOpen
                        ? "border-[#D4AF6A]/60 bg-[#D4AF6A]/[0.05]"
                        : "border-white/10 bg-[#101010] hover:border-white/25"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="font-[var(--font-playfair)] text-sm italic text-[#D4AF6A]">
                          0{idx + 1}
                        </span>
                        <span className="font-[var(--font-playfair)] text-base text-white sm:text-lg">
                          {faq.question}
                        </span>
                      </div>
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-lg border transition ${
                          isOpen
                            ? "border-[#D4AF6A] bg-[#D4AF6A] text-black"
                            : "border-white/15 bg-black/40 text-[#D4AF6A]"
                        }`}
                      >
                        {isOpen ? <FiMinus size={14} /> : <FiPlus size={14} />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="border-t border-white/10 px-5 pb-4 pt-3">
                        <p className="pl-7 text-xs leading-6 text-white/65 sm:text-sm">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
