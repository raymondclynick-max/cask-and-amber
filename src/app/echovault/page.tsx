"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// --- Design tokens ---
const gold = "#D9B877";

// Demo images for presentation. Put files in /public/img/demo/
const DEMO_IMG_URLS = [
  "/img/demo/ev-memory-1.jpg",
  "/img/demo/ev-memory-2.jpg",
  "/img/demo/ev-memory-3.jpg",
  "/img/demo/ev-memory-4.jpg",
  "/img/demo/ev-memory-5.jpg",
];

// Flavor axes
const AXES = [
  "Smoke",
  "Sweet",
  "Fruit",
  "Spice",
  "Oak",
  "Floral",
  "Body",
  "Finish",
] as const;
type AxisKey = (typeof AXES)[number];

type Memory = {
  id: string;
  whisky: string;
  venue: string;
  companions: string[];
  tags: string[];
  notes: string;
  imgUrl?: string;
  createdAt: string;
  sliders: Record<AxisKey, number>;
  likes: number;
  user: string;
};

// -------- Recharts (no SSR) --------
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const RadarChartDyn = dynamic(
  () => import("recharts").then((m) => m.RadarChart),
  { ssr: false }
);
const RadarDyn = dynamic(() => import("recharts").then((m) => m.Radar), {
  ssr: false,
});
const PolarGridDyn = dynamic(
  () => import("recharts").then((m) => m.PolarGrid),
  { ssr: false }
);
const PolarAngleAxisDyn = dynamic(
  () => import("recharts").then((m) => m.PolarAngleAxis),
  { ssr: false }
);
const PolarRadiusAxisDyn = dynamic(
  () => import("recharts").then((m) => m.PolarRadiusAxis),
  { ssr: false }
);

// Cast once. Avoid TS prop errors from dynamic().
const RadarChartAny = RadarChartDyn as unknown as React.ComponentType<any>;
const RadarAny = RadarDyn as unknown as React.ComponentType<any>;
const PolarGridAny = PolarGridDyn as unknown as React.ComponentType<any>;
const PolarAngleAxisAny =
  PolarAngleAxisDyn as unknown as React.ComponentType<any>;
const PolarRadiusAxisAny =
  PolarRadiusAxisDyn as unknown as React.ComponentType<any>;

