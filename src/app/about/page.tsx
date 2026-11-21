
import Link from "next/link";
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
  },
  {
    number: "02",
    title: "Live Entertainment",
    description:
      "Experience unforgettable performances, live shows and entertainment that bring people together.",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=85&w=1000",
  },
  {
    number: "03",
    title: "Award Ceremonies",
    description:
      "Celebrate creativity, talent and excellence through prestigious award ceremonies and special occasions.",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?q=85&w=1000",
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
          className="relative flex min-h-[650px] items-center bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,0.94), rgba(0,0,0,0.55), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />

          <div className="container-main relative z-10 pt-32 pb-20">
            <div className="max-w-3xl">
              <div className="mb-7 flex items-center gap-4">
                <span className="h-px w-12 bg-[#D4AF6A]" />
                <p className="text-xs uppercase tracking-[5px] text-[#D4AF6A]">
                  Discover Our Story
                </p>
              </div>

              <h1 className="font-[var(--font-playfair)] text-5xl leading-[1.12] sm:text-6xl lg:text-8xl">
                Beyond Events.
                <br />
                Beyond <span className="italic text-[#D4AF6A]">Ordinary.</span>
              </h1>

              <p className="mt-8 max-w-xl text-base leading-8 text-white/65 md:text-lg">
                We bring fashion, entertainment and extraordinary experiences
                together to create moments that inspire, connect and celebrate.
              </p>

              <div className="mt-10 flex flex-wrap gap-5">
                <Link
                  href="/events"
                  className="bg-[#D4AF6A] px-8 py-4 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
                >
                  Explore Events
                </Link>

                <Link
                  href="/contact"
                  className="border border-white/40 px-8 py-4 text-xs font-semibold uppercase tracking-[2px] text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 right-12 hidden text-right lg:block">
            <p className="font-[var(--font-playfair)] text-6xl italic text-white/20">
              IFE
            </p>
            <p className="mt-2 text-[9px] uppercase tracking-[4px] text-white/50">
              Create. Inspire. Celebrate.
            </p>
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="px-6 py-24 md:py-32">
          <div className="container-main grid items-center gap-16 lg:grid-cols-2">

            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-10 bg-[#D4AF6A]" />
                <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                  Who We Are
                </p>
              </div>

              <h2 className="font-[var(--font-playfair)] text-4xl leading-tight md:text-6xl">
                Creating Moments.
                <br />
                <span className="italic text-[#D4AF6A]">
                  Inspiring Generations.
                </span>
              </h2>

              <p className="mt-8 text-sm leading-8 text-white/60 md:text-base">
                International Fashion Entertainment (IFE) is an event-focused
                brand built around fashion, entertainment and creative
                experiences.
              </p>

              <p className="mt-5 text-sm leading-8 text-white/60 md:text-base">
                Our vision is to bring people together through thoughtfully
                curated events, celebrate creative talent and create memorable
                experiences for audiences, artists, designers and partners.
              </p>

              <Link
                href="/events"
                className="mt-9 inline-flex items-center gap-4 border-b border-[#D4AF6A] pb-3 text-xs font-semibold uppercase tracking-[2px] text-[#D4AF6A] transition hover:text-[#F5E5B5]"
              >
                Discover Our Events
                <span className="text-lg">↗</span>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -right-5 -top-5 h-40 w-40 border border-[#D4AF6A]/40" />

              <div
                className="relative min-h-[480px] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=85&w=1200')",
                }}
              />

              <div className="absolute -bottom-8 -left-5 hidden border border-[#D4AF6A]/50 bg-[#111111] p-7 sm:block">
                <p className="font-[var(--font-playfair)] text-4xl italic text-[#D4AF6A]">
                  IFE
                </p>
                <p className="mt-2 text-[9px] uppercase tracking-[3px] text-white/50">
                  International Fashion Entertainment
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* MISSION AND VISION */}
        <section className="border-y border-white/10 bg-[#0D0D0D] px-6 py-24">
          <div className="container-main grid gap-16 md:grid-cols-2">

            <div>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                Our Mission
              </p>

              <h2 className="font-[var(--font-playfair)] text-4xl leading-tight md:text-5xl">
                Bringing Ideas to Life Through Extraordinary Experiences.
              </h2>

              <p className="mt-7 text-sm leading-8 text-white/55">
                Our mission is to curate engaging events that celebrate
                creativity, showcase talent and deliver memorable experiences
                through professional planning and thoughtful execution.
              </p>
            </div>

            <div className="border-t border-[#D4AF6A]/40 pt-8 md:border-l md:border-t-0 md:pl-12">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                Our Vision
              </p>

              <h2 className="font-[var(--font-playfair)] text-4xl leading-tight md:text-5xl">
                Becoming a Destination for Creativity and Celebration.
              </h2>

              <p className="mt-7 text-sm leading-8 text-white/55">
                We aspire to build a recognised platform for fashion,
                entertainment and meaningful experiences, connecting creative
                communities and audiences across borders.
              </p>
            </div>

          </div>
        </section>

        {/* WHAT WE DO */}
        <section className="px-6 py-24 md:py-32">
          <div className="container-main">

            <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-10 bg-[#D4AF6A]" />
                  <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                    What We Do
                  </p>
                </div>

                <h2 className="font-[var(--font-playfair)] text-4xl md:text-6xl">
                  Experiences That <span className="italic text-[#D4AF6A]">Inspire.</span>
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-white/50">
                From fashion showcases to live entertainment, we bring
                different forms of creativity together.
              </p>
            </div>

            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {experiences.map((item) => (
                <article
                  key={item.number}
                  className="group border border-white/10 bg-[#111111] transition duration-500 hover:border-[#D4AF6A]/50"
                >
                  <div
                    className="relative h-[330px] overflow-hidden bg-cover bg-center transition duration-700 group-hover:scale-[1.01]"
                    style={{
                      backgroundImage: `url('${item.image}')`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <span className="absolute bottom-5 left-6 font-[var(--font-playfair)] text-5xl italic text-[#D4AF6A]">
                      {item.number}
                    </span>
                  </div>

                  <div className="p-7">
                    <h3 className="font-[var(--font-playfair)] text-2xl transition group-hover:text-[#D4AF6A]">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-white/50">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>

        {/* OUR VALUES */}
        <section className="bg-[#101010] px-6 py-24 md:py-32">
          <div className="container-main">

            <div className="mx-auto mb-16 max-w-2xl text-center">
              <div className="mb-5 flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-[#D4AF6A]" />
                <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
                  What Defines Us
                </p>
                <span className="h-px w-10 bg-[#D4AF6A]" />
              </div>

              <h2 className="font-[var(--font-playfair)] text-4xl md:text-6xl">
                Our Core <span className="italic text-[#D4AF6A]">Values.</span>
              </h2>

              <p className="mt-6 text-sm leading-7 text-white/50">
                The principles that guide our approach to creating meaningful
                experiences.
              </p>
            </div>

            <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div
                  key={value.number}
                  className="border-t border-white/15 px-6 py-9 transition hover:border-[#D4AF6A] lg:border-l lg:first:border-l-0"
                >
                  <p className="font-[var(--font-playfair)] text-4xl italic text-[#D4AF6A]">
                    {value.number}
                  </p>

                  <h3 className="mt-8 font-[var(--font-playfair)] text-2xl">
                    {value.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-white/50">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* CTA SECTION */}
        <section
          className="relative bg-cover bg-center px-6 py-32 text-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.82), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1506157786151-b8491531f063?q=85&w=2000')",
          }}
        >
          <div className="container-main relative z-10">
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[5px] text-[#D4AF6A]">
              Be Part of the Experience
            </p>

            <h2 className="mx-auto max-w-4xl font-[var(--font-playfair)] text-4xl leading-tight md:text-7xl">
              Let's Create Something
              <br />
              <span className="italic text-[#D4AF6A]">
                Extraordinary Together.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-white/60">
              Discover upcoming experiences, explore our events and become
              part of the IFE journey.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-5">
              <Link
                href="/events"
                className="bg-[#D4AF6A] px-9 py-4 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
              >
                Explore Events
              </Link>

              <Link
                href="/contact"
                className="border border-white/40 px-9 py-4 text-xs font-semibold uppercase tracking-[2px] text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
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
