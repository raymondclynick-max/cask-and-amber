"use client";

import { useEffect, useRef } from "react";

export default function CaskLive({ hlsUrl, poster }: { hlsUrl?: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !hlsUrl) return;
    if ("canPlayType" in document.createElement("video") && video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
    } else {
      // optional: integrate hls.js if you add it later
      // keep plain for now
      video.src = hlsUrl;
    }
  }, [hlsUrl]);

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--lux-gold-line)]/50">
      <div className="flex items-center justify-between px-3 py-2 text-xs uppercase tracking-widest bg-black/30">
        <span className="text-[var(--lux-ink)]/70">Warehouse Camera</span>
        <span className="rounded-full bg-[var(--lux-gold)]/90 px-2 py-0.5 text-[var(--button-text)]">Live</span>
      </div>
      <video
        ref={ref}
        poster={poster}
        autoPlay
        muted
        playsInline
        controls
        className="h-52 w-full object-cover md:h-64"
      />
    </div>
  );
}
