"use client";

import { useEffect, useRef, useState } from "react";

export default function HeritageTransparency() {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setShow(entry.isIntersecting), { threshold: 0.7 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section section--gold-on-black sticky-fade">
      <div ref={triggerRef} className="fade-trigger" />
      <div className={`max fade-in ${show ? "show" : ""}`}>
        <h2 className="gold kern" style={{ fontSize: "clamp(28px,4.2vw,48px)", margin: 0 }}>
          Heritage & Transparency
        </h2>
        <div className="rule" />
        <p style={{ color: "#c5beb6", maxWidth: 860, margin: "10px 0 0 0" }}>
          We pair Scottish cask tradition with forensic custody records, audited storage,
          and model-driven pricing. No myths. Only verifiable data.
        </p>

        <div className="ht-grid">
          <div className="ht-card">
            <h4 className="gold">Provenance</h4>
            <p>Distillery to warehouse, each transfer signed and timestamped.</p>
          </div>
          <div className="ht-card">
            <h4 className="gold">Storage</h4>
            <p>HMRC bonded partners. Temp and humidity logged.</p>
          </div>
          <div className="ht-card">
            <h4 className="gold">Audit</h4>
            <p>Independent stock checks. Yearly reconciliation.</p>
          </div>
          <div className="ht-card">
            <h4 className="gold">Pricing</h4>
            <p>Comps, age curves, cask deltas. Confidence bands.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
