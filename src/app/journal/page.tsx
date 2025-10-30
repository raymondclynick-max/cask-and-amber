"use client";

import React, { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// ================================
// recharts (no SSR)
// ================================
const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false });
const AreaChart          = dynamic(() => import("recharts").then(m => m.AreaChart),          { ssr: false });
const Area               = dynamic(() => import("recharts").then(m => m.Area),               { ssr: false });
const XAxis              = dynamic(() => import("recharts").then(m => m.XAxis),              { ssr: false });
const YAxis              = dynamic(() => import("recharts").then(m => m.YAxis),              { ssr: false });
const Tooltip            = dynamic(() => import("recharts").then(m => m.Tooltip),            { ssr: false });
const CartesianGrid      = dynamic(() => import("recharts").then(m => m.CartesianGrid),      { ssr: false });
const LineChart          = dynamic(() => import("recharts").then(m => m.LineChart),          { ssr: false });
const Line               = dynamic(() => import("recharts").then(m => m.Line),               { ssr: false });

// ================================
// Utility hooks
// ================================
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

// ================================
// Mock data generator
// ================================
function genSeries(len = 24, start = 100, vol = 2) {
  let v = start;
  return Array.from({ length: len }).map((_, i) => {
    const drift = (Math.random() - 0.48) * vol;
    v = Math.max(80, v + drift);
    return { t: i, v: +v.toFixed(2) };
  });
}

const fmtPct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;
const pctChange = (arr: { v: number }[]) => {
  if (!arr.length) return 0;
  const first = arr[0].v;
  const last = arr[arr.length - 1].v;
  return ((last - first) / first) * 100;
};

// ================================
// PAGE
// ================================
export default function JournalPage() {
  const mounted = useMounted();

  const amberSeries = useMemo(() => (mounted ? genSeries(60, 102, 1.4) : []), [mounted]);
  const iconSeries  = useMemo(() => (mounted ? genSeries(60, 96, 1.8) : []), [mounted]);

  const amberDelta = useMemo(() => pctChange(amberSeries), [amberSeries]);
  const iconDelta  = useMemo(() => pctChange(iconSeries),  [iconSeries]);

  return (
    <main className="min-h-screen bg-[var(--lux-bg,#0a0a0a)] text-[var(--lux-ink,#f3efe9)]">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-[var(--lux-ink)]">Journal</h1>
        <p className="mt-3 text-sm md:text-base text-white/70 max-w-2xl">
          Market intelligence, craft analysis, and investor insights.
        </p>
      </section>

      {/* Live Ticker */}
      <section className="sticky top-0 z-20 bg-[var(--lux-bg,#0a0a0a)]/90 backdrop-blur border-y border-[var(--lux-gold-line,rgba(216,186,116,0.38))]">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <LivePulseTicker />
        </div>
      </section>

      {/* Index Cards */}
      <section className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <IndexCard
          title="Amber Index"
          subtitle="Cask & Amber synthetic benchmark"
          changePct={amberDelta}
          series={amberSeries}
        />
        <IndexCard
          title="RW101 Icon 100"
          subtitle="External bottle index"
          changePct={iconDelta}
          series={iconSeries}
          href="https://www.rarewhisky101.com/indices/market-performance-indices/rare_whisky_100_index"
        />
        <SourcesCard />
      </section>

      {/* Articles */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-serif">Latest Entries</h2>
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--lux-gold,#d8ba74)]">From Oak to Index</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map(a => (
            <ArticleCard key={a.slug} {...a} />
          ))}
        </div>
      </section>
    </main>
  );
}

