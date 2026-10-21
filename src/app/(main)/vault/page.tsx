'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSupabase } from '@/components/SupabaseProvider';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { Wallet, ArrowRight, Lock, TrendingUp, ArrowUpRight, Rocket, Activity } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const SOL_PRICE = 150;

export default function VaultPage() {
  const { user } = usePrivy();
  const { supabase } = useSupabase();
  const { address, balance } = useSolanaWallet();
  
  const [myLaunches, setMyLaunches] = useState<any[]>([]);
  const [myBids, setMyBids] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'launches' | 'bids'>('launches');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ invested: 0, value: 0 });

  useEffect(() => {
    async function fetchVault() {
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('id').eq('privy_did', user.id).single();
      if (!profile) { setLoading(false); return; }

      // 1. Fetch Launches (Coins you made)
      const { data: launches } = await supabase
        .from('auctions')
        .select('*, bids(amount)')
        .eq('creator_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (launches) {
        const formattedLaunches = launches.map(a => ({
          ...a,
          total_raised: a.bids.reduce((sum: number, b: any) => sum + Number(b.amount), 0)
        }));
        setMyLaunches(formattedLaunches);
      }

      // 2. Fetch Bids (Coins you bought)
      const { data: bids } = await supabase
        .from('bids')
        .select(`id, amount, created_at, auctions ( id, name, ticker, status, image_url, graduation_target )`)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (bids) {
        setMyBids(bids);
        const totalInvested = bids.reduce((sum, b) => sum + Number(b.amount), 0);
        setStats({ invested: totalInvested, value: totalInvested * SOL_PRICE });
      }

      setLoading(false);
    }
    fetchVault();
  }, [user, supabase]);

  if (!user) return <div className="p-20 text-center font-mono text-white">Connect Identity</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Wallet className="text-cyan-400" size={28} /> SECURE VAULT
          </h1>
          <p className="font-mono text-sm text-slate-400">Manage your active bids and portfolio positions.</p>
        </div>
      </header>

      {/* Wallet Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111116] border border-white/5 rounded-2xl p-5 shadow-lg">
          <div className="text-[10px] font-mono text-slate-500 mb-1 uppercase tracking-wider">Available Balance</div>
          <div className="text-2xl font-mono text-white font-bold">{balance?.toFixed(3) || '0.000'} <span className="text-sm text-slate-500">SOL</span></div>
        </div>
        <div className="bg-[#111116] border border-white/5 rounded-2xl p-5 shadow-lg">
          <div className="text-[10px] font-mono text-slate-500 mb-1 uppercase tracking-wider">Total Invested</div>
          <div className="text-2xl font-mono text-white font-bold">{stats.invested.toFixed(2)} <span className="text-sm text-slate-500">SOL</span></div>
        </div>
        <div className="bg-[#111116] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 blur-xl"></div>
          <div className="text-[10px] font-mono text-slate-500 mb-1 uppercase tracking-wider">Est. Portfolio Value</div>
          <div className="text-2xl font-mono text-emerald-400 font-bold">${stats.value.toFixed(2)}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/5 pb-px">
        <button 
          onClick={() => setActiveTab('launches')} 
          className={`px-6 py-3 text-xs font-mono font-bold transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'launches' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-500 hover:text-white'}`}
        >
          <Rocket size={14} /> MY LAUNCHES ({myLaunches.length})
        </button>
        <button 
          onClick={() => setActiveTab('bids')} 
          className={`px-6 py-3 text-xs font-mono font-bold transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'bids' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-500 hover:text-white'}`}
        >
          <Activity size={14} /> MY POSITIONS ({myBids.length})
        </button>
      </div>

      {loading ? (
        <div className="text-cyan-400 font-mono animate-pulse text-sm">Scanning vault...</div>
      ) : (
        <div className="space-y-3">
          
          {/* LAUNCHES TAB */}
          {activeTab === 'launches' && (
            myLaunches.length === 0 ? (
              <div className="bg-[#111116] border border-white/5 rounded-2xl p-12 text-center text-slate-500 font-mono text-sm">You haven't launched any tokens yet.</div>
            ) : (
              myLaunches.map((a) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111116] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-cyan-500/30 transition-all shadow-lg">
                  <div className="flex items-center gap-4">
                    {a.image_url ? <img src={a.image_url} className="w-12 h-12 rounded-xl object-cover border border-white/10" /> : <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10 font-mono text-slate-500">{a.ticker?.slice(0,2)}</div>}
                    <div>
                      <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                        {a.name} <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/5 text-slate-400">{a.ticker}</span>
                      </h3>
                      <div className="text-[11px] font-mono text-slate-500 mt-1 flex items-center gap-3">
                        <span>Raised: <span className="text-white">{a.total_raised} SOL</span></span>
                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                        <span>Target: <span className="text-cyan-400">{a.graduation_target} SOL</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {a.status === 'settled' ? (
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1"><TrendingUp size={12}/> LIVE ON RAYDIUM</span>
                    ) : a.status === 'failed' ? (
                      <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1"><Lock size={12}/> FAILED</span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1"><Lock size={12}/> BOOTSTRAPPING</span>
                    )}
                    <Link href={`/dark-pools/${a.id}`} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-400/30 transition-all"><ArrowRight size={14}/></Link>
                  </div>
                </motion.div>
              ))
            )
          )}

          {/* BIDS TAB */}
          {activeTab === 'bids' && (
            myBids.length === 0 ? (
              <div className="bg-[#111116] border border-white/5 rounded-2xl p-12 text-center text-slate-500 font-mono text-sm">You haven't placed any bids yet.</div>
            ) : (
              myBids.map((bid) => {
                const auction = bid.auctions;
                const isGraduated = auction?.status === 'settled';
                const currentValue = bid.amount * SOL_PRICE * (isGraduated ? 1.42 : 1); // Mock multiplier
                const pnl = currentValue - (bid.amount * SOL_PRICE);

                return (
                  <motion.div key={bid.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111116] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-cyan-500/30 transition-all shadow-lg">
                    <div className="flex items-center gap-4">
                      {auction?.image_url ? <img src={auction.image_url} className="w-12 h-12 rounded-xl object-cover border border-white/10" /> : <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10 font-mono text-slate-500">{auction?.ticker?.slice(0,2)}</div>}
                      <div>
                        <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                          {auction?.name} <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/5 text-slate-400">{auction?.ticker}</span>
                        </h3>
                        <div className="text-[11px] font-mono text-slate-500 mt-1 flex items-center gap-3">
                          <span>Invested: <span className="text-white">{bid.amount} SOL</span></span>
                          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                          <span>Value: <span className="text-emerald-400">${currentValue.toFixed(0)}</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {isGraduated ? (
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold"><ArrowUpRight size={12}/> +${pnl.toFixed(2)} PnL</div>
                          <div className="text-[10px] font-mono text-slate-500">LIVE ON RAYDIUM</div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20">
                          <Lock size={12} /> <span className="font-mono text-[10px] font-bold">BOOTSTRAPPING</span>
                        </div>
                      )}
                      <Link href={`/dark-pools/${auction?.id}`} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-400/30 transition-all"><ArrowRight size={14}/></Link>
                    </div>
                  </motion.div>
                );
              })
            )
          )}

        </div>
      )}
    </div>
  );
}
