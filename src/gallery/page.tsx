
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";

const galleryItems = [
  {
    title: "Fashion Runway",
    category: "Fashion",
    image: "photo-1539109136881-3be0616acf4b",
  },
  {
    title: "Live Performances",
    category: "Entertainment",
    image: "photo-1501386761578-eac5c94b800a",
  },
  {
    title: "Glamour Moments",
    category: "Fashion",
    image: "photo-1529139574466-a303027c1d8b",
  },
  {
    title: "Grand Celebrations",
    category: "Events",
    image: "photo-1492684223066-81342ee5ff30",
  },
  {
    title: "Stage Experiences",
    category: "Entertainment",
    image: "photo-1470229722913-7c0e2dbbafd3",
  },
  {
    title: "Fashion Editorial",
    category: "Fashion",
    image: "photo-1524504388940-b1c1722653e1",
  },
  {
    title: "Creative Showcase",
    category: "Events",
    image: "photo-1516280440614-37939bbacd81",
  },
  {
    title: "Behind The Scenes",
    category: "Moments",
    image: "photo-1529139574466-a303027c1d8b",
  },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 px-6 py-32 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,106,0.15),transparent_65%)]" />

        <div className="relative mx-auto max-w-4xl">
          <Camera className="mx-auto mb-7 text-[#D4AF6A]" size={35} />

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#D4AF6A]">
            Moments Worth Remembering
          </p>

          <h1 className="mt-6 font-serif text-5xl sm:text-7xl">
            The IFE
            <span className="text-[#D4AF6A]"> Gallery</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-gray-400">
            Explore the moments, creativity and extraordinary experiences
            that bring the world of fashion and entertainment together.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF6A]">
              Visual Stories
            </p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
              Captured Moments
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-gray-500">
            A collection of event highlights, runway moments and
            unforgettable experiences.
          </p>
        </div>

        <div className="grid auto-rows-[260px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className={`group relative overflow-hidden border border-white/10 ${
                index === 0 || index === 5
                  ? "sm:row-span-2 sm:h-auto"
                  : ""
              }`}
            >
              <Image
                src={`https://images.unsplash.com/${item.image}?w=1000`}
                alt={item.title}
                fill
                unoptimized
                className="object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-80 transition group-hover:opacity-100" />

              <div className="absolute bottom-0 left-0 w-full p-6 transition duration-300 group-hover:translate-y-[-4px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF6A]">
                  {item.category}
                </p>
                <h3 className="mt-2 font-serif text-2xl">
                  {item.title}
                </h3>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-gray-600">
          Sample gallery images. Replace with your official IFE event photographs.
        </p>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-[#0B0B0B] px-6 py-20 text-center">
        <h2 className="font-serif text-4xl">
          Have an Event to
          <span className="text-[#D4AF6A]"> Remember?</span>
        </h2>

        <Link
          href="/events"
          className="mt-8 inline-flex items-center gap-3 bg-[#D4AF6A] px-8 py-4 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-[#F5E5B5]"
        >
          Explore Events
          <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
