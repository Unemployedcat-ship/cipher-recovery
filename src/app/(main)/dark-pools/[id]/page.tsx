'use client';

import { useState } from 'react';
import Link from 'next/link';
import TradingChart from '@/components/TradingChart';
import { 
  ArrowLeft, Lock, ShieldCheck, Zap, TrendingUp, 
  Droplets, RefreshCcw, Copy, Check, Globe, AtSign, Send, 
  Users, Activity, Wallet, Clock, ArrowUpRight, ArrowDownRight, 
  BarChart3
} from 'lucide-react';

export default function DarkPoolDetailPage() {
  const [panelMode, setPanelMode] = useState<'bid' | 'liquidity' | 'holders'>('bid');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const mockAddress = "7GEi...q9q7W";

  const handleCopy = () => {
    navigator.clipboard.writeText("7GEibaWAAFwANcfSaCfGwpLocKcEfrnhpxK2cwRp9q7W");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mockHolders = [
    { address: '0x1A2b...3C4d', balance: '12,500,000', percentage: '1.25%', pnl: '+124.5%', isUp: true },
    { address: '0x9F8e...7D6c', balance: '8,200,000', percentage: '0.82%', pnl: '-12.3%', isUp: false },
    { address: '0x5B4a...1E2f', balance: '5,100,000', percentage: '0.51%', pnl: '+45.0%', isUp: true },
    { address: '0x7C6b...5A4d', balance: '3,400,000', percentage: '0.34%', pnl: '+8.2%', isUp: true },
    { address: '0x3D2c...9B8a', balance: '2,100,000', percentage: '0.21%', pnl: '-5.4%', isUp: false },
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 lg:p-6 flex flex-col gap-6 font-mono text-zinc-300 bg-[#050505]">
      
      {/* Back Button & Top Header */}
      <div className="flex items-center gap-4 shrink-0">
        <Link href="/dark-pools" className="h-10 w-10 border border-zinc-800 bg-[#09090B] flex items-center justify-center rounded-sm hover:border-[#00FF41] hover:text-[#00FF41] transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-[#00FF41] font-black">
          <Lock className="h-3 w-3" /> FHE SEALED-BID POOL
        </div>
      </div>

      {/* Token Header */}
      <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-6 relative overflow-hidden flex flex-col md:flex-row gap-6 justify-between items-start md:items-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-0 w-1/4 h-[2px] bg-gradient-to-r from-[#00FF41] to-transparent"></div>
        
        <div className="flex items-center gap-6 z-10">
          {/* Token Image - PERFECT CIRCLE */}
          <div className="w-24 h-24 shrink-0 rounded-full bg-[#111116] border-[3px] border-[#00FF41] flex items-center justify-center text-3xl font-black text-[#00FF41] shadow-[0_0_30px_rgba(0,255,65,0.2)]">
            UC
          </div>
          
          <div className="max-w-md">
            <h1 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-3">
              UNEMPLOYED CAT <span className="text-sm text-zinc-500 font-mono font-normal">($UCAT)</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              The first anti-snipe memecoin on Solana. Fair launch, no presale, LP burned. Built by degens, for degens.
            </p>
            <div className="flex items-center gap-4 mt-3">
              <a href="#" className="text-zinc-500 hover:text-[#00FF41] transition-colors"><Globe size={16} /></a>
              <a href="#" className="text-zinc-500 hover:text-[#00FF41] transition-colors"><AtSign size={16} /></a>
              <a href="#" className="text-zinc-500 hover:text-[#00FF41] transition-colors"><Send size={16} /></a>
            </div>
          </div>
        </div>

        <div className="z-10 bg-[#050505] border border-zinc-800 p-3 rounded-sm flex items-center gap-4 w-full md:w-auto">
          <div>
            <div className="text-[9px] text-zinc-500 font-black tracking-widest">CONTRACT ADDRESS</div>
            <div className="text-sm text-white font-mono">{mockAddress}</div>
          </div>
          <button onClick={handleCopy} className="h-8 w-8 flex items-center justify-center bg-[#111116] border border-zinc-700 rounded-sm hover:border-[#00FF41] hover:text-[#00FF41] transition-colors">
            {copied ? <Check size={14} className="text-[#00FF41]"/> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* 6-Stat Data Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'MARKET CAP', value: '$1,200,000', icon: BarChart3, color: 'text-white' },
          { label: 'LIQUIDITY', value: '$420,000', icon: Droplets, color: 'text-cyan-400' },
          { label: 'VOLUME (24H)', value: '$850,000', icon: Activity, color: 'text-[#00FF41]' },
          { label: 'HOLDERS', value: '1,420', icon: Users, color: 'text-white' },
          { label: 'TOTAL SUPPLY', value: '1,000,000,000', icon: Wallet, color: 'text-zinc-400' },
          { label: 'AGE', value: '2d 4h 12m', icon: Clock, color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="border border-zinc-800 bg-[#09090B] p-3 rounded-sm flex flex-col justify-center">
            <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1 mb-1">
              <stat.icon size={10} /> {stat.label}
            </div>
            <div className={`text-sm font-black ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left Column */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-6 relative flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)] min-h-[450px]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[10px] text-zinc-500 font-black tracking-widest">PRICE DISCOVERY (LIVE)</div>
                <div className="text-3xl font-black text-white mt-1 flex items-baseline gap-2">
                  $0.0420 <span className="text-xs text-[#00FF41] bg-[#00FF41]/10 px-1 rounded flex items-center"><TrendingUp size={10}/> +840%</span>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full min-h-[300px]">
              <TradingChart />
            </div>
          </div>

          <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-5 flex flex-col gap-3">
            <div className="flex justify-between text-[10px] font-black tracking-widest">
              <span className="text-[#00FF41] flex items-center gap-1"><ArrowUpRight size={12}/> BUYS (65%)</span>
              <span className="text-zinc-500">TRANSACTION FAVOR</span>
              <span className="text-red-400 flex items-center gap-1">SELLS (35%) <ArrowDownRight size={12}/></span>
            </div>
            <div className="h-3 w-full bg-[#111116] rounded-full overflow-hidden flex">
              <div className="h-full bg-[#00FF41]" style={{ width: '65%' }}></div>
              <div className="h-full bg-red-500" style={{ width: '35%' }}></div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-1 border border-zinc-800 bg-[#09090B] rounded-sm flex flex-col overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] h-[500px]">
          <div className="grid grid-cols-3 border-b border-zinc-800 shrink-0">
            <button onClick={() => setPanelMode('bid')} className={`py-3 text-[9px] font-black uppercase tracking-widest transition-colors ${panelMode === 'bid' ? 'bg-[#111116] text-[#00FF41] border-b-2 border-[#00FF41]' : 'bg-[#050505] text-zinc-500 hover:text-white'}`}>
              <Zap size={12} className="inline mr-1"/> BID
            </button>
            <button onClick={() => setPanelMode('liquidity')} className={`py-3 text-[9px] font-black uppercase tracking-widest transition-colors ${panelMode === 'liquidity' ? 'bg-[#111116] text-[#00FF41] border-b-2 border-[#00FF41]' : 'bg-[#050505] text-zinc-500 hover:text-white'}`}>
              <Droplets size={12} className="inline mr-1"/> LIQ
            </button>
            <button onClick={() => setPanelMode('holders')} className={`py-3 text-[9px] font-black uppercase tracking-widest transition-colors ${panelMode === 'holders' ? 'bg-[#111116] text-[#00FF41] border-b-2 border-[#00FF41]' : 'bg-[#050505] text-zinc-500 hover:text-white'}`}>
              <Users size={12} className="inline mr-1"/> HOLDERS
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
            {panelMode === 'bid' && (
              <>
                <div className="bg-[#111116] border border-zinc-800 rounded-sm p-3 text-[11px] text-zinc-400 leading-relaxed relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00FF41]"></div>
                  Your bid is encrypted with FHE. Snipers cannot see your amount.
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-black tracking-widest mb-1 block">BID AMOUNT (SOL)</label>
                  <div className="relative">
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-[#050505] border border-zinc-800 rounded-sm px-4 py-3 text-lg font-black text-white focus:outline-none focus:border-[#00FF41] transition-all" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-[#00FF41]">SOL</span>
                  </div>
                </div>
                <button className="w-full rounded-sm bg-[#00FF41] py-3 text-[10px] font-black text-black hover:bg-[#00e03a] transition-all flex items-center justify-center gap-2 mt-auto">
                  <Lock size={14} /> ENCRYPT & BID
                </button>
              </>
            )}

            {panelMode === 'liquidity' && (
              <>
                <div className="bg-[#111116] border border-[#00FF41]/30 rounded-sm p-3 text-[11px] text-zinc-400 leading-relaxed relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00FF41]"></div>
                  Add liquidity. 100% of LP tokens are instantly burned.
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-black tracking-widest mb-1 block">ADD LIQUIDITY (SOL)</label>
                  <div className="relative">
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-[#050505] border border-zinc-800 rounded-sm px-4 py-3 text-lg font-black text-white focus:outline-none focus:border-[#00FF41] transition-all" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-[#00FF41]">SOL</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-500 bg-[#050505] p-2 border border-zinc-800 rounded-sm">
                  <span className="flex items-center gap-1"><RefreshCcw size={10}/> LP Status</span>
                  <span className="text-[#00FF41] flex items-center gap-1"><ShieldCheck size={10}/> AUTO-BURN</span>
                </div>
                <button className="w-full rounded-sm bg-[#00FF41] py-3 text-[10px] font-black text-black hover:bg-[#00e03a] transition-all flex items-center justify-center gap-2 mt-auto">
                  <Droplets size={14} /> ADD & BURN LP
                </button>
              </>
            )}

            {panelMode === 'holders' && (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-3 text-[9px] text-zinc-500 font-black tracking-widest border-b border-zinc-800 pb-2 mb-2">
                  <span>ADDRESS</span>
                  <span className="text-right">BALANCE</span>
                  <span className="text-right">PNL</span>
                </div>
                {mockHolders.map((holder, i) => (
                  <div key={i} className="grid grid-cols-3 text-[11px] items-center py-1.5 border-b border-zinc-800/30">
                    <span className="text-zinc-400 font-mono">{holder.address}</span>
                    <span className="text-right text-zinc-300 font-mono">{holder.balance}</span>
                    <span className={`text-right font-black ${holder.isUp ? 'text-[#00FF41]' : 'text-red-400'}`}>
                      {holder.pnl}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
