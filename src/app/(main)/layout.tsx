'use client';

import { ClientProviders } from "@/components/ClientProviders";
import { LegalGate } from "@/components/modals/LegalGate";
import { TopBar } from "@/components/navigation/TopBar";
import { TickerTape } from "@/components/navigation/TickerTape";
import { Sidebar } from "@/components/navigation/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      <LegalGate>
        <div className="flex flex-col h-screen overflow-hidden bg-[#050505] text-white font-mono">
          
          {/* Top Ticker */}
          <TickerTape />
          
          {/* Top Navigation */}
          <TopBar />
          
          {/* Main Content Area */}
          <div className="flex flex-1 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#09090B] to-[#09090B] pointer-events-none -z-10"></div>
            
            {/* Left Sidebar */}
            <Sidebar />
            
            {/* Page Content */}
            <main className="flex-1 overflow-y-auto relative z-10">
              {children}
            </main>
          </div>
          
        </div>
      </LegalGate>
    </ClientProviders>
  );
}
