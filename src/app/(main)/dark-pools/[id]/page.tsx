'use client';

import { useState } from 'react';
import Link from 'next/link';
import TradingChart from '@/components/TradingChart';
import { ArrowLeft, Lock, ShieldCheck, Zap, AlertTriangle, TrendingUp, Droplets, RefreshCcw } from 'lucide-react';

export default function DarkPoolDetailPage() {
  const [panelMode, setPanelMode] = useState<'bid' | 'liquidity'>('bid');
  const [amount, setAmount] = useState('');

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 lg:p-6 flex flex-col gap-6 font-mono text-zinc-300 bg-[#050505]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-4 shrink-0 gap-4 relative">
        <div className="absolute bottom-0 left-0 w-1/4 h-[2px] bg-gradient-to-r from-[#00FF41] to-transparent"></div>
        <div className="flex items-center gap-4">
          <Link href="/dark-pools" className="h-10 w-10 border border-zinc-800 bg-[#09090B] flex items-center justify-center rounded-sm hover:border-[#00FF41] hover:text-[#00FF41] transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-[#00FF41] mb-1 font-black">
              <Lock className="h-3 w-3" /> FHE SEALED-BID POOL
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase flex items-center gap-3">
              UNEMPLOYED CAT <span className="text-sm text-zinc-500 font-mono">($UCAT)</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-[10px] font-bold">
          <div className="flex flex-col border-l border-zinc-700 pl-4"><span className="text-zinc-500">GRAD TARGET</span><span className="text-white text-sm">2.0 SOL</span></div>
          <div className="flex flex-col border-l border-zinc-700 pl-4"><span className="text-zinc-500">TOTAL RAISED</span><span className="text-[#00FF41] text-sm">0.84 SOL</span></div>
          <div className="flex flex-col border-l border-zinc-700 pl-4"><span className="text-zinc-500">TIME LEFT</span><span className="text-amber-500 text-sm">04d 12h 30m</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Live Chart */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-6 relative flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)] min-h-[500px]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[10px] text-zinc-500 font-black tracking-widest">PRICE DISCOVERY (LIVE)</div>
                <div className="text-3xl font-black text-white mt-1 flex items-baseline gap-2">
                  $0.0420 <span className="text-xs text-[#00FF41] bg-[#00FF41]/10 px-1 rounded flex items-center"><TrendingUp size={10}/> +840%</span>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full min-h-[350px]">
              <TradingChart />
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Panel */}
        <div className="xl:col-span-1 border border-zinc-800 bg-[#09090B] rounded-sm flex flex-col overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 border-b border-zinc-800">
            <button 
              onClick={() => setPanelMode('bid')}
              className={`py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${panelMode === 'bid' ? 'bg-[#111116] text-[#00FF41] border-b-2 border-[#00FF41]' : 'bg-[#050505] text-zinc-500 hover:text-white'}`}
            >
              <Zap size={14} className="inline mr-2"/> Sealed Bid
            </button>
            <button 
              onClick={() => setPanelMode('liquidity')}
              className={`py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${panelMode === 'liquidity' ? 'bg-[#111116] text-[#00FF41] border-b-2 border-[#00FF41]' : 'bg-[#050505] text-zinc-500 hover:text-white'}`}
            >
              <Droplets size={14} className="inline mr-2"/> Liquidity
            </button>
          </div>
          
          <div className="p-6 flex flex-col gap-6">
            
            {panelMode === 'bid' ? (
              <>
                <div className="bg-[#111116] border border-zinc-800 rounded-sm p-4 text-xs text-zinc-400 leading-relaxed relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00FF41]"></div>
                  Your bid amount is encrypted using Fully Homomorphic Encryption. No one (not even the dev) can see your bid until the pool settles.
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 font-black tracking-widest">BID AMOUNT (SOL)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00" 
                      className="w-full bg-[#050505] border border-zinc-800 rounded-sm px-4 py-4 text-xl font-black text-white focus:outline-none focus:border-[#00FF41] focus:shadow-[0_0_15px_rgba(0,255,65,0.15)] transition-all" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-[#00FF41]">SOL</span>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-zinc-400 bg-[#050505] p-3 border border-zinc-800 rounded-sm">
                  <span>Est. Tokens</span>
                  <span className="font-bold text-white">--- $UCAT</span>
                </div>

                <button className="w-full rounded-sm bg-[#00FF41] px-6 py-4 text-xs font-black text-black hover:bg-[#00e03a] transition-all duration-200 flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                  <Lock size={16} className="group-hover:animate-bounce" /> ENCRYPT & SUBMIT BID
                </button>

                <div className="flex items-center justify-center gap-2 text-[9px] text-zinc-500 font-bold tracking-widest uppercase mt-2">
                   <AlertTriangle size={12} className="text-amber-500"/> Bids are final. No refunds if target is hit.
                </div>
              </>
            ) : (
              <>
                <div className="bg-[#111116] border border-[#00FF41]/30 rounded-sm p-4 text-xs text-zinc-400 leading-relaxed relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00FF41]"></div>
                  Anyone can add liquidity to this pool once trading is live. <strong className="text-[#00FF41]">100% of the LP tokens are instantly burned</strong>, guaranteeing the liquidity can never be rugged.
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 font-black tracking-widest">LIQUIDITY TO ADD (SOL)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00" 
                      className="w-full bg-[#050505] border border-zinc-800 rounded-sm px-4 py-4 text-xl font-black text-white focus:outline-none focus:border-[#00FF41] focus:shadow-[0_0_15px_rgba(0,255,65,0.15)] transition-all" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-[#00FF41]">SOL</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold bg-[#050505] p-3 border border-zinc-800 rounded-sm">
                  <span className="flex items-center gap-1"><RefreshCcw size={12}/> LP Status</span>
                  <span className="text-[#00FF41] bg-[#00FF41]/10 px-2 py-0.5 rounded flex items-center gap-1"><ShieldCheck size={12}/> AUTO-BURN</span>
                </div>

                <button className="w-full rounded-sm bg-[#00FF41] px-6 py-4 text-xs font-black text-black hover:bg-[#00e03a] transition-all duration-200 flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                  <Droplets size={16} className="group-hover:animate-bounce" /> ADD & BURN LP
                </button>

                <div className="flex items-center justify-center gap-2 text-[9px] text-zinc-500 font-bold tracking-widest uppercase mt-2">
                   <ShieldCheck size={12} className="text-[#00FF41]"/> Anti-Rug Protection Enabled.
                </div>
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
