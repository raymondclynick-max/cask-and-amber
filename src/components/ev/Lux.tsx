"use client";

import Link, { type LinkProps } from "next/link";
import { motion } from "framer-motion";
import type { ReactNode, CSSProperties, MouseEventHandler } from "react";

/* ── Shell ────────────────────────────────────────────── */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--lux-bg)", color: "var(--lux-ink)" }}>
      <TopNav />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">{children}</main>
      <Footer />
    </div>
  );
}

/* ── Card ─────────────────────────────────────────────── */
export function Card({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`ev-card rounded-2xl border bg-white/5 backdrop-blur-md shadow-[0_1px_0_rgba(216,186,116,0.12),_0_8px_30px_rgba(0,0,0,0.45)] ${className}`}
      style={{ borderColor: "var(--lux-gold-line)", ...style }}
    >
      {children}
    </div>
  );
}


/* ── Button ───────────────────────────────────────────── */
type ButtonVariant = "gold" | "ghost";
type Href = LinkProps["href"];

type ButtonProps =
  | {
      children: ReactNode;
      variant?: ButtonVariant;
      className?: string;
      href: Href;
      onClick?: never;
      type?: never;
    }
  | {
      children: ReactNode;
      variant?: ButtonVariant;
      className?: string;
      href?: undefined;
      onClick?: MouseEventHandler<HTMLButtonElement>;
      type?: "button" | "submit" | "reset";
    };

export function Button(props: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-[1.25rem] px-4 py-2 text-sm font-medium transition-colors";
  const goldCls = "bg-[var(--lux-gold)] text-black hover:bg-[var(--lux-gold-deep)]";
  const ghostCls = "border text-[var(--lux-ink)] hover:bg-white/5";
  const borderStyle: CSSProperties = { borderColor: "var(--lux-gold-line)" };

  const isLink = (p: ButtonProps): p is Extract<ButtonProps, { href: Href }> => (p as any).href !== undefined;

  if (isLink(props)) {
    const { children, href, variant = "gold", className = "" } = props;
    return (
      <Link
        href={href}
        className={`${base} ${variant === "gold" ? goldCls : ghostCls} ${className}`}
        style={variant === "ghost" ? borderStyle : undefined}
      >
        {children}
      </Link>
    );
  }

  const { children, onClick, type = "button", variant = "gold", className = "" } = props;
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variant === "gold" ? goldCls : ghostCls} ${className}`}
      style={variant === "ghost" ? borderStyle : undefined}
    >
      {children}
    </button>
  );
}

/* ── Optional extras used by Shell ───────────────────── */
export function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--lux-gold)" }}>
        {label}
      </span>
      <span className="text-xl md:text-2xl font-semibold">{value}</span>
      {hint ? <span className="text-xs text-white/60">{hint}</span> : null}
    </div>
  );
}

export function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
      {children}
    </motion.div>
  );
}

export function TopNav() {
  return (
    <div className="sticky top-0 z-30 backdrop-blur-md border-b bg-black/30" style={{ borderColor: "var(--lux-gold-line)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full" style={{ background: "var(--lux-gold)" }} />
          <span className="text-sm tracking-widest">ECHOVAULT</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button href="/journal" variant="ghost">Journal</Button>
          <Button href="/echovault">Portfolio</Button>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <div className="mt-16 border-t" style={{ borderColor: "var(--lux-gold-line)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-xs text-white/60 flex items-center justify-between">
        <span>© EchoVault</span>
        <span>Design System v0.1</span>
      </div>
    </div>
  );
}
