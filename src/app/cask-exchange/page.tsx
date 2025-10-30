"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Recharts (client-only)
const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false });
const RadarChart          = dynamic(() => import("recharts").then(m => m.RadarChart),          { ssr: false });
const Radar               = dynamic(() => import("recharts").then(m => m.Radar),               { ssr: false });
const PolarGrid           = dynamic(() => import("recharts").then(m => m.PolarGrid),           { ssr: false });
const PolarAngleAxisRaw   = dynamic(() => import("recharts").then(m => m.PolarAngleAxis),      { ssr: false });
const PolarRadiusAxisRaw  = dynamic(() => import("recharts").then(m => m.PolarRadiusAxis),     { ssr: false });
const Tooltip             = dynamic(() => import("recharts").then(m => m.Tooltip),             { ssr: false });

// Cast to silence TS overload noise across Recharts versions
// Usage is safe because we pass only supported props.
const PAA  = PolarAngleAxisRaw  as unknown as React.ComponentType<any>;
const PRad = PolarRadiusAxisRaw as unknown as React.ComponentType<any>;

// Types
type FlavorAxis = "Citrus" | "Honey" | "Smoke" | "Spice" | "Dried Fruit" | "Vanilla";
type Cask = {
  id: string;
  distillery: string;
  region: string;
  spiritType: string;
  caskType: string;
  age: number;
  abv: number;
  volumeL: number;
  priceEUR: number;
  warehouse: string;
  coords?: { xPct: number; yPct: number };
  image: string;
  status: "available" | "reserved" | "sold";
  nose: string;
  palate: string;
  finish: string;
  flavorSpider: Record<FlavorAxis, number>;
};

// Demo data
const CASKS: Cask[] = [
  {
    id: "CA-25-001",
    distillery: "Strathvale",
    region: "Speyside",
    spiritType: "Single Malt",
    caskType: "First-Fill Sherry Butt",
    age: 12,
    abv: 63.4,
    volumeL: 480,
    priceEUR: 7200,
    warehouse: "Perth, Scotland",
    coords: { xPct: 32, yPct: 18 },
    image: "/img/casks/strathvale-12.jpg",
    status: "available",
    nose: "Raisin, orange peel, roasted hazelnut.",
    palate: "Silky sherry, baked apple, clove.",
    finish: "Long with cocoa and walnut bitters.",
    flavorSpider: { Citrus: 6, Honey: 7, Smoke: 1, Spice: 6, "Dried Fruit": 8, Vanilla: 4 },
  },
  {
    id: "CA-25-002",
    distillery: "Kirk Ness",
    region: "Islay",
    spiritType: "Single Malt",
    caskType: "Refill Bourbon Hogshead",
    age: 10,
    abv: 62.1,
    volumeL: 250,
    priceEUR: 6400,
    warehouse: "Campbeltown",
    coords: { xPct: 26, yPct: 28 },
    image: "/img/casks/kirk-ness-10.jpg",
    status: "available",
    nose: "Sea spray, iodine, lemon.",
    palate: "Peat smoke, vanilla cream, pepper.",
    finish: "Ashy with lingering brine.",
    flavorSpider: { Citrus: 5, Honey: 3, Smoke: 9, Spice: 5, "Dried Fruit": 2, Vanilla: 5 },
  },
  {
    id: "CA-25-003",
    distillery: "Glen Rowan",
    region: "Highland",
    spiritType: "Single Malt",
    caskType: "Ex-Bourbon Barrel",
    age: 15,
    abv: 60.8,
    volumeL: 190,
    priceEUR: 8900,
    warehouse: "Perth, Scotland",
    coords: { xPct: 33, yPct: 22 },
    image: "/img/casks/glen-rowan-15.jpg",
    status: "reserved",
    nose: "Heather honey, pear, vanilla pod.",
    palate: "Toffee, almond, hint of oak spice.",
    finish: "Warming with citrus oils.",
    flavorSpider: { Citrus: 6, Honey: 8, Smoke: 1, Spice: 4, "Dried Fruit": 3, Vanilla: 7 },
  },
];

