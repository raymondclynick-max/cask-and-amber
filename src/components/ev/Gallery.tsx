"use client";

import { useState } from "react";

export default function Gallery({
  images,
  className = "",
}: {
  images: string[];
  className?: string;
}) {
  const [i, setI] = useState(0);
  if (!images?.length) return <div className="w-full h-40 rounded-2xl bg-white/5 grid place-items-center text-xs text-white/40">No image</div>;

  const prev = () => setI((p) => (p - 1 + images.length) % images.length);
  const next = () => setI((p) => (p + 1) % images.length);

  return (
    <div className={`relative w-full h-48 md:h-56 rounded-2xl overflow-hidden border ${className}`} style={{ borderColor: "var(--lux-gold-line)" }}>
      <img src={images[i]} alt={`photo-${i}`} className="w-full h-full object-cover" />
      {images.length > 1 && (
        <>
          <button aria-label="prev" onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 ev-btn ghost px-2 py-1 text-xs">‹</button>
          <button aria-label="next" onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 ev-btn ghost px-2 py-1 text-xs">›</button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {images.map((_, idx) => (
              <span key={idx}
                className="inline-block h-1.5 w-3 rounded-full"
                style={{ background: idx === i ? "var(--lux-gold)" : "rgba(255,255,255,0.35)" }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
