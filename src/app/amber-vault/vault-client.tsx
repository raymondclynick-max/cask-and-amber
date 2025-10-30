"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Stat = { label: string; value: number | string; suffix?: string };
type Insight = { title: string; body: string };
type Cask = { id: string; title: string; region: string; img: string };

const stats: Stat[] = [
  { label: "Portfolio Value", value: 108000, suffix: " €" },
  { label: "Total Casks", value: 37 },
  { label: "Total LAA", value: 182, suffix: " L" },
  { label: "Last Re-Gauge", value: "2025-06-12" },
];

const insights: Insight[] = [
  { title: "Market pulse rises", body: "Blue-chip single malts lift the index by 1.2% on higher median hammer prices." },
  { title: "PX-finish spotlight", body: "A Speyside house announces a limited PX series targeted at collectors." },
  { title: "Premium focus signalled", body: "A major producer prioritises aged malt SKUs over blends for Q4." },
];

const casks: Cask[] = [
  { id: "hp1997", title: "1997 Highland 1st Fill", region: "Highland", img: "/img/casks/hp1997.jpg" },
  { id: "sp2008", title: "2008 Speyside Refill", region: "Speyside", img: "/img/casks/sp2008.jpg" },
  { id: "is2012", title: "2012 Islay Hogshead", region: "Islay", img: "/img/casks/is2012.jpg" },
];

export default function VaultClient() {
  return (
    <main className="relative">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{ backgroundImage: "radial-gradient(1200px 600px at 20% 10%, var(--amber) 0%, transparent 60%)" }}
      />

      {/* HERO */}
      <section className="relative overflow-clip">
        <Image src="/img/hero/warehouse.jpg" alt="Warehouse" fill priority className="object-cover opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-5xl tracking-tight text-[var(--lux-ink)]"
          >
            Perth, Scotland
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1 }}
            className="origin-left mt-4 h-px bg-[var(--lux-gold-line)]"
          />

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <StatCard key={i} stat={s} delay={0.1 + i * 0.05} />
            ))}
          </div>

          <div className="mt-6 flex gap-6 text-xs uppercase tracking-[0.18em] text-[var(--lux-ink)]/70">
            <Metric label="Temperature" value="12.9 °C" />
            <Metric label="Relative Humidity" value="76%" />
            <Metric label="Wind Speed" value="9 kph" />
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Header title="Market Insights" />
        <div className="mt-6 divide-y divide-[var(--lux-gold-line)]/60 rounded-3xl border border-[var(--lux-gold-line)]/60 bg-white/[0.02] backdrop-blur">
          {insights.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.05 * i }}
              className="p-5 md:p-6"
            >
              <div className="font-serif text-[17px] text-[var(--lux-gold)]">{it.title}</div>
              <div className="mt-1.5 text-sm text-[var(--lux-ink)]/80">{it.body}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CASKS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-baseline justify-between">
          <Header title="Privately Owned Casks" />
          <a href="/cask-exchange/browse" className="text-xs tracking-[0.18em] text-[var(--lux-gold)] hover:opacity-80">
            View all
          </a>
        </div>

        <div className="mt-6 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex gap-6 snap-x snap-mandatory">
            {casks.map((c, i) => (
              <li key={c.id} className="snap-start shrink-0 w-[320px]">
                <CaskCard cask={c} delay={0.05 * i} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

function Header({ title }: { title: string }) {
  return (
    <div>
      <h2 className="font-serif text-2xl md:text-[28px] text-[var(--lux-ink)]">{title}</h2>
      <div className="mt-2 h-px w-24 bg-[var(--lux-gold-line)]" />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-[var(--lux-ink)]/60">{label}</span>
      <span className="text-sm text-[var(--lux-gold)]">{value}</span>
    </div>
  );
}

function StatCard({ stat, delay }: { stat: Stat; delay: number }) {
  const [display, setDisplay] = useState("—");

  useEffect(() => {
    if (typeof stat.value !== "number") {
      setDisplay(String(stat.value));
      return;
    }
    let frame = 0;
    const target = stat.value as number;
    const steps = 40;
    const id = setInterval(() => {
      frame += 1;
      const v = Math.round(target * (frame / steps));
      setDisplay(`${v.toLocaleString()}${stat.suffix ?? ""}`);
      if (frame >= steps) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [stat.value, stat.suffix]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-[var(--lux-gold-line)]/60 bg-white/[0.02] p-4"
    >
      <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--lux-ink)]/60">{stat.label}</div>
      <div className="mt-1 font-serif text-xl text-[var(--lux-gold)]">{display}</div>
    </motion.div>
  );
}

function CaskCard({ cask, delay }: { cask: Cask; delay: number }) {
  return (
    <motion.a
      href={`/amber-vault/cask/${cask.id}`}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay }}
      className="group block overflow-hidden rounded-3xl border border-[var(--lux-gold-line)]/60 bg-white/[0.02]"
    >
      <div className="relative h-48">
        <Image src={cask.img} alt={cask.title} fill className="object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="font-serif text-[15px] text-[var(--lux-ink)]">{cask.title}</div>
          <div className="text-xs text-[var(--lux-ink)]/70">{cask.region}</div>
        </div>
      </div>
      <div className="p-4 text-right">
        <span className="text-xs tracking-[0.18em] text-[var(--lux-gold)] opacity-90 group-hover:opacity-100">
          View details →
        </span>
      </div>
    </motion.a>
  );
}
