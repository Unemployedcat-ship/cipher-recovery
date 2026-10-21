'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSupabase } from '@/components/SupabaseProvider';
import Link from 'next/link';
import { Trophy, Medal, ShieldAlert, TrendingUp, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

export default function LeaderboardPage() {
  const { supabase } = useSupabase();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<'PNL' | 'WIN_RATE'>('PNL');
  const [liveUpdate, setLiveUpdate] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────
  // Load leaderboard — only public metrics
  // ─────────────────────────────────────────────────────────────
  const loadLeaderboard = useCallback(async () => {
    const query = supabase
      .from('profiles')
      .select(
        'id, username, avatar_url, total_pnl, win_rate, conviction_tier, total_volume_usd, is_pnl_public'
      )
      .eq('is_pnl_public', true)
      .limit(50);

    const { data } =
      tab === 'PNL'
        ? await query.order('total_pnl', { ascending: false })
        : await query.order('win_rate', { ascending: false });

    setUsers(data || []);
    setIsLoading(false);
  }, [supabase, tab]);

  useEffect(() => {
    setIsLoading(true);
    loadLeaderboard();
  }, [loadLeaderboard]);

  // ─────────────────────────────────────────────────────────────
  // Real-time: new public profile or PnL update appears instantly
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('leaderboard-live')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        (payload) => {
          if (payload.new.is_pnl_public) {
            setLiveUpdate(payload.new.username || 'Operator');
            loadLeaderboard();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, loadLeaderboard]);

  const getRankDisplay = (index: number) => {
    if (index < 3) {
      const Icon = index === 0 ? Trophy : Medal;
      return (
        <Icon
          size={20}
          style={{ color: RANK_COLORS[index] }}
          className="mx-auto"
        />
      );
    }
    return (
      <span className="font-mono text-sm text-[var(--text-muted)]">
        {index + 1}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Live toast */}
      {liveUpdate && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-6 z-50 glass-panel px-5 py-3 border border-[var(--accent-cyan)]/40"
        >
          <div className="font-mono text-xs text-[var(--accent-cyan)]">
            {liveUpdate} updated their public metrics
          </div>
        </motion.div>
      )}

      {/* Header */}
      <header className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Trophy className="text-[var(--accent-cyan)]" size={32} />
          <h1 className="font-mono text-4xl font-bold tracking-tight text-white">
            GLOBAL LEADERBOARD
          </h1>
        </div>
        <p className="font-mono text-sm text-[var(--text-secondary)]">
          Only operators who have opted into public metrics are shown here.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 justify-center">
        {[
          { id: 'PNL' as const, label: 'ABSOLUTE PNL', icon: TrendingUp },
          { id: 'WIN_RATE' as const, label: 'WIN RATE / ROI', icon: Zap },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] font-mono text-sm transition-all ${
              tab === t.id
                ? 'bg-[var(--accent-cyan)] text-[var(--bg-void)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 bg-black/40 font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-4">Operator</div>
          <div className="col-span-2 text-right">Conviction</div>
          <div className="col-span-2 text-right">Win Rate</div>
          <div className="col-span-2 text-right">
            {tab === 'PNL' ? 'Total PnL' : 'Volume'}
          </div>
          <div className="col-span-1 text-right">Profile</div>
        </div>

        {isLoading ? (
          [...Array(8)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-4 px-6 py-4 animate-pulse border-b border-white/5"
            >
              <div className="col-span-12 h-4 bg-white/5 rounded" />
            </div>
          ))
        ) : users.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <Users
              size={48}
              className="text-[var(--text-muted)] mb-4 opacity-30"
            />
            <div className="font-mono text-lg font-bold text-white mb-2">
              NO PUBLIC METRICS
            </div>
            <div className="font-mono text-sm text-[var(--text-secondary)] max-w-md">
              No operators have made their metrics public yet. Go to your
              Operator settings to toggle public performance metrics.
            </div>
          </div>
        ) : (
          users.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors items-center"
            >
              <div className="col-span-1 text-center">{getRankDisplay(i)}</div>

              <div className="col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                  {u.avatar_url ? (
                    <img
                      src={u.avatar_url}
                      alt={u.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-mono text-xs text-[var(--accent-cyan)]">
                      {u.username?.[0]?.toUpperCase() || '?'}
                    </span>
                  )}
                </div>
                <div className="font-mono text-sm text-white font-bold truncate">
                  {u.username || 'Anonymous'}
                </div>
              </div>

              <div className="col-span-2 text-right font-mono text-sm text-[var(--accent-cyan)]">
                T{u.conviction_tier || 0}
              </div>

              <div className="col-span-2 text-right font-mono text-sm text-[var(--text-secondary)]">
                {Number(u.win_rate || 0).toFixed(1)}%
              </div>

              <div
                className={`col-span-2 text-right font-mono text-sm font-bold ${
                  u.total_pnl >= 0
                    ? 'text-[var(--status-live)]'
                    : 'text-[var(--status-rug)]'
                }`}
              >
                {tab === 'PNL'
                  ? `${u.total_pnl >= 0 ? '+' : ''}${Number(
                      u.total_pnl || 0
                    ).toLocaleString()} SOL`
                  : `$${Number(u.total_volume_usd || 0).toLocaleString()}`}
              </div>

              <div className="col-span-1 text-right">
                <Link
                  href={`/profile/${u.id}`}
                  className="font-mono text-xs text-[var(--accent-cyan)] hover:underline"
                >
                  VIEW
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Empty-state hint */}
      {!isLoading && users.length > 0 && (
        <div className="mt-4 text-center font-mono text-xs text-[var(--text-muted)]">
          Updated live via Supabase Realtime. Only public metrics are shown.
        </div>
      )}
    </div>
  );
}