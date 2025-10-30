"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function ParallaxScene(){
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const { innerWidth:w, innerHeight:h } = window;
      mx.set((e.clientX - w/2) / (w/2));
      my.set((e.clientY - h/2) / (h/2));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx,my]);

  const t = (f:number) => ({
    x: useTransform(mx, v => v * f),
    y: useTransform(my, v => v * f),
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div style={t(12)} className="absolute -top-24 right-16 h-72 w-72 rounded-full"
        animate={{ boxShadow: ["0 0 120px 30px rgba(233,196,143,.15)","0 0 120px 40px rgba(233,196,143,.22)"] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.svg style={t(-10)} width="680" height="680" viewBox="0 0 680 680"
        className="absolute -left-40 -bottom-32 opacity-40">
        <g fill="none" stroke="#E9C48F" strokeOpacity=".18">
          <circle cx="340" cy="340" r="220"/>
          <circle cx="340" cy="340" r="260"/>
          <circle cx="340" cy="340" r="300"/>
        </g>
      </motion.svg>
      <motion.div style={t(6)} className="absolute inset-y-0 left-1/2 w-px"
        animate={{ background: ["linear-gradient(180deg, rgba(233,196,143,.0), rgba(233,196,143,.25), rgba(233,196,143,.0))",
                                "linear-gradient(180deg, rgba(233,196,143,.0), rgba(233,196,143,.15), rgba(233,196,143,.0))"] }}
        transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse" }}
      />
    </div>
  );
}
