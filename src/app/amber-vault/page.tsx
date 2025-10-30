import FeaturedCarousel from "../../components/vault/FeaturedCarousel";
import CasksPanel from "../../components/vault/CasksPanel";
import { LayoutFade, SectionFade } from "../../components/vault/LayoutFade";
import MarketUpdates from "../../components/vault/MarketUpdates";
import FramedHero from "../../components/vault/FramedHero";

export const metadata = {
  title: "Amber Vault — Cask & Amber",
  description: "Private vault dashboard.",
};

export default function Page() {
  return (
    <main className="relative isolate min-h-screen bg-[var(--lux-bg)] text-[var(--lux-ink)]">
      {/* background pushed behind */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[url('/img/logo-mark.png')] bg-center bg-no-repeat bg-contain opacity-[0.06]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-transparent to-black/70"
      />

      <LayoutFade>
        {/* HERO */}
        <SectionFade>
          <div className="pt-10 md:pt-12">
            <FramedHero
              location="Perth, Scotland"
              tempC={12.9}
              humidityPct={76}
              windKph={9}
              portfolioEUR={108000}
              totalLAA={182}
              totalCasks={37}
              lastRegaugeISO="2025-06-12"
            />
          </div>
        </SectionFade>

        {/* INSIGHTS */}
        <SectionFade delay={0.05}>
          <div className="mx-auto max-w-7xl px-6 pt-10">
            <header className="mb-4">
              <h2 className="font-serif text-[28px] leading-tight">Market Insights</h2>
              <div className="mt-2 h-px w-28 bg-[var(--lux-gold-line)]" />
            </header>

            <div className="divide-y divide-[var(--lux-gold-line)]/50 overflow-hidden rounded-[28px] border border-[var(--lux-gold-line)]/50 bg-white/[0.02] backdrop-blur">
              <MarketUpdates
                items={[
                  {
                    title: "Market pulse rises",
                    href: "/insights/auction-index",
                    summary:
                      "Blue-chip single malts lift the composite by 1.2% on higher median hammer prices.",
                    tone: "up",
                  },
                  {
                    title: "PX-finish spotlight",
                    href: "/insights/px-series",
                    summary:
                      "A Speyside house unveils a limited PX series focused on collector demand.",
                    tone: "flat",
                  },
                  {
                    title: "Premium focus signalled",
                    href: "/insights/q4-premium-malt",
                    summary:
                      "A major producer prioritises aged malt SKUs over blends going into Q4.",
                    tone: "flat",
                  },
                ]}
              />
            </div>
          </div>
        </SectionFade>

        {/* MAIN GRID */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 lg:grid-cols-[1fr_340px]">
          {/* CENTER */}
          <SectionFade delay={0.1}>
            <section className="rounded-[28px] border border-[var(--lux-gold-line)]/40 bg-white/[0.015] p-8 md:p-10 lg:p-12">
              <header className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-serif text-[26px] leading-none">Privately Owned Casks</h3>
                  <div className="mt-2 h-px w-24 bg-[var(--lux-gold-line)]" />
                </div>
                <a
                  href="/amber-vault/overview"
                  className="text-xs uppercase tracking-[0.18em] text-[var(--lux-gold)] hover:opacity-80"
                >
                  View all
                </a>
              </header>

              <CasksPanel mode="cards" />
            </section>
          </SectionFade>

          {/* RIGHT RAIL */}
          <SectionFade delay={0.18}>
            <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <div className="rounded-3xl border border-[var(--lux-gold-line)]/60 bg-white/[0.02] p-4">
                <div className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold)]/90">
                  Featured Casks
                </div>
                <div className="relative h-48 overflow-hidden rounded-2xl">
                  <FeaturedCarousel />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/15" />
                </div>
                <a
                  href="/cask-exchange"
                  className="mt-3 block text-xs uppercase tracking-[0.18em] text-[var(--lux-gold)] hover:opacity-80"
                >
                  Browse marketplace
                </a>
              </div>

              <div className="rounded-3xl border border-[var(--lux-gold-line)]/60 bg-white/[0.02] p-5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--lux-ink)]/60">
                  Totals
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[var(--lux-ink)]/60">Portfolio value</div>
                    <div className="font-serif text-[var(--lux-gold)]">€108,000</div>
                  </div>
                  <div>
                    <div className="text-[var(--lux-ink)]/60">Casks</div>
                    <div className="font-serif text-[var(--lux-gold)]">37</div>
                  </div>
                  <div>
                    <div className="text-[var(--lux-ink)]/60">Total LAA</div>
                    <div className="font-serif text-[var(--lux-gold)]">182 L</div>
                  </div>
                  <div>
                    <div className="text-[var(--lux-ink)]/60">Last re-gauge</div>
                    <div className="font-serif text-[var(--lux-gold)]">2025-06-12</div>
                  </div>
                </div>
              </div>
            </aside>
          </SectionFade>
        </div>
      </LayoutFade>
    </main>
  );
}
