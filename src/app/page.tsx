"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Splash() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Attempt autoplay
    (async () => { try { await v.play(); } catch {} })();

    // Reveal band after video is playable
    const onReady = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setShow(true);
        return;
      }
      setTimeout(() => setShow(true), 600);
    };
    v.addEventListener("playing", onReady, { once: true });
    v.addEventListener("canplay", onReady, { once: true });

    return () => {
      v.removeEventListener("playing", onReady);
      v.removeEventListener("canplay", onReady);
    };
  }, []);

  return (
    <main className="splash">
      <video
        ref={videoRef}
        className="splash-video"
        autoPlay
        muted
        loop
        playsInline
        poster="/poster.png"
        src="/hero.mp4"
      />
      <div className="splash-mask" />

      {/* Full-width band with ONLY the logo */}
      <div className={`splash-band ${show ? "fade-reveal show" : "fade-reveal"}`}>
        <div className="splash-band-inner">
          <img src="/logo.png" alt="Cask & Amber" className="splash-logo-img" />
        </div>
      </div>

      {/* Elegant Enter button just below the band */}
      <div className="splash-enter">
        <Link href="/hub" className="btn-royal">
          Enter <span className="chev" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
