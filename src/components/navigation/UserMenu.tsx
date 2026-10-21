'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { User, Settings, Shield, Scale, Users, LogOut } from 'lucide-react';

export function UserMenu() {
  const { login, authenticated, logout, user } = usePrivy();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="bg-[var(--accent-cyan-dim)] text-[var(--accent-cyan)] px-6 py-2 rounded-md font-mono font-bold tracking-widest border border-[var(--accent-cyan)] shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:bg-[var(--accent-cyan)] hover:text-black transition-colors"
      >
        CONNECT IDENTITY
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-mono text-sm text-[var(--status-live)] border border-[var(--status-live)] px-4 py-1.5 rounded bg-[var(--bg-elevated)] flex items-center gap-2 hover:bg-[var(--status-live)] hover:text-black transition-colors"
      >
        <div className="w-2 h-2 rounded-full bg-[var(--status-live)] animate-pulse"></div>
        OPERATOR VERIFIED
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-md shadow-xl py-1 z-50">
          <div className="px-4 py-2 border-b border-[var(--border-subtle)] mb-1">
            <div className="font-mono text-xs text-[var(--text-muted)] truncate">
              {user?.wallet?.address || user?.email?.address || 'Operator'}
            </div>
          </div>
          
          <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 font-mono text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-white">
            <User size={14} /> Operator ID
          </Link>
          <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 font-mono text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-white">
            <Settings size={14} /> System Config
          </Link>
          <Link href="/privacy" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 font-mono text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-white">
            <Shield size={14} /> Data Privacy
          </Link>
          <Link href="/legal" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 font-mono text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-white">
            <Scale size={14} /> Compliance & Legal
          </Link>
          <Link href="/team" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 font-mono text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-white">
            <Users size={14} /> Syndicate Lore
          </Link>
          
          <div className="border-t border-[var(--border-subtle)] mt-1 pt-1">
            <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 font-mono text-sm text-[var(--status-rug)] hover:bg-[var(--bg-elevated)] transition-colors">
              <LogOut size={14} /> Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