// ================================
// Components
// ================================
function IndexCard({ title, subtitle, changePct, series, href }:{
  title: string; subtitle: string; changePct: number; series: { t:number; v:number }[]; href?: string;
}) {
  const badge = series.length === 0 ? "text-white/60" : changePct >= 0 ? "text-emerald-400" : "text-red-400";

  return (
    <div className="rounded-3xl border border-[var(--lux-gold-line,rgba(216,186,116,0.38))] bg-white/[0.02] p-4">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h3 className="text-base md:text-lg font-medium text-[var(--lux-ink)]">{title}</h3>
          <p className="text-xs text-white/60">{subtitle}</p>
        </div>
        <div className={`text-sm md:text-base ${badge}`}>{series.length ? fmtPct(changePct) : "—"}</div>
      </div>

      <div className="mt-3 h-28 w-full">
        {series.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 6, right: 6, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--lux-gold,#d8ba74)" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="var(--lux-gold,#d8ba74)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <XAxis dataKey="t" tick={{ fill: "#aaa", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#aaa", fontSize: 10 }} tickLine={false} axisLine={false} domain={["auto","auto"]} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(216,186,116,0.38)", borderRadius: 12 }} labelStyle={{ color: "#ddd" }} />
              <Area type="monotone" dataKey="v" stroke="var(--lux-gold,#d8ba74)" fill="url(#g1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full animate-pulse rounded-2xl bg-white/5" />
        )}
      </div>

      {href && (
        <div className="mt-3 text-right">
          <Link href={href} target="_blank" className="text-xs text-[var(--lux-gold,#d8ba74)] underline underline-offset-4 hover:opacity-80">
            View source
          </Link>
        </div>
      )}
    </div>
  );
}

