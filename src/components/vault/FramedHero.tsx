"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  location: string;
  tempC: number;
  humidityPct: number;
  windKph: number;
  portfolioEUR: number;
  totalLAA: number;
  totalCasks: number;
  lastRegaugeISO: string;
};

export default function FramedHero({
  location,
  tempC,
  humidityPct,
  windKph,
  portfolioEUR,
  totalLAA,
  totalCasks,
  lastRegaugeISO,
}: Props) {
  const chips = [
    { k: "Temperature", v: `${tempC.toFixed(1)} °C` },
    { k: "Relative Humidity", v: `${humidityPct}%` },
    { k: "Wind Speed", v: `${windKph} kph` },
  ];
  const stats = [
    { k: "Portfolio Value", v: `${portfolioEUR.toLocaleString()} €` },
    { k: "Total Casks", v: `${totalCasks}` },
    { k: "Total LAA", v: `${totalLAA} L` },
    { k: "Last Re-Gauge", v: lastRegaugeISO },
  ];

  return (
    <section className="relative h-[480px] md:h-[560px] overflow-hidden rounded-[32px] ring-1 ring-[var(--lux-gold-line)]/50">
      {/* background image */}
      <Image src="/img/hero/warehouse.jpg" alt="Warehouse" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 z-[1]" />

      <div className="absolute inset-0 bg-gradient-to-r from-[var(--lux-bg)]/85 via-[var(--lux-bg)]/55 to-transparent" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(900px 420px at 20% 15%, rgba(216,186,116,0.10) 0%, transparent 60%)" }}
      />

      {/* content */}
      <div className="relative z-[1] mx-auto grid h-full max-w-7xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2">
        {/* left */}
        <div className="flex flex-col justify-center">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--lux-ink)]/70">Warehouse Weather</div>
          <motion.h1 initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.5}}
            className="mt-2 font-serif text-4xl md:text-[44px] leading-tight">{location}</motion.h1>
          <div className="mt-4 h-px w-28 bg-[var(--lux-gold-line)]" />

          {/* framed chips */}
          <div className="mt-6 grid max-w-xl grid-cols-3 gap-4">
            {chips.map(c => (
              <div key={c.k}
                   className="rounded-2xl border border-[var(--lux-gold-line)]/70 bg-[rgba(0,0,0,0.85)] px-4 py-3 shadow-[0_0_18px_rgba(0,0,0,0.9)] backdrop-blur-lg">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--lux-ink)]/80">{c.k}</div>
                <div className="text-sm font-medium text-[var(--lux-gold)]">{c.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* right stats */}
        <div className="self-center grid grid-cols-2 gap-5">
          {stats.map(s => (
            <div key={s.k}
              className="rounded-3xl border border-[var(--lux-gold-line)]/70 bg-[rgba(0,0,0,0.88)] p-5 backdrop-blur-lg shadow-[0_0_22px_rgba(0,0,0,0.9)]">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--lux-ink)]/80">{s.k}</div>
              <div className="mt-1.5 font-serif text-xl text-[var(--lux-gold)]">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
