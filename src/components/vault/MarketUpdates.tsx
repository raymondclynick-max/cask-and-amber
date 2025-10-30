"use client";

type Item = {
  title: string;   // link text
  href: string;    // target
  summary: string; // one-line summary
  tone?: "up" | "down" | "flat";
};

export default function MarketUpdates({ items }: { items: Item[] }) {
  return (
    <section className="rounded-[24px] border border-[var(--lux-gold-line)]/30 bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[var(--lux-gold)]/85">Market Insights</div>
        <ul className="space-y-6">
          {items.map((it) => (
            <li key={it.href} className="group rounded-2xl border border-transparent p-4 hover:border-[var(--lux-gold-line)]/35 hover:bg-white/[0.02] transition">
              <a href={it.href} className="block">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-base font-semibold text-[var(--headline)] group-hover:text-[var(--lux-gold)] transition-colors">
                    {it.title}
                  </h3>
                  <Delta tone={it.tone} />
                </div>
                <p className="mt-1 text-sm leading-relaxed text-[var(--lux-ink)]/80">{it.summary}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Delta({ tone }: { tone?: "up" | "down" | "flat" }) {
  if (!tone) return null;
  const s = tone === "up" ? "▲" : tone === "down" ? "▼" : "—";
  const c = tone === "up" ? "text-emerald-300" : tone === "down" ? "text-rose-300" : "text-[var(--lux-ink)]/60";
  return <span className={`text-xs ${c}`}>{s}</span>;
}
