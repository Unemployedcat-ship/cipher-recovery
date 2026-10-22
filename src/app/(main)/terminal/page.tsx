'use client';
import { Activity, TrendingUp, Zap, ArrowUpRight, List } from 'lucide-react';
import TradingChart from '@/components/TradingChart';

export default function TerminalPage() {
  return (
    <div className="w-full h-[calc(100vh-100px)] p-4 lg:p-6 flex flex-col gap-4 font-mono text-zinc-300 bg-[#050505] overflow-hidden">
      
      {/* Top Header Bar - fixed height */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border border-zinc-800 bg-[#09090B] p-3 rounded-sm relative overflow-hidden gap-4 shrink-0">
        <div className="absolute top-0 left-0 w-1/4 h-[2px] bg-gradient-to-r from-[#00FF41] to-transparent"></div>
        <div>
          <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-[#00FF41] mb-1 font-black">
            <Activity className="h-3 w-3" /> LIVE MARKET
          </div>
          <h1 className="text-xl font-black tracking-tight text-white uppercase">
            TRADING DESK
          </h1>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-bold">
          <div className="flex flex-col"><span className="text-zinc-500">24H VOL</span><span className="text-white text-sm">$1.2M</span></div>
          <div className="flex flex-col"><span className="text-zinc-500">POOLS</span><span className="text-[#00FF41] text-sm">42</span></div>
          <div className="flex flex-col"><span className="text-zinc-500">TOP GAINER</span><span className="text-[#00FF41] text-sm">+124%</span></div>
        </div>
      </div>

      {/* Main Grid Area - fills remaining space */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-4 overflow-hidden min-h-0">
        
        {/* Left Column */}
        <div className="xl:col-span-2 flex flex-col gap-4 h-full overflow-hidden">
          
          {/* Chart Box */}
          <div className="flex-1 border border-zinc-800 bg-[#09090B] rounded-sm p-4 relative flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)] min-h-0">
            <div className="flex justify-between items-start mb-2 shrink-0">
              <div>
                <div className="text-[10px] text-zinc-500 font-black tracking-widest">TOTAL PROTOCOL VOLUME</div>
                <div className="text-2xl font-black text-white flex items-baseline gap-2">
                  $4,209,690.00 <span className="text-xs text-[#00FF41] bg-[#00FF41]/10 px-1 rounded flex items-center"><ArrowUpRight size={10}/> 12.4%</span>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full relative min-h-0">
              <TradingChart />
            </div>
          </div>

          {/* Top Gainers Table - fixed height */}
          <div className="h-[220px] shrink-0 border border-zinc-800 bg-[#09090B] rounded-sm flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b border-zinc-800 bg-[#050505] shrink-0">
              <h2 className="text-[10px] font-black text-white flex items-center gap-2 uppercase tracking-widest"><TrendingUp size={12} className="text-[#00FF41]"/> TOP GAINERS</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-zinc-800/50">
                  {[
                    { name: 'Unemployed Cat', sym: 'UCAT', price: '$0.0420', change: '+840%', vol: '$420K' },
                    { name: 'FairDegens', sym: 'FAIR', price: '$0.0125', change: '+124%', vol: '$1.2M' },
                    { name: 'Doge Killer', sym: 'DOGEK', price: '$0.0084', change: '+68%', vol: '$890K' },
                  ].map((token, i) => (
                    <tr key={i} className="hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                      <td className="px-3 py-2 flex items-center gap-3">
                        <div className="h-6 w-6 bg-zinc-800 border border-zinc-700 text-[8px] flex items-center justify-center font-bold text-zinc-400 group-hover:text-[#00FF41] group-hover:border-[#00FF41] transition-colors rounded-sm">
                          {token.sym.slice(0,2)}
                        </div>
                        <div className="font-bold text-zinc-200">{token.name}</div>
                      </td>
                      <td className="px-3 py-2 text-zinc-400 font-mono">{token.price}</td>
                      <td className="px-3 py-2 text-right text-[#00FF41] font-bold font-mono">{token.change}</td>
                      <td className="px-3 py-2 text-right text-zinc-400 font-mono">{token.vol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="xl:col-span-1 flex flex-col gap-4 h-full overflow-hidden">
          
          {/* Live Tape */}
          <div className="flex-1 border border-zinc-800 bg-[#09090B] rounded-sm flex flex-col overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] min-h-0">
            <div className="flex justify-between items-center p-3 border-b border-zinc-800 bg-[#050505] shrink-0">
              <h2 className="text-[10px] font-black text-white flex items-center gap-2 uppercase tracking-widest"><Zap size={12} className="text-[#FF00FF]"/> LIVE TAPE</h2>
              <div className="flex items-center gap-1 text-[8px] text-[#00FF41] bg-[#00FF41]/10 px-1.5 py-0.5 rounded border border-[#00FF41]/20">
                <div className="h-1 w-1 bg-[#00FF41] rounded-full animate-pulse"></div> SYNCED
              </div>
            </div>
            
            <div className="grid grid-cols-4 text-[8px] text-zinc-500 border-b border-zinc-800 bg-[#09090B] px-3 py-1.5 font-black tracking-wider uppercase shrink-0">
              <div className="col-span-1">TIME</div>
              <div className="col-span-1">TYPE</div>
              <div className="col-span-1 text-right">PRICE</div>
              <div className="col-span-1 text-right">AMT</div>
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-[10px]">
              {[
                { time: '12:22:01', type: 'BUY', price: '0.000042', amt: '1.25', color: 'text-[#00FF41]', bg: 'bg-[#00FF41]/5' },
                { time: '12:21:55', type: 'SELL', price: '0.000041', amt: '0.50', color: 'text-red-400', bg: 'bg-red-500/5' },
                { time: '12:21:42', type: 'BUY', price: '0.000042', amt: '3.10', color: 'text-[#00FF41]', bg: 'bg-[#00FF41]/5' },
                { time: '12:21:30', type: 'BUY', price: '0.000040', amt: '0.15', color: 'text-[#00FF41]', bg: 'bg-[#00FF41]/5' },
                { time: '12:21:12', type: 'SELL', price: '0.000039', amt: '1.00', color: 'text-red-400', bg: 'bg-red-500/5' },
                { time: '12:20:58', type: 'BUY', price: '0.000041', amt: '5.00', color: 'text-[#00FF41]', bg: 'bg-[#00FF41]/5' },
                { time: '12:20:44', type: 'BUY', price: '0.000041', amt: '0.80', color: 'text-[#00FF41]', bg: 'bg-[#00FF41]/5' },
                { time: '12:20:31', type: 'SELL', price: '0.000038', amt: '2.50', color: 'text-red-400', bg: 'bg-red-500/5' },
              ].map((trade, i) => (
                <div key={i} className={`grid grid-cols-4 px-3 py-1.5 border-b border-zinc-800/30 hover:bg-zinc-800 transition-colors cursor-default ${trade.bg}`}>
                  <div className="col-span-1 text-zinc-500">{trade.time}</div>
                  <div className={`col-span-1 font-bold ${trade.color}`}>{trade.type}</div>
                  <div className="col-span-1 text-right text-zinc-300">{trade.price}</div>
                  <div className="col-span-1 text-right text-zinc-400">{trade.amt}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Book */}
          <div className="flex-1 border border-zinc-800 bg-[#09090B] rounded-sm flex flex-col overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] min-h-0">
             <div className="flex justify-between items-center p-3 border-b border-zinc-800 bg-[#050505] shrink-0">
              <h2 className="text-[10px] font-black text-white flex items-center gap-2 uppercase tracking-widest"><List size={12} className="text-zinc-400"/> ORDER BOOK</h2>
            </div>
            
            <div className="flex-1 flex flex-col justify-between p-3 overflow-hidden">
               <div className="space-y-0.5">
                  {[
                    { price: 0.000045, amount: 18, total: 18 },
                    { price: 0.000044, amount: 374, total: 392 },
                    { price: 0.000043, amount: 404, total: 796 },
                    { price: 0.000042, amount: 120, total: 916 },
                  ].map((ask, i) => (
                    <div key={i} className="flex justify-between text-[10px] font-mono relative py-1">
                       <div className="absolute right-0 top-0 h-full bg-red-500/10" style={{ width: `${(ask.total / 1000) * 100}%` }}></div>
                       <span className="text-red-400 relative z-10">{ask.price.toFixed(6)}</span>
                       <span className="text-zinc-400 relative z-10">{ask.amount}</span>
                       <span className="text-zinc-500 relative z-10">{ask.total}</span>
                    </div>
                  ))}
               </div>
               
               <div className="flex justify-between items-center py-2 border-y border-zinc-800 my-1 bg-[#050505]">
                  <span className="text-sm font-black text-[#00FF41] px-1">0.000042</span>
                  <span className="text-[8px] text-zinc-500 font-bold">SPREAD: 0.000001</span>
               </div>
               
               <div className="space-y-0.5">
                  {[
                    { price: 0.000041, amount: 210, total: 210 },
                    { price: 0.000040, amount: 486, total: 696 },
                    { price: 0.000039, amount: 224, total: 920 },
                    { price: 0.000038, amount: 150, total: 1070 },
                  ].map((bid, i) => (
                    <div key={i} className="flex justify-between text-[10px] font-mono relative py-1">
                       <div className="absolute right-0 top-0 h-full bg-[#00FF41]/10" style={{ width: `${(bid.total / 1200) * 100}%` }}></div>
                       <span className="text-[#00FF41] relative z-10">{bid.price.toFixed(6)}</span>
                       <span className="text-zinc-400 relative z-10">{bid.amount}</span>
                       <span className="text-zinc-500 relative z-10">{bid.total}</span>
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
