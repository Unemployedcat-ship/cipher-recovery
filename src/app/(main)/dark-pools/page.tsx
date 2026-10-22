'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Lock, Flame, Rocket, TrendingUp, ShieldCheck, Search, Activity, Users } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const Sparkline = ({ data, color = "#00FF41" }: { data: number[], color?: string }) => {
  const min = Math.min(...data); const max = Math.max(...data); const range = max - min || 1;
  const points = data.map((val, i) => ({ x: (i / (data.length - 1)) * 100, y: 100 - ((val - min) / range) * 80 }));
  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');
  const polygon = `0,100 ${polyline} 100,100`;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-16" preserveAspectRatio="none">
      <defs><linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <polygon points={polygon} fill={`url(#grad-${color.replace('#', '')})`} />
      <polyline fill="none" stroke={color} strokeWidth="2" points={polyline} vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_4px_rgba(0,255,65,0.5)]" />
    </svg>
  );
};

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<'pre' | 'post' | 'trending'>('pre');
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(1);

  useEffect(() => {
    fetch('/api/tokens').then(res => res.json()).then(data => { if (data.tokens) setTokens(data.tokens); setLoading(false); });
    const channel = supabase.channel('explore_realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'tokens' }, (payload) => {
      if (payload.eventType === 'INSERT') setTokens(prev => [payload.new, ...prev]);
    }).subscribe();

    const presenceChannel = supabase.channel('active-users', { config: { presence: { key: Math.random().toString(36).substring(7) } } });
    presenceChannel.on('presence', { event: 'sync' }, () => setActiveUsers(Object.keys(presenceChannel.presenceState()).length + 1419))
      .subscribe(async (status) => { if (status === 'SUBSCRIBED') await presenceChannel.track({ online_at: new Date().toISOString() }); });

    return () => { supabase.removeChannel(channel); supabase.removeChannel(presenceChannel); };
  }, []);

  const filteredTokens = tokens.filter((t: any) => {
    const isGraduated = t.status === 'graduated';
    if (activeTab === 'pre') return !isGraduated;
    if (activeTab === 'post') return isGraduated;
    return true;
  });
  if (activeTab === 'trending') filteredTokens.sort((a, b) => (b.volume_24h || 0) - (a.volume_24h || 0));

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 lg:p-6 flex flex-col gap-6 font-mono text-zinc-300 bg-[#050505]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-[#00FF41] mb-2 font-black"><Flame className="h-3 w-3" /> DISCOVERY HUB</div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-3">EXPLORE <span className="text-[9px] bg-[#00FF41]/10 text-[#00FF41] px-2 py-0.5 rounded border border-[#00FF41]/30">LIVE</span></h1>
        </div>
        <Link href="/launch" className="rounded-sm bg-[#00FF41] px-6 py-2 text-xs font-black text-black hover:bg-[#00e03a] transition-all flex items-center gap-2"><Rocket size={14} /> LAUNCH</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm flex items-center justify-between">
          <div><div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><Users size={10} /> ACTIVE USERS</div><div className="text-2xl font-black text-white mt-1 flex items-center gap-2">{activeUsers.toLocaleString()}<span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF41]"></span></span></div></div>
          <Activity className="text-[#00FF41] opacity-20" size={32} />
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm flex items-center justify-between"><div><div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><Lock size={10} /> PRE-GRADUATION</div><div className="text-2xl font-black text-amber-500 mt-1">{tokens.filter((t:any) => t.status !== 'graduated').length}</div></div><Lock className="text-amber-500 opacity-20" size={32} /></div>
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm flex items-center justify-between"><div><div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><ShieldCheck size={10} /> GRADUATED</div><div className="text-2xl font-black text-[#00FF41] mt-1">{tokens.filter((t:any) => t.status === 'graduated').length}</div></div><ShieldCheck className="text-[#00FF41] opacity-20" size={32} /></div>
      </div>

      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        {[{ id: 'pre', label: 'Before Graduation', icon: Lock }, { id: 'post', label: 'After Graduation', icon: ShieldCheck }, { id: 'trending', label: 'Trending', icon: TrendingUp }].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-sm transition-all ${activeTab === tab.id ? 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30' : 'text-zinc-500 hover:text-white'}`}><tab.icon size={14} /> {tab.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? <div className="col-span-full py-20 text-center text-zinc-500 animate-pulse">SCANNING BLOCKCHAIN...</div> : filteredTokens.map((token: any) => (
          <Link href={`/dark-pools/${token.id}`} key={token.id} className="group border border-zinc-800 bg-[#09090B] rounded-sm p-4 hover:border-[#00FF41]/60 transition-all block relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <div className="h-10 w-10 bg-[#111116] border border-zinc-700 flex items-center justify-center font-black text-[#00FF41] rounded-md overflow-hidden">{token.image_url ? <img src={token.image_url} className="h-full w-full object-cover"/> : token.symbol?.slice(0,2)}</div>
              <div><div className="font-bold text-white text-sm truncate w-32">{token.name}</div><div className="text-[10px] text-zinc-500 font-mono">${token.symbol}</div></div>
            </div>
            <div className="h-14 mb-3"><Sparkline data={[10,20,15,30,25]} color={token.status === 'graduated' ? '#00FF41' : '#f59e0b'} /></div>
            <div className="grid grid-cols-2 gap-2 border-t border-zinc-800/80 pt-2">
              <div><div className="text-[8px] text-zinc-600 font-black tracking-widest mb-0.5">MCAP</div><div className="text-[11px] font-bold text-white">${(token.market_cap || 0).toLocaleString()}</div></div>
              <div className="text-right"><div className="text-[8px] text-zinc-600 font-black tracking-widest mb-0.5">24H VOL</div><div className="text-[11px] font-bold text-[#00FF41]">${(token.volume_24h || 0).toLocaleString()}</div></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
