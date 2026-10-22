import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";
import { LegalGate } from "@/components/modals/LegalGate";
import { TopBar } from "@/components/navigation/TopBar";
import { TickerTape } from "@/components/navigation/TickerTape";
import { Sidebar } from "@/components/navigation/Sidebar";

export const metadata: Metadata = {
  title: "FairDegens | Anti-Snipe Memecoin Launchpad",
  description: "The FHE-secured launchpad where snipers can't front-run you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', height: '100vh', margin: 0, backgroundColor: '#050505', color: '#ffffff', fontFamily: 'monospace', overflow: 'hidden' }}>
        <ClientProviders>
          <LegalGate>
            <TickerTape />
            <TopBar />
            
            {/* This flex container forces Sidebar and Main side-by-side */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <Sidebar />
              <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#09090B] to-[#09090B] pointer-events-none -z-10"></div>
                {children}
              </main>
            </div>
          </LegalGate>
        </ClientProviders>
      </body>
    </html>
  );
}
