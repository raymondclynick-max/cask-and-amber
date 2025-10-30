import Image from "next/image";

export default function FracHero() {
  return (
    <header className="relative">
      <div className="relative h-[36vh] min-h-[320px] w-full overflow-hidden">
        {/* file must exist: /public/img/fractional/hero.jpg */}
        <Image
          src="/img/fractional/hero.jpg"
          alt="Fractional casks"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-[var(--lux-bg)]/98" />
        <div className="absolute inset-x-0 bottom-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-semibold">Fractional Casks</h1>
          <p className="mt-1 text-sm md:text-base text-white/80">Legally registered. No tokens. Registry only.</p>
        </div>
      </div>
    </header>
  );
}
