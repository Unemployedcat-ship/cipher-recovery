'use client';

import { useState } from 'react';
import Link from 'next/link';
import PortfolioChart from '@/components/PortfolioChart';
import { 
  Wallet, ShieldCheck, ArrowUpRight, Activity, TrendingUp, 
  Droplets, BarChart3, Download, RefreshCcw, Landmark, 
  ExternalLink, Zap, Clock, ArrowDownRight
} from 'lucide-react';

export default function VaultPage() {
  const [activeTab, setActiveTab] = useState<'launches' | 'positions'>('launches');

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 lg:p-6 flex flex-col gap-6 font-mono text-zinc-300 bg-[#050505]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-6 gap-4 relative">
        <div className="absolute bottom-0 left-0 w-1/4 h-[2px] bg-gradient-to-r from-[#00FF41] to-transparent"></div>
        <div>
          <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-[#00FF41] mb-2 font-black">
            <ShieldCheck className="h-3 w-3" /> PORTFOLIO MANAGER
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            SECURE VAULT
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="rounded-sm border border-zinc-800 bg-[#09090B] px-4 py-2 text-xs font-black text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
            <Download size={14} /> EXPORT
          </button>
          <button className="rounded-sm bg-[#00FF41] px-6 py-2 text-xs font-black text-black hover:bg-[#00e03a] transition-all shadow-[0_0_20px_rgba(0,255,65,0.2)] flex items-center gap-2">
            <Wallet size={14} /> DEPOSIT
          </button>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden group">
          <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1 mb-1">
            <Wallet size={10} /> AVAILABLE BALANCE
          </div>
          <div className="text-2xl font-black text-white">0.000 SOL</div>
          <div className="mt-2 text-[10px] text-zinc-500 flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-[#00FF41] rounded-full animate-pulse"></span> Connected to Devnet
          </div>
        </div>

        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden group">
          <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1 mb-1">
            <Activity size={10} /> TOTAL INVESTED
          </div>
          <div className="text-2xl font-black text-white">0.00 SOL</div>
          <div className="mt-2 text-[10px] text-zinc-500">
            Across 0 active pools
          </div>
        </div>

        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden group">
          <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1 mb-1">
            <BarChart3 size={10} /> PORTFOLIO VALUE
          </div>
          <div className="text-2xl font-black text-[#00FF41]">$0.00</div>
          <div className="mt-2 text-[10px] text-zinc-500">
            Last updated: Just now
          </div>
        </div>

        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden group">
          <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1 mb-1">
            <TrendingUp size={10} /> UNREALIZED PNL
          </div>
          <div className="text-2xl font-black text-zinc-500">$0.00 <span className="text-sm">(0.0%)</span></div>
          <div className="mt-2 text-[10px] text-zinc-500">
            No positions yet
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Chart & Table */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Portfolio Performance Chart */}
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-5 relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-[10px] text-zinc-500 font-black tracking-widest">PORTFOLIO PERFORMANCE</div>
                <div className="text-2xl font-black text-white mt-1">$0.00</div>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 px-2 py-1 rounded-sm cursor-pointer font-bold">1W</span>
                <span className="text-[10px] bg-[#050505] text-zinc-500 border border-zinc-800 px-2 py-1 rounded-sm cursor-pointer hover:text-white transition-colors">1M</span>
                <span className="text-[10px] bg-[#050505] text-zinc-500 border border-zinc-800 px-2 py-1 rounded-sm cursor-pointer hover:text-white transition-colors">ALL</span>
              </div>
            </div>
            <div className="h-48 w-full">
              <PortfolioChart />
            </div>
          </div>

          {/* Asset Table */}
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm flex flex-col overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="flex border-b border-zinc-800 bg-[#050505]">
              <button 
                onClick={() => setActiveTab('launches')}
                className={`px-6 py-3 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'launches' ? 'border-[#00FF41] text-white bg-[#111116]' : 'border-transparent text-zinc-500 hover:text-white'}`}
              >
                <Activity size={14} /> MY LAUNCHES (0)
              </button>
              <button 
                onClick={() => setActiveTab('positions')}
                className={`px-6 py-3 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'positions' ? 'border-[#00FF41] text-white bg-[#111116]' : 'border-transparent text-zinc-500 hover:text-white'}`}
              >
                <TrendingUp size={14} /> MY POSITIONS (0)
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="h-16 w-16 bg-[#111116] border border-zinc-800 rounded-full flex items-center justify-center mb-4">
                {activeTab === 'launches' ? <Droplets className="h-8 w-8 text-zinc-600" /> : <BarChart3 className="h-8 w-8 text-zinc-600" />}
              </div>
              <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wider">
                {activeTab === 'launches' ? 'No Tokens Launched' : 'No Active Positions'}
              </h3>
              <p className="text-xs text-zinc-500 mb-6 max-w-sm">
                {activeTab === 'launches' 
                  ? 'Initialize a protocol to see your tokens here.' 
                  : 'Explore the dark pools to place your first bid.'}
              </p>
              <Link href={activeTab === 'launches' ? '/launch' : '/dark-pools'} className="rounded-sm border border-[#00FF41] bg-[#00FF41]/10 px-6 py-2 text-xs font-black text-[#00FF41] hover:bg-[#00FF41]/20 transition-all flex items-center gap-2">
                {activeTab === 'launches' ? 'LAUNCH TOKEN' : 'EXPLORE POOLS'} <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* Asset Allocation */}
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <h2 className="text-[10px] font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
              <Landmark size={12} className="text-[#00FF41]"/> ASSET ALLOCATION
            </h2>
            
            <div className="flex items-center justify-center h-40 mb-6 relative">
               <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
                 <circle cx="50" cy="50" r="40" fill="transparent" stroke="#27272a" strokeWidth="8" />
                 <circle cx="50" cy="50" r="40" fill="transparent" stroke="#00FF41" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="0" className="transition-all duration-1000" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <div className="text-[10px] text-zinc-500">TOTAL</div>
                 <div className="text-lg font-black text-white">$0.00</div>
               </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 text-zinc-400"><span className="h-2 w-2 bg-[#00FF41] rounded-sm"></span> SOL</span>
                <span className="text-white font-mono">100%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 text-zinc-400"><span className="h-2 w-2 bg-[#FF00FF] rounded-sm"></span> Tokens</span>
                <span className="text-white font-mono">0%</span>
              </div>
            </div>
          </div>

          {/* Recent Activity (Mock) */}
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <h2 className="text-[10px] font-black text-white mb-4 uppercase tracking-widest flex items-center gap-2">
              <Clock size={12} className="text-zinc-400"/> RECENT ACTIVITY
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-sm bg-[#00FF41]/10 border border-[#00FF41]/30 flex items-center justify-center text-[#00FF41]"><ArrowDownRight size={14}/></div>
                  <div>
                    <div className="text-xs font-bold text-white">Deposited SOL</div>
                    <div className="text-[10px] text-zinc-500">Today at 10:42 AM</div>
                  </div>
                </div>
                <div className="text-xs font-mono text-white">+0.00</div>
              </div>
              
              <div className="flex justify-between items-start opacity-50">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-sm bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400"><Zap size={14}/></div>
                  <div>
                    <div className="text-xs font-bold text-white">Bid Placed</div>
                    <div className="text-[10px] text-zinc-500">Yesterday</div>
                  </div>
                </div>
                <div className="text-xs font-mono text-white">-0.00</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
