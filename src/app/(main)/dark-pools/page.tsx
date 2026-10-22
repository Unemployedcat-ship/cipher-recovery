'use client';
import Link from 'next/link';
import { Lock, ShieldCheck, Zap, Activity, Server, Cpu, Terminal } from 'lucide-react';

export default function DarkPoolsPage() {
  return (
    <div className="p-4 md:p-8 font-mono text-zinc-300 w-full max-w-7xl mx-auto mt-4">
      
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
        <div className="border border-zinc-800 bg-[#09090B] p-5 rounded-sm relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00FF41] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center mb-2">
             <div className="text-[10px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><Activity size={12}/> TOTAL VOLUME</div>
             <div className="h-1.5 w-1.5 bg-[#00FF41] rounded-full animate-pulse shadow-[0_0_5px_#00FF41]"></div>
          </div>
          <div className="text-2xl font-black text-white">$0.00</div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-5 rounded-sm relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00FF41] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center mb-2">
             <div className="text-[10px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><Server size={12}/> ACTIVE POOLS</div>
             <div className="text-[10px] text-zinc-600 font-mono border border-zinc-800 px-1 rounded">IDLE</div>
          </div>
          <div className="text-2xl font-black text-[#00FF41]">0</div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-5 rounded-sm relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00FF41] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center mb-2">
             <div className="text-[10px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><Cpu size={12}/> TOTAL BIDS PLACED</div>
             <div className="text-[10px] text-zinc-600 font-mono border border-zinc-800 px-1 rounded">0ms</div>
          </div>
          <div className="text-2xl font-black text-white">0</div>
        </div>
      </div>

      {/* Mainframe Vault Empty State */}
      <div className="border border-zinc-800 bg-gradient-to-b from-[#09090B] to-[#050505] rounded-sm flex flex-col items-center justify-center min-h-[550px] px-4 text-center relative overflow-hidden shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
        
        {/* Scanning Laser Line */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
           <div className="w-full h-[2px] bg-[#00FF41] animate-scan shadow-[0_0_20px_#00FF41]"></div>
        </div>

        {/* Tactical Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

        {/* Targeting Corners */}
        <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-[#00FF41]/50"></div>
        <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-[#00FF41]/50"></div>
        <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-[#00FF41]/50"></div>
        <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-[#00FF41]/50"></div>

        {/* The Vault Graphic */}
        <div className="relative mb-12 flex items-center justify-center">
          
          {/* Outer Rotating Ring */}
          <div className="absolute w-72 h-72 border border-dashed border-[#00FF41]/20 rounded-full animate-[spin_30s_linear_infinite]"></div>
          
          {/* Inner Rotating Ring (Reverse) */}
          <div className="absolute w-56 h-56 border border-[#00FF41]/30 rounded-full animate-[spin_20s_linear_infinite_reverse] border-t-[#00FF41]"></div>
          
          {/* Crosshairs */}
          <div className="absolute w-80 h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/30 to-transparent"></div>
          <div className="absolute h-80 w-[1px] bg-gradient-to-b from-transparent via-[#00FF41]/30 to-transparent"></div>

          {/* Hexagon Vault Door */}
          <div className="h-32 w-32 bg-[#09090B] border-2 border-[#00FF41] relative z-10 shadow-[0_0_50px_rgba(0,255,65,0.3)] flex items-center justify-center overflow-hidden"
               style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,65,0.2)_0%,_transparent_70%)]"></div>
            <ShieldCheck className="h-16 w-16 text-[#00FF41] relative z-10 drop-shadow-[0_0_10px_rgba(0,255,65,0.8)]" />
          </div>
        </div>

        {/* Terminal Window */}
        <div className="relative z-10 w-full max-w-lg">
          <div className="bg-[#000000] border border-zinc-800 rounded-sm shadow-2xl overflow-hidden text-left">
            {/* Terminal Header */}
            <div className="bg-[#111116] border-b border-zinc-800 px-4 py-2 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#00FF41]/80"></div>
              <span className="text-[10px] text-zinc-500 ml-2 flex items-center gap-1"><Terminal size={10}/> sys_standby.log</span>
            </div>
            
            {/* Terminal Body */}
            <div className="p-5 text-sm text-zinc-400 font-mono space-y-2">
              <p>&gt; SEARCHING FOR ACTIVE DARK POOLS...</p>
              <p>&gt; RESULT: <span className="text-amber-500">0 POOLS FOUND</span></p>
              <p className="text-white">&gt; AWAITING OPERATOR INITIALIZATION<span className="animate-pulse text-[#00FF41]">_</span></p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Link href="/launch" className="rounded-sm border border-[#00FF41] bg-[#00FF41]/10 px-10 py-4 text-xs font-black text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(0,255,65,0.15)]">
              <Zap size={16} className="group-hover:animate-bounce" /> INITIALIZE FIRST PROTOCOL
            </Link>
          </div>
        </div>

        {/* Footer Status Bar */}
        <div className="absolute bottom-0 left-0 w-full bg-[#09090B] border-t border-zinc-800 px-6 py-2 flex justify-between text-[10px] text-zinc-500 font-mono tracking-wider">
          <span className="flex items-center gap-1"><Lock size={10}/> ENCRYPTION: FHE ACTIVE</span>
          <span>NODE: DEVNET</span>
          <span className="text-[#00FF41]">LATENCY: 12ms</span>
        </div>
      </div>
    </div>
  );
}