// -------- Page --------
export default function EchoVaultPage() {
  const [whisky, setWhisky] = useState("");
  const [venue, setVenue] = useState("");
  const [companions, setCompanions] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [autoWheel, setAutoWheel] = useState(true);
  const [sliders, setSliders] = useState<Record<AxisKey, number>>(() =>
    AXES.reduce((acc, k) => ({ ...acc, [k]: 4 }), {} as Record<AxisKey, number>)
  );
  const [memories, setMemories] = useState<Memory[]>(() => seedMemories());
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  // Upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingImgUrl, setPendingImgUrl] = useState<string | undefined>();
  const handlePickImage = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPendingImgUrl(URL.createObjectURL(f));
  };

  // Radar data
  const radarData = useMemo(
    () => AXES.map((a) => ({ axis: a, value: sliders[a] })),
    [sliders]
  );

  function saveMemory() {
    const m: Memory = {
      id: crypto.randomUUID(),
      whisky: whisky || "Untitled Whisky",
      venue,
      companions: companions.split(",").map((s) => s.trim()).filter(Boolean),
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
      notes,
      imgUrl: pendingImgUrl,
      createdAt: new Date().toISOString(),
      sliders: { ...sliders },
      likes: Math.floor(Math.random() * 5),
      user: "Ray",
    };
    setMemories((prev) => [m, ...prev]);
    setWhisky("");
    setVenue("");
    setCompanions("");
    setTags("");
    setNotes("");
    setPendingImgUrl(undefined);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return memories;
    return memories.filter((m) =>
      [m.whisky, m.venue, m.notes, m.tags.join(" "), m.companions.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [search, memories]);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/50 bg-black/70 border-b border-[var(--lux-gold-line)]/30">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
          <Link
            href="/journal"
            className="text-xs tracking-widest uppercase text-[var(--lux-gold)]/80 hover:text-[var(--lux-gold)]"
          >
            Journal
          </Link>
          <div className="h-4 w-px bg-[var(--lux-gold-line)]/30" />
          <div className="font-serif text-xl" style={{ color: gold }}>
            EchoVault
          </div>
          <div className="ml-auto w-full max-w-xl">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tastings…"
              className="w-full rounded-full bg-white/5 px-4 py-2 text-sm outline-none ring-1 ring-inset ring-white/10 focus:ring-[var(--lux-gold-line)]/60"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl p-4 lg:p-8 grid lg:grid-cols-3 gap-8">
        {/* Left: form */}
        <section className="lg:col-span-1">
          <Card
            title="Create tasting"
            subtitle="Type notes. See the spider react. Save the memory."
          >
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-xs text-white/70">
                <input
                  type="checkbox"
                  checked={autoWheel}
                  onChange={() => setAutoWheel((v) => !v)}
                />
                Auto-generate wheel
              </label>
              <button
                onClick={handlePickImage}
                className="rounded-full px-3 py-1 text-xs ring-1 ring-inset ring-white/10 hover:ring-white/20"
              >
                + Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </div>

            <Field value={whisky} setValue={setWhisky} placeholder="Whisky" />
            <Field value={venue} setValue={setVenue} placeholder="Venue" />
            <Field
              value={companions}
              setValue={setCompanions}
              placeholder="Tag companions (comma separated)"
            />
            <Field
              value={tags}
              setValue={setTags}
              placeholder="Hashtags e.g. sherry, Islay"
            />
            <TextArea
              value={notes}
              setValue={setNotes}
              placeholder="Notes — try words like honey, peat, citrus, clove, oak, floral, full, long finish"
            />

            {pendingImgUrl && (
              <div className="mt-3 overflow-hidden rounded-2xl ring-1 ring-inset ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pendingImgUrl}
                  alt="Upload preview"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Sliders + Radar */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="space-y-3">
                {AXES.map((a) => (
                  <SliderRow
                    key={a}
                    label={a}
                    value={sliders[a]}
                    onChange={(v) =>
                      setSliders((s) => ({ ...s, [a]: v }))
                    }
                  />
                ))}
              </div>
              <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-inset ring-white/10">
                <div className="h-[260px]">
                  <RadarWheel data={radarData} />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={saveMemory}
                className="rounded-full bg-white/5 px-4 py-2 text-sm ring-1 ring-inset ring-white/10 hover:bg-white/10"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setWhisky("");
                  setVenue("");
                  setCompanions("");
                  setTags("");
                  setNotes("");
                  setPendingImgUrl(undefined);
                }}
                className="rounded-full px-4 py-2 text-sm ring-1 ring-inset ring-white/10"
              >
                Reset
              </button>
            </div>
          </Card>
        </section>

        {/* Right: Instagram grid */}
        <section className="lg:col-span-2">
          <Card
            title="Your memories"
            subtitle="Instagram-style grid. Click a tile for details."
          >
            <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
              {filtered.map((m) => (
                <MemoryTile key={m.id} m={m} onOpen={() => setOpenId(m.id)} />
              ))}
            </div>
          </Card>

          {openId && (
            <MemoryModal
              m={memories.find((x) => x.id === openId)!}
              onClose={() => setOpenId(null)}
            />
          )}
        </section>
      </div>

      {/* Floating upload FAB */}
      <button
        aria-label="Add photo"
        onClick={handlePickImage}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[var(--lux-gold)] text-black shadow-2xl flex items-center justify-center ring-2 ring-black/60 hover:scale-[1.02] transition"
      >
        <span className="text-2xl">＋</span>
      </button>
    </main>
  );
}

// ---------- UI ----------
function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-5 md:p-6 ring-1 ring-inset ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      style={{ outline: `1px solid ${gold}20` }}
    >
      <div className="mb-4">
        <h2 className="font-serif text-lg" style={{ color: gold }}>
          {title}
        </h2>
        {subtitle && <p className="text-xs text-white/60">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({
  value,
  setValue,
  placeholder,
}: {
  value: string;
  setValue: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="mb-3 w-full rounded-xl bg-white/5 px-4 py-2 text-sm outline-none ring-1 ring-inset ring-white/10 focus:ring-[var(--lux-gold-line)]/60"
    />
  );
}

function TextArea({
  value,
  setValue,
  placeholder,
}: {
  value: string;
  setValue: (v: string) => void;
  placeholder: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="mb-3 w-full resize-none rounded-xl bg-white/5 px-4 py-2 text-sm outline-none ring-1 ring-inset ring-white/10 focus:ring-[var(--lux-gold-line)]/60"
    />
  );
}

function SliderRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 items-center gap-3">
      <div className="col-span-2 text-xs text-white/70">{label}</div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="col-span-3 accent-[var(--lux-gold)]"
      />
    </div>
  );
}

