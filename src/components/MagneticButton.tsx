"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MagneticButton(
  { href, children, variant = "gold" }:
  { href: string; children: React.ReactNode; variant?: "gold" | "ghost" }
) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [xy, set] = useState({ x: 0, y: 0 });

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect(); if (!r) return;
        set({ x: (e.clientX - r.left - r.width / 2) * 0.15, y: (e.clientY - r.top - r.height / 2) * 0.15 });
      }}
      onMouseLeave={() => set({ x: 0, y: 0 })}
      style={{ translateX: xy.x, translateY: xy.y, boxShadow: variant === "gold" ? "0 10px 30px rgba(233,196,143,.25)" : "0 10px 30px rgba(0,0,0,.5)" }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm transition ${variant === "gold" ? "bg-[var(--gold)] text-black hover:opacity-90" : "border border-[var(--line)] text-[var(--text)]"}`}
    >
      <span style={{ transform: `translate(${xy.x * 0.2}px, ${xy.y * 0.2}px)` }}>{children}</span>
    </motion.a>
  );
}
