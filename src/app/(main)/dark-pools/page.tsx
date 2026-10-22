'use client';
import Link from 'next/link';
import { Lock, ShieldCheck, Zap, Activity, Server, Cpu, Terminal, ShieldAlert, Wifi } from 'lucide-react';

export default function DarkPoolsPage() {
  return (
    <div className="p-4 md:p-8 font-mono text-zinc-300 w-full max-w-[1400px] mx-auto flex flex-col gap-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-800 pb-6 relative">
        <div className="absolute bottom-0 left-0 w-1/3 h-[2px] bg-gradient-to-r from-[#00FF41] to-transparent"></div>
        <div>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#00FF41] mb-2 font-black">
            <Lock className="h-4 w-4" />
            <span>FHE SEALED-BID AUCTIONS</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            DARK POOLS 
            <span className="text-[10px] bg-[#00FF41]/10 text-[#00FF41] px-2 py-1 rounded-sm border border-[#00FF41]/30">LIVE_SYS</span>
          </h1>
        </div>
        <Link href="/launch" className="rounded-sm bg-[#00FF41] px-6 py-3 text-xs font-black text-black hover:bg-[#00e03a] transition-all shadow-[0_0_20px_rgba(0,255,65,0.2)] hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] flex items-center gap-2">
          <Zap size={16} /> INITIALIZE POOL
        </Link>
      </div>

      {/* Top Telemetry Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-zinc-800 bg-[#09090B] p-5 rounded-sm relative group overflow-hidden">
          <div className="flex justify-between items-center mb-3">
             <div className="text-[10px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><Activity size={12}/> 24H VOLUME</div>
             <div className="h-1.5 w-1.5 bg-[#00FF41] rounded-full animate-pulse shadow-[0_0_5px_#00FF41]"></div>
          </div>
          <div className="text-3xl font-black text-white">$0.00</div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#00FF41]/50 to-transparent"></div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-5 rounded-sm relative group overflow-hidden">
          <div className="flex justify-between items-center mb-3">
             <div className="text-[10px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><Server size={12}/> ACTIVE POOLS</div>
             <div className="text-[9px] text-zinc-600 font-mono border border-zinc-800 px-1 rounded bg-[#050505]">STANDBY</div>
          </div>
          <div className="text-3xl font-black text-[#00FF41]">0</div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#00FF41]/50 to-transparent"></div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-5 rounded-sm relative group overflow-hidden">
          <div className="flex justify-between items-center mb-3">
             <div className="text-[10px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><Cpu size={12}/> TOTAL BIDS</div>
             <div className="text-[9px] text-[#00FF41] font-mono border border-[#00FF41]/30 px-1 rounded bg-[#00FF41]/5 flex items-center gap-1"><Wifi size={8}/> 0ms</div>
          </div>
          <div className="text-3xl font-black text-white">0</div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#00FF41]/50 to-transparent"></div>
        </div>
      </div>

      {/* Main Command Console Area */}
      <div className="border border-zinc-800 bg-[#050505] rounded-sm relative overflow-hidden flex flex-col lg:flex-row shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] min-h-[600px]">
        
        {/* Background Grid & Scanline */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
           <div className="w-full h-[2px] bg-[#00FF41] animate-scan shadow-[0_0_30px_#00FF41]"></div>
        </div>

        {/* Left Column: The Radar */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative border-b lg:border-b-0 lg:border-r border-zinc-800/50 p-12 lg:p-20">
          
          <div className="relative flex items-center justify-center w-full max-w-[400px] aspect-square">
            
            {/* Outer Ring */}
            <div className="absolute inset-0 border border-zinc-800 rounded-full">
              <div className="absolute top-1/2 -left-1 w-2 h-2 bg-[#00FF41] rounded-full shadow-[0_0_10px_#00FF41]"></div>
              <div className="absolute top-0 left-1/2 w-1 h-1 bg-zinc-600 rounded-full"></div>
            </div>
            
            {/* Middle Ring (Dashed) */}
            <div className="absolute inset-[15%] border border-dashed border-[#00FF41]/30 rounded-full animate-[spin_30s_linear_infinite]"></div>
            
            {/* Inner Ring */}
            <div className="absolute inset-[30%] border border-[#00FF41]/50 rounded-full animate-[spin_15s_linear_infinite_reverse] border-t-[#00FF41] border-l-[#00FF41]"></div>

            {/* Crosshairs */}
            <div className="absolute w-[120%] h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/40 to-transparent"></div>
            <div className="absolute h-[120%] w-[1px] bg-gradient-to-b from-transparent via-[#00FF41]/40 to-transparent"></div>

            {/* Center Hexagon */}
            <div className="h-[35%] w-[35%] bg-[#09090B] border-2 border-[#00FF41] relative z-10 shadow-[0_0_60px_rgba(0,255,65,0.2)] flex items-center justify-center overflow-hidden"
                 style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,65,0.15)_0%,_transparent_80%)] animate-pulse"></div>
              <ShieldCheck className="h-[50%] w-[50%] text-[#00FF41] relative z-10 drop-shadow-[0_0_15px_rgba(0,255,65,0.8)]" />
            </div>

            {/* Decorative Text */}
            <div className="absolute -top-10 text-[9px] text-[#00FF41]/50 font-mono tracking-widest">SYS.OP.001</div>
            <div className="absolute -bottom-10 text-[9px] text-[#00FF41]/50 font-mono tracking-widest">FHE.SYS.ON</div>
          </div>
        </div>

        {/* Right Column: The Terminal Console */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 relative z-10">
          
          <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
            
            <div className="bg-[#000000] border border-zinc-800 rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/50 to-transparent"></div>

              {/* Terminal Header */}
              <div className="bg-[#0a0a0f] border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-[#00FF41]/80"></div>
                  <span className="text-[10px] text-zinc-500 ml-2 flex items-center gap-2 font-bold tracking-wider"><Terminal size={12}/> system_console.log</span>
                </div>
                <div className="text-[10px] text-[#00FF41] font-mono animate-pulse flex items-center gap-1">
                  <div className="h-1.5 w-1.5 bg-[#00FF41] rounded-full"></div> LIVE
                </div>
              </div>
              
              {/* Terminal Body */}
              <div className="p-6 md:p-8 text-xs md:text-sm text-zinc-400 font-mono space-y-4 leading-relaxed">
                <p className="flex gap-3"><span className="text-zinc-600 shrink-0">[SYS_01]</span> <span>Initializing dark pool protocol...</span></p>
                <p className="flex gap-3"><span className="text-zinc-600 shrink-0">[SYS_02]</span> <span>FHE encryption active. Snipers neutralized.</span></p>
                <p className="flex gap-3"><span className="text-zinc-600 shrink-0">[SCAN]</span> <span>Searching block for active pools...</span></p>
                <p className="flex gap-3"><span className="text-zinc-600 shrink-0">[RSLT]</span> <span className="text-amber-500 font-bold">0 POOLS FOUND</span></p>
                <div className="h-2"></div>
                <p className="text-[#00FF41] font-bold flex gap-3 items-center">
                  <span className="text-zinc-600 shrink-0">[WAIT]</span> 
                  <span>AWAITING OPERATOR INITIALIZATION<span className="animate-pulse">_</span></span>
                </p>
              </div>
            </div>
            
            {/* The Massive Launch Button */}
            <Link href="/launch" className="w-full rounded-sm bg-[#00FF41] px-6 py-5 text-sm font-black text-black hover:bg-[#00e03a] transition-all duration-300 flex items-center justify-center gap-3 group shadow-[0_0_30px_rgba(0,255,65,0.2)] hover:shadow-[0_0_50px_rgba(0,255,65,0.5)]">
              <Zap size={20} className="group-hover:animate-bounce" /> INITIALIZE FIRST PROTOCOL
            </Link>

            <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
               <ShieldAlert size={14} className="text-amber-500"/> System standby. No active bids detected.
            </div>
          </div>

        </div>

        {/* Footer Status Bar */}
        <div className="absolute bottom-0 left-0 w-full bg-[#09090B] border-t border-zinc-800 px-6 py-2 flex justify-between items-center text-[10px] text-zinc-500 font-mono tracking-wider z-20">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#00FF41]"><Lock size={10}/> ENCRYPTION: FHE ACTIVE</span>
            <span className="hidden md:inline">NODE: DEVNET</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-[#00FF41] rounded-full animate-pulse"></span>
            <span>CONNECTION SECURE</span>
          </div>
        </div>
      </div>
    </div>
  );
}