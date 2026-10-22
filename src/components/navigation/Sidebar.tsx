'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Flame, Award, Users, Zap, Box } from 'lucide-react';

const SECTIONS = [
  { label: 'TRADE', items: [
      { href: '/dark-pools', label: 'Trending', icon: Flame },
      { href: '/launch', label: 'Launch', icon: Zap },
      { href: '/terminal', label: 'Terminal', icon: Compass },
  ]},
  { label: 'PORTFOLIO', items: [
      { href: '/vault', label: 'My Bags', icon: Box },
      { href: '/conviction', label: 'Conviction', icon: Award },
  ]},
  { label: 'SOCIAL', items: [
      { href: '/community', label: 'Community', icon: Users },
      { href: '/syndicates', label: 'Syndicates', icon: Users },
  ]},
];

export function Sidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 border-r-0 md:border-r border-zinc-800 bg-[#09090B] flex flex-col z-20 h-full flex-shrink-0">
      <nav className="flex-1 overflow-y-auto py-6">
        {SECTIONS.map((section) => (
          <div key={section.label} className="mb-6">
            <div className="px-6 mb-2 text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">
              {section.label}
            </div>
            <div className="px-3">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onLinkClick}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 transition-all duration-200 text-sm ${isActive ? 'bg-[#00FF41]/10 text-[#00FF41] shadow-[inset_2px_0_0_#00FF41]' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 hover:translate-x-1'}`}
                  >
                    <item.icon size={16} className={isActive ? 'text-[#00FF41]' : 'text-zinc-500 group-hover:text-zinc-300 transition-colors'} />
                    <span className="font-mono">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}