// src/components/fractional/PriceTicker.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { TRANCHES, Tranche } from "./tranche-data";

type Row = { label: string; value: number; unit: string };

export default function PriceTicker() {
  const [rows, setRows] = useState<Row[]>([
    { label: "€/RLA",     value: 512.4, unit: "€/LAA" },
    { label: "€/BOTTLE",  value: 38.2,  unit: "€/700ml" },
    { label: "INDEX LEVEL", value: 124.6, unit: "CAVI" },
  ]);

  // selected tranche for tracking
  const [trackId, setTrackId] = useState<string>(TRANCHES[0]?.id);
  const tracked: Tranche | undefined = useMemo(
    () => TRANCHES.find(t => t.id === trackId),
    [trackId]
  );

  // listen for selection from TrancheGrid
  useEffect(() => {
    function onSel(e: Event) {
      const t = (e as CustomEvent<{ id: string }>).detail;
      if (t?.id) setTrackId(t.id);
    }
    window.addEventListener("cna:select-tranche", onSel as any);
    window.addEventListener("cna:track-cask", onSel as any);
    return () => {
      window.removeEventListener("cna:select-tranche", onSel as any);
      window.removeEventListener("cna:track-cask", onSel as any);
    };
  }, []);

  // simple live jitter
  useEffect(() => {
    const id = setInterval(() => {
      setRows(r =>
        r.map(x => ({
          ...x,
          value: +(x.value * (1 + (Math.random() - 0.5) * 0.002)).toFixed(2),
        }))
      );
    }, 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden">
      {/* Tracked cask header */}
      <div className="px-4 py-3 bg-white/[0.03] flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">Tracking</div>
          <div className="truncate text-sm">
            {tracked ? `${tracked.distilleryOrSeries} • ${tracked.vintageOrBatch}` : "—"}
          </div>
        </div>
        <button
          className="text-[11px] underline underline-offset-4 text-white/70 hover:text-white"
          onClick={() => {
            // cycle for demo
            const idx = Math.max(0, TRANCHES.findIndex(t => t.id === trackId));
            const next = TRANCHES[(idx + 1) % TRANCHES.length];
            setTrackId(next.id);
          }}
        >
          Change
        </button>
      </div>

      {/* Live rows */}
      <div className="divide-y divide-white/10">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="text-xs uppercase tracking-[0.2em]">{r.label}</div>
            <div className="font-medium">
              {r.value} <span className="text-xs text-white/60">{r.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
