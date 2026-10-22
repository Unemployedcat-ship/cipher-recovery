'use client';

import Link from 'next/link';
import { Lock, ShieldCheck, Zap, TrendingUp } from 'lucide-react';

export default function DarkPoolsPage() {
  return (
    <div className="p-8 font-mono text-zinc-300 w-full max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#00FF41]">
            <Lock className="h-3.5 w-3.5" />
            <span>FHE SEALED-BID AUCTIONS</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">DARK POOLS</h1>
          <p className="mt-1 text-sm text-zinc-500">Fair match seeding. Snipers cannot front-run your launch.</p>
        </div>
        <Link href="/launch" className="rounded bg-[#00FF41] px-6 py-2.5 text-xs font-bold text-black hover:bg-[#00e03a] transition-colors shadow-[0_0_15px_rgba(0,255,65,0.3)]">
          + LAUNCH POOL
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-lg">
          <div className="text-[10px] text-zinc-500 tracking-widest">TOTAL VOLUME</div>
          <div className="text-xl font-bold text-white mt-1">$0.00</div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-lg">
          <div className="text-[10px] text-zinc-500 tracking-widest">ACTIVE POOLS</div>
          <div className="text-xl font-bold text-[#00FF41] mt-1">0</div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-lg">
          <div className="text-[10px] text-zinc-500 tracking-widest">TOTAL BIDS PLACED</div>
          <div className="text-xl font-bold text-white mt-1">0</div>
        </div>
      </div>

      {/* Empty State (The main focus) */}
      <div className="border border-zinc-800 bg-[#09090B] rounded-xl flex flex-col items-center justify-center py-24 px-4 text-center relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00FF41]/5  rounded-full pointer-events-none"></div>

        <div className="h-16 w-16 bg-[#111116] border border-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <ShieldCheck className="h-8 w-8 text-[#00FF41]" />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2">No Active Dark Pools</h2>
        <p className="text-sm text-zinc-500 max-w-md mb-8">
          Be the first to launch a token using our FHE-secured sealed-bid mechanism. No snipers, no front-running, just fair price discovery.
        </p>
        
        <Link href="/launch" className="rounded border border-[#00FF41]/30 bg-[#00FF41]/10 px-6 py-2.5 text-xs font-bold text-[#00FF41] hover:bg-[#00FF41]/20 transition-colors flex items-center gap-2">
          <Zap size={14} /> INITIALIZE FIRST PROTOCOL
        </Link>
      </div>
      
    </div>
  );
}
