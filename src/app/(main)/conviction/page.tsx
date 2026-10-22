'use client';
import { ShieldCheck, Target, Star, Zap } from 'lucide-react';

export default function ConvictionPage() {
  return (
    <div className="p-4 md:p-8 font-mono text-zinc-300 w-full max-w-7xl mx-auto overflow-x-hidden">
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex flex-col md:flex-row items-center justify-center gap-2 mb-2"><ShieldCheck className="text-[#00FF41]" size={32} /> CONVICTION PROTOCOL</h1>
        <p className="text-sm text-zinc-500">Reputation earned through belief, not just capital.</p>
      </div>
      <div className="border border-zinc-800 bg-gradient-to-r from-[#09090B] to-[#111116] rounded-xl p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full"></div>
        <div className="text-[10px] text-zinc-500 tracking-widest font-bold mb-2">CURRENT TIER</div>
        <div className="text-4xl md:text-5xl font-black text-amber-500 tracking-tight mb-4">BRONZE</div>
        <div className="flex justify-between text-xs text-zinc-400 mb-2"><span>Progress</span><span>0 / 500 CP</span></div>
        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden"><div className="h-full bg-amber-500 w-0"></div></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="border border-zinc-800 bg-[#09090B] rounded-xl p-6">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Target size={16} className="text-[#00FF41]"/> DAILY MISSIONS</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded bg-zinc-900/50 border border-zinc-800/50 gap-4">
                <div><div className="text-sm font-bold text-white">Ape In</div><div className="text-[10px] text-zinc-500">Buy 1 SOL worth of any token</div></div>
                <div className="text-xs font-bold text-[#00FF41] whitespace-nowrap">+10 CP</div>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-zinc-900/50 border border-zinc-800/50 gap-4">
                <div><div className="text-sm font-bold text-white">Shill Master</div><div className="text-[10px] text-zinc-500">Send 5 messages in community chat</div></div>
                <div className="text-xs font-bold text-[#00FF41] whitespace-nowrap">+5 CP</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] rounded-xl p-6">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Star size={16} className="text-amber-500"/> TRADER BADGES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[#00FF41]/30 bg-[#00FF41]/5 rounded-lg p-4 text-center">
              <div className="h-10 w-10 mx-auto bg-[#00FF41]/20 rounded-full flex items-center justify-center text-[#00FF41] mb-2"><Zap size={18}/></div>
              <div className="text-xs font-bold text-white">First Blood</div><div className="text-[9px] text-zinc-500 mt-1">Launch your first memecoin.</div>
            </div>
            <div className="border border-zinc-800 bg-zinc-900/30 rounded-lg p-4 text-center opacity-50 grayscale">
              <div className="h-10 w-10 mx-auto bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 mb-2"><ShieldCheck size={18}/></div>
              <div className="text-xs font-bold text-white">Rug Survivor</div><div className="text-[9px] text-zinc-500 mt-1">Hold a token for 7 days.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}