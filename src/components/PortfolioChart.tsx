'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/components/SupabaseProvider';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function PortfolioChart({ userId }: { userId: string }) {
  const { supabase } = useSupabase();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: snapshots } = await supabase
        .from('portfolio_snapshots')
        .select('balance_sol, timestamp')
        .eq('user_id', userId)
        .order('timestamp', { ascending: true })
        .limit(30);

      if (snapshots) {
        const formatted = snapshots.map(s => ({
          time: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          balance: Number(s.balance_sol)
        }));
        setData(formatted);
      }
      setLoading(false);
    }
    load();
  }, [supabase, userId]);

  if (loading) return <div className="h-64 animate-pulse bg-white/5 rounded-lg" />;
  
  if (data.length === 0) return (
    <div className="h-64 flex items-center justify-center border border-white/10 rounded-lg bg-black/20">
      <span className="font-mono text-sm text-[var(--text-muted)]">Not enough trading data to generate chart yet.</span>
    </div>
  );

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val} SOL`} domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', fontFamily: 'monospace', fontSize: '12px' }}
            itemStyle={{ color: 'var(--accent-cyan)' }}
          />
          <Area type="monotone" dataKey="balance" stroke="var(--accent-cyan)" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}