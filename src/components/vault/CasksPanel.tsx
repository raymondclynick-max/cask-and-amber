import CaskCard, { Cask } from "./CaskCard";

export default function CasksPanel({ mode = "cards" }: { mode?: "cards" | "ledger" }) {
  const casks = demoCasks();

if (mode === "cards") {
  return (
    <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 px-2 sm:px-4">
      {casks.map((c) => (
        <div
          key={c.id}
          className="mx-auto w-full max-w-[560px] rounded-3xl border border-[var(--lux-gold-line)]/40
                     bg-white/[0.03] shadow-[0_0_25px_rgba(0,0,0,0.2)] hover:shadow-[0_0_35px_rgba(255,215,160,0.15)]
                     transition-all duration-300"
        >
          <CaskCard cask={c} />
        </div>
      ))}
    </div>
  );
}


  return null;
}

function demoCasks(): Cask[] {
  return [
    {
      id: "1997-highland",
      title: "1997 Highland 1st Fill",
      region: "Highland",
      ageYears: 27,
      volumeL: 228,
      estValueEUR: 48500,
      imageUrl: "/img/casks/highland-1997.jpg",
      live: { tempC: 14.8, rhPct: 72, laa: 182, angelsSharePctYr: 2.1, lastRegaugeISO: "2025-06-12" },
    },
    {
      id: "2003-speyside",
      title: "2003 Speyside Hogshead",
      region: "Speyside",
      ageYears: 21,
      volumeL: 250,
      estValueEUR: 32000,
      imageUrl: "/img/casks/speyside-2003.jpg",
      live: { tempC: 15.2, rhPct: 70, laa: 201 },
    },
    {
      id: "2011-islay",
      title: "2011 Islay Refill Butt",
      region: "Islay",
      ageYears: 13,
      volumeL: 500,
      estValueEUR: 27500,
      imageUrl: "/img/casks/islay-2011.jpg",
      live: { tempC: 13.9, rhPct: 74, laa: 410 },
    },
  ];
}
