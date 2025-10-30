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

export default function VaultHero({
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
    <section className="relative h-[480px] md:h-[560px] overflow-hidden rounded-[32px]">
      {/* image */}
      <Image
        src="/img/hero/warehouse.jpg"
        alt="Warehouse"
        fill
        priority
        className="object-cover z-[1]"
      />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[var(--lux-bg)]/85 via-[var(--lux-bg)]/55 to-transparent" />
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 420px at 18% 20%, rgba(216,186,116,0.08) 0%, transparent 60%)",
        }}
      />

      {/* content */}
      <div className="relative z-[3] h-full mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col justify-center">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--lux-ink)]/65">
            Warehouse Weather
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-2 font-serif text-4xl md:text-[44px] leading-tight text-[var(--lux-ink)]"
          >
            {location}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.1 }}
            className="origin-left mt-4 h-px w-28 bg-[var(--lux-gold-line)]"
          />

          <div className="mt-6 grid grid-cols-3 gap-4 max-w-xl">
            {chips.map((c) => (
              <motion.div
                key={c.k}
                whileHover={{ scale: 1.03 }}
                className="rounded-full border border-[var(--lux-gold-line)]/60 bg-white/[0.04] px-4 py-2 backdrop-blur-sm"
              >
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--lux-ink)]/65">
                  {c.k}
                </div>
                <div className="text-sm font-medium text-[var(--lux-gold)]">{c.v}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="self-center">
          <div className="grid grid-cols-2 gap-5">
            {stats.map((s, i) => (
              <motion.div
                key={s.k}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: 0.06 * i }}
                className="rounded-2xl bg-white/[0.06] p-5 shadow-lg shadow-black/30"
              >
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--lux-ink)]/65">
                  {s.k}
                </div>
                <div className="mt-1.5 font-serif text-xl text-[var(--lux-gold)]">{s.v}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
