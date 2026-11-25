import Link from "next/link";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const experiences = [
  {
    number: "01",
    title: "Fashion Shows",
    description:
      "Discover the world of fashion through extraordinary runway experiences, designer showcases and creative expression.",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=85&w=1000",
    href: "/fashion-shows",
  },
  {
    number: "02",
    title: "Live Entertainment",
    description:
      "Experience unforgettable performances, live shows and entertainment that bring people together.",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=85&w=1000",
    href: "/entertainment",
  },
  {
    number: "03",
    title: "Award Ceremonies",
    description:
      "Celebrate creativity, talent and excellence through prestigious award ceremonies and special occasions.",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?q=85&w=1000",
    href: "/events",
  },
];

const values = [
  {
    number: "01",
    title: "Creativity",
    description:
      "We believe every event should be unique, inspiring and memorable.",
  },
  {
    number: "02",
    title: "Excellence",
    description:
      "We focus on quality, attention to detail and exceptional experiences.",
  },
  {
    number: "03",
    title: "Innovation",
    description:
      "We bring fresh ideas and creative approaches to every experience.",
  },
  {
    number: "04",
    title: "Connection",
    description:
      "We create opportunities for people, talent and communities to connect.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="overflow-hidden bg-[#050505] text-white">
        {/* HERO SECTION */}
        <section
          className="relative flex min-h-[380px] items-end border-b border-white/10 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,0.94), rgba(0,0,0,0.6), rgba(0,0,0,0.25)), url('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />

          <div className="container-main relative z-10 pb-10 pt-28">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-10 bg-[#D4AF6A]" />
                <p className="text-[10px] font-semibold uppercase tracking-[5px] text-[#D4AF6A]">
                  Discover Our Story
                </p>
              </div>

              <h1 className="font-[var(--font-playfair)] text-4xl leading-[1.12] sm:text-5xl lg:text-6xl">
                Beyond Events.{" "}
                <span className="italic text-[#D4AF6A]">
                  Beyond Ordinary.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 md:text-base">
                We bring fashion, entertainment and extraordinary experiences
                together to create moments that inspire, connect and celebrate.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF6A] px-7 py-3.5 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
                >
                  Explore Events
                  <FiArrowRight size={15} />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-7 py-3.5 text-xs font-semibold uppercase tracking-[2px] text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-12 hidden text-right lg:block">
            <p className="font-[var(--font-playfair)] text-4xl italic text-white/20">
              IFE
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-[4px] text-white/50">
              Create. Inspire. Celebrate.
            </p>
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="px-6 py-12 md:py-16">
          <div className="container-main grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#D4AF6A]" />
                <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                  Who We Are
                </p>
              </div>

              <h2 className="font-[var(--font-playfair)] text-3xl leading-tight md:text-5xl">
                Creating Moments.{" "}
                <span className="italic text-[#D4AF6A]">
                  Inspiring Generations.
                </span>
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/65 md:text-base">
                International Fashion Entertainment (IFE) is an event-focused
                brand built around fashion, entertainment and creative
                experiences.
              </p>

              <p className="mt-3 text-sm leading-7 text-white/60 md:text-base">
                Our vision is to bring people together through thoughtfully
                curated events, celebrate creative talent and create memorable
                experiences for audiences, artists, designers and partners.
              </p>

              <Link
                href="/events"
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#D4AF6A]/50 bg-[#D4AF6A]/10 px-6 py-3 text-xs font-semibold uppercase tracking-[2px] text-[#D4AF6A] transition hover:bg-[#D4AF6A] hover:text-black"
              >
                Discover Our Events
                <FiArrowUpRight size={15} />
              </Link>
            </div>

            <div className="relative">
              <div
                className="relative min-h-[340px] overflow-hidden rounded-xl border border-white/10 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=85&w=1200')",
                }}
              />

              <div className="absolute bottom-4 left-4 rounded-lg border border-[#D4AF6A]/40 bg-black/80 px-5 py-3.5 backdrop-blur-md">
                <p className="font-[var(--font-playfair)] text-2xl italic text-[#D4AF6A]">
                  IFE
                </p>
                <p className="mt-0.5 text-[9px] uppercase tracking-[3px] text-white/60">
                  International Fashion Entertainment
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION AND VISION */}
        <section className="border-y border-white/10 bg-[#0D0D0D] px-6 py-12">
          <div className="container-main grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-[#111111] p-6">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                Our Mission
              </p>
              <h2 className="font-[var(--font-playfair)] text-2xl leading-tight md:text-3xl">
                Bringing Ideas to Life Through Extraordinary Experiences.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/60">
                Our mission is to curate engaging events that celebrate
                creativity, showcase talent and deliver memorable experiences
                through professional planning and thoughtful execution.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#111111] p-6">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                Our Vision
              </p>
              <h2 className="font-[var(--font-playfair)] text-2xl leading-tight md:text-3xl">
                Becoming a Destination for Creativity and Celebration.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/60">
                We aspire to build a recognised platform for fashion,
                entertainment and meaningful experiences, connecting creative
                communities and audiences across borders.
              </p>
            </div>
          </div>
        </section>

        {/* WHAT WE DO */}
        <section className="px-6 py-12 md:py-16">
          <div className="container-main">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px w-8 bg-[#D4AF6A]" />
                  <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                    What We Do
                  </p>
                </div>

                <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl">
                  Experiences That{" "}
                  <span className="italic text-[#D4AF6A]">Inspire.</span>
                </h2>
              </div>

              <p className="max-w-md text-xs leading-6 text-white/55 sm:text-sm">
                From fashion showcases to live entertainment, we bring
                different forms of creativity together.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {experiences.map((item) => (
                <Link
                  href={item.href}
                  key={item.number}
                  className="group overflow-hidden rounded-xl border border-white/10 bg-[#111111] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF6A]/60"
                >
                  <div
                    className="relative h-[200px] overflow-hidden bg-cover bg-center transition duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('${item.image}')`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/30 to-transparent" />
                    <span className="absolute bottom-3 left-4 font-[var(--font-playfair)] text-3xl italic text-[#D4AF6A]">
                      {item.number}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-[var(--font-playfair)] text-xl transition group-hover:text-[#D4AF6A]">
                        {item.title}
                      </h3>
                      <FiArrowUpRight
                        size={16}
                        className="text-white/40 transition group-hover:text-[#D4AF6A]"
                      />
                    </div>

                    <p className="mt-2 text-xs leading-5 text-white/60">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* OUR VALUES */}
        <section className="border-t border-white/10 bg-[#0A0A0A] px-6 py-12">
          <div className="container-main">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                What Defines Us
              </p>
              <h2 className="mt-2 font-[var(--font-playfair)] text-3xl md:text-4xl">
                Our Core <span className="italic text-[#D4AF6A]">Values.</span>
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div
                  key={value.number}
                  className="rounded-xl border border-white/10 bg-[#111111] p-5 transition hover:border-[#D4AF6A]/50"
                >
                  <p className="font-[var(--font-playfair)] text-2xl italic text-[#D4AF6A]">
                    {value.number}
                  </p>
                  <h3 className="mt-3 font-[var(--font-playfair)] text-xl">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-white/60">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="border-t border-white/10 bg-[#050505] px-6 py-12">
          <div className="container-main relative overflow-hidden rounded-2xl border border-[#D4AF6A]/25 bg-[radial-gradient(ellipse_at_top,rgba(212,175,106,0.14),#0D0D0D_65%)] px-6 py-10 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
              Be Part of the Experience
            </p>

            <h2 className="mx-auto mt-3 max-w-3xl font-[var(--font-playfair)] text-3xl leading-tight md:text-5xl">
              Let&apos;s Create Something{" "}
              <span className="italic text-[#D4AF6A]">
                Extraordinary Together.
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-white/60 sm:text-sm">
              Discover upcoming experiences, explore our events and become part
              of the IFE journey.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF6A] px-7 py-3.5 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
              >
                Explore Events
                <FiArrowRight size={15} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-7 py-3.5 text-xs font-semibold uppercase tracking-[2px] text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
