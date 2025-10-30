"use client";

import { useMemo } from "react";
import Link from "next/link";

export type Cask = {
  id: string;
  title: string;
  region: string;
  ageYears: number;
  volumeL: number;
  estValueEUR?: number;
  estValueGBP?: number; // temporary fallback
  imageUrl?: string;
  live?: {
    tempC: number;
    rhPct: number;
    laa: number;
    angelsSharePctYr?: number;
    lastRegaugeISO?: string;
  };
};

export default function CaskCard({ cask }: { cask: Cask }) {
  const eur = useMemo(
    () => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
    []
  );
  const est = cask.estValueEUR ?? cask.estValueGBP ?? 0;

  return (
    <article className="w-full overflow-hidden rounded-2xl border border-[var(--lux-gold-line)]/50 bg-white/[0.02] shadow-[0_0_24px_rgba(0,0,0,0.18)]">
      {/* Image */}
      <div className="relative h-[160px] md:h-[200px] w-full overflow-hidden rounded-t-2xl">
        <img
          src={cask.imageUrl || "/img/casks/default.jpg"}
          alt={cask.title}
          className="h-full w-full object-cover"
        />
        {cask.live && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--lux-gold)]/90 px-2 py-0.5 text-[10px] font-medium text-[var(--button-text)]">
            Live
          </span>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4 p-5">
        <header className="flex items-baseline justify-between gap-3">
          <h3 className="truncate text-lg font-semibold text-[var(--headline)]">{cask.title}</h3>
          <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-[var(--lux-ink)]/60">
            {cask.region}
          </span>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <KV k="Age" v={`${cask.ageYears} yrs`} />
          <KV k="Volume" v={`${cask.volumeL} L`} />
          <KV k="Est. Value" v={eur.format(est)} />
        </div>

        {/* Diagnostics */}
        {cask.live && (
          <div className="rounded-xl border border-[var(--lux-gold-line)]/50 p-3">
            <div className="grid grid-cols-3 gap-3 text-xs">
              <KV k="Temp" v={`${cask.live.tempC.toFixed(1)} °C`} />
              <KV k="RH" v={`${cask.live.rhPct.toFixed(0)} %`} />
              <KV k="LAA" v={`${cask.live.laa.toFixed(0)} L`} />
            </div>
            {typeof cask.live.angelsSharePctYr === "number" && (
              <div className="mt-2 text-[10px] text-[var(--lux-ink)]/60">
                Angel’s share ~ {cask.live.angelsSharePctYr.toFixed(1)}%/yr · Last re-gauge {cask.live.lastRegaugeISO || "—"}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link href={`/amber-vault/cask/${cask.id}`} className="text-sm underline underline-offset-4">
            View details
          </Link>
          <div className="flex gap-2">
            <button className="rounded-lg bg-[var(--lux-gold)] px-3 py-1.5 text-xs font-medium text-[var(--button-text)]">
              Request Bottling
            </button>
            <button className="rounded-lg border border-[var(--lux-gold-line)]/70 px-3 py-1.5 text-xs">
              Edit Finish
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="truncate">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--lux-ink)]/55">{k}</div>
      <div className="truncate font-medium">{v}</div>
    </div>
  );
}
