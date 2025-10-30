// src/components/fractional/FracCalc.tsx
"use client";
import { useEffect, useMemo, useState } from "react";

type TrancheLite = { id: string; pricePerOnePctEUR: number };

export default function FracCalc() {
  const [euros, setEuros] = useState(10000);
  const [years, setYears] = useState(5);
  const [cagr, setCagr] = useState(0.08);
  const [fee, setFee] = useState(0.0125);

  useEffect(() => {
    const id = localStorage.getItem("selectedTranche");
    // optional: prefill on reload using stored price if you inject a map
  }, []);

  useEffect(() => {
    function onSel(e: Event) {
      const t = (e as CustomEvent<TrancheLite>).detail;
      if (!t) return;
      setEuros(Math.round(t.pricePerOnePctEUR * 10)); // default 10% tranche
    }
    window.addEventListener("cna:select-tranche", onSel as any);
    return () => window.removeEventListener("cna:select-tranche", onSel as any);
  }, []);

  const result = useMemo(() => {
    let v = euros;
    for (let y = 0; y < years; y++) v *= 1 + cagr - fee;
    return Math.round(v);
  }, [euros, years, cagr, fee]);

  const field = "w-full h-10 rounded-xl bg-white/5 border border-white/10 px-3 text-sm";

  return (
    <div id="calc" className="space-y-5">
      {/* inputs unchanged */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Amount, Years, CAGR, Fees inputs as before */}
      </div>
      <div className="flex items-center justify-between">
        <button type="button" className="rounded-2xl px-4 py-2 bg-[var(--lux-gold)] text-[var(--button-text)] hover:bg-[var(--lux-gold-deep)] transition">
          Simulate
        </button>
        <div className="text-sm text-white/85">
          Projected value: <span className="text-[var(--lux-gold)] font-semibold">€{result.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
