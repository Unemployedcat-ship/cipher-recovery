'use client';
import Link from 'next/link';
import { Lock, ShieldCheck, Zap, Activity, Server, Cpu, Terminal, ShieldAlert } from 'lucide-react';

export default function DarkPoolsPage() {
  return (
    <div className="p-4 md:p-8 font-mono text-zinc-300 w-full max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-800 pb-6 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#00FF41] mb-2 font-black">
            <Lock className="h-4 w-4" />
            <span>FHE SEALED-BID AUCTIONS</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            DARK POOLS 
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded-sm border border-zinc-700">V1.0</span>
          </h1>
        </div>
        <Link href="/launch" className="rounded-sm bg-[#00FF41] px-6 py-3 text-xs font-black text-black hover:bg-[#00e03a] transition-colors shadow-[0_0_20px_rgba(0,255,65,0.3)] flex items-center gap-2">
          <Zap size={16} /> INITIALIZE POOL
        </Link>
      </div>

      {/* Telemetry Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 shrink-0">
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00FF41] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center mb-1">
             <div className="text-[10px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><Activity size={12}/> TOTAL VOLUME</div>
             <div className="h-1.5 w-1.5 bg-[#00FF41] rounded-full animate-pulse shadow-[0_0_5px_#00FF41]"></div>
          </div>
          <div className="text-xl font-black text-white">$0.00</div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00FF41] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center mb-1">
             <div className="text-[10px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><Server size={12}/> ACTIVE POOLS</div>
             <div className="text-[9px] text-zinc-600 font-mono border border-zinc-800 px-1 rounded">IDLE</div>
          </div>
          <div className="text-xl font-black text-[#00FF41]">0</div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00FF41] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center mb-1">
             <div className="text-[10px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><Cpu size={12}/> TOTAL BIDS</div>
             <div className="text-[9px] text-zinc-600 font-mono border border-zinc-800 px-1 rounded">0ms</div>
          </div>
          <div className="text-xl font-black text-white">0</div>
        </div>
      </div>

      {/* Command Center Empty State - Splits into 2 Columns */}
      <div className="flex-1 border border-zinc-800 bg-[#050505] rounded-sm relative overflow-hidden flex flex-col lg:flex-row shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
        
        {/* Background Grid & Scanline */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
           <div className="w-full h-[2px] bg-[#00FF41] animate-scan shadow-[0_0_20px_#00FF41]"></div>
        </div>

        {/* Left Column: The Vault Radar */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative min-h-[300px] lg:min-h-full border-b lg:border-b-0 lg:border-r border-zinc-800/50 p-8">
          <div className="relative flex items-center justify-center">
            {/* Rings */}
            <div className="absolute w-64 h-64 lg:w-80 lg:h-80 border border-dashed border-[#00FF41]/20 rounded-full animate-[spin_30s_linear_infinite]"></div>
            <div className="absolute w-48 h-48 lg:w-64 lg:h-64 border border-[#00FF41]/30 rounded-full animate-[spin_20s_linear_infinite_reverse] border-t-[#00FF41]"></div>
            
            {/* Crosshairs */}
            <div className="absolute w-72 lg:w-96 h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/40 to-transparent"></div>
            <div className="absolute h-72 lg:h-96 w-[1px] bg-gradient-to-b from-transparent via-[#00FF41]/40 to-transparent"></div>

            {/* Hexagon */}
            <div className="h-28 w-28 lg:h-36 lg:w-36 bg-[#09090B] border-2 border-[#00FF41] relative z-10 shadow-[0_0_50px_rgba(0,255,65,0.3)] flex items-center justify-center overflow-hidden animate-pulse"
                 style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,65,0.2)_0%,_transparent_70%)]"></div>
              <ShieldCheck className="h-14 w-14 lg:h-16 lg:w-16 text-[#00FF41] relative z-10 drop-shadow-[0_0_10px_rgba(0,255,65,0.8)]" />
            </div>
          </div>
        </div>

        {/* Right Column: The Terminal */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-12 relative z-10">
          
          <div className="w-full max-w-md">
            <div className="bg-[#000000] border border-zinc-800 rounded-sm shadow-2xl overflow-hidden text-left mb-8">
              
              {/* Terminal Header */}
              <div className="bg-[#111116] border-b border-zinc-800 px-4 py-2 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#00FF41]/80"></div>
                <span className="text-[10px] text-zinc-500 ml-2 flex items-center gap-1"><Terminal size={10}/> sys_standby.log</span>
              </div>
              
              {/* Terminal Body */}
              <div className="p-5 text-xs md:text-sm text-zinc-400 font-mono space-y-3">
                <p><span className="text-zinc-600">[SYSTEM]</span> Initializing connection...</p>
                <p><span className="text-zinc-600">[SEARCH]</span> Scanning for active pools...</p>
                <p><span className="text-zinc-600">[RESULT]</span> <span className="text-amber-500 font-bold">0 POOLS FOUND</span></p>
                <p className="text-[#00FF41] font-bold">
                  <span className="text-zinc-600">[STATUS]</span> AWAITING OPERATOR<span className="animate-pulse">_</span>
                </p>
              </div>
            </div>
            
            {/* Action Button */}
            <Link href="/launch" className="w-full rounded-sm border border-[#00FF41] bg-[#00FF41]/10 px-6 py-4 text-xs font-black text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(0,255,65,0.15)]">
              <Zap size={16} className="group-hover:animate-bounce" /> INITIALIZE FIRST PROTOCOL
            </Link>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
               <ShieldAlert size={12} className="text-amber-500"/> No active bids detected on-chain
            </div>
          </div>

        </div>

        {/* Footer Status Bar */}
        <div className="absolute bottom-0 left-0 w-full bg-[#09090B] border-t border-zinc-800 px-6 py-2 flex justify-between text-[10px] text-zinc-500 font-mono tracking-wider z-20">
          <span className="flex items-center gap-1"><Lock size={10}/> FHE ACTIVE</span>
          <span>NODE: DEVNET</span>
          <span className="text-[#00FF41]">PING: 12ms</span>
        </div>
      </div>
    </div>
  );
}