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
        {/* Force the entire app to be a vertical column */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#050505', color: 'white', fontFamily: 'monospace', margin: 0, padding: 0 }}>
          
          <TickerTape />
          <TopBar />
          
          {/* Force the Sidebar and Main content to be a horizontal row */}
          <div style={{ display: 'flex', flexDirection: 'row', flex: 1, overflow: 'hidden' }}>
            
            <Sidebar />
            
            <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
              {children}
            </main>
            
          </div>
        </div>
      </LegalGate>
    </ClientProviders>
  );
}
