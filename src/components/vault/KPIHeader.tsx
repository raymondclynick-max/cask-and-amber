export default function KPIHeader({
  totalValue = 108000,
  laa = 182,
  weightedAge = 21.4,
  lastRegauge = "2025-06-12",
}: {
  totalValue?: number;
  laa?: number;
  weightedAge?: number;
  lastRegauge?: string;
}) {
  const fmt = (n: number) => new Intl.NumberFormat("en-GB").format(n);
  return (
    <div className="rounded-2xl border border-[var(--lux-gold-line)]/70 bg-white/[0.02] p-6 backdrop-blur-[2px]">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <K label="Portfolio Value" value={`£${fmt(totalValue)}`} />
        <K label="Total LAA" value={`${fmt(laa)} L`} />
        <K label="Weighted Age" value={`${weightedAge.toFixed(1)} yrs`} />
        <K label="Last Re-gauge" value={lastRegauge} />
      </div>
    </div>
  );
}

function K({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold)]/90">{label}</div>
      <div className="mt-1 font-serif text-2xl text-[var(--headline)]">{value}</div>
    </div>
  );
}
