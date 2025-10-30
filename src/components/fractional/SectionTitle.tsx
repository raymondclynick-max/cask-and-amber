// src/components/fractional/SectionTitle.tsx
export default function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="mb-3">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[var(--lux-ink)]">{title}</h2>
      {sub && (
        <p className="mt-1 text-[12px] md:text-[13px] leading-relaxed text-[var(--lux-ink)]/65">
          {sub}
        </p>
      )}
    </header>
  );
}
