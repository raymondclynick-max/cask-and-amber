"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { TRANCHES, Tranche } from "./tranche-data";

// recharts client-only
const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false });
const AreaChart          = dynamic(() => import("recharts").then(m => m.AreaChart),          { ssr: false });
const Area               = dynamic(() => import("recharts").then(m => m.Area),               { ssr: false });
const YAxis              = dynamic(() => import("recharts").then(m => m.YAxis),              { ssr: false });

function daysLeft(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86400000));
}

function useCaviSeries(key: string, start = 100) {
  const [series, setSeries] = useState<{ t: number; v: number }[]>([{ t: 0, v: start }]);
  const t0 = useRef<number>(Date.now());
  const val = useRef<number>(start);

  useEffect(() => {
    t0.current = Date.now();
    val.current = start;
    setSeries([{ t: 0, v: start }]);

    const id = setInterval(() => {
      const drift = 0.00004;
      const shock = (Math.random() - 0.5) * 0.002;
      val.current = val.current * (1 + drift + shock);
      const t = Math.round((Date.now() - t0.current) / 1000);
      setSeries(s => [...s.slice(-240), { t, v: +val.current.toFixed(2) }]);
    }, 1000);

    return () => clearInterval(id);
  }, [key, start]);

  return series;
}

function Row({ t }: { t: Tranche }) {
  const series = useCaviSeries(t.id, 100);
  const last = series[series.length - 1]?.v ?? 100;

  return (
    <div className="rounded-2xl border border-[var(--lux-gold-line)]/70 bg-white/[0.02] p-4 flex items-center gap-4">
      <div className="w-24">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">Bottling</div>
        <div className="text-lg font-semibold">{daysLeft(t.bottlingDateISO)} days</div>
        <div className="text-[11px] text-white/60">Record {new Date(t.recordDateISO).toLocaleDateString()}</div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm">{t.distilleryOrSeries} • {t.vintageOrBatch}</div>
        <div className="h-14">
          <ResponsiveContainer>
            <AreaChart data={series}>
              <YAxis hide />
              <Area dataKey="v" type="monotone" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-24 text-right">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">CAVI</div>
        <div className="text-lg font-semibold">{last.toFixed(2)}</div>
      </div>
    </div>
  );
}

export default function BottlingLive() {
  const rows = [...TRANCHES].sort(
    (a, b) => new Date(a.bottlingDateISO).getTime() - new Date(b.bottlingDateISO).getTime()
  );
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rows.map((t) => <Row key={t.id} t={t} />)}
    </div>
  );
}
