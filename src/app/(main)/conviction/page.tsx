'use client';
import { ShieldCheck, Target, Star, Zap } from 'lucide-react';

export default function ConvictionPage() {
  return (
    <div className="p-8 font-mono text-zinc-300 w-full max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-white flex items-center justify-center gap-3 mb-2 uppercase tracking-tight"><ShieldCheck className="text-[#00FF41]" size={32} /> CONVICTION PROTOCOL</h1>
        <p className="text-sm text-zinc-500">Reputation earned through belief, not just capital.</p>
      </div>

      <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-8 mb-8 relative overflow-hidden">
        <div className="text-[10px] text-zinc-500 font-black tracking-widest mb-2">CURRENT TIER</div>
        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 tracking-tight mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]">BRONZE</div>
        <div className="flex justify-between text-xs text-zinc-400 mb-2 font-bold"><span>Progress</span><span>0 / 500 CP</span></div>
        <div className="h-2 w-full bg-[#050505] rounded-full overflow-hidden border border-zinc-800">
          <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 w-0 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-6">
          <h2 className="text-sm font-black text-white mb-4 flex items-center gap-2 uppercase tracking-widest"><Target size={16} className="text-[#00FF41]"/> DAILY MISSIONS</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-[#050505] border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div><div className="text-sm font-bold text-white">Ape In</div><div className="text-[10px] text-zinc-500">Buy 1 SOL worth of any token</div></div>
              <div className="text-sm font-black text-[#00FF41]">+10 CP</div>
            </div>
            <div className="flex justify-between items-center p-4 bg-[#050505] border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div><div className="text-sm font-bold text-white">Shill Master</div><div className="text-[10px] text-zinc-500">Send 5 messages in chat</div></div>
              <div className="text-sm font-black text-[#00FF41]">+5 CP</div>
            </div>
          </div>
        </div>

        <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-6">
          <h2 className="text-sm font-black text-white mb-4 flex items-center gap-2 uppercase tracking-widest"><Star size={16} className="text-amber-500"/> TRADER BADGES</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[#00FF41]/30 bg-[#00FF41]/5 rounded-sm p-4 text-center shadow-[0_0_15px_rgba(0,255,65,0.1)]">
              <div className="h-12 w-12 mx-auto bg-[#00FF41]/20 rounded-sm flex items-center justify-center text-[#00FF41] mb-3"><Zap size={20}/></div>
              <div className="text-xs font-black text-white uppercase tracking-wider">First Blood</div><div className="text-[10px] text-zinc-500 mt-1">Launch first memecoin.</div>
            </div>
            <div className="border border-zinc-800 bg-[#050505] rounded-sm p-4 text-center opacity-50 grayscale">
              <div className="h-12 w-12 mx-auto bg-zinc-800 rounded-sm flex items-center justify-center text-zinc-500 mb-3"><ShieldCheck size={20}/></div>
              <div className="text-xs font-black text-white uppercase tracking-wider">Rug Survivor</div><div className="text-[10px] text-zinc-500 mt-1">Hold a token for 7 days.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}