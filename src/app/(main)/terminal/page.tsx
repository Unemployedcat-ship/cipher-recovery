'use client';
import { Activity, TrendingUp, Zap, ArrowUpRight, ArrowDownRight, Clock, Terminal, Cpu, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function TerminalPage() {
  return (
    <div className="w-full min-h-full p-4 lg:p-6 flex flex-col gap-6 font-mono text-zinc-300 bg-[#050505]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-4 shrink-0 relative gap-4">
        <div className="absolute bottom-0 left-0 w-1/4 h-[2px] bg-gradient-to-r from-[#00FF41] to-transparent"></div>
        <div>
          <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-[#00FF41] mb-1 font-black">
            <Activity className="h-3 w-3" /> GLOBAL ECOSYSTEM METRICS
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            MARKET PULSE
            <span className="text-[9px] bg-[#00FF41]/10 text-[#00FF41] px-2 py-0.5 rounded border border-[#00FF41]/30">LIVE_DATA</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold bg-[#09090B] px-4 py-2 border border-zinc-800 rounded-sm">
          <div className="flex flex-col"><span className="text-zinc-500">24H VOLUME</span><span className="text-white text-sm">$1.2M</span></div>
          <div className="w-[1px] h-8 bg-zinc-800"></div>
          <div className="flex flex-col"><span className="text-zinc-500">ACTIVE POOLS</span><span className="text-[#00FF41] text-sm">42</span></div>
          <div className="w-[1px] h-8 bg-zinc-800"></div>
          <div className="flex flex-col"><span className="text-zinc-500">TOP GAINER</span><span className="text-[#00FF41] text-sm">+124%</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Main Chart & Trending Table */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Main Chart Box */}
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-6 relative flex-1 min-h-[350px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="text-[10px] text-zinc-500 font-black tracking-widest">TOTAL PROTOCOL VOLUME (ALL TIME)</div>
                <div className="text-3xl font-black text-white mt-1">$4,209,690.00</div>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 px-2 py-1 rounded-sm cursor-pointer font-bold">1H</span>
                <span className="text-[10px] bg-[#050505] text-zinc-500 border border-zinc-800 px-2 py-1 rounded-sm cursor-pointer hover:text-white transition-colors">1D</span>
                <span className="text-[10px] bg-[#050505] text-zinc-500 border border-zinc-800 px-2 py-1 rounded-sm cursor-pointer hover:text-white transition-colors">1W</span>
              </div>
            </div>
            
            {/* SVG Chart Area */}
            <div className="flex-1 relative border-l border-b border-zinc-800 flex">
              {/* Y-Axis Labels */}
              <div className="absolute -left-10 top-0 bottom-0 flex flex-col justify-between text-[9px] text-zinc-600 font-mono text-right pr-2">
                <span>$5M</span><span>$4M</span><span>$3M</span><span>$2M</span><span>$1M</span><span>$0</span>
              </div>
              
              {/* Chart Background Grid */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[1,2,3,4,5].map(i => <div key={i} className="w-full h-[1px] bg-zinc-800/30"></div>)}
              </div>
              <div className="absolute inset-0 flex justify-between">
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-full w-[1px] bg-zinc-800/30"></div>)}
              </div>

              {/* The Line */}
              <svg viewBox="0 0 100 50" className="w-full h-full preserve-3d relative z-10 mt-2">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00FF41" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00FF41" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area Fill */}
                <path d="M 0 45 Q 20 40, 30 25 T 60 35 T 80 10 T 100 5 L 100 50 L 0 50 Z" fill="url(#chartGradient)" />
                {/* Main Line */}
                <path d="M 0 45 Q 20 40, 30 25 T 60 35 T 80 10 T 100 5" fill="none" stroke="#00FF41" strokeWidth="1.5" className="drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]" />
                {/* Secondary Line (Mock Moving Average) */}
                <path d="M 0 48 Q 30 45, 50 30 T 100 15" fill="none" stroke="#FF00FF" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
              </svg>
            </div>
            
            {/* X-Axis Labels */}
            <div className="flex justify-between text-[9px] text-zinc-600 font-mono mt-2 pl-2">
              <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>24:00</span>
            </div>
          </div>

          {/* Trending Assets Table */}
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-[#050505]">
              <h2 className="text-xs font-black text-white flex items-center gap-2 uppercase tracking-widest"><TrendingUp size={14} className="text-[#00FF41]"/> TOP GAINERS</h2>
              <span className="text-[9px] text-[#00FF41] border border-[#00FF41]/30 bg-[#00FF41]/10 px-2 py-0.5 rounded cursor-pointer hover:bg-[#00FF41]/20">VIEW ALL</span>
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

        {/* Right Column: Live Trade Feed */}
        <div className="border border-zinc-800 bg-[#09090B] rounded-sm flex flex-col overflow-hidden h-full max-h-[850px]">
          
          {/* Feed Header */}
          <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-[#050505]">
            <h2 className="text-xs font-black text-white flex items-center gap-2 uppercase tracking-widest"><Zap size={14} className="text-[#FF00FF]"/> LIVE TAPE</h2>
            <div className="flex items-center gap-1 text-[9px] text-[#00FF41]">
              <div className="h-1.5 w-1.5 bg-[#00FF41] rounded-full animate-pulse"></div> CONNECTED
            </div>
          </div>
          
          {/* Table Header */}
          <div className="grid grid-cols-4 text-[9px] text-zinc-500 border-b border-zinc-800 bg-[#09090B] px-4 py-2 font-black tracking-wider uppercase">
            <div className="col-span-1">TIME</div>
            <div className="col-span-1">TYPE</div>
            <div className="col-span-1 text-right">PRICE</div>
            <div className="col-span-1 text-right">AMOUNT</div>
          </div>

          {/* Feed Body */}
          <div className="flex-1 overflow-y-auto font-mono text-[11px]">
            {/* Mock live data */}
            {[
              { time: '12:22:01', type: 'BUY', price: '0.000042', amt: '1.25 SOL', color: 'text-[#00FF41]' },
              { time: '12:21:55', type: 'SELL', price: '0.000041', amt: '0.50 SOL', color: 'text-red-400' },
              { time: '12:21:42', type: 'BUY', price: '0.000042', amt: '3.10 SOL', color: 'text-[#00FF41]' },
              { time: '12:21:30', type: 'BUY', price: '0.000040', amt: '0.15 SOL', color: 'text-[#00FF41]' },
              { time: '12:21:12', type: 'SELL', price: '0.000039', amt: '1.00 SOL', color: 'text-red-400' },
              { time: '12:20:58', type: 'BUY', price: '0.000041', amt: '5.00 SOL', color: 'text-[#00FF41]' },
              { time: '12:20:44', type: 'BUY', price: '0.000041', amt: '0.80 SOL', color: 'text-[#00FF41]' },
              { time: '12:20:31', type: 'SELL', price: '0.000038', amt: '2.50 SOL', color: 'text-red-400' },
              { time: '12:20:15', type: 'BUY', price: '0.000040', amt: '1.10 SOL', color: 'text-[#00FF41]' },
              { time: '12:20:02', type: 'BUY', price: '0.000040', amt: '0.20 SOL', color: 'text-[#00FF41]' },
            ].map((trade, i) => (
              <div key={i} className="grid grid-cols-4 px-4 py-2 border-b border-zinc-800/30 hover:bg-zinc-800/50 transition-colors cursor-default">
                <div className="col-span-1 text-zinc-500">{trade.time}</div>
                <div className={`col-span-1 font-bold ${trade.color}`}>{trade.type}</div>
                <div className="col-span-1 text-right text-zinc-300">{trade.price}</div>
                <div className="col-span-1 text-right text-zinc-400">{trade.amt}</div>
              </div>
            ))}
          </div>
          
          {/* Footer Action */}
          <div className="p-4 border-t border-zinc-800 bg-[#050505] shrink-0">
             <Link href="/launch" className="w-full rounded-sm border border-[#00FF41]/50 bg-[#00FF41]/5 px-4 py-2.5 text-[10px] font-black text-[#00FF41] hover:bg-[#00FF41]/20 transition-all flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(0,255,65,0.1)]">
                <BarChart3 size={14} className="group-hover:animate-pulse" /> TRADE ON TERMINAL
             </Link>
          </div>

        </div>

      </div>
    </div>
  );
}