'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSupabase } from '@/components/SupabaseProvider';
import { User, ShieldAlert, Lock, Flame, ArrowLeft, Loader2, Award } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const SOL_PRICE = 150;

export default function PublicOperatorPage() {
  const { id } = useParams();
  const { supabase } = useSupabase();
  
  const [profile, setProfile] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOperatorData() {
      // 1. Fetch Profile
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (profileData) setProfile(profileData);

      // 2. Fetch Bids (only if profile exists and is not private)
      if (profileData && !profileData.is_private) {
        const { data: bidsData } = await supabase
          .from('bids')
          .select(`
            amount, 
            auctions ( id, name, ticker, image_url )
          `)
          .eq('user_id', id)
          .order('created_at', { ascending: false });
        
        if (bidsData) setBids(bidsData);
      }
      
      setLoading(false);
    }
    fetchOperatorData();
  }, [id, supabase]);

  if (loading) return <div className="p-20 text-center font-mono text-cyan-400 animate-pulse">Scanning Operator Dossier...</div>;
  if (!profile) return <div className="p-20 text-center font-mono text-white">Operator not found.</div>;

  const totalVolume = bids.reduce((sum, bid) => sum + Number(bid.amount), 0);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link href="/dark-pools" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-mono text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> BACK TO FEED
      </Link>

      {/* Profile Header */}
      <div className="bg-[#0D0D14] border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center gap-8 relative overflow-hidden">
        
        {profile.is_private && (
          <div className="absolute top-0 right-0 bg-red-500/10 text-red-400 border-b border-l border-red-500/20 px-4 py-1 text-xs font-mono font-bold flex items-center gap-2 rounded-bl-lg">
            <Lock size={12} /> PRIVATE OPERATOR
          </div>
        )}

        <div className="w-32 h-32 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} className="w-full h-full object-cover" />
          ) : (
            <User size={48} className="text-slate-500" />
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold font-mono text-white mb-2 flex items-center gap-3">
            {profile.username || 'Anonymous Operator'}
            <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-1 rounded-lg">VERIFIED</span>
          </h1>
          <p className="text-sm font-mono text-slate-400 mb-4 max-w-xl">
            {profile.bio || "This operator hasn't set a bio yet."}
          </p>
          
          <div className="flex gap-6">
            <div>
              <div className="text-[10px] font-mono text-slate-500">TOTAL VOLUME</div>
              <div className="text-lg font-mono text-white font-bold">
                {profile.is_private ? '***' : `${totalVolume.toFixed(2)} SOL`}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500">POSITIONS</div>
              <div className="text-lg font-mono text-white font-bold">
                {profile.is_private ? '***' : bids.length}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500">EST. VALUE</div>
              <div className="text-lg font-mono text-emerald-400 font-bold">
                {profile.is_private ? '***' : `$${(totalVolume * SOL_PRICE).toFixed(2)}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio / Activity */}
      <div className="mt-8">
        <h2 className="font-mono text-lg text-white font-bold mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
          <Flame size={18} className="text-cyan-400" /> RECENT PLAYS
        </h2>

        {profile.is_private ? (
          <div className="bg-[#0D0D14] border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <ShieldAlert size={48} className="text-slate-600 mb-4" />
            <h3 className="text-xl font-mono text-white mb-2">Holdings Hidden</h3>
            <p className="text-sm font-mono text-slate-500 max-w-md">
              This operator has enabled Private Mode. Their wallet size, positions, and trading history are hidden from the public.
            </p>
          </div>
        ) : bids.length === 0 ? (
          <div className="bg-[#0D0D14] border border-slate-800 rounded-2xl p-12 text-center text-slate-500 font-mono text-sm">
            No trading history found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bids.map((bid, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#0D0D14] border border-slate-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {bid.auctions.image_url ? (
                    <img src={bid.auctions.image_url} className="w-10 h-10 rounded-lg object-cover border border-slate-700" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                      <span className="font-mono text-xs text-slate-500">{bid.auctions.ticker?.slice(0, 2)}</span>
                    </div>
                  )}
                  <div>
                    <div className="font-mono text-white font-bold text-sm">{bid.auctions.name}</div>
                    <div className="font-mono text-slate-500 text-xs">{bid.auctions.ticker}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-emerald-400 font-bold text-sm">{bid.amount} SOL</div>
                  <div className="font-mono text-slate-500 text-[10px]">${(bid.amount * SOL_PRICE).toFixed(0)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
