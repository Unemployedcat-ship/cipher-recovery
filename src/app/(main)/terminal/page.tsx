'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/components/SupabaseProvider';
import { Activity, TrendingUp, Flame, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function TerminalPage() {
  const { supabase } = useSupabase();
  const [topGainers, setTopGainers] = useState<any[]>([]);
  const [topTraders, setTopTraders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch Top Gainers (Auctions with most SOL raised)
      const { data: auctions } = await supabase.from('auctions').select('id, name, ticker, image_url, graduation_target');
      const { data: bids } = await supabase.from('bids').select('amount, auction_id, user_id');
      
      if (auctions && bids) {
        const auctionStats = auctions.map(a => ({
          ...a,
          raised: bids.filter(b => b.auction_id === a.id).reduce((s, b) => s + Number(b.amount), 0)
        })).sort((a, b) => b.raised - a.raised).slice(0, 3);
        
        setTopGainers(auctionStats);

        // 2. Fetch Top Traders (Users with most volume)
        const userVolume: Record<string, number> = {};
        bids.forEach(b => {
          userVolume[b.user_id] = (userVolume[b.user_id] || 0) + Number(b.amount);
        });

        const sortedUserIds = Object.keys(userVolume).sort((a, b) => userVolume[b] - userVolume[a]).slice(0, 5);
        if (sortedUserIds.length > 0) {
          const { data: profiles } = await supabase.from('profiles').select('id, username, avatar_url').in('id', sortedUserIds);
          if (profiles) {
            const traders = profiles.map(p => ({
              ...p,
              volume: userVolume[p.id]
            })).sort((a, b) => b.volume - a.volume);
            setTopTraders(traders);
          }
        }
      }
    }
    fetchData();
  }, [supabase]);

  const totalVolume = topGainers.reduce((sum, g) => sum + g.raised, 0) * 150;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-mono text-white mb-2 flex items-center gap-3">
          <Activity className="text-cyan-400" size={28} /> MARKET PULSE
        </h1>
        <p className="font-mono text-sm text-slate-400">Global ecosystem metrics and top trader performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-sm font-mono text-white font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <TrendingUp size={16} className="text-emerald-400" /> TOP GAINERS
            </h3>
            <div className="space-y-3">
              {topGainers.map((coin, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl hover:bg-white/[0.04] transition-colors border border-white/5 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-mono text-xs text-slate-400 border border-white/10 overflow-hidden">
                      {coin.image_url ? <img src={coin.image_url} className="w-full h-full object-cover" /> : coin.ticker?.slice(0,2)}
                    </div>
                    <div>
                      <div className="text-sm font-bold font-mono text-white group-hover:text-cyan-400 transition-colors">{coin.name}</div>
                      <div className="text-[10px] font-mono text-slate-500">{coin.ticker}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-mono text-white">${(coin.raised * 150).toLocaleString()}</div>
                      <div className="text-[10px] font-mono text-emerald-400 flex items-center justify-end gap-1"><ArrowUpRight size={10}/> {coin.raised.toFixed(1)} SOL Raised</div>
                    </div>
                    <Link href={`/dark-pools/${coin.id}`} className="p-2 bg-white/5 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors"><ArrowUpRight size={14}/></Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 h-64 shadow-2xl relative overflow-hidden flex flex-col justify-end">
             <div className="absolute top-6 left-6 z-10">
               <div className="text-xs font-mono text-slate-400 mb-1">TOTAL VOLUME (ALL TIME)</div>
               <div className="text-3xl font-mono text-white font-bold">${totalVolume.toLocaleString()}</div>
             </div>
             <svg viewBox="0 0 100 30" className="w-full h-32 text-cyan-500 opacity-50" preserveAspectRatio="none">
               <path d="M0,25 Q10,20 20,22 T40,10 T60,15 T80,5 T100,0 L100,30 L0,30 Z" fill="currentColor" fillOpacity="0.1"/>
               <path d="M0,25 Q10,20 20,22 T40,10 T60,15 T80,5 T100,0" fill="none" stroke="currentColor" strokeWidth="0.5"/>
             </svg>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-sm font-mono text-white font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <Flame size={16} className="text-amber-400" /> TOP TRADERS
            </h3>
            <div className="space-y-4">
              {topTraders.length > 0 ? topTraders.map((trader, rank) => (
                <div key={trader.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono font-bold w-4 ${rank === 0 ? 'text-amber-400' : rank === 1 ? 'text-slate-300' : rank === 2 ? 'text-amber-600' : 'text-slate-600'}`}>#{rank + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-900 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white group-hover:scale-110 transition-transform overflow-hidden">
                      {trader.avatar_url ? <img src={trader.avatar_url} className="w-full h-full object-cover" /> : (trader.username?.slice(0,2).toUpperCase() || 'AN')}
                    </div>
                    <div>
                      <div className="text-xs font-mono text-white group-hover:text-cyan-400 transition-colors">{trader.username || 'Anonymous'}</div>
                      <div className="text-[9px] font-mono text-slate-500">Volume: {trader.volume.toFixed(1)} SOL</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 font-bold">${(trader.volume * 150).toLocaleString()}</div>
                </div>
              )) : <div className="text-xs font-mono text-slate-500 text-center py-4">No trader data yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
