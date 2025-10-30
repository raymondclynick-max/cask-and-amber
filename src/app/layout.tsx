// src/app/layout.tsx
import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import HeaderShell from "@/components/HeaderShell";

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

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-[var(--lux-bg)] text-[var(--lux-ink)] antialiased relative">
        <HeaderShell />
        <div className="pt-14">{children}</div>
      </body>
    </html>
  );
}
