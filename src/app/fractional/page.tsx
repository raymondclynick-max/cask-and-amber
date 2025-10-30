// src/app/fractional/page.tsx or the simulator component
"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

// recharts client-only
const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then(m => m.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then(m => m.Area), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(m => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(m => m.Tooltip), { ssr: false });

export default function FractionalSim() {
  const [amount, setAmount] = useState(10000);
  const [years, setYears] = useState(5);
  const [volatility, setVolatility] = useState(0.12);
  const [seed, setSeed] = useState(0); // bump to re-run

  const data = useMemo(() => {
    // simple GBM-style path
    const points = [];
    const steps = years * 12;
    let value = amount;
    let rng = seed + 1;
    for (let i = 0; i <= steps; i++) {
      // cheap deterministic noise
      rng = (1103515245 * rng + 12345) % 2 ** 31;
      const z = ((rng / 2 ** 31) - 0.5) * 2;
      const drift = 0.06 / 12;
      const shock = volatility / Math.sqrt(12) * z;
      value = value * (1 + drift + shock);
      points.push({ m: i, value: Math.max(0, Math.round(value)) });
    }
    return points;
  }, [amount, years, volatility, seed]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="block">
          <div className="text-xs uppercase tracking-widest mb-1">Amount (€)</div>
          <input type="number" value={amount} onChange={e => setAmount(+e.target.value)} className="w-full rounded-lg bg-white/5 border border-white/10 p-2" />
        </label>
        <label className="block">
          <div className="text-xs uppercase tracking-widest mb-1">Years</div>
          <input type="number" value={years} onChange={e => setYears(+e.target.value)} className="w-full rounded-lg bg-white/5 border border-white/10 p-2" />
        </label>
        <label className="block">
          <div className="text-xs uppercase tracking-widest mb-1">Volatility</div>
          <input type="number" step="0.01" value={volatility} onChange={e => setVolatility(+e.target.value)} className="w-full rounded-lg bg-white/5 border border-white/10 p-2" />
        </label>
      </div>

      <button
        onClick={() => setSeed(s => s + 1)}
        className="rounded-2xl px-4 py-2 bg-[var(--lux-gold)] text-[var(--button-text)] hover:bg-[var(--lux-gold-deep)] transition"
      >
        Simulate
      </button>

      <div className="h-64">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <XAxis dataKey="m" hide />
            <YAxis width={60} />
            <Tooltip />
            <Area dataKey="value" type="monotone" fillOpacity={0.25} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
