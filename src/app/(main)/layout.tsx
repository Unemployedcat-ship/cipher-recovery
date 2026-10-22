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
          <TopBar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isMenuOpen={isMobileMenuOpen} />
          
          <div className="flex flex-1 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#09090B] to-[#09090B] pointer-events-none -z-10"></div>
            
            {/* Desktop Sidebar */}
            <div className="hidden md:flex h-full flex-shrink-0 z-20">
              <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay & Drawer */}
            <div className={`fixed inset-0 z-50 flex md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}>
              {/* Backdrop */}
              <div className={`fixed inset-0 bg-black/70  transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
              
              {/* Sliding Panel */}
              <div className={`relative flex flex-col w-72 h-full bg-[#09090B] border-r border-zinc-800 shadow-2xl transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center p-4 border-b border-zinc-800">
                  <span className="font-bold text-white tracking-widest">FAIR<span className="text-[#00FF41]">//</span>DEGENS</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-500 hover:text-white transition-colors">Close</button>
                </div>
                <Sidebar onLinkClick={() => setIsMobileMenuOpen(false)} />
              </div>
            </div>
            
            {/* Main Content Area */}
            <main className={`flex-1 overflow-y-auto relative w-full transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'md:translate-x-0 translate-x-[20px] scale-95 rounded-xl shadow-2xl' : 'translate-x-0 scale-100'}`}>
              {children}
            </main>
          </div>
        </div>
      </LegalGate>
    </ClientProviders>
  );
}