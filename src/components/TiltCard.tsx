"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { PropsWithChildren } from "react";

export default function TiltCard({ children }: PropsWithChildren) {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useTransform(my, [-0.5, 0.5], [10, -10]);
  const ry = useTransform(mx, [-0.5, 0.5], [-10, 10]);
  const srx = useSpring(rx, { stiffness: 120, damping: 12 });
  const sry = useSpring(ry, { stiffness: 120, damping: 12 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) / r.width);
    my.set((e.clientY - (r.top + r.height / 2)) / r.height);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
      className="relative rounded-2xl border border-[var(--line)]/80 bg-white/[0.03] backdrop-blur-md p-10 shadow-[0_30px_80px_rgba(0,0,0,.45)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl [background:radial-gradient(600px_200px_at_50%_-20%,rgba(233,196,143,.25),transparent_70%)]" style={{ transform: "translateZ(60px)" }} />
      {children}
    </motion.div>
  );
}
