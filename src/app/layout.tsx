import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import SiteHeader from "@/components/SiteHeader"; // ← add this import

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Cask & Amber",
  description: "Time distilled into memory.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-[var(--lux-bg)] text-[var(--lux-ink)] antialiased relative">
        {/* Global header */}
        <SiteHeader />

        {/* Push page content below header */}
        <div className="pt-14">{children}</div>
      </body>
    </html>
  );
}
