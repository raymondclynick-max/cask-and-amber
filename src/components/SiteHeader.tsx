// src/components/SiteHeader.tsx
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!panelRef.current) return;
      if (panelRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  // close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* top fixed bar */}
      <header
        className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between
        px-4 sm:px-6 lg:px-8 h-14
        bg-[var(--lux-bg,#000000)]/60 backdrop-blur-md
        border-b border-[var(--lux-border,rgba(255,215,130,0.18))]"
      >
        <Link
          href="/amber-vault"
          className="flex items-center gap-2 text-[11px] font-medium tracking-[0.15em] uppercase
          text-[var(--lux-gold,rgb(255,215,130))]"
        >
          <span className="inline-block rounded-full bg-[var(--lux-gold,rgb(255,215,130))] text-black px-2 py-[2px] leading-none">
            Cask&nbsp;&amp;&nbsp;Amber
          </span>
          <span className="hidden sm:inline text-[var(--lux-gold,rgb(255,215,130))]/80">
            Member
          </span>
        </Link>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(o => !o)}
          className="relative flex items-center justify-center h-10 w-10 rounded-xl
          border border-[var(--lux-border,rgba(255,215,130,0.18))]
          bg-[var(--lux-panel,rgba(0,0,0,0.85))]/60
          text-[var(--lux-gold,rgb(255,215,130))]
          hover:bg-[var(--lux-panel,rgba(0,0,0,0.85))]/80
          transition-colors"
        >
          {open ? (
            <X className="h-5 w-5 stroke-[1.5]" />
          ) : (
            <Menu className="h-5 w-5 stroke-[1.5]" />
          )}
        </button>
      </header>

      {open && (
        <div
          ref={panelRef}
          className="fixed right-4 sm:right-6 lg:right-8 top-16 z-[1100]
          w-[220px] sm:w-[240px]
          rounded-2xl border border-[var(--lux-border,rgba(255,215,130,0.18))]
          bg-[var(--lux-panel,rgba(0,0,0,0.85))]
          shadow-[0_30px_120px_rgba(0,0,0,0.9)]
          ring-1 ring-black/50
          animate-[fadeInMenu_160ms_ease-out]"
        >
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-[var(--lux-gold,rgb(255,215,130))]/10" />
          <nav className="relative flex flex-col p-3 text-sm text-white">
            <MenuGroup
              heading="Portfolio"
              links={[
                { label: "Amber Vault", href: "/amber-vault", desc: "Your held stock" },
                {
                  label: "Portfolio Live",
                  href: "/portfolio-live",
                  desc: "Value, ROI, CAVI",
                },
              ]}
            />

            <Divider />

            <MenuGroup
              heading="Market"
              links={[
                {
                  label: "Cask Exchange",
                  href: "/cask-exchange",
                  desc: "Browse live casks",
                },
                {
                  label: "CAVI Index",
                  href: "/cavi",
                  desc: "Cask & Amber Value Index",
                },
              ]}
            />

            <Divider />

            <MenuGroup
              heading="Insight"
              links={[
                {
                  label: "Journal",
                  href: "/journal",
                  desc: "Market notes and news",
                },
                {
                  label: "Memory Vault",
                  href: "/memory-vault",
                  desc: "Tastings and moments",
                },
              ]}
            />

            <Divider />

            <MiscLinks />
          </nav>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeInMenu {
          0% {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}

function MenuGroup(props: {
  heading: string;
  links: { label: string; href: string; desc?: string }[];
}) {
  const { heading, links } = props;
  return (
    <div className="mb-3">
      <div className="px-2 pb-2 text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold,rgb(255,215,130))]/70">
        {heading}
      </div>
      <ul className="space-y-1">
        {links.map(link => (
          <li key={link.href}>
            <MenuItem href={link.href} label={link.label} desc={link.desc} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function MenuItem(props: { href: string; label: string; desc?: string }) {
  const { href, label, desc } = props;
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-transparent px-2 py-2
      hover:border-[var(--lux-gold,rgb(255,215,130))]/20
      hover:bg-[var(--lux-gold,rgb(255,215,130))]/5
      transition-colors"
    >
      <div className="flex items-center justify-between text-[13px] font-medium text-white leading-tight">
        <span>{label}</span>
        <span
          className="text-[10px] font-normal tracking-[0.15em]
          text-[var(--lux-gold,rgb(255,215,130))]/70
          group-hover:text-[var(--lux-gold,rgb(255,215,130))]"
        >
          ↗
        </span>
      </div>
      {desc ? (
        <div className="text-[11px] text-[var(--lux-text-dim,rgba(255,255,255,0.6))] leading-snug mt-[2px]">
          {desc}
        </div>
      ) : null}
    </Link>
  );
}

function Divider() {
  return (
    <div className="mx-2 my-2 border-t border-[var(--lux-border,rgba(255,215,130,0.18))]/60" />
  );
}

function MiscLinks() {
  return (
    <div className="px-2 pt-2 pb-1 space-y-1">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold,rgb(255,215,130))]/70 pb-2">
        Other
      </div>

      <Link
        href="/about"
        className="block rounded-xl px-2 py-2 text-[13px] font-medium text-white/90
        hover:bg-[var(--lux-gold,rgb(255,215,130))]/5
        hover:text-white
        hover:border-[var(--lux-gold,rgb(255,215,130))]/20
        border border-transparent transition-colors leading-tight"
      >
        About Cask &amp; Amber
      </Link>

      <Link
        href="/faq"
        className="block rounded-xl px-2 py-2 text-[13px] font-medium text-white/90
        hover:bg-[var(--lux-gold,rgb(255,215,130))]/5
        hover:text-white
        hover:border-[var(--lux-gold,rgb(255,215,130))]/20
        border border-transparent transition-colors leading-tight"
      >
        FAQ
      </Link>

      <Link
        href="/contact"
        className="block rounded-xl px-2 py-2 text-[13px] font-medium text-white/90
        hover:bg-[var(--lux-gold,rgb(255,215,130))]/5
        hover:text-white
        hover:border-[var(--lux-gold,rgb(255,215,130))]/20
        border border-transparent transition-colors leading-tight"
      >
        Contact
      </Link>

      <div className="pt-3 pb-2 text-[10px] uppercase tracking-[0.2em] text-[var(--lux-text-dim,rgba(255,255,255,0.6))]">
        Signed in
      </div>
    </div>
  );
}
