'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/components/SupabaseProvider';
import { usePrivy } from '@privy-io/react-auth';
import { useParams } from 'next/navigation';
import { OperatorAvatar } from '@/components/ui/OperatorAvatar';
import { BackButton } from '@/components/ui/BackButton';
import { Lock, Unlock, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const TIER_NAMES = ['BRONZE', 'SILVER', 'GOLD', 'DIAMOND', 'MYTHIC', 'LEGEND'];
const TIER_COLORS = ['#CD7F32', '#C0C0C0', '#FFD700', '#B9F2FF', '#C084FC', '#00E5FF'];

export default function PublicProfilePage() {
  const { supabase } = useSupabase();
  const { user: privyUser } = usePrivy();
  const params = useParams();
  const profileId = params.id as string;

  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [myProfileId, setMyProfileId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data: targetProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .maybeSingle();
      
      setProfile(targetProfile);

      if (privyUser) {
        const { data: mapping } = await supabase
          .from('user_mappings')
          .select('supabase_uid')
          .eq('privy_did', privyUser.id)
          .single();
          
        if (mapping) {
          setMyProfileId(mapping.supabase_uid);
          const { data: followStatus } = await supabase
            .from('follows')
            .select('*')
            .eq('follower_id', mapping.supabase_uid)
            .eq('following_id', profileId)
            .maybeSingle();
            
          if (followStatus) setIsFollowing(true);
        }
      }
      setIsLoading(false);
    }
    loadData();
  }, [profileId, privyUser, supabase]);

  const handleFollow = async () => {
    if (!myProfileId) return;
    if (isFollowing) {
      await supabase.from('follows').delete().eq('follower_id', myProfileId).eq('following_id', profileId);
      setIsFollowing(false);
      setProfile({ ...profile, follower_count: Math.max(0, (profile.follower_count || 0) - 1) });
    } else {
      await supabase.from('follows').insert({ follower_id: myProfileId, following_id: profileId });
      setIsFollowing(true);
      setProfile({ ...profile, follower_count: (profile.follower_count || 0) + 1 });
    }
  };

  if (isLoading) return <div className="p-8 font-mono text-white">Loading Operator ID...</div>;
  if (!profile) return <div className="p-8 font-mono text-white">Operator not found.</div>;

  const tier = profile.conviction_tier || 0;
  const tierColor = TIER_COLORS[tier];
  const tierName = TIER_NAMES[tier];

  return (
    <div className="max-w-4xl mx-auto p-8 relative z-10">
      <BackButton />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="glass-panel overflow-hidden relative border-t-4"
        style={{ borderTopColor: tierColor }}
      >
        {/* Background Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        <div className="p-8 md:p-12 relative z-10">
          <div className="flex flex-col md:flex-row items-start gap-8">
            
            {/* Avatar with Glow (Clean) */}
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-black/50 border-2 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] flex-shrink-0" style={{ borderColor: tierColor }}>
                <OperatorAvatar seed={profile.avatar_url || undefined} size={128} className="w-full h-full" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="font-mono text-4xl font-bold text-white tracking-tight">{profile.username || 'Anonymous'}</h1>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="px-2 py-1 rounded bg-[var(--bg-elevated)] border border-white/10 flex items-center gap-1" style={{ color: tierColor }}>
                      <Award size={12} /> {tierName} OPERATOR
                    </span>
                    <span className="text-[var(--text-muted)]">
                      Joined {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {privyUser && myProfileId !== profileId && (
                  <button 
                    onClick={handleFollow}
                    className={`px-8 py-2.5 rounded-lg font-mono text-sm font-bold transition-all shadow-lg ${
                      isFollowing 
                        ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--status-rug)] hover:text-[var(--status-rug)]' 
                        : 'bg-[var(--accent-cyan)] text-black hover:brightness-110 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                    }`}
                  >
                    {isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
                  </button>
                )}
              </div>

              <div className="flex gap-8 mt-8 border-t border-white/5 pt-6">
                <div className="font-mono">
                  <div className="text-2xl font-bold text-white">{profile.follower_count || 0}</div>
                  <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Followers</div>
                </div>
                <div className="font-mono">
                  <div className="text-2xl font-bold text-white">{profile.following_count || 0}</div>
                  <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Following</div>
                </div>
                <div className="font-mono border-l border-white/10 pl-8">
                  <div className="text-2xl font-bold" style={{ color: tierColor }}>{profile.conviction_cp || 0}</div>
                  <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Conviction CP</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Bio</h3>
            <p className="font-mono text-sm text-[var(--text-primary)] leading-relaxed bg-black/30 p-4 rounded-lg border border-white/5">
              {profile.bio || "This operator hasn't written a bio yet."}
            </p>
          </div>

          {/* Confidential PnL Section */}
          <div className="mt-8">
            <h3 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-2">
              {profile.is_pnl_public ? <Unlock size={14} className="text-[var(--status-live)]" /> : <Lock size={14} className="text-[var(--status-rug)]" />}
              Performance Metrics
            </h3>
            
            {profile.is_pnl_public ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 border border-white/5 p-6 rounded-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--status-live)] rounded-full blur-[50px] opacity-10 pointer-events-none" />
                   <div className="font-mono text-xs text-[var(--text-muted)] mb-1">TOTAL PNL</div>
                   <div className={`font-mono text-3xl font-bold ${profile.total_pnl >= 0 ? 'text-[var(--status-live)]' : 'text-[var(--status-rug)]'}`}>
                     {profile.total_pnl >= 0 ? '+' : ''}{profile.total_pnl?.toLocaleString() || 0} SOL
                   </div>
                </div>
                <div className="bg-black/30 border border-white/5 p-6 rounded-xl">
                   <div className="font-mono text-xs text-[var(--text-muted)] mb-1">WIN RATE</div>
                   <div className="font-mono text-3xl font-bold text-white">{profile.win_rate || 0}%</div>
                </div>
              </div>
            ) : (
              <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <Lock size={24} className="text-[var(--text-muted)] mb-2" />
                <div className="font-mono text-sm text-[var(--text-secondary)]">Performance metrics are encrypted.</div>
                <div className="font-mono text-xs text-[var(--text-muted)] mt-1">This operator values their privacy.</div>
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
