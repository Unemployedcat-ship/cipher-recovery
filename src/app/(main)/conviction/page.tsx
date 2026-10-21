'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSupabase } from '@/components/SupabaseProvider';
import { Shield, Zap, Star, Award, Flame, Trophy, Clock, Lock, CheckCircle2, Rocket, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConvictionPage() {
  const { user } = usePrivy();
  const { supabase } = useSupabase();
  const [userCP, setUserCP] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from('profiles').select('conviction_points').eq('privy_did', user.id).single();
      if (data) setUserCP(data.conviction_points || 0);
      setLoading(false);
    }
    fetchProfile();
  }, [user, supabase]);

  const currentTier = userCP >= 10000 ? 'DIAMOND' : userCP >= 2500 ? 'GOLD' : userCP >= 500 ? 'SILVER' : 'BRONZE';
  const nextTierCP = currentTier === 'BRONZE' ? 500 : currentTier === 'SILVER' ? 2500 : currentTier === 'GOLD' ? 10000 : 50000;
  const progressPercent = Math.min(100, (userCP / nextTierCP) * 100);

  const dailyMissions = [
    { id: 'd1', title: 'Ape In', desc: 'Buy 1 SOL worth of any token', points: 10 },
    { id: 'd2', title: 'Shill Master', desc: 'Send 5 messages in the community chat', points: 5 },
    { id: 'd3', title: 'Early Bird', desc: 'Bid on a token within the first 5 minutes', points: 15 },
  ];

  const weeklyMissions = [
    { id: 'w1', title: 'First Launch', desc: 'Launch your first memecoin on Cipher', points: 100 },
    { id: 'w2', title: 'Diamond Hands', desc: 'Hold a token for 24 hours post-graduation', points: 250 },
    { id: 'w3', title: 'Whale Watcher', desc: 'Invest a total of 10 SOL across launches', points: 150 },
  ];

  const badges = [
    { name: 'First Blood', icon: Flame, unlocked: true, progress: 100, goal: 1, current: 1, desc: 'Launch your first memecoin.' },
    { name: 'Paper Hands', icon: Zap, unlocked: true, progress: 100, goal: 1, current: 1, desc: 'Sell your first token.' },
    { name: 'Rug Survivor', icon: Shield, unlocked: false, progress: 50, goal: 7, current: 3, desc: 'Hold a token for 7 days.' },
    { name: 'Whale', icon: TrendingUp, unlocked: false, progress: 25, goal: 100, current: 25, desc: 'Invest 100 SOL total volume.' },
    { name: 'Degen', icon: Star, unlocked: true, progress: 100, goal: 5, current: 5, desc: 'Bid on 5 different tokens.' },
    { name: 'Syndicate Leader', icon: Users, unlocked: false, progress: 0, goal: 1, current: 0, desc: 'Create a Syndicate.' },
    { name: 'Community Pillar', icon: Award, unlocked: false, progress: 40, goal: 100, current: 40, desc: 'Send 100 messages.' },
    { name: 'Cipher OG', icon: Rocket, unlocked: false, progress: 0, goal: 1, current: 0, desc: 'Launch a token that hits 50 SOL.' },
  ];

  if (loading) return <div className="p-20 text-center font-mono text-cyan-400 animate-pulse">Loading Conviction...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold font-mono text-white mb-2 flex items-center justify-center gap-3">
          <Shield className="text-cyan-400" size={28} /> CONVICTION PROTOCOL
        </h1>
        <p className="text-sm font-mono text-slate-400">Reputation earned through belief, not just capital.</p>
      </div>

      <div className="bg-[#111116] border border-white/5 rounded-3xl p-8 shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600" />
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="text-[10px] font-mono text-slate-500 mb-1 uppercase tracking-widest">Current Tier</div>
            <div className={`text-5xl font-bold font-mono drop-shadow-[0_0_20px_rgba(245,158,11,0.2)] ${currentTier === 'GOLD' ? 'text-yellow-400' : currentTier === 'SILVER' ? 'text-slate-300' : currentTier === 'DIAMOND' ? 'text-cyan-400' : 'text-amber-500'}`}>
              {currentTier}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono text-white font-bold">{userCP} <span className="text-sm text-slate-500">CP</span></div>
            <div className="text-[10px] font-mono text-slate-500">{nextTierCP - userCP} CP to next tier</div>
          </div>
        </div>
        <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/5">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1.5 }} className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-sm font-mono text-white font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-3"><Clock size={16} className="text-cyan-400" /> DAILY MISSIONS</h3>
          <div className="space-y-3">
            {dailyMissions.map((q) => (
              <div key={q.id} className="flex justify-between items-center p-3 rounded-xl border bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform"><Zap size={14}/></div>
                  <div>
                    <div className="text-xs font-bold font-mono text-white">{q.title}</div>
                    <div className="text-[10px] font-mono text-slate-500">{q.desc}</div>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-cyan-400">+{q.points} CP</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-sm font-mono text-white font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-3"><Trophy size={16} className="text-amber-400" /> WEEKLY MISSIONS</h3>
          <div className="space-y-3">
            {weeklyMissions.map((q) => (
              <div key={q.id} className="flex justify-between items-center p-3 rounded-xl border bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform"><Star size={14}/></div>
                  <div>
                    <div className="text-xs font-bold font-mono text-white">{q.title}</div>
                    <div className="text-[10px] font-mono text-slate-500">{q.desc}</div>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-amber-400">+{q.points} CP</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-sm font-mono text-white font-bold mb-6 flex items-center gap-2 border-b border-white/5 pb-3"><Award size={16} className="text-cyan-400" /> TRADER BADGES</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, i) => {
            const Icon = badge.unlocked ? badge.icon : Lock;
            return (
              <div key={i} className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all ${badge.unlocked ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'bg-white/[0.02] border-white/5'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${badge.unlocked ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Icon size={20} />
                </div>
                <div className={`text-xs font-bold font-mono mb-1 ${badge.unlocked ? 'text-white' : 'text-slate-400'}`}>{badge.name}</div>
                <div className="text-[9px] font-mono text-slate-500 leading-tight mb-3">{badge.desc}</div>
                
                <div className="w-full">
                  <div className="flex justify-between text-[8px] font-mono text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{badge.current}/{badge.goal}</span>
                  </div>
                  <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                    <div className={`h-full ${badge.unlocked ? 'bg-emerald-400' : 'bg-cyan-400'}`} style={{ width: `${badge.progress}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
