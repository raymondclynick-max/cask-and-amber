"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function VideoHero() {
  const vidRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;

    // try autoplay
    (async () => {
      try {
        await v.play();
      } catch {
        /* ignored */
      }
    })();

    // subtle parallax zoom
    let raf = 0;
    const onScroll = () => {
      if (!vidRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const y = window.scrollY;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const t = Math.min(y / 600, 1);
        vidRef.current!.style.transform = `scale(${1 + 0.05 * t})`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const chips = [
    { k: "Temperature", v: "12.9 °C" },
    { k: "Relative Humidity", v: "76 %" },
    { k: "Wind Speed", v: "9 kph" },
  ];

  const stats = [
    { k: "Portfolio Value", v: "108 000 €" },
    { k: "Total Casks", v: "37" },
    { k: "Total LAA", v: "182 L" },
    { k: "Last Re-Gauge", v: "2025-06-12" },
  ];

  return (
    <section className="relative isolate h-[520px] w-full overflow-hidden rounded-[32px] bg-[var(--lux-bg)]">
      {/* --- VIDEO --- */}
      <video
        ref={vidRef}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        poster="/poster.png"
        src="/hero.mp4"
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
      />

      {/* --- VIGNETTE + GOLD GLOW --- */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--lux-bg)]/85 via-[var(--lux-bg)]/50 to-transparent z-[2]" />
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 420px at 20% 15%, rgba(216,186,116,0.10) 0%, transparent 60%)",
        }}
      />

      {/* --- CONTENT --- */}
      <div className="relative z-[3] mx-auto grid h-full max-w-7xl grid-cols-1 md:grid-cols-2 gap-10 px-6 py-12">
        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--lux-ink)]/70">
            Warehouse Weather
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-2 font-serif text-4xl md:text-[44px] leading-tight text-[var(--lux-ink)]"
          >
            Perth, Scotland
          </motion.h1>

          {/* Chips framed like luxury buttons */}
          <div className="mt-6 grid grid-cols-3 gap-4 max-w-xl">
            {chips.map((c) => (
              <motion.div
                key={c.k}
                whileHover={{ scale: 1.03 }}
                className="rounded-2xl border border-[var(--lux-gold-line)]/70 bg-black/45 px-4 py-3 backdrop-blur-sm shadow-[0_0_8px_rgba(0,0,0,0.4)]"
              >
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--lux-ink)]/80">
                  {c.k}
                </div>
                <div className="text-sm font-medium text-[var(--lux-gold)]">{c.v}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE STATS */}
        <div className="self-center grid grid-cols-2 gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.06 * i }}
              className="rounded-3xl border border-[var(--lux-gold-line)]/70 bg-black/45 p-5 shadow-[0_0_12px_rgba(0,0,0,0.5)] backdrop-blur-sm"
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--lux-ink)]/80">
                {s.k}
              </div>
              <div className="mt-1.5 font-serif text-xl text-[var(--lux-gold)]">{s.v}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
