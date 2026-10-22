'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/components/SupabaseProvider';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, Shield, Sparkles, Rocket, TrendingUp, TrendingDown, Target, Users } from 'lucide-react';

// Mock Sparkline
const Sparkline = ({ isUp }: { isUp: boolean }) => {
  const path = isUp 
    ? "M0,20 L10,15 L20,18 L30,10 L40,12 L50,5 L60,8 L70,2 L80,4 L90,0" 
    : "M0,0 L10,5 L20,3 L30,10 L40,8 L50,15 L60,12 L70,18 L80,16 L90,20";
  return (
    <svg viewBox="0 0 90 20" className={`w-20 h-6 ${isUp ? 'text-emerald-500' : 'text-red-500'}`} preserveAspectRatio="none">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default function DarkPoolsPage() {
  const { supabase } = useSupabase();
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuctions() {
      const { data: auctionsData } = await supabase.from('auctions').select('*').order('created_at', { ascending: false });
      const { data: bidsData } = await supabase.from('bids').select('auction_id, amount');

      if (auctionsData) {
        const raisedMap: Record<string, number> = {};
        bidsData?.forEach(bid => { raisedMap[bid.auction_id] = (raisedMap[bid.auction_id] || 0) + Number(bid.amount); });
        
        setAuctions(auctionsData.map(a => {
          const raised = raisedMap[a.id] || 0;
          const target = Number(a.graduation_target) || 2;
          return {
            ...a,
            real_raised: raised,
            is_graduated: raised >= target,
            pct_change: (Math.random() * 200 - 30).toFixed(1) // Mock price change only for graduated
          };
        }));
      }
      setLoading(false);
    }
    fetchAuctions();
  }, [supabase]);

  if (loading) return <div className="p-20 text-center font-mono text-cyan-400 animate-pulse">Initializing...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-mono text-3xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
            <Flame className="text-cyan-400" size={28} /> TRENDING MEMES
          </h1>
          <p className="font-mono text-sm text-slate-400">The safest way to launch and trade memecoins.</p>
        </div>
        <Link href="/launch" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono px-5 py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center gap-2">
          LAUNCH MEME <Rocket size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {auctions.map((auction) => {
          const target = Number(auction.graduation_target) || 2;
          const raised = auction.real_raised || 0;
          const isGraduated = auction.is_graduated;
          const progress = Math.min(100, Math.floor((raised / target) * 100));
          const isUp = Number(auction.pct_change) > 0;

          return (
            <Link href={`/dark-pools/${auction.id}`} key={auction.id}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111116] border border-white/5 rounded-2xl p-4 hover:border-cyan-500/40 transition-all group relative overflow-hidden shadow-xl">
                {isGraduated ? (
                  <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-400 border-b border-l border-emerald-500/30 text-[9px] font-bold font-mono px-2 py-1 rounded-bl-lg z-10 flex items-center gap-1 shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-md">
                    <Sparkles size={10} /> GRADUATED
                  </div>
                ) : (
                  <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-500 border-b border-l border-amber-500/20 text-[9px] font-bold font-mono px-2 py-1 rounded-bl-lg z-10 flex items-center gap-1 backdrop-blur-md">
                    <Target size={10} /> BOOTSTRAPPING
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4 mt-2">
                  <div className="flex items-center gap-3">
                    {auction.image_url ? (
                      <img src={auction.image_url} alt={auction.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10"><span className="font-mono text-sm text-slate-500">{auction.ticker?.slice(0, 2)}</span></div>
                    )}
                    <div>
                      <h3 className="text-sm font-bold font-mono text-white group-hover:text-cyan-400 transition-colors truncate max-w-[100px]">{auction.name}</h3>
                      <span className="text-[9px] font-mono text-slate-400">{auction.ticker}</span>
                    </div>
                  </div>
                  {isGraduated && <Sparkline isUp={isUp} />}
                </div>

                <div className="flex justify-between items-end mb-3">
                  <div>
                    {/* 🔴 DYNAMIC LABEL: MCAP vs RAISED */}
                    <div className="text-[9px] text-slate-500 font-mono mb-0.5 uppercase tracking-wider">
                      {isGraduated ? 'Market Cap' : 'Liquidity Raised'}
                    </div>
                    <div className="text-sm text-white font-mono font-bold">
                      {isGraduated ? `$${(raised * 150).toLocaleString()}` : `${raised.toFixed(2)} / ${target} SOL`}
                    </div>
                  </div>
                  {isGraduated ? (
                    <div className={`flex items-center gap-1 font-mono text-xs font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isUp ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} {auction.pct_change}%
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
                      <Users size={12}/> {raised > 0 ? 'Active' : 'New'}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-mono">
                    <span className="text-slate-400">{isGraduated ? 'LP Locked' : 'Bootstrapping Progress'}</span>
                    <span className={isGraduated ? 'text-emerald-400' : 'text-cyan-400'}>{isGraduated ? '100%' : `${progress}%`}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                    <div className={`h-full ${isGraduated ? 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]'}`} style={{ width: `${isGraduated ? 100 : progress}%` }} />
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
