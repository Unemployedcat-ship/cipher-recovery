'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { Menu, X } from 'lucide-react';

export function TopBar({ onMenuClick, isMenuOpen }: { onMenuClick?: () => void, isMenuOpen?: boolean }) {
  const { authenticated, login } = usePrivy();
  const { address } = useSolanaWallet();

  return (
    <div className="flex flex-row items-center justify-between px-4 md:px-6 py-3 border-b border-zinc-800 bg-[#09090B] flex-shrink-0 z-40 relative">
      
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger / Close Icon */}
        <button onClick={onMenuClick} className="md:hidden relative h-8 w-8 flex items-center justify-center text-zinc-400 hover:text-white transition-transform duration-300">
          <Menu size={24} className={`absolute transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
          <X size={24} className={`absolute transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
        </button>

        <Link href="/" className="flex items-center gap-2 md:gap-3 text-decoration-none z-10">
          <img src="/logo.svg" alt="FairDegens" className="h-8 w-8 md:h-10 md:w-10" />
          <div className="flex flex-col">
            <span className="text-white font-black text-lg md:text-xl tracking-wider leading-none">
              FAIR<span className="text-[#00FF41]">//</span>DEGENS
            </span>
            <span className="hidden md:block text-[#00FF41] text-[9px] tracking-[0.2em] uppercase font-bold mt-1">
              Anti-Snipe Protocol
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {!authenticated ? (
          <button onClick={login} className="bg-[#00FF41] text-black font-bold text-[10px] md:text-xs px-3 md:px-5 py-2 rounded hover:bg-[#00e03a] transition-colors shadow-[0_0_15px_rgba(0,255,65,0.3)]">
            CONNECT
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-[#111116] border border-zinc-800 px-2 md:px-3 py-1.5 rounded-md">
            <div className="h-2 w-2 bg-[#00FF41] rounded-full"></div>
            <span className="text-[10px] md:text-xs text-zinc-300 font-mono">
              {address?.slice(0,4)}...{address?.slice(-4)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}