"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { featuredCasks } from "../../data/vault";

export default function FeaturedCarousel() {
  const [idx, setIdx] = useState(0);
  const dir = useRef<1 | -1>(1);
  const wrap = (n: number) => (n + featuredCasks.length) % featuredCasks.length;

  const next = () => { dir.current = 1; setIdx((i) => wrap(i + 1)); };
  const prev = () => { dir.current = -1; setIdx((i) => wrap(i - 1)); };

  useEffect(() => { const t = setInterval(next, 5000); return () => clearInterval(t); }, []);

  const c = featuredCasks[idx];

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-[var(--lux-gold-line)]/70 bg-black/40">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={c.id}
          initial={{ x: dir.current === 1 ? 40 : -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: dir.current === 1 ? -40 : 40, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="relative h-full w-full"
        >
          <Image src={c.image} alt={c.displayName} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--lux-bg)]/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end justify-between">
              <div>
                <div className="font-serif text-3xl text-[var(--headline)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                  {c.displayName}
                </div>
                <div className="mt-1 text-sm text-[var(--lux-ink)]/80">
                  {c.region} • {c.caskType} • {c.ageYears} years • {c.abv?.toFixed(1)}%
                </div>
              </div>
              <a
                href={`/amber-vault/${c.id}`}
                className="rounded-xl bg-[var(--lux-gold)] px-4 py-2 text-[var(--button-text)] shadow-[0_0_0_1px_rgba(233,196,143,0.35)] hover:opacity-90"
              >
                View cask
              </a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-[var(--lux-gold-line)] bg-[var(--lux-bg)]/60 px-3 py-2 text-sm z-10"
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[var(--lux-gold-line)] bg-[var(--lux-bg)]/60 px-3 py-2 text-sm z-10"
        aria-label="Next"
      >
        ›
      </button>

      <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-2">
        {featuredCasks.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIdx(i)}
            className={`h-2 w-2 rounded-full ${i === idx ? "bg-[var(--lux-gold)]" : "bg-[var(--lux-gold-line)]"}`}
          />
        ))}
      </div>
    </div>
  );
}
