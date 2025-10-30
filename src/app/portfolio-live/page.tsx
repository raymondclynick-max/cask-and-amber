"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

/* ========= Recharts (no SSR) ========= */
const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false });
const AreaChart           = dynamic(() => import("recharts").then(m => m.AreaChart),           { ssr: false });
const Area                = dynamic(() => import("recharts").then(m => m.Area),                { ssr: false });
const XAxis               = dynamic(() => import("recharts").then(m => m.XAxis),               { ssr: false });
const YAxis               = dynamic(() => import("recharts").then(m => m.YAxis),               { ssr: false });
const Tooltip             = dynamic(() => import("recharts").then(m => m.Tooltip),             { ssr: false });

/* ========= Types ========= */
type CaskLite = { id: string; distillery: string; region: string; age: number; caskType: string; image: string; valueEUR: number; roiPct: number; weeklyChangePct: number; };
type PortfolioMetrics = { totalValueEUR: number; totalROI: number; weeklyChangePct: number; xp: number; level: number; amberPoints: number; badges: string[]; };
type LeaderboardEntry = { username: string; roiPct: number; xp: number; totalValueEUR: number; rank: number; };
type Challenge = { id: string; title: string; description: string; rewardPoints: number; endDate: string };
type Candle = { time: number; open: number; high: number; low: number; close: number; volume: number };

/* ========= Mock data ========= */
const CASKS: CaskLite[] = [
  { id: "CA-25-001", distillery: "Strathvale", region: "Speyside", age: 12, caskType: "First-Fill Sherry Butt", image: "/img/casks/strathvale-12.jpg", valueEUR: 9200, roiPct: 27.4, weeklyChangePct: 0.6 },
  { id: "CA-25-002", distillery: "Kirk Ness",  region: "Islay",    age: 10, caskType: "Refill Bourbon Hogshead", image: "/img/casks/kirk-ness-10.jpg",  valueEUR: 6800, roiPct: 18.9, weeklyChangePct: -0.2 },
  { id: "CA-25-003", distillery: "Glen Rowan", region: "Highland", age: 15, caskType: "Ex-Bourbon Barrel",       image: "/img/casks/glen-rowan-15.jpg", valueEUR: 10400, roiPct: 31.1, weeklyChangePct: 0.9 },
];

const START_METRICS: PortfolioMetrics = {
  totalValueEUR: CASKS.reduce((a, b) => a + b.valueEUR, 0),
  totalROI: 25.0, weeklyChangePct: 0.53, xp: 1860, level: 5, amberPoints: 740,
  badges: ["First Fill Hero", "Diversifier", "Decade Holder"],
};

const LB: LeaderboardEntry[] = [
  { username: "Amir",  roiPct: 28.9, xp: 2040, totalValueEUR: 35500, rank: 1 },
  { username: "Yoav",  roiPct: 25.3, xp: 1860, totalValueEUR: START_METRICS.totalValueEUR, rank: 2 },
  { username: "Ray",   roiPct: 18.4, xp: 1320, totalValueEUR: 18300, rank: 3 },
  { username: "Matan", roiPct: 12.1, xp:  980, totalValueEUR:  9100, rank: 4 },
];

const CHALLENGES: Challenge[] = [
  { id: "ch-01", title: "Predict the Islay Index", description: "Guess next month’s Islay single-malt index movement.", rewardPoints: 150, endDate: "2025-11-15" },
  { id: "ch-02", title: "Sherry Sprint",          description: "Acquire a sherry cask or attend a tasting to qualify.", rewardPoints: 200, endDate: "2025-11-30" },
];

