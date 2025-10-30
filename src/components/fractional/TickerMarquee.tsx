"use client";
import { useEffect, useState } from "react";

export default function TickerMarquee() {
  const [v, setV] = useState(1000);
  useEffect(() => {
    const id = setInterval(() => setV((x) => x * (1 + (Math.random()-0.5)*0.001) + (Math.random()*0.8-0.4)), 2500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="mt-3 overflow-hidden rounded-full border border-[var(--lux-gold-line)]/60">
      <div className="animate-[marquee_18s_linear_infinite] whitespace-nowrap text-xs">
        <span className="mx-6 text-[var(--lux-gold)]">CAVI {v.toFixed(2)} €/RLA</span>
        <span className="mx-6">Unit of value: whisky (bottles, RLA). Registry only.</span>
        <span className="mx-6">Post-bottling storage available in bond.</span>
      </div>
      <style jsx>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
}
