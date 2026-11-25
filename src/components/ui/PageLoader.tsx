export default function PageLoader({
  label = "Loading...",
  cards = 0,
}: {
  label?: string;
  cards?: number;
}) {
  if (cards > 0) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 pb-16 pt-28 text-white">
        <div className="container-main">
          <div className="mb-8 space-y-3 border-b border-white/10 pb-6">
            <div className="h-3 w-36 animate-pulse rounded bg-[#D4AF6A]/25" />
            <div className="h-9 w-64 animate-pulse rounded bg-white/10" />
            <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF6A]/80">
              {label}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: cards }).map((_, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-white/10 bg-[#101010]"
              >
                <div className="h-44 animate-pulse bg-white/5" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-full animate-pulse rounded bg-white/5" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-white/5" />
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                    <div className="h-4 w-20 animate-pulse rounded bg-[#D4AF6A]/20" />
                    <div className="h-7 w-24 animate-pulse rounded bg-[#D4AF6A]/30" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF6A]/25 border-t-[#D4AF6A]" />
        <p className="text-xs uppercase tracking-[0.28em] text-[#D4AF6A]">
          {label}
        </p>
      </div>
    </main>
  );
}

