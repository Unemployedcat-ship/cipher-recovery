'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Flame, Award, Users, Zap, Box } from 'lucide-react';

const SECTIONS = [
  {
    label: 'DISCOVER',
    items: [
      { href: '/', label: 'Terminal', icon: Compass },
      { href: '/dark-pools', label: 'Dark Pools', icon: Flame },
      { href: '/launch', label: 'Launch', icon: Zap },
    ],
  },
  {
    label: 'PORTFOLIO',
    items: [
      { href: '/vault', label: 'Vault', icon: Box },
      { href: '/conviction', label: 'Conviction', icon: Award },
    ],
  },
  {
    label: 'SOCIAL',
    items: [
      { href: '/community', label: 'Community', icon: Users },
      { href: '/syndicates', label: 'Syndicates', icon: Users },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col z-20 h-screen sticky top-0">
      <Link href="/" className="px-6 py-6 border-b border-[var(--border-subtle)] block">
        <div className="font-mono text-xl font-bold tracking-tight text-white">
          CIPHER<span className="text-[var(--accent-cyan)]">//</span>TERMINAL
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto py-4">
        {SECTIONS.map((section) => (
          <div key={section.label} className="mb-6">
            <div className="px-6 mb-2 font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em]">
              {section.label}
            </div>
            <div className="px-3">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] transition-colors mb-0.5 ${
                      isActive
                        ? 'text-[var(--accent-cyan)] bg-[var(--accent-cyan-dim)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                    }`}
                  >
                    <item.icon size={16} />
                    <span className="font-mono text-sm">{item.label}</span>
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