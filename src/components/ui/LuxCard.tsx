// src/components/ui/LuxCard.tsx
import clsx from "clsx";
export function LuxCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section
      className={clsx(
        "rounded-3xl border border-[var(--lux-gold-line)]/70",
        "bg-white/[0.02] backdrop-blur-sm",
        "p-6 md:p-7 lg:p-8 space-y-4",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_10px_30px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      {children}
    </section>
  );
}
