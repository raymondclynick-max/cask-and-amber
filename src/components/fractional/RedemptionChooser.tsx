"use client";

export default function RedemptionChooser() {
  return (
    <div className="rounded-3xl border border-[var(--lux-gold-line)]/60 bg-white/[0.015] p-6">
      <div className="text-lg font-serif text-[var(--headline)]">End-of-Term Options</div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          { t: "Redeem Bottles", d: "Pay duty/logistics. Take delivery or keep in bond (monthly per-bottle fee)." },
          { t: "Cash-Settle", d: "Wholesale auction on bottling day at CAVI band. Proceeds paid out." },
          { t: "Roll-Forward", d: "Swap value into a new cohort. Same ledger, no crypto." },
        ].map(x=>(
          <div key={x.t} className="rounded-2xl border border-[var(--lux-gold-line)]/60 p-4">
            <div className="text-sm font-medium">{x.t}</div>
            <div className="mt-1 text-sm text-[var(--lux-ink)]/80">{x.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
