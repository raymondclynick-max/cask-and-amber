// src/components/fractional/TrancheGrid.tsx
"use client";

import { useMemo } from "react";
import { LuxCard } from "@/components/ui/LuxCard";

/** Tranche shape */
type Tranche = {
  id: string;
  type: "single_malt" | "blend";
  distilleryOrSeries: string;
  vintageOrBatch: string;
  wood: string;
  abv: number;               // %
  caskSizeL: number;         // L
  pricePerOnePctEUR: number; // €/1%
  remainingPct: number;      // 0..100
  recordDateISO: string;
  bottlingDateISO: string;
};

/** Demo data — adjust as needed */
const TRANCHES: Tranche[] = [
  {
    id: "tm-2008-butt",
    type: "single_malt",
    distilleryOrSeries: "Thomas Melvin",
    vintageOrBatch: "2008 • Sherry Butt",
    wood: "European oak",
    abv: 62.5,
    caskSizeL: 500,
    pricePerOnePctEUR: 1425,
    remainingPct: 38,
    recordDateISO: "2026-03-31T16:00:00Z",
    bottlingDateISO: "2026-06-30T16:00:00Z",
  },
  {
    id: "amber-2021-cohort-a",
    type: "blend",
    distilleryOrSeries: "Amber Cohort A",
    vintageOrBatch: "2021 • 1st-fill Bourbon",
    wood: "American oak",
    abv: 63.0,
    caskSizeL: 200,
    pricePerOnePctEUR: 420,
    remainingPct: 72,
    recordDateISO: "2026-02-15T16:00:00Z",
    bottlingDateISO: "2026-05-15T16:00:00Z",
  },
];

/** UI bits kept local to avoid missing imports */
function TypeBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[var(--lux-gold)]/18 px-2 py-0.5 text-[11px] text-[var(--lux-ink)]/85">
      {label}
    </span>
  );
}
function ProgressBar({ soldPct }: { soldPct: number }) {
  const pct = Math.max(0, Math.min(100, soldPct));
  return (
    <div className="h-1 w-full rounded-full bg-white/10">
      <div className="h-1 rounded-full bg-[var(--lux-gold)] transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function TrancheGrid() {
  const items = useMemo(() => TRANCHES, []);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {items.map((t) => {
        const badge = t.type === "blend" ? "Blended Cohort" : "Single Malt";
        const sold = 100 - t.remainingPct;

        return (
          <LuxCard key={t.id} className="relative overflow-hidden space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="text-lg font-serif text-[var(--headline)]">{t.distilleryOrSeries}</div>
              <TypeBadge label={badge} />
            </div>
            <div className="text-sm text-[var(--lux-ink)]/80">{t.vintageOrBatch}</div>

            {/* Specs */}
            <div className="mt-1 grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--lux-ink)]/60">ABV</div>
                <div className="text-[13px]">{t.abv.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--lux-ink)]/60">Cask</div>
                <div className="text-[13px]">{t.caskSizeL} L • {t.wood}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--lux-ink)]/60">Price / 1%</div>
                <div className="text-[13px] font-semibold">€{t.pricePerOnePctEUR.toLocaleString()}</div>
              </div>
            </div>

            {/* Record / Bottling */}
            <div className="grid grid-cols-2 gap-3 text-[11px] text-[var(--lux-ink)]/70">
              <div>
                <div className="uppercase tracking-[0.14em]">Record</div>
                <div>{new Date(t.recordDateISO).toLocaleDateString()}</div>
              </div>
              <div className="text-right">
                <div className="uppercase tracking-[0.14em]">Bottling</div>
                <div>{new Date(t.bottlingDateISO).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Allocation */}
            <div className="mt-1">
              <ProgressBar soldPct={sold} />
              <div className="mt-1 text-[11px] text-[var(--lux-ink)]/60">
                Allocated {sold}% • Free {t.remainingPct}%
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center justify-between">
              <button
                className="rounded-2xl bg-[var(--lux-gold)] px-4 py-2 text-[var(--button-text)] hover:bg-[var(--lux-gold-deep)] transition"
                onClick={() => {
                  localStorage.setItem("selectedTranche", t.id);
                  window.dispatchEvent(
                    new CustomEvent("cna:select-tranche", {
                      detail: {
                        id: t.id,
                        pricePerOnePctEUR: t.pricePerOnePctEUR,
                        recordDateISO: t.recordDateISO,
                        bottlingDateISO: t.bottlingDateISO,
                      },
                    })
                  );
                  window.dispatchEvent(new CustomEvent("cna:track-cask", { detail: { id: t.id } }));
                  document.querySelector("#calc")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Simulate
              </button>

              <button
                className="rounded-2xl border border-[var(--lux-gold-line)] px-4 py-2 hover:bg-white/5 transition"
                onClick={() => {
                  localStorage.setItem("selectedTranche", t.id);
                  window.dispatchEvent(new CustomEvent("cna:track-cask", { detail: { id: t.id } }));
                }}
              >
                Select
              </button>
            </div>
          </LuxCard>
        );
      })}
    </div>
  );
}
