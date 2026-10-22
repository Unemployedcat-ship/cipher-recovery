'use client';
import { Activity, TrendingUp, Zap } from 'lucide-react';

export default function TerminalPage() {
  return (
    <div className="p-8 font-mono text-zinc-300 w-full max-w-7xl mx-auto">
      <div className="mb-8 border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-black text-white flex items-center gap-2 uppercase tracking-tight"><Activity className="text-[#00FF41]"/> MARKET PULSE</h1>
        <p className="text-sm text-zinc-500 mt-1">Global ecosystem metrics and top trader performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-6 relative overflow-hidden">
            <div className="text-[10px] text-zinc-500 font-black tracking-widest mb-2">TOTAL VOLUME (ALL TIME)</div>
            <div className="text-4xl font-black text-white mb-8">$0</div>
            
            {/* Upgraded Chart */}
            <div className="h-64 w-full relative">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between border-b border-l border-zinc-800/50">
                {[1,2,3,4].map(i => <div key={i} className="w-full h-[1px] bg-zinc-800/30"></div>)}
              </div>
              
              <svg viewBox="0 0 100 50" className="w-full h-full preserve-3d absolute inset-0 z-10">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00FF41" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#00FF41" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M 0 45 Q 20 40, 30 25 T 60 35 T 80 10 T 100 5 L 100 50 L 0 50 Z" fill="url(#chartGradient)" />
                <path d="M 0 45 Q 20 40, 30 25 T 60 35 T 80 10 T 100 5" fill="none" stroke="#00FF41" strokeWidth="1.5" className="drop-shadow-[0_0_8px_rgba(0,255,65,0.5)]" />
              </svg>
            </div>
          </div>

          <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-6">
            <h2 className="text-sm font-black text-white mb-4 flex items-center gap-2 uppercase tracking-widest"><TrendingUp size={16} className="text-[#00FF41]"/> TOP GAINERS</h2>
            <div className="text-sm text-zinc-500 italic">No gainers yet. Be the first to launch.</div>
          </div>
        </div>

        <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-6 flex flex-col h-full">
          <h2 className="text-sm font-black text-white mb-4 flex items-center gap-2 uppercase tracking-widest"><Zap size={16} className="text-[#FF00FF]"/> LIVE FEED</h2>
          <div className="flex-1 space-y-4 text-xs font-mono">
            <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
              <span className="text-[#00FF41] font-bold">0.5 SOL</span>
              <span className="text-zinc-400">Bid placed</span>
              <span className="text-zinc-600">2s ago</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
              <span className="text-[#FF00FF] font-bold">NEW POOL</span>
              <span className="text-zinc-400">TestDegen</span>
              <span className="text-zinc-600">1m ago</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2 opacity-50">
              <span className="text-[#00FF41] font-bold">1.2 SOL</span>
              <span className="text-zinc-400">Bid placed</span>
              <span className="text-zinc-600">5m ago</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-800 text-center text-[10px] text-[#00FF41] font-bold tracking-widest animate-pulse">
            LISTENING FOR ON-CHAIN EVENTS...
          </div>
        </div>
      </div>
    </div>
  );
}