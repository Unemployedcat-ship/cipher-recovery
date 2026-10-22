'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Flame, Award, Users, Zap, Box } from 'lucide-react';

const SECTIONS = [
  {
    label: 'TRADE',
    items: [
      { href: '/dark-pools', label: 'Trending', icon: Flame },
      { href: '/launch', label: 'Launch', icon: Zap },
      { href: '/terminal', label: 'Terminal', icon: Compass },
    ],
  },
  {
    label: 'PORTFOLIO',
    items: [
      { href: '/vault', label: 'My Bags', icon: Box },
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
    <aside style={{ width: '260px', backgroundColor: '#09090B', borderRight: '1px solid #222228', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <nav style={{ flex: 1, overflowY: 'auto', paddingTop: '24px', paddingBottom: '24px' }}>
        {SECTIONS.map((section) => (
          <div key={section.label} style={{ marginBottom: '24px' }}>
            <div style={{ paddingLeft: '24px', marginBottom: '8px', fontSize: '10px', color: '#71717a', letterSpacing: '0.1em', fontWeight: 'bold' }}>
              {section.label}
            </div>
            <div style={{ paddingLeft: '12px', paddingRight: '12px' }}>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', marginBottom: '4px', textDecoration: 'none', fontSize: '14px',
                      backgroundColor: isActive ? 'rgba(0, 255, 65, 0.1)' : 'transparent',
                      color: isActive ? '#00FF41' : '#a1a1aa',
                    }}
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
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