// ---- Custom tick components ----
const AxisTick = ({ payload, x, y, textAnchor }: any) => (
  <text x={x} y={y} textAnchor={textAnchor} fontSize={11} fill="#d7c399">
    {payload?.value}
  </text>
);
const SmallAxisTick = ({ payload, x, y, textAnchor }: any) => (
  <text x={x} y={y} textAnchor={textAnchor} fontSize={9} fill="#8b7a52">
    {payload?.value}
  </text>
);

// ---- Radars ----
function RadarWheel({ data }: { data: { axis: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChartAny data={data} outerRadius={85}>
        <PolarGridAny />
        <PolarAngleAxisAny dataKey="axis" tick={<AxisTick />} tickLine={false} />
        <PolarRadiusAxisAny angle={45} domain={[0, 10]} tick={false} axisLine={false} />
        <RadarAny name="profile" dataKey="value" stroke={gold} fill={gold} fillOpacity={0.25} />
      </RadarChartAny>
    </ResponsiveContainer>
  );
}

// ---- Tiles + Modal ----
function MemoryTile({ m, onOpen }: { m: Memory; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group relative aspect-square overflow-hidden rounded-2xl ring-1 ring-inset ring-white/10 bg-white/[0.04] hover:scale-[1.01] transition"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={m.imgUrl || pickFallbackImage(m.id)}
        alt={m.whisky}
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-90" />
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs">
        <span
          className="rounded-full bg-black/50 px-2 py-0.5 uppercase tracking-widest"
          style={{ color: gold }}
        >
          {m.whisky}
        </span>
        <span className="rounded-full bg-black/50 px-2 py-0.5 text-white/80">❤ {m.likes}</span>
      </div>
    </button>
  );
}

function MemoryModal({ m, onClose }: { m: Memory; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] ring-1 ring-inset ring-white/10">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square md:aspect-auto md:h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.imgUrl || pickFallbackImage(m.id)}
              alt={m.whisky}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl" style={{ color: gold }}>{m.whisky}</h3>
              <button onClick={onClose} className="rounded-full bg-white/10 px-3 py-1 text-sm">Close</button>
            </div>
            <div className="text-xs uppercase tracking-widest text-white/60 flex items-center gap-2">
              <span>{m.venue || "location"}</span>
              <span className="h-3 w-px bg-white/10" />
              <span>{new Date(m.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm text-white/90">{m.notes || "No notes"}</p>

            <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-inset ring-white/10">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChartAny data={AXES.map(a => ({ axis: a, value: m.sliders[a] }))} outerRadius={75}>
                    <PolarGridAny />
                    <PolarAngleAxisAny dataKey="axis" tick={<SmallAxisTick />} tickLine={false} />
                    <PolarRadiusAxisAny angle={45} domain={[0,10]} tick={false} axisLine={false} />
                    <RadarAny name="profile" dataKey="value" stroke={gold} fill={gold} fillOpacity={0.2} />
                  </RadarChartAny>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- helpers ----------
function seedMemories(): Memory[] {
  const base: Omit<Memory, "id" | "createdAt">[] = DEMO_IMG_URLS.map((img, i) => ({
    whisky: ["Dalmore Port", "Lagavulin 16", "Springbank 12", "Macallan Sherry Oak", "Glenmorangie Nectar d'Or"][i] || "Echo Dram",
    venue: ["home", "Perth, Scotland", "C&A Tasting Room", "Warehouse 2", "Club Terrace"][i] || "home",
    companions: ["Amir"],
    tags: ["port cask", "floral", "fresh"],
    notes: ["floral, fresh and zesty", "peated with long finish", "viscous, balanced spice", "rich sherry, walnut", "honeyed citrus"][i] || "notes",
    imgUrl: img,
    sliders: AXES.reduce((acc, a) => ({ ...acc, [a]: Math.floor(Math.random() * 8) + 2 }), {} as Record<AxisKey, number>),
    likes: Math.floor(Math.random() * 20),
    user: "Ray",
  }));
  return base.map((b, i) => ({ ...b, id: `demo-${i}`, createdAt: new Date(Date.now() - i * 86400000).toISOString() }));
}

function pickFallbackImage(id: string) {
  const idx = Math.abs(hashCode(id)) % DEMO_IMG_URLS.length;
  return DEMO_IMG_URLS[idx];
}

function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}
