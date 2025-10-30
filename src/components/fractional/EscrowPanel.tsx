"use client";

import { useMemo, useState } from "react";

export default function EscrowPanel({ monthlyStoragePerBottleEUR }: { monthlyStoragePerBottleEUR: number }) {
  const [bottles, setBottles] = useState<number>(60);
  const [months, setMonths] = useState<number>(6);
  const storage = useMemo(() => bottles * months * monthlyStoragePerBottleEUR, [bottles, months, monthlyStoragePerBottleEUR]);

  return (
    <div className="rounded-3xl border border-[var(--lux-gold-line)]/60 bg-white/[0.02] p-6">
      <div className="text-lg font-serif text-[var(--headline)]">Ops Escrow & Bonded Storage</div>
      <div className="mt-2 text-sm text-[var(--lux-ink)]/80">
        Accruals cover storage, insurance, bottling, duty, and optional post-bottling storage.
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <label className="block">
          <span className="text-xs text-[var(--lux-ink)]/70">Bottles to store (bond)</span>
          <input type="number" min={0} className="mt-1 w-full rounded-xl bg-black/30 border border-[var(--lux-gold-line)]/80 p-3"
                 value={bottles} onChange={(e)=>setBottles(Math.max(0, Number(e.target.value)))}/>
        </label>
        <label className="block">
          <span className="text-xs text-[var(--lux-ink)]/70">Months</span>
          <input type="number" min={0} className="mt-1 w-full rounded-xl bg-black/30 border border-[var(--lux-gold-line)]/80 p-3"
                 value={months} onChange={(e)=>setMonths(Math.max(0, Number(e.target.value)))}/>
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--lux-gold-line)]/60 p-3">
        <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--lux-ink)]/60">Estimated bonded storage</div>
        <div className="text-lg">€{storage.toFixed(2)}</div>
        <div className="text-[11px] text-[var(--lux-ink)]/60 mt-1">Rate: €{monthlyStoragePerBottleEUR.toFixed(2)} per bottle per month.</div>
      </div>
    </div>
  );
}
