'use client';
import { Activity, TrendingUp, Zap, ArrowUpRight, BarChart3, ChevronRight, ArrowDownRight, List } from 'lucide-react';
import Link from 'next/link';
import TradingChart from '@/components/TradingChart';

export default function TerminalPage() {
  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 lg:p-6 flex flex-col gap-6 font-mono text-zinc-300 bg-[#050505]">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden gap-4 shrink-0">
        <div className="absolute top-0 left-0 w-1/4 h-[2px] bg-gradient-to-r from-[#00FF41] to-transparent"></div>
        <div>
          <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-[#00FF41] mb-1 font-black">
            <Activity className="h-3 w-3" /> GLOBAL ECOSYSTEM METRICS
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            TRADING DESK
            <span className="text-[9px] bg-[#00FF41]/10 text-[#00FF41] px-2 py-0.5 rounded border border-[#00FF41]/30">LIVE_DATA</span>
          </h1>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-bold">
          <div className="flex flex-col border-l border-zinc-700 pl-4"><span className="text-zinc-500">24H VOLUME</span><span className="text-white text-sm">$1.2M</span></div>
          <div className="flex flex-col border-l border-zinc-700 pl-4"><span className="text-zinc-500">ACTIVE POOLS</span><span className="text-[#00FF41] text-sm">42</span></div>
          <div className="flex flex-col border-l border-zinc-700 pl-4"><span className="text-zinc-500">TOP GAINER</span><span className="text-[#00FF41] text-sm">+124%</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Chart & Table */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Live Chart Box */}
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-6 relative flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)] min-h-[400px]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[10px] text-zinc-500 font-black tracking-widest">TOTAL PROTOCOL VOLUME (ALL TIME)</div>
                <div className="text-3xl font-black text-white mt-1 flex items-baseline gap-2">
                  $4,209,690.00 <span className="text-xs text-[#00FF41] bg-[#00FF41]/10 px-1 rounded flex items-center"><ArrowUpRight size={10}/> 12.4%</span>
                </div>
              </div>
            </div>
            
            {/* The Live Chart Component */}
            <div className="flex-1 w-full min-h-[300px]">
              <TradingChart />
            </div>
          </div>

          {/* Top Gainers Table */}
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-[#050505]">
              <h2 className="text-xs font-black text-white flex items-center gap-2 uppercase tracking-widest"><TrendingUp size={14} className="text-[#00FF41]"/> TOP GAINERS</h2>
              <Link href="/dark-pools" className="text-[9px] text-[#00FF41] border border-[#00FF41]/30 bg-[#00FF41]/10 px-2 py-1 rounded hover:bg-[#00FF41]/20 transition-colors flex items-center gap-1">
                VIEW ALL <ChevronRight size={10}/>
              </Link>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="text-[9px] text-zinc-500 border-b border-zinc-800 bg-[#09090B]">
                <tr>
                  <th className="px-4 py-3 font-normal">ASSET</th>
                  <th className="px-4 py-3 font-normal">PRICE</th>
                  <th className="px-4 py-3 font-normal text-right">24H CHANGE</th>
                  <th className="px-4 py-3 font-normal text-right">VOLUME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {[
                  { name: 'Unemployed Cat', sym: 'UCAT', price: '$0.0420', change: '+840%', vol: '$420K' },
                  { name: 'FairDegens', sym: 'FAIR', price: '$0.0125', change: '+124%', vol: '$1.2M' },
                  { name: 'Doge Killer', sym: 'DOGEK', price: '$0.0084', change: '+68%', vol: '$890K' },
                ].map((token, i) => (
                  <tr key={i} className="hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="h-6 w-6 bg-zinc-800 border border-zinc-700 text-[8px] flex items-center justify-center font-bold text-zinc-400 group-hover:text-[#00FF41] group-hover:border-[#00FF41] transition-colors rounded-sm">
                        {token.sym.slice(0,2)}
                      </div>
                      <div>
                        <div className="font-bold text-zinc-200">{token.name}</div>
                        <div className="text-[9px] text-zinc-500 font-mono">{token.sym}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 font-mono">{token.price}</td>
                    <td className="px-4 py-3 text-right text-[#00FF41] font-bold font-mono flex items-center justify-end gap-1">
                       <ArrowUpRight size={12}/> {token.change}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-400 font-mono">{token.vol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column: Live Tape & Order Book */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* Live Tape */}
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm flex flex-col h-[300px] overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-[#050505] shrink-0">
              <h2 className="text-xs font-black text-white flex items-center gap-2 uppercase tracking-widest"><Zap size={14} className="text-[#FF00FF]"/> LIVE TAPE</h2>
              <div className="flex items-center gap-1 text-[9px] text-[#00FF41] bg-[#00FF41]/10 px-2 py-0.5 rounded border border-[#00FF41]/20">
                <div className="h-1.5 w-1.5 bg-[#00FF41] rounded-full animate-pulse"></div> CONNECTED
              </div>
            </div>
            
            <div className="grid grid-cols-4 text-[9px] text-zinc-500 border-b border-zinc-800 bg-[#09090B] px-4 py-2 font-black tracking-wider uppercase shrink-0">
              <div className="col-span-1">TIME</div>
              <div className="col-span-1">TYPE</div>
              <div className="col-span-1 text-right">PRICE</div>
              <div className="col-span-1 text-right">AMT</div>
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-[11px]">
              {[
                { time: '12:22:01', type: 'BUY', price: '0.000042', amt: '1.25', color: 'text-[#00FF41]', bg: 'bg-[#00FF41]/5' },
                { time: '12:21:55', type: 'SELL', price: '0.000041', amt: '0.50', color: 'text-red-400', bg: 'bg-red-500/5' },
                { time: '12:21:42', type: 'BUY', price: '0.000042', amt: '3.10', color: 'text-[#00FF41]', bg: 'bg-[#00FF41]/5' },
                { time: '12:21:30', type: 'BUY', price: '0.000040', amt: '0.15', color: 'text-[#00FF41]', bg: 'bg-[#00FF41]/5' },
                { time: '12:21:12', type: 'SELL', price: '0.000039', amt: '1.00', color: 'text-red-400', bg: 'bg-red-500/5' },
                { time: '12:20:58', type: 'BUY', price: '0.000041', amt: '5.00', color: 'text-[#00FF41]', bg: 'bg-[#00FF41]/5' },
              ].map((trade, i) => (
                <div key={i} className={`grid grid-cols-4 px-4 py-2 border-b border-zinc-800/30 hover:bg-zinc-800 transition-colors cursor-default ${trade.bg}`}>
                  <div className="col-span-1 text-zinc-500">{trade.time}</div>
                  <div className={`col-span-1 font-bold ${trade.color}`}>{trade.type}</div>
                  <div className="col-span-1 text-right text-zinc-300">{trade.price}</div>
                  <div className="col-span-1 text-right text-zinc-400">{trade.amt}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Book */}
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm flex flex-col h-[300px] overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
             <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-[#050505] shrink-0">
              <h2 className="text-xs font-black text-white flex items-center gap-2 uppercase tracking-widest"><List size={14} className="text-zinc-400"/> ORDER BOOK</h2>
            </div>
            
            <div className="flex-1 flex flex-col justify-center p-4">
               {/* Asks (Sells) */}
               <div className="space-y-1 mb-2">
                  {[0.000045, 0.000044, 0.000043].map((p, i) => (
                    <div key={i} className="flex justify-between text-[10px] font-mono relative py-0.5">
                       <div className="absolute right-0 top-0 h-full bg-red-500/10" style={{ width: `${Math.random() * 80 + 10}%` }}></div>
                       <span className="text-red-400 relative z-10">{p.toFixed(6)}</span>
                       <span className="text-zinc-400 relative z-10">{(Math.random() * 500).toFixed(0)}</span>
                    </div>
                  ))}
               </div>
               
               {/* Spread */}
               <div className="flex justify-between items-center py-2 border-y border-zinc-800 my-2">
                  <span className="text-sm font-black text-[#00FF41]">0.000042</span>
                  <span className="text-[9px] text-zinc-500 font-bold">SPREAD: 0.000001</span>
               </div>
               
               {/* Bids (Buys) */}
               <div className="space-y-1 mt-2">
                  {[0.000041, 0.000040, 0.000039].map((p, i) => (
                    <div key={i} className="flex justify-between text-[10px] font-mono relative py-0.5">
                       <div className="absolute right-0 top-0 h-full bg-[#00FF41]/10" style={{ width: `${Math.random() * 80 + 10}%` }}></div>
                       <span className="text-[#00FF41] relative z-10">{p.toFixed(6)}</span>
                       <span className="text-zinc-400 relative z-10">{(Math.random() * 500).toFixed(0)}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
