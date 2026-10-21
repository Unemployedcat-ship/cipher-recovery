'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/components/SupabaseProvider';
import { Activity, Droplet, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';

const SOL_PRICE = 150;

export function TickerTape() {
  const { supabase } = useSupabase();
  const [stats, setStats] = useState({ volume: 0, liquidity: 0, topGainer: null as any });

  useEffect(() => {
    async function fetchGlobalStats() {
      // Fetch all auctions and bids
      const { data: auctions } = await supabase.from('auctions').select('id, name, ticker, graduation_target');
      const { data: bids } = await supabase.from('bids').select('amount, auction_id');

      if (auctions && bids) {
        const totalVolume = bids.reduce((sum, b) => sum + Number(b.amount), 0) * SOL_PRICE;
        
        // Calculate liquidity (assume graduated ones have liquidity)
        const graduatedIds = new Set(
          auctions.filter(a => {
            const raised = bids.filter(b => b.auction_id === a.id).reduce((s, b) => s + Number(b.amount), 0);
            return raised >= (a.graduation_target || 2);
          }).map(a => a.id)
        );
        
        const totalLiquidity = bids.filter(b => graduatedIds.has(b.auction_id)).reduce((sum, b) => sum + Number(b.amount), 0) * SOL_PRICE;

        // Find top gainer based on highest raised amount
        const auctionTotals = auctions.map(a => ({
          ...a,
          raised: bids.filter(b => b.auction_id === a.id).reduce((s, b) => s + Number(b.amount), 0)
        })).sort((a, b) => b.raised - a.raised);

        setStats({ 
          volume: totalVolume, 
          liquidity: totalLiquidity, 
          topGainer: auctionTotals[0] || null 
        });
      }
    }
    fetchGlobalStats();
  }, [supabase]);

  return (
    <div className="w-full bg-[#050508] border-b border-white/5 py-2.5 relative z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-cyan-400" />
            <span>24H VOL: <span className="text-white font-bold">${stats.volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Droplet size={14} className="text-emerald-400" />
            <span>LIQUIDITY: <span className="text-white font-bold">${stats.liquidity.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></span>
          </div>
          {stats.topGainer && (
            <Link href={`/dark-pools/${stats.topGainer.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <TrendingUp size={14} className="text-amber-400" />
              <span>TOP GAINER: <span className="text-emerald-400 font-bold">{stats.topGainer.ticker}</span></span>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2 text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
          <Zap size={12} className="text-yellow-400" />
          <span className="text-white">SOLANA MAINNET</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1"></span>
        </div>
      </div>
    </div>
  );
}