// ================================
// Live ticker
// ================================
function LivePulseTicker() {
  const makePoint = (x:number, prev:number, vol=0.25) => ({ x, y: Math.max(80, +(prev + (Math.random()-0.5)*vol).toFixed(2)) });
  const seed = Array.from({length:40}).map((_,i)=>({ x:i, y:100+Math.sin(i/6)*1.2 }));
  const seed2= Array.from({length:40}).map((_,i)=>({ x:i, y:96+Math.cos(i/7)*1.4 }));
  const seed3= Array.from({length:40}).map((_,i)=>({ x:i, y:101+Math.sin(i/5)*0.8 }));

  const [a, setA] = useState(seed);
  const [b, setB] = useState(seed2);
  const [c, setC] = useState(seed3);

  useEffect(()=>{
    const id = setInterval(()=>{
      setA(p=>{ const l=p[p.length-1]; const n=makePoint(l.x+1,l.y,0.35); return [...p.slice(1),n]; });
      setB(p=>{ const l=p[p.length-1]; const n=makePoint(l.x+1,l.y,0.45); return [...p.slice(1),n]; });
      setC(p=>{ const l=p[p.length-1]; const n=makePoint(l.x+1,l.y,0.3);  return [...p.slice(1),n]; });
    },1200);
    return ()=>clearInterval(id);
  },[]);

  const delta = (arr:{y:number}[]) => arr.length ? (((arr[arr.length-1].y-arr[0].y)/arr[0].y)*100):0;
  const Item = ({label,series,href}:{label:string;series:{x:number;y:number}[];href?:string;})=>{
    const d = delta(series);
    const badge = d>=0 ? "text-emerald-400" : "text-red-400";
    return (
      <div className="flex items-center gap-3 min-w-[260px]">
        <div className="w-40 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}><Line type="monotone" dataKey="y" stroke="var(--lux-gold,#d8ba74)" dot={false} strokeWidth={2}/></LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs md:text-sm">
          {href ? <Link href={href} target="_blank" className="underline underline-offset-4 text-[var(--lux-ink)] hover:text-[var(--lux-gold)]">{label}</Link> : <span className="text-[var(--lux-ink)]">{label}</span>}
        </div>
        <div className={`ml-auto text-xs md:text-sm ${badge}`}>{fmtPct(d)}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-nowrap items-center gap-6 overflow-x-auto no-scrollbar">
      <Item label="Amber Index (Live)" series={a}/>
      <Item label="RW101 Icon 100" series={b} href="https://www.rarewhisky101.com/indices/market-performance-indices/rare_whisky_100_index"/>
      <Item label="Maturation Yield Proxy" series={c}/>
    </div>
  );
}

// ================================
// Sources + Articles
// ================================
function SourcesCard() {
  return (
    <div className="rounded-3xl border border-[var(--lux-gold-line,rgba(216,186,116,0.38))] bg-white/[0.02] p-4">
      <div className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold,#d8ba74)]">Primary Sources</div>
      <ul className="space-y-2 text-sm">
        <li><Link href="https://www.rarewhisky101.com/indices/market-performance-indices" target="_blank" className="underline underline-offset-4 text-[var(--lux-ink)] hover:text-[var(--lux-gold)]">Rare Whisky 101 — Indices</Link></li>
        <li><Link href="https://content.knightfrank.com/resources/knightfrank.com/wealthreport/the-wealth-report-2024.pdf" target="_blank" className="underline underline-offset-4 text-[var(--lux-ink)] hover:text-[var(--lux-gold)]">Knight Frank Wealth Report 2024</Link></li>
        <li><Link href="https://www.scotch-whisky.org.uk/newsroom/2024-export-figures/" target="_blank" className="underline underline-offset-4 text-[var(--lux-ink)] hover:text-[var(--lux-gold)]">SWA — 2024 Export Figures</Link></li>
        <li><Link href="https://www.dlapiper.com/en/insights/topics/whisky-law-insights/2025/scotch-whisky-a-guide-to-the-regulatory-framework" target="_blank" className="underline underline-offset-4 text-[var(--lux-ink)] hover:text-[var(--lux-gold)]">DLA Piper — Regulatory Framework</Link></li>
        <li><Link href="https://www.reuters.com/business/retail-consumer/diageo-braces-150-million-tariff-hit-unveils-500-million-savings-plan-2025-05-19/" target="_blank" className="underline underline-offset-4 text-[var(--lux-ink)] hover:text-[var(--lux-gold)]">Reuters — Diageo Cost Plan</Link></li>
      </ul>
    </div>
  );
}

function ArticleCard({ title, k, excerpt, href, tag }:{
  title:string; k:string; excerpt:string; href:string; tag:string;
}) {
  return (
    <article className="group rounded-3xl border border-[var(--lux-gold-line,rgba(216,186,116,0.38))] bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors">
      <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold,#d8ba74)]">{tag}</div>
      <h3 className="text-lg md:text-xl font-serif leading-tight text-[var(--lux-ink)]">{title}</h3>
      <p className="mt-2 text-sm text-white/70 line-clamp-3">{excerpt}</p>
      <div className="mt-4">
        <Link href={href} target="_blank" className="text-xs text-[var(--lux-gold,#d8ba74)] underline underline-offset-4 group-hover:opacity-80">
          Read external source
        </Link>
      </div>
    </article>
  );
}

// ================================
// Articles content
// ================================
const ARTICLES = [
  {
    slug: "amber-index-q3",
    title: "Amber Index: Q3 uptick driven by sherry-cask scarcity",
    k: "Market",
    tag: "Market",
    excerpt: "Sherry-seasoned oak tightens. Our index climbs modestly while bottle indices stay mixed.",
    href: "https://www.rarewhisky101.com/indices/market-performance-indices/rare_whisky_100_index",
  },
  {
    slug: "wealth-report",
    title: "Knight Frank 2024/25: rare whisky cools, dispersion widens",
    k: "Perspective",
    tag: "Perspective",
    excerpt: "Knight Frank shows rare whisky softening short term, decade returns remain high.",
    href: "https://content.knightfrank.com/resources/knightfrank.com/wealthreport/the-wealth-report-2024.pdf",
  },
  {
    slug: "swa-exports",
    title: "SWA: 2024 Scotch exports £5.4bn; 44 bottles per second",
    k: "Provenance",
    tag: "Provenance",
    excerpt: "Trade scale context for investors. Export volume and value show strong demand signals.",
    href: "https://www.scotch-whisky.org.uk/newsroom/2024-export-figures/",
  },
  {
    slug: "risk-note",
    title: "Regulatory note: cask sales and investor protections",
    k: "Risk",
    tag: "Risk",
    excerpt: "Cask sales fall outside FCA regulation. Ensure title, storage, insurance, and exit clarity.",
    href: "https://www.dlapiper.com/en/insights/topics/whisky-law-insights/2025/scotch-whisky-a-guide-to-the-regulatory-framework",
  },
  {
    slug: "diageo-capex",
    title: "Diageo: savings programme and tariff sensitivity",
    k: "News",
    tag: "News",
    excerpt: "Cost controls and tariffs shaping category margins. Monitor recovery timelines.",
    href: "https://www.reuters.com/business/retail-consumer/diageo-braces-150-million-tariff-hit-unveils-500-million-savings-plan-2025-05-19/",
  },
];
