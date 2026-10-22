'use client';
import { Activity, TrendingUp, Zap } from 'lucide-react';

export default function TerminalPage() {
  return (
    <div className="p-8 font-mono text-zinc-300 w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Activity className="text-[#00FF41]"/> MARKET PULSE</h1>
        <p className="text-sm text-zinc-500">Global ecosystem metrics and top trader performance.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-zinc-800 bg-[#09090B] rounded-lg p-6">
            <div className="text-xs text-zinc-500 mb-2">TOTAL VOLUME (ALL TIME)</div>
            <div className="text-3xl font-bold text-white mb-6">$0</div>
            <div className="h-48 w-full border-b border-l border-zinc-800 relative">
              <svg viewBox="0 0 100 50" className="w-full h-full preserve-3d">
                <path d="M 0 40 Q 20 40, 30 20 T 60 30 T 80 10 T 100 5" fill="none" stroke="#00FF41" strokeWidth="1.5" />
                <path d="M 0 40 Q 20 40, 30 20 T 60 30 T 80 10 T 100 5 L 100 50 L 0 50 Z" fill="url(#gradient)" opacity="0.1" />
              </svg>
            </div>
          </div>
          <div className="border border-zinc-800 bg-[#09090B] rounded-lg p-6">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-[#00FF41]"/> TOP GAINERS</h2>
            <div className="text-sm text-zinc-500 italic">No gainers yet. Be the first to launch.</div>
          </div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] rounded-lg p-6 flex flex-col h-full">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Zap size={16} className="text-[#FF00FF]"/> LIVE FEED</h2>
          <div className="flex-1 space-y-3 text-xs">
            <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
              <span className="text-[#00FF41]">0.5 SOL</span><span className="text-zinc-500">Bid placed</span><span className="text-zinc-600">2s ago</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
              <span className="text-[#FF00FF]">NEW POOL</span><span className="text-zinc-500">TestDegen</span><span className="text-zinc-600">1m ago</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-800 text-center text-[10px] text-zinc-600 animate-pulse">Listening for on-chain events...</div>
        </div>
      </div>
    </div>
  );
}