/* ========= Utils ========= */
const currency = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/* ========= Synthetic data ========= */
function genCandles(n: number, start: number, stepSec = 60): Candle[] {
  const out: Candle[] = [];
  let t = Math.floor(Date.now() / 1000) - n * stepSec;
  let prev = start;
  for (let i = 0; i < n; i++) {
    const drift = 1 + (Math.random() - 0.5) * 0.004;
    const open = prev;
    const close = Math.max(100, open * drift);
    const high = Math.max(open, close) * (1 + Math.random() * 0.002);
    const low  = Math.min(open, close) * (1 - Math.random() * 0.002);
    const volume = 50 + Math.random() * 300;
    out.push({ time: t, open, high, low, close, volume });
    prev = close; t += stepSec;
  }
  return out;
}
function nextCandle(last: Candle): Candle {
  const t = last.time + 60;
  const open = last.close;
  const drift = 1 + (Math.random() - 0.5) * 0.004;
  const close = Math.max(100, open * drift);
  const high = Math.max(open, close) * (1 + Math.random() * 0.002);
  const low  = Math.min(open, close) * (1 - Math.random() * 0.002);
  const volume = 50 + Math.random() * 300;
  return { time: t, open, high, low, close, volume };
}
function calcStats(c: Candle[]) {
  const last = c[c.length - 1];
  const first = c[Math.max(0, c.length - 60 * 24)];
  const change = first ? ((last.close - first.close) / first.close) * 100 : 0;
  const high24 = Math.max(...c.slice(-60 * 24).map(x => x.high));
  const low24  = Math.min(...c.slice(-60 * 24).map(x => x.low));
  const vol24  = c.slice(-60 * 24).reduce((a, x) => a + x.volume, 0);
  return { last: last.close, changePct: change, high24, low24, vol24 };
}
function buildDepth(mid: number) {
  const bids: { price: number; size: number }[] = [];
  const asks: { price: number; size: number }[] = [];
  for (let i = 20; i >= 1; i--) bids.push({ price: +(mid * (1 - i * 0.0015)).toFixed(2), size: Math.round(50 + Math.random() * 200) });
  for (let i = 1; i <= 20; i++) asks.push({ price: +(mid * (1 + i * 0.0015)).toFixed(2), size: Math.round(50 + Math.random() * 200) });
  let acc = 0; const bidsCum = bids.map(b => ({ price: b.price, cum: (acc += b.size) }));
  acc = 0; const asksCum = asks.map(a => ({ price: a.price, cum: (acc += a.size) }));
  return { bidsCum, asksCum };
}

