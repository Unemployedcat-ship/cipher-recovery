'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, Flame, Rocket, LineChart, 
  Wallet, Users, Network, Shield
} from 'lucide-react';

export default function MainLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const navGroups = [
    {
      title: 'TRADE',
      links: [
        { name: 'Trending', href: '/dark-pools', icon: Flame },
        { name: 'Launch', href: '/launch', icon: Rocket },
        { name: 'Terminal', href: '/terminal', icon: LineChart },
      ]
    },
    {
      title: 'PORTFOLIO',
      links: [
        { name: 'My Bags', href: '/vault', icon: Wallet },
        { name: 'Conviction', href: '/conviction', icon: Shield },
      ]
    },
    {
      title: 'SOCIAL',
      links: [
        { name: 'Community', href: '/community', icon: Users },
        { name: 'Syndicates', href: '/syndicates', icon: Network },
      ]
    }
  ];

  return (
    <div className="flex flex-1 h-[calc(100vh-105px)] overflow-hidden bg-[#050508]">
      <aside className={`${isSidebarOpen ? 'w-60' : 'w-0'} transition-all duration-300 ease-in-out border-r border-white/5 bg-[#09090B] flex flex-col relative shrink-0 overflow-hidden z-20`}>
        <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-6">
              <h3 className="text-[10px] font-mono text-slate-600 tracking-widest mb-2 px-3 uppercase">{group.title}</h3>
              <div className="space-y-1">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link key={link.name} href={link.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-xs transition-all ${isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                      <Icon size={14} className={isActive ? 'text-cyan-400' : 'text-slate-500'} />
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-y-auto bg-[#0A0A0F]">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute left-4 top-4 z-40 p-1.5 bg-[#111116] border border-white/10 rounded-md text-slate-400 hover:text-white transition-colors shadow-lg">
          {isSidebarOpen ? <X size={14} /> : <Menu size={14} />}
        </button>
        <div className="pt-14 px-6 pb-6 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
