'use client';

import { useState } from 'react';
import Link from 'next/link';
import PortfolioChart from '@/components/PortfolioChart';
import { 
  Wallet, ShieldCheck, ArrowUpRight, Activity, TrendingUp, 
  Droplets, BarChart3, Download, RefreshCcw, Landmark, 
  Zap, Clock, ArrowDownRight, ArrowUpRightSquare, Flame
} from 'lucide-react';

export default function VaultPage() {
  const [activeTab, setActiveTab] = useState<'launches' | 'positions'>('launches');

  // Mock data to make the page feel alive
  const mockPortfolioValue = 1337.12;
  const mockPnl = 337.12;
  const mockPnlPercent = 33.71;

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
            <span className="h-1.5 w-1.5 bg-[#00FF41] rounded-full animate-pulse"></span> Devnet Connected
          </div>
        </div>

        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden group">
          <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1 mb-1">
            <Activity size={10} /> TOTAL INVESTED
          </div>
          <div className="text-2xl font-black text-white">1.00 SOL</div>
          <div className="mt-2 text-[10px] text-zinc-500">
            Across 3 active pools
          </div>
        </div>

        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden group">
          <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1 mb-1">
            <BarChart3 size={10} /> PORTFOLIO VALUE
          </div>
          <div className="text-2xl font-black text-[#00FF41]">${mockPortfolioValue.toLocaleString()}</div>
          <div className="mt-2 text-[10px] text-zinc-500">
            Updated 12s ago
          </div>
        </div>

        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden group">
          <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1 mb-1">
            <TrendingUp size={10} /> UNREALIZED PNL
          </div>
          <div className="text-2xl font-black text-[#00FF41] flex items-center gap-2">
            +${mockPnl.toLocaleString()} <span className="text-sm">({mockPnlPercent}%)</span>
          </div>
          <div className="mt-2 text-[10px] text-zinc-500">
            Since inception
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
                <div className="text-2xl font-black text-white mt-1">${mockPortfolioValue.toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 px-3 py-1.5 rounded-sm cursor-pointer font-bold">1W</span>
                <span className="text-[10px] bg-[#050505] text-zinc-500 border border-zinc-800 px-3 py-1.5 rounded-sm cursor-pointer hover:text-white transition-colors">1M</span>
                <span className="text-[10px] bg-[#050505] text-zinc-500 border border-zinc-800 px-3 py-1.5 rounded-sm cursor-pointer hover:text-white transition-colors">ALL</span>
              </div>
            </div>
            <div className="h-56 w-full">
              <PortfolioChart />
            </div>
          </div>

          {/* Asset Table */}
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm flex flex-col overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="flex border-b border-zinc-800 bg-[#050505]">
              <button 
                onClick={() => setActiveTab('launches')}
                className={`px-6 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'launches' ? 'border-[#00FF41] text-white bg-[#111116]' : 'border-transparent text-zinc-500 hover:text-white'}`}
              >
                <Activity size={14} /> MY LAUNCHES (1)
              </button>
              <button 
                onClick={() => setActiveTab('positions')}
                className={`px-6 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'positions' ? 'border-[#00FF41] text-white bg-[#111116]' : 'border-transparent text-zinc-500 hover:text-white'}`}
              >
                <TrendingUp size={14} /> MY POSITIONS (2)
              </button>
            </div>

            {activeTab === 'launches' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {/* Mock Launched Token Card */}
                <Link href="/dark-pools/1" className="group border border-zinc-800 bg-[#050505] rounded-sm p-4 hover:border-[#00FF41]/50 transition-all block relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-[#111116] border border-zinc-700 flex items-center justify-center font-black text-[#00FF41] rounded-md">UC</div>
                    <div>
                      <div className="font-bold text-white text-sm">Unemployed Cat</div>
                      <div className="text-[10px] text-zinc-500 font-mono">$UCAT</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-[8px] font-black px-2 py-1 rounded bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30">LIVE</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-t border-zinc-800/80 pt-3">
                    <div><div className="text-[8px] text-zinc-600 font-black tracking-widest mb-0.5">BALANCE</div><div className="text-[11px] font-bold text-white">1,250,000</div></div>
                    <div className="text-right"><div className="text-[8px] text-zinc-600 font-black tracking-widest mb-0.5">VALUE</div><div className="text-[11px] font-bold text-[#00FF41]">$450.00</div></div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="h-16 w-16 bg-[#111116] border border-zinc-800 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-zinc-600" />
                </div>
                <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wider">No Active Positions</h3>
                <p className="text-xs text-zinc-500 mb-6 max-w-sm">You don't have any active bids or positions in the dark pools.</p>
                <Link href="/dark-pools" className="rounded-sm border border-[#00FF41] bg-[#00FF41]/10 px-6 py-2 text-xs font-black text-[#00FF41] hover:bg-[#00FF41]/20 transition-all flex items-center gap-2">
                  EXPLORE POOLS <ArrowUpRight size={14} />
                </Link>
              </div>
            )}
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
                 <circle cx="50" cy="50" r="40" fill="transparent" stroke="#00FF41" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="60" className="transition-all duration-1000" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <div className="text-[10px] text-zinc-500">TOTAL</div>
                 <div className="text-lg font-black text-white">$1,337</div>
               </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 text-zinc-400"><span className="h-2 w-2 bg-[#00FF41] rounded-sm"></span> SOL</span>
                <span className="text-white font-mono">76%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 text-zinc-400"><span className="h-2 w-2 bg-[#FF00FF] rounded-sm"></span> Tokens</span>
                <span className="text-white font-mono">24%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <h2 className="text-[10px] font-black text-white mb-4 uppercase tracking-widest flex items-center gap-2">
              <Zap size={12} className="text-[#00FF41]"/> QUICK ACTIONS
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex flex-col items-center justify-center p-3 border border-zinc-800 rounded-sm hover:border-[#00FF41]/50 hover:bg-[#00FF41]/5 transition-all group">
                <ArrowDownRight size={16} className="text-zinc-500 group-hover:text-[#00FF41] mb-1" />
                <span className="text-[10px] font-bold text-zinc-300 group-hover:text-white">DEPOSIT</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 border border-zinc-800 rounded-sm hover:border-[#00FF41]/50 hover:bg-[#00FF41]/5 transition-all group">
                <ArrowUpRight size={16} className="text-zinc-500 group-hover:text-[#00FF41] mb-1" />
                <span className="text-[10px] font-bold text-zinc-300 group-hover:text-white">WITHDRAW</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 border border-zinc-800 rounded-sm hover:border-[#00FF41]/50 hover:bg-[#00FF41]/5 transition-all group">
                <Flame size={16} className="text-zinc-500 group-hover:text-[#00FF41] mb-1" />
                <span className="text-[10px] font-bold text-zinc-300 group-hover:text-white">BURN LP</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 border border-zinc-800 rounded-sm hover:border-[#00FF41]/50 hover:bg-[#00FF41]/5 transition-all group">
                <RefreshCcw size={16} className="text-zinc-500 group-hover:text-[#00FF41] mb-1" />
                <span className="text-[10px] font-bold text-zinc-300 group-hover:text-white">BRIDGE</span>
              </button>
            </div>
          </div>

          {/* Recent Activity Ledger */}
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Clock size={12} className="text-zinc-400"/> RECENT ACTIVITY
              </h2>
              <span className="text-[9px] text-[#00FF41] hover:underline cursor-pointer">VIEW ALL</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center group cursor-pointer">
                <div className="flex gap-3 items-center">
                  <div className="h-8 w-8 rounded-sm bg-[#00FF41]/10 border border-[#00FF41]/30 flex items-center justify-center text-[#00FF41]"><ArrowDownRight size={14}/></div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-[#00FF41] transition-colors">Deposited SOL</div>
                    <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1"><Clock size={8}/> 2 hrs ago</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-white">+0.50</div>
                  <div className="text-[9px] text-[#00FF41] font-mono">SUCCESS</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center group cursor-pointer">
                <div className="flex gap-3 items-center">
                  <div className="h-8 w-8 rounded-sm bg-[#FF00FF]/10 border border-[#FF00FF]/30 flex items-center justify-center text-[#FF00FF]"><Zap size={14}/></div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-[#FF00FF] transition-colors">Bid Placed</div>
                    <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1"><Clock size={8}/> Yesterday</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-white">-0.10</div>
                  <div className="text-[9px] text-[#00FF41] font-mono">SUCCESS</div>
                </div>
              </div>

              <div className="flex justify-between items-center group cursor-pointer opacity-60">
                <div className="flex gap-3 items-center">
                  <div className="h-8 w-8 rounded-sm bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400"><ArrowUpRightSquare size={14}/></div>
                  <div>
                    <div className="text-xs font-bold text-white">Token Launched</div>
                    <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1"><Clock size={8}/> 2 days ago</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-white">0.02</div>
                  <div className="text-[9px] text-zinc-500 font-mono">FEE</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
