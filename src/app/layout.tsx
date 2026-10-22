import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { LegalGate } from "@/components/modals/LegalGate";
import { TopBar } from "@/components/navigation/TopBar";
import { TickerTape } from "@/components/navigation/TickerTape";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FairDegens | Anti-Snipe Memecoin Launchpad",
  description: "Fair-launch memecoin launchpad with 0% rug risk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090B] text-slate-200 flex flex-col min-h-screen selection:bg-cyan-500/30`}>
        <Providers>
          <LegalGate>
            <TickerTape />
            <TopBar />
            <main className="flex-1 flex flex-col relative">
              {/* Subtle radial gradient background */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#09090B] to-[#09090B] pointer-events-none -z-10"></div>
              {children}
            </main>
          </LegalGate>
        </Providers>
      </body>
    </html>
  );
}