const currency = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export default function CaskExchangePage() {
  const [view, setView] = useState<"grid" | "map">("grid");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [compare, setCompare] = useState<string[]>([]);
  const [active, setActive] = useState<Cask | null>(null);

  const regions = useMemo(
    () => ["all", "Speyside", "Islay", "Highland", "Lowland", "Islands", "Campbeltown"],
    []
  );
  const types = useMemo(() => ["all", "Single Malt", "Grain", "Blend"], []);

  const filtered = useMemo(() => {
    return CASKS.filter(
      (c) =>
        (region === "all" || c.region === region) &&
        (type === "all" || c.spiritType === type) &&
        (status === "all" || c.status === status) &&
        (query.trim() === "" ||
          `${c.distillery} ${c.region} ${c.caskType}`.toLowerCase().includes(query.toLowerCase()))
    );
  }, [region, type, status, query]);

  function toggleCompare(id: string) {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  return (
    <main className="min-h-screen bg-[var(--lux-bg)] text-[var(--lux-ink)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
        <img src="/img/hero/warehouse.jpg" alt="Warehouse" className="h-[36vh] w-full object-cover opacity-70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight">Cask Exchange</h1>
          <p className="mt-3 max-w-2xl text-sm md:text-base text-[var(--lux-ink)]/80">
            Discover and acquire exceptional whisky casks. Verified, insured, bonded. Add to your portfolio in one step.
          </p>
          <div className="mt-6 flex items-center gap-2 rounded-full border border-[var(--lux-gold-line)] bg-white/5 p-1">
            <button
              onClick={() => setView("grid")}
              className={`px-4 py-2 rounded-full text-sm ${
                view === "grid" ? "bg-[var(--lux-gold)] text-[var(--button-text)]" : "text-[var(--lux-ink)]/80"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView("map")}
              className={`px-4 py-2 rounded-full text-sm ${
                view === "map" ? "bg-[var(--lux-gold)] text-[var(--button-text)]" : "text-[var(--lux-ink)]/80"
              }`}
            >
              Map
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-[0.2em] text-[var(--lux-gold)]/80 mb-2">Search</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Distillery, cask type…"
              className="w-full rounded-xl bg-white/5 border border-[var(--lux-gold-line)] px-3 py-2 outline-none"
            />
          </div>
          <Select label="Region" value={region} onChange={setRegion} options={regions} />
          <Select label="Type" value={type} onChange={setType} options={types} />
          <Select label="Status" value={status} onChange={setStatus} options={["all", "available", "reserved", "sold"]} />
          <div className="flex gap-3">
            <Link href="/amber-vault" className="w-full text-center rounded-xl bg-[var(--lux-gold)] text-[var(--button-text)] px-4 py-2">
              Go to Vault
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pb-24">
        {view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <article
                key={c.id}
                className="rounded-3xl border border-[var(--lux-gold-line)] bg-white/[0.02] overflow-hidden hover:border-[var(--lux-gold)]/50 transition-colors"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img src={c.image} alt={c.distillery} className="h-full w-full object-cover" />
                  <div className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full border border-[var(--lux-gold-line)] bg-black/50">
                    {c.region}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs text-[var(--lux-ink)]/70">{c.distillery}</div>
                      <h3 className="font-serif text-xl text-[var(--lux-ink)]">
                        {c.age} year • {c.caskType}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[var(--lux-ink)]/70">
                        {c.volumeL} L @ {c.abv}%
                      </div>
                      <div className="text-lg text-[var(--lux-gold)]">{currency(c.priceEUR)}</div>
                    </div>
                  </div>

                  <div className="text-sm text-[var(--lux-ink)]/80">
                    <span className="text-[var(--lux-ink)]/60">Warehouse:</span> {c.warehouse}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <MiniSpider chart={c.flavorSpider} />
                    <NoteBlock label="Nose" text={c.nose} />
                    <NoteBlock label="Palate" text={c.palate} />
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => setActive(c)}
                      className="rounded-xl border border-[var(--lux-gold-line)] px-3 py-2 text-sm hover:border-[var(--lux-gold)]/60"
                    >
                      Details
                    </button>
                    <div className="flex items-center gap-2">
                      <button className="rounded-xl bg-[var(--lux-gold)] text-[var(--button-text)] px-3 py-2 text-sm">
                        Add to Portfolio
                      </button>
                      <button
                        onClick={() => toggleCompare(c.id)}
                        className={`rounded-xl px-3 py-2 text-sm border ${
                          compare.includes(c.id)
                            ? "border-[var(--lux-gold)] text-[var(--lux-gold)]"
                            : "border-[var(--lux-gold-line)]"
                        }`}
                      >
                        {compare.includes(c.id) ? "Selected" : "Compare"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <MapView
            casks={filtered}
            onOpen={(c) => setActive(c)}
            onCompare={(c) => toggleCompare(c.id)}
            selected={compare}
          />
        )}
      </section>

      {/* Detail Drawer */}
      {active && (
        <DetailDrawer
          cask={active}
          onClose={() => setActive(null)}
          onCompare={() => toggleCompare(active.id)}
          compareSelected={compare.includes(active.id)}
        />
      )}

      {/* Compare Tray */}
      <CompareTray
        casks={CASKS.filter((c) => compare.includes(c.id))}
        onRemove={(id) => setCompare(compare.filter((x) => x !== id))}
      />
    </main>
  );
}

// UI helpers
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[var(--lux-gold)]/80 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-white/5 border border-[var(--lux-gold-line)] px-3 py-2"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function NoteBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-xl border border-[var(--lux-gold-line)]/70 p-3 bg-white/5">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold)]/80 mb-1">{label}</div>
      <p className="text-sm text-[var(--lux-ink)]/85 line-clamp-3">{text}</p>
    </div>
  );
}

function MiniSpider({ chart }: { chart: Record<FlavorAxis, number> }) {
  const data = (Object.keys(chart) as FlavorAxis[]).map((k) => ({ axis: k, value: chart[k] }));
  return (
    <div className="rounded-xl border border-[var(--lux-gold-line)]/70 p-2 bg-white/5">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold)]/80 mb-1">Flavour</div>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
            <PolarGrid />
            <PAA dataKey="axis" tick={{ fill: "#d8ba74", fontSize: 12 }} />
            <PRad domain={[0, 10]} tick={false} />
            <Radar name="intensity" dataKey="value" fill="#d8ba74" fillOpacity={0.25} stroke="#d8ba74" />
            <Tooltip
              contentStyle={{
                background: "#111",
                border: "1px solid rgba(216,186,116,0.4)",
                borderRadius: 12,
                color: "#f3efe9",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function DetailDrawer({
  cask,
  onClose,
  onCompare,
  compareSelected,
}: {
  cask: Cask;
  onClose: () => void;
  onCompare: () => void;
  compareSelected: boolean;
}) {
  const spiderData = (Object.keys(cask.flavorSpider) as FlavorAxis[]).map((k) => ({
    axis: k,
    value: cask.flavorSpider[k],
  }));
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[560px] bg-[var(--lux-bg)] border-l border-[var(--lux-gold-line)] shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[var(--lux-gold-line)]/60">
          <div>
            <div className="text-xs text-[var(--lux-ink)]/70">{cask.distillery}</div>
            <div className="font-serif text-2xl">{cask.age} year • {cask.caskType}</div>
          </div>
          <button onClick={onClose} className="rounded-xl border border-[var(--lux-gold-line)] px-3 py-2">Close</button>
        </div>
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-64px)]">
          <img src={cask.image} alt={cask.distillery} className="w-full h-48 object-cover rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            <KeyVal k="Region" v={cask.region} />
            <KeyVal k="Type" v={cask.spiritType} />
            <KeyVal k="ABV" v={`${cask.abv}%`} />
            <KeyVal k="Volume" v={`${cask.volumeL} L`} />
            <KeyVal k="Warehouse" v={cask.warehouse} />
            <KeyVal k="Status" v={capitalize(cask.status)} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <NoteBlock label="Nose" text={cask.nose} />
            <NoteBlock label="Palate" text={cask.palate} />
            <NoteBlock label="Finish" text={cask.finish} />
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold)]/80 mb-2">Flavour Profile</div>
            <div className="h-64 w-full rounded-2xl border border-[var(--lux-gold-line)] bg-white/5 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={spiderData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid />
                  <PAA dataKey="axis" tick={{ fill: "#d8ba74", fontSize: 12 }} />
                  <PRad domain={[0, 10]} tick={false} />
                  <Radar name="intensity" dataKey="value" fill="#d8ba74" fillOpacity={0.25} stroke="#d8ba74" />
                  <Tooltip
                    contentStyle={{
                      background: "#111",
                      border: "1px solid rgba(216,186,116,0.4)",
                      borderRadius: 12,
                      color: "#f3efe9",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button className="rounded-xl bg-[var(--lux-gold)] text-[var(--button-text)] px-4 py-3">Add to Portfolio</button>
            <button
              onClick={onCompare}
              className={`rounded-xl px-4 py-3 border ${
                compareSelected ? "border-[var(--lux-gold)] text-[var(--lux-gold)]" : "border-[var(--lux-gold-line)]"
              }`}
            >
              {compareSelected ? "Selected for Compare" : "Add to Compare"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapView({
  casks,
  onOpen,
  onCompare,
  selected,
}: {
  casks: Cask[];
  onOpen: (c: Cask) => void;
  onCompare: (c: Cask) => void;
  selected: string[];
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold)]/80 mb-3">Storage Map</div>
      <div className="relative w-full h-[520px] overflow-hidden rounded-3xl border border-[var(--lux-gold-line)] bg-[url('/img/maps/uk-cyprus-map.jpg')] bg-cover bg-center">
        {casks.map((c) => (
          <div
            key={c.id}
            style={{
              left: `${c.coords?.xPct ?? 50}%`,
              top: `${c.coords?.yPct ?? 50}%`,
              transform: "translate(-50%, -100%)",
            }}
            className="absolute"
          >
            <button
              onClick={() => onOpen(c)}
              className={`group relative -mt-4 rounded-xl border px-3 py-2 text-xs backdrop-blur bg-black/50 ${
                selected.includes(c.id)
                  ? "border-[var(--lux-gold)] text-[var(--lux-gold)]"
                  : "border-[var(--lux-gold-line)] text-[var(--lux-ink)]"
              }`}
            >
              <span className="block font-semibold">{c.distillery}</span>
              <span className="block opacity-80">{c.warehouse}</span>
              <span className="absolute left-1/2 top-full -translate-x-1/2 mt-2 block h-3 w-[1px] bg-[var(--lux-gold-line)]" />
              <span className="absolute left-1/2 top-[calc(100%+12px)] -translate-x-1/2 block h-2 w-2 rounded-full bg-[var(--lux-gold)]" />
            </button>
            <div className="mt-2 flex justify-center">
              <button onClick={() => onCompare(c)} className="text-[10px] underline opacity-80 hover:opacity-100">
                {selected.includes(c.id) ? "Selected" : "Compare"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-[var(--lux-ink)]/60">
        Map is illustrative. Exact bonded warehouse and insurance details shown on contract.
      </p>
    </div>
  );
}

function CompareTray({ casks, onRemove }: { casks: Cask[]; onRemove: (id: string) => void }) {
  if (!casks.length) return null;

  const axes: FlavorAxis[] = ["Citrus", "Honey", "Smoke", "Spice", "Dried Fruit", "Vanilla"];
  const [a, b, c] = casks;
  const data = axes.map((axis) => ({
    axis,
    A: a ? a.flavorSpider[axis] ?? 0 : 0,
    B: b ? b.flavorSpider[axis] ?? 0 : 0,
    C: c ? c.flavorSpider[axis] ?? 0 : 0,
  }));
  const names = [
    a ? `${a.distillery} ${a.age}y` : "",
    b ? `${b.distillery} ${b.age}y` : "",
    c ? `${c.distillery} ${c.age}y` : "",
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--lux-gold-line)] bg-[var(--lux-bg)]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold)]/90">Compare up to three casks</div>
          <div className="text-xs text-[var(--lux-ink)]/70">Click a card to remove</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div className="col-span-1 md:col-span-2 rounded-2xl border border-[var(--lux-gold-line)] bg-white/5 p-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data}>
                <PolarGrid />
                <PAA dataKey="axis" tick={{ fill: "#d8ba74", fontSize: 12 }} />
                <PRad domain={[0, 10]} tick={false} />
                {a && <Radar name={names[0]} dataKey="A" fill="#d8ba74" fillOpacity={0.18} stroke="#d8ba74" />}
                {b && <Radar name={names[1]} dataKey="B" fill="#8fd8c4" fillOpacity={0.18} stroke="#8fd8c4" />}
                {c && <Radar name={names[2]} dataKey="C" fill="#d88fb6" fillOpacity={0.18} stroke="#d88fb6" />}
                <Tooltip
                  contentStyle={{
                    background: "#111",
                    border: "1px solid rgba(216,186,116,0.4)",
                    borderRadius: 12,
                    color: "#f3efe9",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {casks.map((cx) => (
            <button
              key={cx.id}
              onClick={() => onRemove(cx.id)}
              className="rounded-2xl border border-[var(--lux-gold-line)] bg-white/5 p-3 text-left"
            >
              <div className="flex items-center gap-3">
                <img src={cx.image} alt={cx.distillery} className="h-16 w-24 object-cover rounded-lg" />
                <div>
                  <div className="text-xs text-[var(--lux-ink)]/70">{cx.distillery}</div>
                  <div className="font-serif text-lg">{cx.age} year • {cx.caskType}</div>
                  <div className="text-sm text-[var(--lux-ink)]/70">
                    {cx.volumeL} L @ {cx.abv}% • {currency(cx.priceEUR)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function KeyVal({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border border-[var(--lux-gold-line)]/60 p-3 bg-white/5">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold)]/70">{k}</div>
      <div className="text-sm">{v}</div>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
