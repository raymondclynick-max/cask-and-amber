// src/components/Header.tsx (excerpt)
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur bg-[color:rgba(11,11,11,.6)] border-b border-[var(--lux-gold-line)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 h-16">
        <Link href="/" className="font-serif text-[var(--gold)] text-xl">Cask & Amber</Link>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/about" className="hover:text-[var(--gold)]">About</Link>
          <Link href="/how-it-works" className="hover:text-[var(--gold)]">How it works</Link>
          <Link href="/cask-exchange/browse" className="hover:text-[var(--gold)]">Cask Exchange</Link>
          <Link href="/amber-vaults/overview" className="hover:text-[var(--gold)]">Amber Vaults</Link>
          <Link href="/journal" className="hover:text-[var(--gold)]">Journal</Link>
          <Link href="/contact" className="hover:text-[var(--gold)]">Contact</Link>
        </div>
      </nav>
    </header>
  );
}
