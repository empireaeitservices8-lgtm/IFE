
type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-2xl`}>
      <div
        className={`mb-5 flex items-center gap-3 ${
          centered ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-9 bg-[#D4AF6A]" />
        <span className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D4AF6A]">
          {eyebrow}
        </span>
      </div>

      <h2 className="font-[var(--font-playfair)] text-4xl leading-tight text-white md:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 text-sm leading-7 text-white/55 md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
