'use client';
import Link from 'next/link';
import { Lock, ShieldCheck, Zap, Hexagon, Activity, Cpu, Server } from 'lucide-react';

export default function DarkPoolsPage() {
  return (
    <div className="p-4 md:p-8 font-mono text-zinc-300 w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-800 pb-6 relative">
        <div>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#00FF41] mb-2 font-black">
            <Lock className="h-4 w-4" />
            <span>FHE SEALED-BID AUCTIONS</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            DARK POOLS 
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded-sm border border-zinc-700">V1.0</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-500">Fair match seeding. Snipers cannot front-run your launch.</p>
        </div>
        <Link href="/launch" className="rounded-sm bg-[#00FF41] px-6 py-3 text-xs font-black text-black hover:bg-[#00e03a] transition-colors shadow-[0_0_20px_rgba(0,255,65,0.3)] flex items-center gap-2">
          <Zap size={16} /> INITIALIZE POOL
        </Link>
      </div>

      {/* Telemetry Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border border-zinc-800 bg-[#09090B] p-5 rounded-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-zinc-700 group-hover:border-[#00FF41] transition-colors"></div>
          <div className="flex justify-between items-center mb-2">
             <div className="text-[10px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><Activity size={12}/> TOTAL VOLUME</div>
             <div className="h-1.5 w-1.5 bg-[#00FF41] rounded-full animate-pulse"></div>
          </div>
          <div className="text-2xl font-black text-white">$0.00</div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-5 rounded-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-zinc-700 group-hover:border-[#00FF41] transition-colors"></div>
          <div className="flex justify-between items-center mb-2">
             <div className="text-[10px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><Server size={12}/> ACTIVE POOLS</div>
             <div className="text-[10px] text-zinc-600 font-mono">IDLE</div>
          </div>
          <div className="text-2xl font-black text-[#00FF41]">0</div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-5 rounded-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-zinc-700 group-hover:border-[#00FF41] transition-colors"></div>
          <div className="flex justify-between items-center mb-2">
             <div className="text-[10px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><Cpu size={12}/> TOTAL BIDS PLACED</div>
             <div className="text-[10px] text-zinc-600 font-mono">0ms</div>
          </div>
          <div className="text-2xl font-black text-white">0</div>
        </div>
      </div>

      {/* Mainframe Vault Empty State */}
      <div className="border border-zinc-800 bg-[#050505] rounded-sm flex flex-col items-center justify-center min-h-[500px] px-4 text-center relative overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
        
        {/* Scanning Laser Line */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
           <div className="w-full h-32 bg-gradient-to-b from-transparent via-[#00FF41]/20 to-transparent animate-scan border-b border-[#00FF41]/50"></div>
        </div>

        {/* Tactical Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        {/* Targeting Corners */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-[#00FF41]/40"></div>
        <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-[#00FF41]/40"></div>
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-[#00FF41]/40"></div>
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-[#00FF41]/40"></div>

        {/* The Vault Graphic */}
        <div className="relative mb-10 flex items-center justify-center group cursor-crosshair">
          
          {/* Outer Rotating Ring (CSS only) */}
          <div className="absolute w-64 h-64 border border-dashed border-[#00FF41]/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
          
          {/* Inner Ring */}
          <div className="absolute w-48 h-48 border border-[#00FF41]/20 rounded-full flex items-center justify-center">
             <div className="w-[1px] h-full bg-[#00FF41]/20 absolute"></div>
             <div className="h-[1px] w-full bg-[#00FF41]/20 absolute"></div>
          </div>

          {/* Hexagon Vault Door */}
          <div className="h-32 w-32 bg-[#09090B] border-2 border-[#00FF41]/60 relative z-10 shadow-[0_0_40px_rgba(0,255,65,0.2)] group-hover:border-[#00FF41] group-hover:shadow-[0_0_60px_rgba(0,255,65,0.4)] transition-all duration-500 flex items-center justify-center overflow-hidden"
               style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
            <div className="absolute inset-0 bg-gradient-to-b from-[#00FF41]/10 to-transparent"></div>
            <ShieldCheck className="h-14 w-14 text-[#00FF41] relative z-10" />
          </div>
        </div>

        {/* Terminal Text */}
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-black text-white tracking-widest uppercase">
            SYSTEM STANDBY
          </h2>
          <div className="text-sm text-zinc-400 font-mono space-y-1 bg-[#09090B]/80 p-4 rounded border border-zinc-800 backdrop-blur-sm">
            <p>&gt; SEARCHING FOR ACTIVE DARK POOLS...</p>
            <p>&gt; RESULT: <span className="text-amber-500">0 POOLS FOUND</span></p>
            <p>&gt; AWAITING OPERATOR INITIALIZATION<span className="animate-pulse">_</span></p>
          </div>
          
          <div className="pt-6">
            <Link href="/launch" className="rounded-sm border border-[#00FF41] bg-[#00FF41]/10 px-8 py-4 text-xs font-black text-[#00FF41] hover:bg-[#00FF41]/20 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(0,255,65,0.15)]">
              <Zap size={16} className="group-hover:animate-bounce" /> INITIALIZE FIRST PROTOCOL
            </Link>
          </div>
        </div>

        {/* Footer Status Bar */}
        <div className="absolute bottom-0 left-0 w-full bg-[#09090B] border-t border-zinc-800 px-4 py-2 flex justify-between text-[9px] text-zinc-500 font-mono">
          <span>ENCRYPTION: FHE ACTIVE</span>
          <span>NODE: DEVNET</span>
          <span>LATENCY: 12ms</span>
        </div>
      </div>
    </div>
  );
}