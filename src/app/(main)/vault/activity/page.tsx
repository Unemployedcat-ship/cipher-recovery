'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, ArrowDownRight, ArrowUpRight, Zap, CheckCircle2, ExternalLink } from 'lucide-react';

export default function ActivityPage() {
  const mockActivity = [
    { id: '0x1a2b...3c4d', type: 'DEPOSIT', amount: '+0.50 SOL', date: '2 hrs ago', status: 'SUCCESS', icon: ArrowDownRight, color: 'text-[#00FF41]', bg: 'bg-[#00FF41]/10' },
    { id: '0x9f8e...7d6c', type: 'BID PLACED', amount: '-0.10 SOL', date: 'Yesterday', status: 'SUCCESS', icon: Zap, color: 'text-[#FF00FF]', bg: 'bg-[#FF00FF]/10' },
    { id: '0x5b4a...1e2f', type: 'TOKEN LAUNCH', amount: '0.02 SOL', date: '2 days ago', status: 'FEE', icon: Rocket, color: 'text-zinc-400', bg: 'bg-zinc-800' },
    { id: '0x7c6b...5a4d', type: 'CLAIM REWARDS', amount: '+12.5 UCAT', date: '3 days ago', status: 'SUCCESS', icon: ArrowUpRight, color: 'text-[#00FF41]', bg: 'bg-[#00FF41]/10' },
    { id: '0x3d2c...9b8a', type: 'WITHDRAW', amount: '-1.00 SOL', date: '4 days ago', status: 'SUCCESS', icon: ArrowUpRight, color: 'text-red-400', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 lg:p-8 flex flex-col gap-6 font-mono text-zinc-300 bg-[#050505] min-h-screen">
      
      {/* Header */}
      <div className="flex items-center gap-4 shrink-0 border-b border-zinc-800 pb-6">
        <Link href="/vault" className="h-10 w-10 border border-zinc-800 bg-[#09090B] flex items-center justify-center rounded-sm hover:border-[#00FF41] hover:text-[#00FF41] transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-[#00FF41] mb-1 font-black">
            <Clock className="h-3 w-3" /> TRANSACTION LEDGER
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">
            ACTIVITY LOG
          </h1>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="border border-zinc-800 bg-[#09090B] rounded-sm overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-5 text-[9px] text-zinc-500 border-b border-zinc-800 bg-[#050505] px-6 py-3 font-black tracking-wider uppercase">
          <div className="col-span-1">TYPE</div>
          <div className="col-span-1">TXN HASH</div>
          <div className="col-span-1">DATE</div>
          <div className="col-span-1 text-right">AMOUNT</div>
          <div className="col-span-1 text-right">STATUS</div>
        </div>
        
        <div className="divide-y divide-zinc-800/50">
          {mockActivity.map((tx, i) => (
            <div key={i} className="grid grid-cols-5 items-center px-6 py-4 hover:bg-zinc-800/30 transition-colors group cursor-pointer">
              <div className="col-span-1 flex items-center gap-3">
                <div className={`h-8 w-8 rounded-sm border border-zinc-700 flex items-center justify-center ${tx.bg} ${tx.color}`}>
                  <tx.icon size={14} />
                </div>
                <span className="text-xs font-bold text-white">{tx.type}</span>
              </div>
              <div className="col-span-1 text-xs font-mono text-zinc-400 flex items-center gap-1 group-hover:text-[#00FF41] transition-colors">
                {tx.id} <ExternalLink size={10} />
              </div>
              <div className="col-span-1 text-xs text-zinc-500">{tx.date}</div>
              <div className="col-span-1 text-right text-xs font-bold text-white font-mono">{tx.amount}</div>
              <div className="col-span-1 flex justify-end">
                <span className={`text-[9px] font-black px-2 py-1 rounded border flex items-center gap-1 ${
                  tx.status === 'SUCCESS' ? 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                  {tx.status === 'SUCCESS' && <CheckCircle2 size={10} />} {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
