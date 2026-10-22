'use client';
import { useState } from 'react';
import { ClientProviders } from "@/components/ClientProviders";
import { LegalGate } from "@/components/modals/LegalGate";
import { TopBar } from "@/components/navigation/TopBar";
import { TickerTape } from "@/components/navigation/TickerTape";
import { Sidebar } from "@/components/navigation/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ClientProviders>
      <LegalGate>
        <div className="flex flex-col h-screen overflow-hidden bg-[#050505] text-white font-mono">
          <TickerTape />
          <TopBar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          
          <div className="flex flex-1 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#09090B] to-[#09090B] pointer-events-none -z-10"></div>
            
            {/* Desktop Sidebar */}
            <div className="hidden md:flex h-full flex-shrink-0">
              <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-50 flex md:hidden">
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                <div className="relative flex flex-col w-64 h-full bg-[#09090B] border-r border-zinc-800">
                  <Sidebar onLinkClick={() => setIsMobileMenuOpen(false)} />
                </div>
              </div>
            )}
            
            <main className="flex-1 overflow-y-auto relative w-full">
              {children}
            </main>
          </div>
        </div>
      </LegalGate>
    </ClientProviders>
  );
}