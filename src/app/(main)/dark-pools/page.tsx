'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Lock, Flame, Rocket, TrendingUp, ShieldCheck, ArrowUpRight, BarChart3, Search, Activity } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fast SVG Sparkline component
const Sparkline = ({ data, color = "#00FF41" }: { data: number[], color?: string }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" className="w-full h-12 preserve-3d" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="3" points={points} vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<'pre' | 'post' | 'trending'>('pre');
  const [searchQuery, setSearchQuery] = useState('');
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock Data (Will be replaced by Supabase data)
  const mockData = [
    { id: '1', name: 'Unemployed Cat', symbol: 'UCAT', status: 'active', market_cap: 0, volume_24h: 42000, phase: 'pre', sparkline: [10, 15, 12, 20, 18, 30, 25, 40] },
    { id: '2', name: 'FairDegens', symbol: 'FAIR', status: 'graduated', market_cap: 1200000, volume_24h: 850000, phase: 'post', sparkline: [5, 8, 10, 8, 15, 20, 18, 25] },
    { id: '3', name: 'Doge Killer', symbol: 'DOGEK', status: 'graduated', market_cap: 890000, volume_24h: 120000, phase: 'post', sparkline: [30, 25, 20, 22, 15, 10, 12, 8] },
    { id: '4', name: 'Pepe 2.0', symbol: 'PEPE2', status: 'active', market_cap: 0, volume_24h: 15000, phase: 'pre', sparkline: [5, 5, 5, 5, 5, 5, 5, 5] },
  ];

  useEffect(() => {
    const fetchTokens = async () => {
      const { data, error } = await supabase.from('tokens').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        // Merge real data with mock sparkline
        const enriched = data.map(d => ({ ...d, sparkline: [10, 20, 15, 30, 25, 40, 35, 50] }));
        setTokens(enriched);
      } else {
        setTokens(mockData);
      }
      setLoading(false);
    };
    fetchTokens();

    const channel = supabase.channel('explore_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tokens' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setTokens(prev => [{ ...payload.new, sparkline: [10, 10, 10, 10, 10, 10, 10, 10] }, ...prev]);
        }
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const displayTokens = tokens.length > 0 ? tokens : mockData;

  const filteredTokens = displayTokens.filter((t: any) => {
    const isGraduated = t.status === 'graduated' || t.phase === 'post';
    
    // Search filter
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase()) && !t.symbol.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (activeTab === 'pre') return !isGraduated;
    if (activeTab === 'post') return isGraduated;
    return true;
  });

  if (activeTab === 'trending') {
    filteredTokens.sort((a, b) => (b.volume_24h || 0) - (a.volume_24h || 0));
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 lg:p-6 flex flex-col gap-6 font-mono text-zinc-300 bg-[#050505]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-6 gap-4 relative">
        <div className="absolute bottom-0 left-0 w-1/4 h-[2px] bg-gradient-to-r from-[#00FF41] to-transparent"></div>
        <div>
          <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-[#00FF41] mb-2 font-black">
            <Flame className="h-3 w-3" /> DISCOVERY HUB
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            EXPLORE
            <span className="text-[9px] bg-[#00FF41]/10 text-[#00FF41] px-2 py-0.5 rounded border border-[#00FF41]/30">LIVE_MARKET</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input 
              type="text" 
              placeholder="Search tokens..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#09090B] border border-zinc-800 rounded-sm pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FF41] transition-colors"
            />
          </div>
          <Link href="/launch" className="rounded-sm bg-[#00FF41] px-6 py-2 text-xs font-black text-black hover:bg-[#00e03a] transition-all shadow-[0_0_20px_rgba(0,255,65,0.2)] flex items-center gap-2 whitespace-nowrap">
            <Rocket size={14} /> LAUNCH
          </Link>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm flex items-center justify-between">
          <div>
            <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><BarChart3 size={10} /> ECOSYSTEM VOLUME</div>
            <div className="text-2xl font-black text-white mt-1">$4,209,690</div>
          </div>
          <Activity className="text-[#00FF41] opacity-20" size={32} />
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm flex items-center justify-between">
          <div>
            <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><Lock size={10} /> PRE-GRADUATION</div>
            <div className="text-2xl font-black text-amber-500 mt-1">{displayTokens.filter((t:any) => t.status !== 'graduated').length}</div>
          </div>
          <Lock className="text-amber-500 opacity-20" size={32} />
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm flex items-center justify-between">
          <div>
            <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1"><ShieldCheck size={10} /> GRADUATED</div>
            <div className="text-2xl font-black text-[#00FF41] mt-1">{displayTokens.filter((t:any) => t.status === 'graduated').length}</div>
          </div>
          <ShieldCheck className="text-[#00FF41] opacity-20" size={32} />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto">
        {[
          { id: 'pre', label: 'Before Graduation', icon: Lock },
          { id: 'post', label: 'After Graduation', icon: ShieldCheck },
          { id: 'trending', label: 'Trending', icon: TrendingUp },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-sm transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30' 
                : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50 border border-transparent'
            }`}
          >
            <tab.icon size={14} /> {tab.label}
            <span className={`ml-2 text-[9px] px-1.5 py-0.5 rounded ${activeTab === tab.id ? 'bg-[#00FF41] text-black' : 'bg-zinc-800 text-zinc-400'}`}>
              {displayTokens.filter((t:any) => tab.id === 'pre' ? t.status !== 'graduated' : tab.id === 'post' ? t.status === 'graduated' : true).length}
            </span>
          </button>
        ))}
      </div>

      {/* Token Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTokens.length === 0 ? (
          <div className="col-span-full border border-zinc-800 border-dashed bg-[#09090B] rounded-sm flex flex-col items-center justify-center py-24">
            <Search className="h-10 w-10 text-zinc-700 mb-4" />
            <h3 className="text-lg font-black text-white mb-1">NO TOKENS FOUND</h3>
            <p className="text-xs text-zinc-500">Try adjusting your filters or search.</p>
          </div>
        ) : (
          filteredTokens.map((token: any) => (
            <Link href={`/dark-pools/${token.id}`} key={token.id} className="group border border-zinc-800 bg-[#09090B] rounded-sm p-5 hover:border-[#00FF41]/60 transition-all block relative overflow-hidden">
              {/* Dynamic Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FF41]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="h-12 w-12 bg-[#111116] border border-zinc-700 text-xs flex items-center justify-center font-black text-[#00FF41] group-hover:border-[#00FF41] transition-colors rounded-md shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  {token.symbol?.slice(0,2) || '??'}
                </div>
                <div>
                  <div className="font-bold text-white text-base">{token.name}</div>
                  <div className="text-[10px] text-zinc-500 font-mono">${token.symbol}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className={`text-[9px] font-black px-2 py-1 rounded border ${
                    token.status === 'graduated' ? 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/30' : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  }`}>
                    {token.status === 'graduated' ? 'LIVE' : 'PRE-GRAD'}
                  </div>
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="h-12 mb-4 relative z-10">
                <Sparkline data={token.sparkline || [10,20,15,30]} color={token.status === 'graduated' ? '#00FF41' : '#f59e0b'} />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-zinc-800/80 pt-3 relative z-10">
                <div>
                  <div className="text-[9px] text-zinc-600 font-black tracking-widest mb-1">MCAP</div>
                  <div className="text-sm font-bold text-white">${(token.market_cap || 0).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-zinc-600 font-black tracking-widest mb-1">24H VOL</div>
                  <div className="text-sm font-bold text-[#00FF41] flex items-center justify-end gap-1">
                    ${(token.volume_24h || 0).toLocaleString()}
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
