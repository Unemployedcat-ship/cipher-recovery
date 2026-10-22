'use client';
import Link from 'next/link';
import { Lock, ShieldCheck, Zap } from 'lucide-react';

export default function DarkPoolsPage() {
  return (
    <div className="p-8 font-mono text-zinc-300 w-full max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#00FF41] mb-2 font-black">
            <Lock className="h-4 w-4" />
            <span>FHE SEALED-BID AUCTIONS</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">DARK POOLS</h1>
          <p className="mt-2 text-sm text-zinc-500">Fair match seeding. Snipers cannot front-run your launch.</p>
        </div>
        <Link href="/launch" className="rounded-sm bg-[#00FF41] px-6 py-3 text-xs font-black text-black hover:bg-[#00e03a] transition-colors shadow-[0_0_15px_rgba(0,255,65,0.2)]">
          + LAUNCH POOL
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border border-zinc-800 bg-[#09090B] p-5 rounded-sm relative">
          <div className="text-[10px] text-zinc-500 font-black tracking-widest">TOTAL VOLUME</div>
          <div className="text-2xl font-black text-white mt-1">$0.00</div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-5 rounded-sm relative">
          <div className="text-[10px] text-zinc-500 font-black tracking-widest">ACTIVE POOLS</div>
          <div className="text-2xl font-black text-[#00FF41] mt-1">0</div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-5 rounded-sm relative">
          <div className="text-[10px] text-zinc-500 font-black tracking-widest">TOTAL BIDS PLACED</div>
          <div className="text-2xl font-black text-white mt-1">0</div>
        </div>
      </div>

      <div className="border border-zinc-800 bg-[#09090B] rounded-sm flex flex-col items-center justify-center py-32 px-4 text-center relative overflow-hidden">
        {/* Tactical Targeting Corners */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#00FF41]/50"></div>
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#00FF41]/50"></div>
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#00FF41]/50"></div>
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#00FF41]/50"></div>

        <div className="relative mb-8 group">
          {/* Radar Ping */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 border border-[#00FF41] rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }}></div>
            <div className="absolute w-48 h-[1px] bg-[#00FF41]/30"></div>
            <div className="absolute h-48 w-[1px] bg-[#00FF41]/30"></div>
          </div>
          {/* Shield Icon */}
          <div className="h-24 w-24 bg-[#111116] border border-zinc-800 rounded-sm flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(0,255,65,0.15)] group-hover:border-[#00FF41] transition-colors">
            <ShieldCheck className="h-10 w-10 text-[#00FF41]" />
          </div>
        </div>
        
        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wider">No Active Dark Pools</h2>
        <p className="text-sm text-zinc-500 max-w-md mb-8 leading-relaxed">
          Be the first to launch a token using our FHE-secured sealed-bid mechanism. <br/>
          <span className="text-[#00FF41]">No snipers. No front-running. Just fair price discovery.</span>
        </p>
        
        <Link href="/launch" className="rounded-sm border border-[#00FF41] bg-[#00FF41]/10 px-8 py-3 text-xs font-black text-[#00FF41] hover:bg-[#00FF41]/20 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
          <Zap size={16} /> INITIALIZE FIRST PROTOCOL
        </Link>
      </div>
    </div>
  );
}