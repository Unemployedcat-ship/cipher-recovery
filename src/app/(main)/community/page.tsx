'use client';
import { useState } from 'react';
import { Hash, Send, ShieldAlert } from 'lucide-react';

const CHANNELS = [
  { id: 'general-chat', name: 'general-chat' },
  { id: 'degen-alpha', name: 'degen-alpha' },
  { id: 'sniper-watchtower', name: 'sniper-watchtower' },
  { id: 'meme-dumpster', name: 'meme-dumpster' },
];

export default function CommunityPage() {
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0].id);

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-[#050505] font-mono text-zinc-300 p-4 md:p-6 gap-4 md:gap-6">
      
      {/* Channels Sidebar (Horizontal Scroll on Mobile) */}
      <div className="w-full md:w-64 border border-zinc-800 bg-[#09090B] rounded-lg flex flex-col overflow-hidden shrink-0">
        <div className="p-3 md:p-4 border-b border-zinc-800 text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
          <Hash size={14} className="text-[#00FF41]" /> Channels
        </div>
        <div className="p-2 flex md:flex-col overflow-x-auto md:overflow-y-auto gap-1 md:gap-0 hide-scrollbar">
          {CHANNELS.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={`whitespace-nowrap text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${activeChannel === channel.id ? 'bg-[#00FF41]/10 text-[#00FF41] font-bold' : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'}`}
            >
              <Hash size={14} /> {channel.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 border border-zinc-800 bg-[#09090B] rounded-lg flex flex-col overflow-hidden min-h-[400px]">
        <div className="p-3 md:p-4 border-b border-zinc-800 flex justify-between items-center bg-[#111116]">
          <div className="flex items-center gap-2 text-white font-bold"><Hash size={16} className="text-[#00FF41]" /> {activeChannel}</div>
          <div className="text-[10px] text-[#00FF41] bg-[#00FF41]/10 px-2 py-1 rounded border border-[#00FF41]/20 flex items-center gap-1">
            <div className="h-1.5 w-1.5 bg-[#00FF41] rounded-full animate-pulse"></div> 42 Online
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
          <div className="text-center text-xs text-zinc-600 my-4">Welcome to the beginning of #{activeChannel}.</div>
          <div className="flex gap-3">
            <div className="h-8 w-8 shrink-0 rounded bg-[#00FF41]/20 border border-[#00FF41]/30 flex items-center justify-center text-[#00FF41] font-bold text-xs">U</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Unemployed Cat</span>
                <span className="text-[10px] text-zinc-500">Today</span>
              </div>
              <p className="text-sm text-zinc-400 mt-1">Welcome to the FairDegens alpha channel. Snipers are banned. Only fair launches here.</p>
            </div>
          </div>
        </div>

        <div className="p-3 md:p-4 bg-[#111116] border-t border-zinc-800">
          <div className="flex items-center gap-2 bg-[#050505] border border-zinc-800 rounded-md px-3 py-2 focus-within:border-[#00FF41]/50 transition-colors">
            <input type="text" placeholder={`Message #${activeChannel}...`} className="flex-1 bg-transparent text-sm text-white outline-none placeholder-zinc-600" />
            <button className="text-[#00FF41] hover:text-[#00e03a] transition-colors"><Send size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}