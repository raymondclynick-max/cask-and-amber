import FracHero from "@/components/fractional/FracHero";
import LifecycleBar from "@/components/fractional/LifecycleBar";
import SectionTitle from "@/components/fractional/SectionTitle";
import CaviChart from "@/components/fractional/CaviChart";
import TickerMarquee from "@/components/fractional/TickerMarquee";
import PriceTicker from "@/components/fractional/PriceTicker";
import TrancheGrid from "@/components/fractional/TrancheGrid";
import FracCalc from "@/components/fractional/FracCalc";
import RedemptionChooser from "@/components/fractional/RedemptionChooser";
import EscrowPanel from "@/components/fractional/EscrowPanel";
import OwnershipPolicy from "@/components/fractional/OwnershipPolicy";
import { LuxCard } from "@/components/ui/LuxCard";

export const metadata = {
  title: "Fractional Casks — Cask & Amber",
  description: "Legally registered fractional whisky ownership in MBU blocks. CAVI-derived pricing from full casks in the Amber Vault. Clear exits and bonded storage.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[var(--lux-bg)] text-[var(--lux-ink)] antialiased">
      <FracHero />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <LifecycleBar recordDate="2026-03-31T16:00:00Z" bottlingDate="2026-06-30T16:00:00Z" />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 grid gap-6 lg:grid-cols-3">
        <LuxCard className="lg:col-span-2 space-y-4">
          <SectionTitle title="CAVI" sub="Derived from full casks in the Amber Vault • €/RLA" />
          <CaviChart />
          <TickerMarquee />
        </LuxCard>
        <LuxCard>
          <SectionTitle title="Live Ticker" sub="Demo feed • Registry only" />
          <PriceTicker />
          <p className="mt-3 text-[11px] text-[var(--lux-ink)]/60">
            Valuation unit: €/RLA and €/bottle. No crypto. Registry only.
          </p>
        </LuxCard>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <SectionTitle title="Available Tranches" />
        <TrancheGrid />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <LuxCard>
            <SectionTitle title="Investment Calculator • Demo" />
            <FracCalc />
          </LuxCard>
          <LuxCard>
            <RedemptionChooser />
          </LuxCard>
        </div>
        <div className="space-y-6">
          <LuxCard><EscrowPanel monthlyStoragePerBottleEUR={0.1} /></LuxCard>
          <LuxCard><OwnershipPolicy /></LuxCard>
        </div>
      </section>

      <div className="h-20" />
    </main>
  );
}
