"use client";

import { useEffect, useState } from "react";

type Weather = { place: string; tempC: number; humidity: number; windKph: number; icon: "sun"|"cloud"|"rain"|"fog" };

export default function WeatherWidget() {
  const [w, setW] = useState<Weather>({
    place: "Perth, Scotland",
    tempC: 12.6,
    humidity: 76,
    windKph: 9,
    icon: "cloud",
  });

  useEffect(() => {
    const t = setInterval(() => {
      setW((p) => ({ ...p, tempC: Math.round((p.tempC + (Math.random() - 0.5) * 0.4) * 10) / 10 }));
    }, 60000);
    return () => clearInterval(t);
  }, []);

  const icon = { sun: "☀", cloud: "⛅", rain: "🌧", fog: "🌫" }[w.icon];

  return (
    <div className="rounded-2xl border border-[var(--lux-gold-line)] p-5">
      <div className="text-xs uppercase tracking-widest text-[var(--lux-gold)]">Warehouse Weather</div>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <div className="font-serif text-xl">{w.place}</div>
          <div className="mt-1 text-sm text-[var(--lux-ink)]/70">Humidity {w.humidity}% • Wind {w.windKph} kph</div>
        </div>
        <div className="text-right">
          <div className="text-3xl">{icon}</div>
          <div className="text-lg">{w.tempC.toFixed(1)}°C</div>
        </div>
      </div>
    </div>
  );
}
