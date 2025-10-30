"use client";

type Props = {
  tempC: number;
  rhPct: number;
  laa: number;
  leak?: boolean;
  motion?: boolean;
};

export default function CaskDiagnostics({ tempC, rhPct, laa, leak, motion }: Props) {
  return (
    <div className="grid grid-cols-5 gap-3 text-xs">
      <Tile label="Temp" value={`${tempC.toFixed(1)} °C`} />
      <Tile label="RH" value={`${rhPct.toFixed(0)} %`} />
      <Tile label="LAA" value={`${laa.toFixed(0)} L`} />
      <Tile label="Leak" value={leak ? "Detected" : "None"} tone={leak ? "bad" : "ok"} />
      <Tile label="Motion" value={motion ? "Active" : "Idle"} tone={motion ? "warn" : "ok"} />
    </div>
  );
}

function Tile({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" | "bad" }) {
  const ring =
    tone === "bad"
      ? "ring-red-500/40"
      : tone === "warn"
      ? "ring-yellow-400/40"
      : "ring-[var(--lux-gold-line)]/50";
  return (
    <div className={`rounded-xl ring-1 ${ring} p-2 text-center`}>
      <div className="text-[var(--lux-ink)]/60">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
