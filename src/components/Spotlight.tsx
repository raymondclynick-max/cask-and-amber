"use client";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function Spotlight(){
  const mx = useMotionValue(0), my = useMotionValue(0);

  useEffect(() => {
    let t = 0, raf = 0;
    const onMove = (e: MouseEvent) => {
      const w = innerWidth, h = innerHeight;
      mx.set((e.clientX - w/2) / (w/2));
      my.set((e.clientY - h/2) / (h/2));
      t = 0; // reset idle drift when user moves
    };
    const loop = () => {
      t += 0.003;
      if (Math.abs(mx.get()) < 0.001 && Math.abs(my.get()) < 0.001) {
        mx.set(Math.sin(t) * 0.15);
        my.set(Math.cos(t * 0.8) * 0.12);
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); };
  }, [mx,my]);

  const x = useSpring(useTransform(mx, v => `calc(50% + ${v*14}%)`), { stiffness: 60, damping: 20 });
  const y = useSpring(useTransform(my, v => `calc(30% + ${v*10}%)`), { stiffness: 60, damping: 20 });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <motion.div style={{ left: x, top: y }} className="absolute h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full">
        <div className="h-full w-full rounded-full"
             style={{ background: "radial-gradient(closest-side, rgba(233,196,143,.32), rgba(233,196,143,.12) 55%, transparent 70%)" }} />
      </motion.div>
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full" style={{ boxShadow:"0 0 160px 52px rgba(233,196,143,.22)" }} />
      <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full" style={{ boxShadow:"0 0 160px 48px rgba(233,196,143,.18)" }} />
    </div>
  );
}
