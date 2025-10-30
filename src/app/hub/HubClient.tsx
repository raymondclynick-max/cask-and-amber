"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const BG = "/img/hub-cask-hero.jpg";
const LOGO = "/img/logo-mark.png";

// Design canvas (pixel) basis for positioning/scaling
const DESIGN_W = 1020;
const DESIGN_H = 946;

type Btn = {
  label: string;
  href: string;
  xPct: number;   // % of DESIGN_W (0–100)
  yPct: number;   // % of DESIGN_H
  sizePctW: number; // circle diameter as % of DESIGN_W
};

const BTNS: Btn[] = [
  { label: "Amber Vault",      href: "/amber-vault",      xPct: 18.1, yPct: 27.55, sizePctW: 23.6 },
  { label: "Cask Exchange",    href: "/cask-exchange",    xPct: 49.8, yPct: 27.70, sizePctW: 23.6 },
  { label: "Portfolio Live",   href: "/portfolio-live",   xPct: 81.4, yPct: 27.90, sizePctW: 23.6 },
  { label: "Journal",          href: "/journal",          xPct: 18.1, yPct: 64.20, sizePctW: 24.0 },
  { label: "Echovault",        href: "/echovault",        xPct: 49.8, yPct: 63.80, sizePctW: 24.0 },
  { label: "Fractional Casks", href: "/fractional-casks", xPct: 81.9, yPct: 63.80, sizePctW: 24.0 },
];

export default function HubPage() {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    // Recompute scale + offsets to preserve design aspect + center
    const calc = () => {
      const bw = el.clientWidth;
      const bh = el.clientHeight;
      const scale = Math.min(bw / DESIGN_W, bh / DESIGN_H); // fit inside, fully visible
      const iw = DESIGN_W * scale;
      const ih = DESIGN_H * scale;
      const ox = (bw - iw) / 2;
      const oy = (bh - ih) / 2;

      el.style.setProperty("--scale", String(scale));
      el.style.setProperty("--ox", `${ox}px`);
      el.style.setProperty("--oy", `${oy}px`);
    };

    const ro = new ResizeObserver(() => calc());
    ro.observe(el);
    calc();

    return () => ro.disconnect();
  }, []);

  return (
    <main className="min-h-[100svh] bg-[var(--bg)] text-[var(--text)] flex items-center justify-center p-4">
      <div
        ref={boxRef}
        className="relative w-full max-w-[1200px] rounded-3xl overflow-hidden"
        style={{ aspectRatio: `${DESIGN_W} / ${DESIGN_H}` }}
      >
        <Image src={BG} alt="" fill priority className="object-cover" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.12), rgba(0,0,0,0.32))" }}
        />

        {/* Absolute design canvas that we scale + translate */}
        <div
          className="absolute top-0 left-0"
          style={{
            width: `${DESIGN_W}px`,
            height: `${DESIGN_H}px`,
            transformOrigin: "top left",
            transform: "translate(var(--ox,0px), var(--oy,0px)) scale(var(--scale,1))",
          }}
        >
          {BTNS.map((b) => {
            const left = (b.xPct / 100) * DESIGN_W;
            const top = (b.yPct / 100) * DESIGN_H;
            const size = (b.sizePctW / 100) * DESIGN_W;

            return (
              <Link
                prefetch={false}
                key={b.label}
                href={b.href}
                aria-label={b.label}
                className="absolute group"
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${size}px`,
                  height: `${size}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className="relative w-full h-full rounded-full border-[3px]
                             flex items-center justify-center
                             transition-transform duration-200
                             group-hover:scale-[1.04] group-active:scale-95
                             group-hover:border-[var(--gold)]
                             shadow-[inset_0_0_26px_rgba(0,0,0,0.55)]
                             group-hover:shadow-[inset_0_0_30px_rgba(0,0,0,0.6),0_0_36px_rgba(233,196,143,0.22)]
                             [container-type:inline-size]"
                  style={{
                    borderColor: "var(--gold,#E9C48F)",
                    backgroundImage: `
                      radial-gradient(65% 65% at 50% 50%, rgba(0,0,0,0.25), rgba(0,0,0,0.7)),
                      url(${LOGO})
                    `,
                    backgroundRepeat: "no-repeat,no-repeat",
                    backgroundPosition: "center,center",
                    backgroundSize: "100% 100%, calc(100% - 6px) calc(100% - 6px)",
                  }}
                >
                  <span
                    className="font-serif select-none text-center"
                    style={{
                      color: "var(--gold)",
                      fontWeight: 600,
                      textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                      fontSize: "clamp(12px, 8cqw, 22px)",
                    }}
                  >
                    {b.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
