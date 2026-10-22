'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Lock, Flame, Rocket, TrendingUp, ShieldCheck, ArrowUpRight, BarChart3 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Tab = 'pre' | 'post' | 'trending';

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<Tab>('pre');
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial Fetch
    const fetchTokens = async () => {
      const { data, error } = await supabase
        .from('tokens')
        .select('*, auctions(*)')
        .order('created_at', { ascending: false });
      
      if (!error && data) setTokens(data);
      setLoading(false);
    };
    fetchTokens();

    // 2. Realtime Listener (Auto-inject new tokens)
    const channel = supabase
      .channel('explore_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tokens' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setTokens(prev => [payload.new, ...prev]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Mock data fallback for UI demonstration if DB is empty
  const mockData = [
    { id: '1', name: 'Unemployed Cat', symbol: 'UCAT', status: 'active', market_cap: 0, volume_24h: 42000, phase: 'pre' },
    { id: '2', name: 'FairDegens', symbol: 'FAIR', status: 'graduated', market_cap: 1200000, volume_24h: 850000, phase: 'post' },
    { id: '3', name: 'Doge Killer', symbol: 'DOGEK', status: 'graduated', market_cap: 890000, volume_24h: 120000, phase: 'post' },
  ];

  const displayTokens = tokens.length > 0 ? tokens : mockData;

  // Categorization Logic
  const filteredTokens = displayTokens.filter((t: any) => {
    const isGraduated = t.status === 'graduated' || t.phase === 'post';
    if (activeTab === 'pre') return !isGraduated;
    if (activeTab === 'post') return isGraduated;
    return true; // For trending, we show all, but will sort below
  });

  if (activeTab === 'trending') {
    filteredTokens.sort((a, b) => (b.volume_24h || 0) - (a.volume_24h || 0));
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 lg:p-6 flex flex-col gap-6 font-mono text-zinc-300 bg-[#050505]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-6 gap-4 relative">
        <div className="absolute bottom-0 left-0 w-1/4 h-[2px] bg-gradient-to-r from-[#00FF41] to-transparent"></div>
        <div>
          <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-[#00FF41] mb-2 font-black">
            <Flame className="h-3 w-3" /> LIVE ECOSYSTEM
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            EXPLORE
            <span className="text-[9px] bg-[#00FF41]/10 text-[#00FF41] px-2 py-0.5 rounded border border-[#00FF41]/30">LIVE_SYS</span>
          </h1>
        </div>
        <Link href="/launch" className="rounded-sm bg-[#00FF41] px-6 py-3 text-xs font-black text-black hover:bg-[#00e03a] transition-all shadow-[0_0_20px_rgba(0,255,65,0.2)] flex items-center gap-2">
          <Rocket size={16} /> LAUNCH TOKEN
        </Link>
      </div>

      {/* Top Telemetry Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden group">
          <div className="flex justify-between items-center mb-2">
            <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><BarChart3 size={10} /> TOTAL VOLUME</div>
            <div className="h-1.5 w-1.5 bg-[#00FF41] rounded-full animate-pulse"></div>
          </div>
          <div className="text-2xl font-black text-white">$4,209,690</div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden group">
          <div className="flex justify-between items-center mb-2">
            <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><Lock size={10} /> ACTIVE POOLS</div>
          </div>
          <div className="text-2xl font-black text-[#00FF41]">{displayTokens.filter((t:any) => t.status !== 'graduated').length}</div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden group">
          <div className="flex justify-between items-center mb-2">
            <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><TrendingUp size={10} /> TOTAL TOKENS</div>
          </div>
          <div className="text-2xl font-black text-white">{displayTokens.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        {[
          { id: 'pre', label: 'Before Graduation', icon: Lock },
          { id: 'post', label: 'After Graduation', icon: ShieldCheck },
          { id: 'trending', label: 'Trending (Top Volume)', icon: Flame },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-sm transition-all ${
              activeTab === tab.id 
                ? 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30' 
                : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50 border border-transparent'
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Token Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-20 text-center text-zinc-500 animate-pulse">SCANNING BLOCKCHAIN...</div>
        ) : filteredTokens.length === 0 ? (
          <div className="col-span-full border border-zinc-800 border-dashed bg-[#09090B] rounded-sm flex flex-col items-center justify-center py-24">
            <Lock className="h-10 w-10 text-zinc-700 mb-4" />
            <h3 className="text-lg font-black text-white mb-1">NO TOKENS FOUND</h3>
            <p className="text-xs text-zinc-500">Be the first to initialize a pool in this category.</p>
          </div>
        ) : (
          filteredTokens.map((token: any) => (
            <Link href={`/dark-pools/${token.id}`} key={token.id} className="group border border-zinc-800 bg-[#09090B] rounded-sm p-4 hover:border-[#00FF41]/50 transition-all block relative overflow-hidden">
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-zinc-700 group-hover:border-[#00FF41] transition-colors"></div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-zinc-800 border border-zinc-700 text-[10px] flex items-center justify-center font-bold text-zinc-400 group-hover:text-[#00FF41] group-hover:border-[#00FF41] transition-colors rounded-sm">
                  {token.symbol?.slice(0,2) || '??'}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{token.name}</div>
                  <div className="text-[10px] text-zinc-500 font-mono">${token.symbol}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-[10px] text-zinc-500 font-bold mb-0.5">STATUS</div>
                  <div className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                    token.status === 'graduated' ? 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/30' : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  }`}>
                    {token.status === 'graduated' ? 'LIVE' : 'PRE-GRAD'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-zinc-800/50 pt-3">
                <div>
                  <div className="text-[9px] text-zinc-600 font-black tracking-widest mb-1">MARKET CAP</div>
                  <div className="text-sm font-bold text-white">${(token.market_cap || 0).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-zinc-600 font-black tracking-widest mb-1">24H VOLUME</div>
                  <div className="text-sm font-bold text-[#00FF41] flex items-center justify-end gap-1">
                    <ArrowUpRight size={12}/> ${(token.volume_24h || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
