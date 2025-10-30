import Link from "next/link";

export const metadata = {
  title: "About — Cask & Amber",
  description:
    "Who we are, your free beginners guide, and the two paths: Cask Exchange and Amber Vaults.",
};

export default function Page() {
  return (
    <main className="min-h-screen text-[var(--text)]">
      {/* Header block */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-12">
        <p className="text-sm tracking-widest text-[var(--gold)] uppercase">Cask & Amber</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl text-[var(--headline)]">About Us</h1>
        <p className="mt-4 max-w-3xl text-lg text-[var(--lux-ink)]/85">
          We curate demonstrative public listings and member-only inventory. Explore single casks
          on <span className="text-[var(--gold)]">Cask Exchange</span> or allocate into managed
          portfolios via <span className="text-[var(--gold)]">Amber Vaults</span>.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/how-it-works" className="rounded-2xl border border-[var(--lux-gold-line)] px-5 py-3 hover:border-[var(--gold)]">
            How it works
          </Link>
          <a
            href="/Cask-and-Amber_Beginners-Guide.pdf"
            download
            className="rounded-2xl bg-[var(--gold)] text-[var(--button-text)] px-5 py-3 hover:opacity-90"
          >
            Download Beginners Guide (PDF)
          </a>
        </div>
      </section>

      <hr className="border-t border-[var(--lux-gold-line)]" />

      {/* Pillars */}
      <section className="mx-auto max-w-6xl px-6 py-12 grid gap-6 md:grid-cols-3">
        {[
          { t: "Provenance", d: "Distillery, vintage, cask type, and verifiable history for members." },
          { t: "Custody", d: "Warehouse acknowledgements, insurance, registry, and documents." },
          { t: "Discipline", d: "Conservative pricing, transparent fees, measured assumptions." },
        ].map((b) => (
          <div key={b.t} className="rounded-2xl border border-[var(--lux-gold-line)] p-6">
            <h3 className="font-serif text-2xl text-[var(--headline)]">{b.t}</h3>
            <p className="mt-2 text-[var(--lux-ink)]/80">{b.d}</p>
          </div>
        ))}
      </section>

      {/* Lead magnet + explainer */}
      <section className="mx-auto max-w-6xl px-6 pb-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Free guide card */}
          <a
            href="/Cask-and-Amber_Beginners-Guide.pdf"
            download
            className="group rounded-3xl border border-[var(--lux-gold-line)] p-8 md:p-10 hover:border-[var(--gold)] transition"
          >
            <h2 className="font-serif text-3xl text-[var(--headline)]">Free Beginners Guide</h2>
            <p className="mt-3 text-[var(--lux-ink)]/80">
              Clear basics: what a cask is, how custody works, realistic costs, risks, and exit routes.
            </p>
            <div className="mt-6 inline-block rounded-xl bg-[var(--gold)] text-[var(--button-text)] px-5 py-3 group-hover:opacity-90">
              Download PDF
            </div>
          </a>

          {/* Short process explainer */}
          <div className="rounded-3xl border border-[var(--lux-gold-line)] p-8 md:p-10">
            <h2 className="font-serif text-3xl text-[var(--headline)]">The two paths</h2>
            <ul className="mt-4 space-y-2 text-[var(--lux-ink)]/80">
              <li>• Public demo → Verify → Member access</li>
              <li>• Choose single casks on Cask Exchange</li>
              <li>• Or allocate into diversified Amber Vaults</li>
              <li>• Hold, monitor, and exit with support</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/how-it-works" className="rounded-xl border border-[var(--lux-gold-line)] px-5 py-3 hover:border-[var(--gold)]">
                Read How it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Signature tiles: Amber Vaults / Cask Exchange */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Amber Vaults tile */}
          <Link
            href="/amber-vaults/overview"
            className="group relative overflow-hidden rounded-3xl border border-[var(--lux-gold-line)] p-8 md:p-10"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition"
                 style={{ backgroundImage: "radial-gradient(circle at 30% 20%, var(--gold), transparent 35%)" }}/>
            <h3 className="font-serif text-3xl text-[var(--headline)]">Amber Vaults</h3>
            <p className="mt-3 text-[var(--lux-ink)]/80">
              Managed portfolios with strategy, fee schedule, and NAV reporting.
            </p>
            <ul className="mt-4 space-y-1 text-[var(--lux-ink)]/75">
              <li>• Defined mandate and rebalancing policy</li>
              <li>• NAV, distributions, audits, documents</li>
              <li>• Units represent proportional ownership</li>
            </ul>
            <div className="mt-6 inline-block rounded-xl bg-[var(--gold)] text-[var(--button-text)] px-5 py-3 group-hover:opacity-90">
              View vault strategies
            </div>
          </Link>

          {/* Cask Exchange tile */}
          <Link
            href="/cask-exchange/browse"
            className="group relative overflow-hidden rounded-3xl border border-[var(--lux-gold-line)] p-8 md:p-10"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition"
                 style={{ backgroundImage: "radial-gradient(circle at 70% 30%, var(--gold), transparent 35%)" }}/>
            <h3 className="font-serif text-3xl text-[var(--headline)]">Cask Exchange</h3>
            <p className="mt-3 text-[var(--lux-ink)]/80">
              Member marketplace for single casks with full specifications and documents.
            </p>
            <ul className="mt-4 space-y-1 text-[var(--lux-ink)]/75">
              <li>• Filters by region, vintage, and cask type</li>
              <li>• Listing states: live, reserved, under offer</li>
              <li>• Compare and provenance access for members</li>
            </ul>
            <div className="mt-6 inline-block rounded-xl border border-[var(--lux-gold-line)] px-5 py-3 group-hover:border-[var(--gold)]">
              Browse demo casks
            </div>
          </Link>
        </div>
      </section>

      {/* Compliance footer strip */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-[var(--lux-gold-line)] p-6 text-[var(--lux-ink)]/70 text-sm">
          Capital at risk. Returns not guaranteed. Duty and VAT apply if bottled. Evaporation and ABV changes occur during maturation.
          Full specifications and documents are member-only after verification.
        </div>
      </section>
    </main>
  );
}
