'use client';
import { Users, Plus, Shield, TrendingUp } from 'lucide-react';

export default function SyndicatesPage() {
  return (
    <div className="p-4 md:p-8 font-mono text-zinc-300 w-full max-w-7xl mx-auto overflow-x-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Users className="text-[#00FF41]"/> SYNDICATES</h1>
          <p className="text-sm text-zinc-500 mt-1">Private alpha groups. High-tier allocations. Powered by FHE.</p>
        </div>
        <button className="w-full md:w-auto bg-[#00FF41] text-black font-bold text-xs px-4 py-3 md:py-2 rounded hover:bg-[#00e03a] transition-colors flex items-center justify-center gap-2">
          <Plus size={14} /> CREATE SYNDICATE
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border border-zinc-800 bg-[#09090B] rounded-xl p-5 hover:border-[#00FF41]/50 transition-colors group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FF41]/5 blur-2xl rounded-full"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="h-12 w-12 rounded-lg bg-[#00FF41]/10 border border-[#00FF41]/30 flex items-center justify-center text-[#00FF41]"><Shield size={24} /></div>
            <div className="text-[10px] font-bold bg-zinc-800 px-2 py-1 rounded text-zinc-400">VERIFIED</div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#00FF41] transition-colors">The Unemployed Cats</h3>
          <p className="text-xs text-zinc-500 mb-4 line-clamp-2">We only snipe the snipers. Exclusive access to top-secret dark pools before they graduate.</p>
          <div className="flex justify-between text-xs text-zinc-400 border-t border-zinc-800 pt-3">
            <span className="flex items-center gap-1"><Users size={12}/> 420 Members</span>
            <span className="flex items-center gap-1 text-[#00FF41]"><TrendingUp size={12}/> 1.2k SOL TVL</span>
          </div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] rounded-xl p-5 hover:border-[#FF00FF]/50 transition-colors group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF00FF]/5 blur-2xl rounded-full"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="h-12 w-12 rounded-lg bg-[#FF00FF]/10 border border-[#FF00FF]/30 flex items-center justify-center text-[#FF00FF]"><Shield size={24} /></div>
            <div className="text-[10px] font-bold bg-zinc-800 px-2 py-1 rounded text-zinc-400">ELITE</div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#FF00FF] transition-colors">Midnight Cartel</h3>
          <p className="text-xs text-zinc-500 mb-4 line-clamp-2">The most ruthless syndicate on Solana. If we bid, you don't see it until it's too late.</p>
          <div className="flex justify-between text-xs text-zinc-400 border-t border-zinc-800 pt-3">
            <span className="flex items-center gap-1"><Users size={12}/> 88 Members</span>
            <span className="flex items-center gap-1 text-[#FF00FF]"><TrendingUp size={12}/> 8.4k SOL TVL</span>
          </div>
        </div>
        <button className="border border-dashed border-zinc-800 bg-transparent rounded-xl p-5 flex flex-col items-center justify-center text-zinc-600 hover:text-[#00FF41] hover:border-[#00FF41]/50 hover:bg-[#00FF41]/5 transition-all h-full min-h-[200px]">
          <Plus size={32} className="mb-2" />
          <span className="text-sm font-bold">Create New Syndicate</span>
          <span className="text-xs mt-1">Pool capital. Conquer dark pools.</span>
        </button>
      </div>
    </div>
  );
}