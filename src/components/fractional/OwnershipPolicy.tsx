"use client";

export default function OwnershipPolicy() {
  return (
    <div className="rounded-3xl border border-[var(--lux-gold-line)]/60 bg-white/[0.02] p-6">
      <div className="text-lg font-serif text-[var(--headline)]">Cohort Terms</div>
      <ul className="mt-3 list-disc pl-5 text-sm text-[var(--lux-ink)]/80 space-y-2">
        <li>Purchases in MBU blocks (≥ 2.5%). Min hold per cohort. Quorum for finishes/re-racks.</li>
        <li>Residuals &lt; 2×MBU pooled or swept at CAVI-band floor.</li>
        <li>Angel’s share modeled with operational buffer.</li>
        <li>Post-bottling storage available in bond for a monthly per-bottle fee.</li>
        <li>No platform tokens. Registry only. Settlement in EUR/GBP and whisky units.</li>
      </ul>
    </div>
  );
}