/* ========= Page ========= */
export default function PortfolioLivePage() {
  const [metrics, setMetrics] = useState<PortfolioMetrics>(START_METRICS);
  const [series, setSeries] = useState(() =>
    Array.from({ length: 120 }, (_, i) => {
      const base = 22000, drift = i * 120, noise = Math.sin(i / 4) * 120;
      return { t: i, v: base + drift + noise };
    })
  );
  const [casksOpen, setCasksOpen] = useState(false);
  const sortedLB = useMemo(() => [...LB].sort((a, b) => a.rank - b.rank), []);

  /* portfolio motion */
  useEffect(() => {
    let raf = 0, lastTs = performance.now();
    const step = (ts: number) => {
      if (ts - lastTs > 800) {
        lastTs = ts;
        const jitter = (Math.random() - 0.5) * 0.18;
        const weekly = clamp(metrics.weeklyChangePct + jitter, -3, 3);
        const last = series[series.length - 1].v;
        const nextVal = last * (1 + weekly / 100 / 12);
        setSeries(s => [...s.slice(1), { t: s[s.length - 1].t + 1, v: nextVal }]);
        setMetrics(m => ({ ...m, weeklyChangePct: weekly, totalValueEUR: nextVal, totalROI: clamp(m.totalROI + jitter / 10, -50, 500) }));
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [metrics.weeklyChangePct, series]);

  return (
    <main className="min-h-screen text-[var(--lux-ink)]" style={{ background: "repeating-linear-gradient(45deg,#0a0a0a,#0a0a0a 6px,#0c0c0c 6px,#0c0c0c 12px)" }}>
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <PerformanceCard series={series} metrics={metrics} />
        <PointsCard points={metrics.amberPoints} />
      </section>

      {/* CASK INDEX */}
      <CaskIndexSection />

      {/* Leaderboard + XP */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SectionCard title="Leaderboard — Friends" right={<Link href="/cask-exchange" className="text-xs underline">Find Casks</Link>}>
          <F1Board entries={sortedLB} />
        </SectionCard>
        <SectionCard title="Level & XP">
          <XPPanel xp={metrics.xp} level={metrics.level} />
          <div className="mt-3"><Chip>Next unlock: Tasting QR • +150</Chip></div>
        </SectionCard>
      </section>

      {/* Collapsed */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SectionCard
          title="Your Casks"
          right={
            <div className="flex items-center gap-3">
              <Link href="/cask-exchange" className="text-xs underline">Find new casks</Link>
              <button onClick={() => setCasksOpen(o => !o)} className="text-xs rounded-full border border-[var(--lux-gold-line)] px-3 py-1">
                {casksOpen ? "Hide" : "Show"}
              </button>
            </div>
          }
        >
          <div className={`grid transition-[grid-template-rows] duration-300 ${casksOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {CASKS.map(c => (
                  <article key={c.id} className="rounded-[20px] overflow-hidden border border-[var(--lux-gold-line)] bg-white/[0.02]">
                    <div className="relative h-36 w-full">
                      <img src={c.image} alt={c.distillery} className="h-full w-full object-cover" />
                      <div className="absolute top-2 left-2 text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full border border-[var(--lux-gold-line)] bg-black/50">{c.region}</div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="text-xs">{c.distillery}</div>
                      <div className="font-serif text-lg">{c.age} year • {c.caskType}</div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{currency(c.valueEUR)}</span>
                        <RoiPill pct={c.roiPct} />
                      </div>
                      <Ticker delta={c.weeklyChangePct} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Challenges">
          <ChallengesList list={CHALLENGES} />
        </SectionCard>
        <div />
      </section>
    </main>
  );
}

/* ========= Cask Index (all-native) ========= */
function CaskIndexSection() {
  const [candles, setCandles] = useState<Candle[]>(() => genCandles(240, 1000)); // 4h @1m
  const [stats, setStats] = useState(() => calcStats(candles));
  const [depth, setDepth] = useState(() => buildDepth(stats.last));

  useEffect(() => {
    const id = setInterval(() => {
      setCandles(prev => {
        const next = nextCandle(prev[prev.length - 1]);
        const arr = [...prev.slice(1), next];
        setStats(calcStats(arr));
        setDepth(buildDepth(next.close));
        return arr;
      });
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const depthData = useMemo(() => {
    const bids = depth.bidsCum.map(b => ({ price: b.price, bid: b.cum, ask: 0 }));
    const asks = depth.asksCum.map(a => ({ price: a.price, bid: 0, ask: a.cum }));
    return [...bids, ...asks].sort((a, b) => a.price - b.price);
  }, [depth]);

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <SectionCard title="Cask Index — Live">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--lux-gold)]">Last</div>
            <div className="text-3xl font-serif">{currency(stats.last)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm">
              <span className={stats.changePct >= 0 ? "text-[var(--lux-gold)]" : ""}>
                {stats.changePct >= 0 ? "▲" : "▼"} {Math.abs(stats.changePct).toFixed(2)}% 24h
              </span>
            </div>
            <div className="text-xs opacity-80">H {currency(stats.high24)} • L {currency(stats.low24)}</div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[var(--lux-gold-line)] bg-black/20 overflow-hidden">
          <div className="h-[360px]"><CandleChartSVG candles={candles} /></div>
          <div className="h-[90px] border-t border-[var(--lux-gold-line)]"><VolumeSVG candles={candles} /></div>
        </div>
      </SectionCard>

      <SectionCard title="Depth">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={depthData}>
              <defs>
                <linearGradient id="bid" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8fd8c4" stopOpacity={0.35}/><stop offset="95%" stopColor="#8fd8c4" stopOpacity={0.02}/></linearGradient>
                <linearGradient id="ask" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#d88fb6" stopOpacity={0.35}/><stop offset="95%" stopColor="#d88fb6" stopOpacity={0.02}/></linearGradient>
              </defs>
              <XAxis dataKey="price" tick={{ fill: "#d8ba74", fontSize: 11 }} />
              <YAxis tick={{ fill: "#d8ba74", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(216,186,116,0.4)", borderRadius: 12, color: "#f3efe9" }} />
              <Area type="monotone" dataKey="bid" stroke="#8fd8c4" fill="url(#bid)" strokeWidth={2} />
              <Area type="monotone" dataKey="ask" stroke="#d88fb6" fill="url(#ask)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-[14px] border border-[var(--lux-gold-line)] bg-black/30 p-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold)] mb-1">24h Volume</div>
            {Math.round(stats.vol24).toLocaleString()} L
          </div>
          <div className="rounded-[14px] border border-[var(--lux-gold-line)] bg-black/30 p-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold)] mb-1">Spread</div>
            ~{(depth.asksCum[0].price - depth.bidsCum[depth.bidsCum.length - 1].price).toFixed(2)} EUR
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Highlights">
        <ul className="space-y-2 text-sm">
          <li className="rounded-[14px] border border-[var(--lux-gold-line)] bg-black/30 p-3">Islay sub-index +0.6% today</li>
          <li className="rounded-[14px] border border-[var(--lux-gold-line)] bg-black/30 p-3">Sherry casks outperform bourbon by 0.3% this week</li>
          <li className="rounded-[14px] border border-[var(--lux-gold-line)] bg-black/30 p-3">12–15y bracket shows strongest momentum</li>
        </ul>
      </SectionCard>
    </section>
  );
}

/* ========= SVG Candles + Volume (no deps) ========= */
function CandleChartSVG({ candles }: { candles: Candle[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1000, h: 360 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth || 1000, h: el.clientHeight || 360 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pad = 8;
  const highs = candles.map(c => c.high);
  const lows  = candles.map(c => c.low);
  const maxY = Math.max(...highs);
  const minY = Math.min(...lows);
  const px = (i: number) => pad + (i / (candles.length - 1)) * (size.w - pad * 2);
  const py = (v: number) => pad + (1 - (v - minY) / (maxY - minY || 1)) * (size.h - pad * 2);

  const bodyW = Math.max(2, (size.w - pad * 2) / candles.length * 0.6);

  return (
    <div ref={ref} className="w-full h-full">
      <svg width="100%" height="100%" viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none">
        {/* subtle grid */}
        <g opacity="0.06" stroke="#d8ba74">
          {[0,1,2,3,4].map(i => <line key={i} x1={pad} x2={size.w-pad} y1={pad + i*(size.h-2*pad)/4} y2={pad + i*(size.h-2*pad)/4} />)}
        </g>
        {/* candles */}
        {candles.map((c, i) => {
          const x = px(i);
          const yOpen = py(c.open);
          const yClose = py(c.close);
          const yHigh = py(c.high);
          const yLow  = py(c.low);
          const up = c.close >= c.open;
          const fill = up ? "#d8ba74" : "#7a6140";
          const yTop = Math.min(yOpen, yClose);
          const h = Math.abs(yClose - yOpen) || 1;
          return (
            <g key={c.time}>
              <line x1={x} x2={x} y1={yHigh} y2={yLow} stroke={fill} strokeWidth="1.5" />
              <rect x={x - bodyW/2} y={yTop} width={bodyW} height={h} fill={fill} opacity="0.85" rx="2" />
            </g>
          );
        })}
        {/* glow */}
        <defs>
          <filter id="soft">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        <rect x={0} y={size.h-6} width={size.w} height={6} fill="#d8ba74" opacity="0.15" filter="url(#soft)" />
      </svg>
    </div>
  );
}

function VolumeSVG({ candles }: { candles: Candle[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1000, h: 90 });

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth || 1000, h: el.clientHeight || 90 }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pad = 8;
  const maxV = Math.max(...candles.map(c => c.volume));
  const px = (i: number) => pad + (i / (candles.length - 1)) * (size.w - pad * 2);
  const py = (v: number) => pad + (1 - v / (maxV || 1)) * (size.h - pad * 2);
  const barW = Math.max(1, (size.w - pad * 2) / candles.length * 0.6);

  return (
    <div ref={ref} className="w-full h-full">
      <svg width="100%" height="100%" viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none">
        {candles.map((c, i) => {
          const x = px(i); const y = py(c.volume);
          const h = size.h - pad - y;
          return <rect key={c.time} x={x - barW/2} y={y} width={barW} height={h} fill="rgba(216,186,116,0.35)" />;
        })}
      </svg>
    </div>
  );
}

/* ========= UI pieces ========= */
function PerformanceCard({ series, metrics }: { series: { t: number; v: number }[]; metrics: PortfolioMetrics }) {
  return (
    <div className="lg:col-span-2 rounded-[32px] p-6"
      style={{ background: "linear-gradient(135deg, rgba(18,18,18,0.7), rgba(0,0,0,0.35))", border: "1px solid var(--lux-gold-line)", backdropFilter: "blur(8px)", boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--lux-gold)]">Portfolio Value</div>
          <AnimatedNumber className="text-[40px] leading-none font-serif" value={metrics.totalValueEUR} fmt="currency" />
          <div className="mt-1 text-sm">
            <span className={metrics.weeklyChangePct >= 0 ? "text-[var(--lux-gold)]" : ""}>
              {metrics.weeklyChangePct >= 0 ? "▲" : "▼"} {Math.abs(metrics.weeklyChangePct).toFixed(2)}% this week
            </span>
            <span className="ml-3 opacity-80">{metrics.totalROI.toFixed(1)}% total ROI</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--lux-gold)]">Level</div>
          <span className="inline-block rounded-full border border-[var(--lux-gold-line)] px-3 py-1 text-sm">Lv {metrics.level}</span>
        </div>
      </div>
      <div className="h-64 rounded-[20px] overflow-hidden border border-[var(--lux-gold-line)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series}>
            <defs>
              <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              <linearGradient id="amberFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#d8ba74" stopOpacity={0.30} /><stop offset="95%" stopColor="#d8ba74" stopOpacity={0.00} /></linearGradient>
            </defs>
            <XAxis dataKey="t" hide /><YAxis hide />
            <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(216,186,116,0.4)", borderRadius: 12, color: "#f3efe9" }} formatter={(v: any) => currency(Number(v))} />
            <Area type="monotone" dataKey="v" stroke="#d8ba74" strokeWidth={2.5} fill="url(#amberFill)" animationDuration={600} animationEasing="ease-out" {...{ filter: "url(#glow)" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function PointsCard({ points }: { points: number }) {
  return (
    <div className="rounded-[32px] p-6 flex flex-col justify-between"
      style={{ background: "linear-gradient(135deg, rgba(42,36,22,0.65), rgba(0,0,0,0.35))", border: "1px solid var(--lux-gold-line)", backdropFilter: "blur(8px)", boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--lux-gold)]">Amber Points</div>
        <AnimatedNumber className="text-[40px] leading-none font-serif" value={points} />
        <div className="mt-2 text-xs opacity-80">Use for tastings, drops, and early access.</div>
      </div>
      <div className="mt-6 flex gap-2">
        <button className="rounded-full bg-[var(--lux-gold)] text-[var(--button-text)] px-4 py-2 text-sm">Redeem</button>
        <button className="rounded-full border border-[var(--lux-gold-line)] px-4 py-2 text-sm">Boost</button>
      </div>
    </div>
  );
}

/* ========= Shared ========= */
function AnimatedNumber({ value, suffix = "", className, fmt }: { value: number; suffix?: string; className?: string; fmt?: "currency" }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => { const id = setInterval(() => setDisplay(d => d + (value - d) * 0.2), 40); return () => clearInterval(id); }, [value]);
  const out = fmt === "currency" ? new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(display) : Math.round(display).toString();
  return <div className={className}>{out}{suffix}</div>;
}

function SectionCard({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] overflow-hidden"
      style={{ background: "linear-gradient(180deg, rgba(10,10,10,0.65), rgba(12,12,12,0.45)), repeating-linear-gradient(45deg,#0a0a0a,#0a0a0a 6px,#0c0c0c 6px,#0c0c0c 12px)", boxShadow: "0 18px 40px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.04)", border: "1px solid transparent", borderImage: "linear-gradient(90deg,#6b5a2e,#d8ba74,#6b5a2e) 1" }}>
      <header>
        <div className="h-[46px] flex items-center justify-between px-5" style={{ background: "linear-gradient(90deg,#2c2618,#3a311a)" }}>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--lux-gold)]">{title}</div>
          {right}
        </div>
        <div className="h-[3px] bg-[linear-gradient(90deg,#b6914b,#d8ba74,#b6914b)]" />
      </header>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full px-3 py-1 text-xs" style={{ border: "1px solid var(--lux-gold-line)", background: "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.2))", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03)" }}>
      {children}
    </span>
  );
}

function F1Board({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="space-y-4 relative">
      <div className="absolute inset-0 pointer-events-none rounded-[22px] [background:repeating-linear-gradient(0deg,transparent,transparent_30px,rgba(216,186,116,0.06)_31px)]" />
      {entries.map(e => (
        <div key={e.username} className="relative grid grid-cols-[68px_1fr_auto] items-center gap-4 rounded-[22px] overflow-hidden"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.58), rgba(0,0,0,0.4))", border: "1px solid var(--lux-gold-line)", boxShadow: "0 12px 26px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.03)" }}>
          <div className="h-full grid place-items-center text-[var(--button-text)] font-bold text-lg" style={{ background: "linear-gradient(180deg,#d8ba74,#b6914b)", clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }}>{e.rank}</div>
          <div className="py-3 pr-2"><div className="flex items-center gap-3"><span className="inline-block h-3 w-12 rounded-sm" style={{ background: "linear-gradient(90deg,#b6914b,#d8ba74)" }} /><span className="font-semibold text-base">{e.username}</span><Chip>{currency(e.totalValueEUR)}</Chip></div></div>
          <div className="pr-4 text-sm"><span className={e.roiPct >= 0 ? "text-[var(--lux-gold)]" : ""}>{e.roiPct >= 0 ? "▲" : "▼"} {e.roiPct.toFixed(1)}%</span></div>
        </div>
      ))}
    </div>
  );
}

function RoiPill({ pct }: { pct: number }) {
  const up = pct >= 0;
  return <span className={`text-xs rounded-full px-2 py-1 border ${up ? "border-[var(--lux-gold)] text-[var(--lux-gold)]" : "border-[var(--lux-gold-line)]"}`}>{up ? "▲" : "▼"} {pct.toFixed(1)}%</span>;
}

function Ticker({ delta }: { delta: number }) {
  const up = delta >= 0;
  return <div className="text-xs rounded-xl border border-[var(--lux-gold-line)] bg-black/30 px-2 py-1 flex items-center justify-between"><span>Weekly</span><span className={up ? "text-[var(--lux-gold)]" : ""}>{up ? "▲" : "▼"} {Math.abs(delta).toFixed(2)}%</span></div>;
}

function XPPanel({ xp, level }: { xp: number; level: number }) {
  const nextLevelXP = 2000; const pct = clamp((xp / nextLevelXP) * 100, 0, 100);
  return (<div><div className="text-sm mb-2">Level {level}</div><div className="w-full h-3.5 rounded-full bg-black/30 overflow-hidden"><div className="h-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#b6914b,#d8ba74)" }} /></div><div className="mt-2 text-xs">{xp} / {nextLevelXP} XP</div></div>);
}

function ChallengesList({ list }: { list: Challenge[] }) {
  return (<div className="space-y-3">{list.map(c => (<div key={c.id} className="rounded-[18px] border border-[var(--lux-gold-line)] bg-black/30 px-4 py-3"><div className="flex items-center justify-between"><div className="font-semibold">{c.title}</div><div className="text-xs rounded-full border border-[var(--lux-gold-line)] px-3 py-1">+{c.rewardPoints}</div></div><div className="text-sm mt-1">{c.description}</div><div className="text-xs mt-1">Ends {new Date(c.endDate).toLocaleDateString()}</div><div className="mt-2"><button className="text-xs rounded-full bg-[var(--lux-gold)] text-[var(--button-text)] px-3 py-1">Join</button></div></div>))}</div>);
}
