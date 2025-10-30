"use client";

import { useEffect, useState } from "react";

function fmt(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

export default function LifecycleBar({
  recordDate,
  bottlingDate,
}: {
  recordDate: string;
  bottlingDate: string;
}) {
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const rec = new Date(recordDate).getTime();
  const bot = new Date(bottlingDate).getTime();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-[var(--lux-gold-line)]/60 bg-white/[0.02] p-4">
        <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--lux-gold)]/90">
          Record Date
        </div>
        <div className="mt-1 text-lg">{fmt(rec - now)}</div>
      </div>
      <div className="rounded-2xl border border-[var(--lux-gold-line)]/60 bg-white/[0.02] p-4">
        <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--lux-gold)]/90">
          Bottling Date
        </div>
        <div className="mt-1 text-lg">{fmt(bot - now)}</div>
      </div>
    </div>
  );
}
