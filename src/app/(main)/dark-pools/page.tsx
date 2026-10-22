'use client';
import Link from 'next/link';
import { Lock, ShieldCheck, Zap, Activity, Server, Cpu, Terminal, ShieldAlert, Wifi, Crosshair, Database } from 'lucide-react';

export default function DarkPoolsPage() {
  return (
    <div className="w-full min-h-full p-4 lg:p-6 flex flex-col gap-4 font-mono text-zinc-300 bg-[#050505]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-4 shrink-0 relative gap-4">
        <div className="absolute bottom-0 left-0 w-1/4 h-[2px] bg-gradient-to-r from-[#00FF41] to-transparent"></div>
        <div>
          <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-[#00FF41] mb-1 font-black">
            <Lock className="h-3 w-3" /> FHE SEALED-BID AUCTIONS
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            DARK POOLS 
            <span className="text-[9px] bg-[#00FF41]/10 text-[#00FF41] px-2 py-0.5 rounded border border-[#00FF41]/30">LIVE_SYS</span>
          </h1>
        </div>
        <Link href="/launch" className="rounded-sm bg-[#00FF41] px-6 py-2.5 text-[10px] font-black text-black hover:bg-[#00e03a] transition-all shadow-[0_0_20px_rgba(0,255,65,0.2)] flex items-center gap-2 whitespace-nowrap">
          <Zap size={14} /> INITIALIZE POOL
        </Link>
      </div>

      {/* Top Telemetry Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden group">
          <div className="flex justify-between items-center mb-2">
            <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1">
              <Activity size={10} /> 24H VOLUME
            </div>
            <div className="h-1.5 w-1.5 bg-[#00FF41] rounded-full animate-pulse shadow-[0_0_5px_#00FF41]"></div>
          </div>
          <div className="text-2xl font-black text-white">$0.00</div>
          {/* Mini Chart */}
          <div className="absolute bottom-0 right-0 flex items-end gap-1 opacity-20 group-hover:opacity-50 transition-opacity pr-2 pb-2">
             {[10, 20, 15, 30, 25, 40].map((val, j) => (
               <div key={j} className="w-1.5 bg-[#00FF41]" style={{ height: val + 'px' }}></div>
             ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#00FF41]/50 to-transparent"></div>
        </div>
        
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden group">
          <div className="flex justify-between items-center mb-2">
            <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1">
              <Server size={10} /> ACTIVE POOLS
            </div>
            <div className="text-[8px] text-zinc-600 font-mono border border-zinc-800 px-1 rounded bg-[#050505]">STANDBY</div>
          </div>
          <div className="text-2xl font-black text-[#00FF41]">0</div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#00FF41]/50 to-transparent"></div>
        </div>

        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden group">
          <div className="flex justify-between items-center mb-2">
            <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1">
              <Cpu size={10} /> TOTAL BIDS
            </div>
            <div className="text-[8px] text-[#00FF41] font-mono border border-[#00FF41]/30 px-1 rounded bg-[#00FF41]/5 flex items-center gap-1"><Wifi size={8}/> 0ms</div>
          </div>
          <div className="text-2xl font-black text-white">0</div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#00FF41]/50 to-transparent"></div>
        </div>
      </div>

      {/* Main Command Console */}
      <div className="flex-1 border border-zinc-800 bg-[#050505] rounded-sm relative flex flex-col lg:flex-row shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] overflow-hidden min-h-[500px]">
        
        {/* Background Grid & Scanline */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
           <div className="w-full h-[2px] bg-[#00FF41] animate-scan shadow-[0_0_30px_#00FF41]"></div>
        </div>

        {/* Left Column: Radar */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative border-b lg:border-b-0 lg:border-r border-zinc-800/50 p-8 lg:p-12">
          <div className="relative flex items-center justify-center w-full max-w-[350px] aspect-square">
            <div className="absolute inset-0 rounded-full" style={{ background: 'repeating-conic-gradient(from 0deg, #27272a 0deg 1deg, transparent 1deg 15deg)' }}>
              <div className="absolute inset-[2px] bg-[#050505] rounded-full"></div>
            </div>
            <div className="absolute inset-[8%] border border-zinc-800 rounded-full">
              <div className="absolute top-1/2 -left-1 w-2 h-2 bg-[#00FF41] rounded-full shadow-[0_0_10px_#00FF41]"></div>
            </div>
            <div className="absolute inset-[20%] border border-dashed border-[#00FF41]/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute inset-[35%] border border-[#00FF41]/50 rounded-full animate-[spin_10s_linear_infinite_reverse] border-t-[#00FF41] border-l-[#00FF41]"></div>
            <div className="absolute w-[110%] h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/40 to-transparent"></div>
            <div className="absolute h-[110%] w-[1px] bg-gradient-to-b from-transparent via-[#00FF41]/40 to-transparent"></div>
            <div className="h-[30%] w-[30%] bg-[#09090B] border-2 border-[#00FF41] relative z-10 shadow-[0_0_40px_rgba(0,255,65,0.2)] flex items-center justify-center overflow-hidden"
                 style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,65,0.2)_0%,_transparent_80%)] animate-pulse"></div>
              <Crosshair className="h-[40%] w-[40%] text-[#00FF41] relative z-10 drop-shadow-[0_0_10px_rgba(0,255,65,0.8)]" />
            </div>
            <div className="absolute top-[10%] left-[80%] text-[8px] text-[#00FF41]/50 font-mono">SYS.OP.001</div>
            <div className="absolute bottom-[10%] left-[10%] text-[8px] text-[#00FF41]/50 font-mono">FHE.SYS.ON</div>
          </div>
        </div>

        {/* Right Column: Terminal */}
        <div className="w-full lg:w-1/2 flex flex-col p-6 lg:p-10 relative z-10 min-h-0">
          <div className="w-full max-w-md mx-auto flex flex-col h-full gap-6">
            
            {/* Terminal Window - Flex-1 to fill space properly */}
            <div className="flex-1 bg-[#000000] border border-zinc-800 rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative min-h-[250px]">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/50 to-transparent"></div>
              
              {/* Header */}
              <div className="bg-[#0a0a0f] border-b border-zinc-800 px-4 py-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00FF41]/80"></div>
                  <span className="text-[9px] text-zinc-500 ml-2 flex items-center gap-1 font-bold"><Terminal size={10}/> sys_console.log</span>
                </div>
                <div className="text-[9px] text-[#00FF41] font-mono flex items-center gap-1">
                  <div className="h-1.5 w-1.5 bg-[#00FF41] rounded-full animate-pulse"></div> LIVE
                </div>
              </div>
              
              {/* Body */}
              <div className="p-4 text-[11px] text-zinc-400 font-mono flex-1 overflow-y-auto leading-relaxed space-y-2">
                <p><span className="text-zinc-600">[SYS]</span> Init dark pool protocol...</p>
                <p><span className="text-zinc-600">[SYS]</span> FHE encryption active. Snipers neutralized.</p>
                <p><span className="text-zinc-600">[SCAN]</span> Searching blocks for active pools...</p>
                <p><span className="text-zinc-600">[RSLT]</span> <span className="text-amber-500 font-bold">0 POOLS FOUND</span></p>
                <p><span className="text-zinc-600">[DATA]</span> Awaiting operator input...</p>
                <br/>
                <p className="text-[#00FF41] font-bold flex items-center gap-1">
                  <span className="text-zinc-600">&gt;</span> AWAITING INITIALIZATION<span className="animate-pulse inline-block w-2 h-3 bg-[#00FF41] ml-1"></span>
                </p>
              </div>
            </div>
            
            {/* Launch Button - Pinned to bottom of the flex container */}
            <div className="shrink-0 space-y-4">
              <Link href="/launch" className="w-full rounded-sm bg-[#00FF41] px-6 py-4 text-xs font-black text-black hover:bg-[#00e03a] transition-all duration-200 flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                <Zap size={16} className="group-hover:animate-bounce" /> INITIALIZE PROTOCOL
              </Link>
              <div className="flex items-center justify-center gap-2 text-[9px] text-zinc-500 font-bold tracking-widest uppercase">
                 <ShieldAlert size={12} className="text-amber-500"/> System standby. No active bids.
              </div>
            </div>
            
          </div>
        </div>

        {/* Footer Status Bar */}
        <div className="absolute bottom-0 left-0 w-full bg-[#09090B] border-t border-zinc-800 px-4 py-1.5 flex justify-between items-center text-[9px] text-zinc-500 font-mono tracking-wider z-20">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#00FF41]"><Lock size={10}/> FHE ACTIVE</span>
            <span className="hidden md:flex items-center gap-1"><Database size={10}/> DEVNET</span>
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