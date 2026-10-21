'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useSupabase } from '@/components/SupabaseProvider';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { submitBidOnChain, refundBidOnChain } from '@/lib/solana/actions';
import { PublicKey } from '@solana/web3.js';
import { ArrowLeft, Shield, Loader2, AtSign, Send, Globe, Lock, EyeOff, Activity, Copy, Check, Crown, TrendingUp, ExternalLink, Target, Users, Droplet, RotateCcw, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { createChart, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';

const SOL_PRICE = 150;

function TradingChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#64748b' },
      grid: { vertLines: { color: 'rgba(255,255,255,0.03)' }, horzLines: { color: 'rgba(255,255,255,0.03)' } },
      width: chartContainerRef.current.clientWidth, height: 400,
      crosshair: { mode: 1 }, timeScale: { borderColor: 'rgba(255,255,255,0.1)', timeVisible: true, secondsVisible: true }, rightPriceScale: { borderColor: 'rgba(255,255,255,0.1)' },
    });
    const candlestickSeries = chart.addSeries(CandlestickSeries, { upColor: '#10b981', downColor: '#ef4444', borderVisible: false, wickUpColor: '#10b981', wickDownColor: '#ef4444' });
    const volumeSeries = chart.addSeries(HistogramSeries, { color: '#1e293b', priceFormat: { type: 'volume' }, priceScaleId: '' });
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
    let currentTime = Math.floor(Date.now() / 1000); let currentPrice = 0.000042;
    const initialData = []; const volumeData = [];
    for (let i = 30; i >= 0; i--) {
      const time = (currentTime - i * 60) as any; const open = currentPrice; const close = open * (1 + (Math.random() - 0.45) * 0.1);
      const high = Math.max(open, close) * (1 + Math.random() * 0.05); const low = Math.min(open, close) * (1 - Math.random() * 0.05);
      initialData.push({ time, open, high, low, close }); volumeData.push({ time, value: Math.random() * 1000, color: close > open ? '#10b98180' : '#ef444480' }); currentPrice = close;
    }
    candlestickSeries.setData(initialData); volumeSeries.setData(volumeData);
    const interval = setInterval(() => {
      currentTime += 2; const open = currentPrice; const close = open * (1 + (Math.random() - 0.45) * 0.05);
      const high = Math.max(open, close) * (1 + Math.random() * 0.02); const low = Math.min(open, close) * (1 - Math.random() * 0.02);
      candlestickSeries.update({ time: currentTime as any, open, high, low, close }); volumeSeries.update({ time: currentTime as any, value: Math.random() * 500, color: close > open ? '#10b98180' : '#ef444480' }); currentPrice = close;
    }, 1000);
    const handleResize = () => { if (chartContainerRef.current) chart.applyOptions({ width: chartContainerRef.current.clientWidth }); };
    window.addEventListener('resize', handleResize);
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); chart.remove(); };
  }, []);
  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
}

export default function TokenPage() {
  const { id } = useParams();
  const { supabase } = useSupabase();
  const { user } = usePrivy();
  const { signer, address, refreshBalance, balance } = useSolanaWallet();
  const [auction, setAuction] = useState<any>(null);
  const [holders, setHolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTrading, setIsTrading] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy');
  const [copied, setCopied] = useState(false);
  const [phase, setPhase] = useState<'live' | 'settled' | 'failed'>('live');
  const [raised, setRaised] = useState(0);
  const [activeTab, setActiveTab] = useState<'holders' | 'trades'>('holders');

  useEffect(() => {
    async function fetchAuctionAndHolders() {
      const { data: auctionData } = await supabase.from('auctions').select('*').eq('id', id).single();
      if (auctionData) {
        setAuction(auctionData);
        setPhase(auctionData.status as any);
      }
      const { data: bidsData } = await supabase.from('bids').select(`amount, profiles ( id, username, avatar_url, is_private )`).eq('auction_id', id).order('amount', { ascending: false });
      if (bidsData) {
        setHolders(bidsData);
        const total = bidsData.reduce((sum, bid) => sum + Number(bid.amount), 0); setRaised(total);
      }
      setLoading(false);
    }
    fetchAuctionAndHolders();
  }, [id, supabase]);

  const handleCopy = () => { if (auction?.mint_address) { navigator.clipboard.writeText(auction.mint_address); setCopied(true); setTimeout(() => setCopied(false), 2000); } };
  
  const validateGas = (amt: number) => {
    if (!balance) return false;
    if (amt + 0.01 > balance) {
      alert(`Insufficient funds. You must leave at least 0.01 SOL for transaction fees. Max you can bid is ${(balance - 0.01).toFixed(3)} SOL.`);
      return false;
    }
    return true;
  };

  const handleBlindBid = async () => { 
    if (!user || !signer || !address) return alert("Connect wallet first");
    if (!amount || isNaN(Number(amount))) return alert("Enter a valid amount");
    if (!validateGas(Number(amount))) return;

    setIsSubmitting(true);
    try {
      const auctionPda = new PublicKey(auction.pda_address);
      await submitBidOnChain(signer, new PublicKey(address), auctionPda, Number(amount));
      const { error } = await supabase.from('bids').insert({ auction_id: auction.id, user_id: (await supabase.from('profiles').select('id').eq('privy_did', user.id).single()).data?.id, amount: Number(amount) });
      if (error) throw error;
      setRaised(prev => prev + Number(amount)); setAmount(''); refreshBalance(); alert("Bid placed!");
    } catch (err: any) { alert("Bid failed: " + err.message); } finally { setIsSubmitting(false); }
  };
  
  const handleTrade = async () => { 
    if (!amount || isNaN(Number(amount))) return alert("Enter amount");
    if (!validateGas(Number(amount))) return;
    
    setIsTrading(true); setTimeout(() => { setIsTrading(false); alert(`${tradeMode.toUpperCase()} Successful!`); setAmount(''); }, 1500);
  };

  const handleRefund = async () => {
    if (!signer || !address) return alert("Connect wallet");
    setIsRefunding(true);
    try {
      await refundBidOnChain(signer, new PublicKey(address), new PublicKey(auction.pda_address));
      alert("Refund successful! Check your wallet.");
      refreshBalance();
    } catch (err: any) {
      alert("Refund failed: " + err.message);
    } finally {
      setIsRefunding(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-mono text-cyan-400 animate-pulse">Loading...</div>;
  if (!auction) return <div className="p-20 text-center font-mono text-white">Not found.</div>;

  const target = Number(auction.graduation_target) || 2;
  const progressPercent = Math.min(100, Math.floor((raised / target) * 100));
  const isGraduated = phase === 'settled';
  const isFailed = phase === 'failed';

  return (
    <div className="max-w-7xl mx-auto">
      <Link href="/dark-pools" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-mono text-xs mb-6 transition-colors">
        <ArrowLeft size={14} /> BACK TO FEED
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-[#111116] border border-white/5 rounded-2xl p-5 relative overflow-hidden shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              {auction.image_url ? <img src={auction.image_url} className="w-16 h-16 rounded-xl border border-white/10" /> : <div className="w-16 h-16 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center font-mono">{auction.ticker?.slice(0,2)}</div>}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold font-mono text-white">{auction.name}</h1>
                  <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400">{auction.ticker}</span>
                  <button onClick={handleCopy} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 flex items-center gap-1 hover:text-white">
                    {auction.mint_address ? `${auction.mint_address.slice(0,4)}...` : 'TBA'} {copied ? <Check size={10} className="text-emerald-400"/> : <Copy size={10}/>}
                  </button>
                </div>
                <p className="text-xs font-mono text-slate-400 max-w-md line-clamp-2">{auction.description || "No description provided."}</p>
                
                <div className="flex gap-2 mt-3">
                  {auction.twitter && <a href={auction.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-[#1DA1F2]/20 px-2 py-1 rounded border border-white/10 transition-colors"><AtSign size={10}/> Twitter</a>}
                  {auction.telegram && <a href={auction.telegram} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-[#229ED9]/20 px-2 py-1 rounded border border-white/10 transition-colors"><Send size={10}/> Telegram</a>}
                  {auction.website && <a href={auction.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-emerald-500/20 px-2 py-1 rounded border border-white/10 transition-colors"><Globe size={10}/> Website</a>}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-[10px] font-mono text-slate-500 mb-1 uppercase tracking-wider">
                {isGraduated ? 'Market Cap' : isFailed ? 'Status' : 'Liquidity Raised'}
              </div>
              <div className={`text-xl font-mono font-bold ${isFailed ? 'text-red-400' : 'text-white'}`}>
                {isGraduated ? `$${(raised * SOL_PRICE).toLocaleString()}` : isFailed ? 'FAILED' : `${raised.toFixed(2)} SOL`}
              </div>
              {!isGraduated && !isFailed && (
                <div className="text-[10px] font-mono text-amber-500 mt-1 flex items-center gap-1">
                  <Target size={10} /> Target: {target} SOL
                </div>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="bg-[#111116] border border-white/5 rounded-2xl p-4 h-[420px] relative overflow-hidden shadow-2xl">
            {isGraduated ? (
              <div className="flex flex-col h-full">
                 <div className="flex justify-end mb-2">
                    <a href={`https://dexscreener.com/solana/${auction.mint_address}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#1e293b] hover:bg-[#334155] text-white font-mono text-xs px-3 py-1.5 rounded-lg border border-white/10 transition-colors">
                      View on DexScreener <ExternalLink size={12} />
                    </a>
                 </div>
                 <div className="flex-1"><TradingChart /></div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Loader2 className={`w-10 h-10 mb-4 ${isFailed ? 'text-red-500' : 'text-amber-500'}`} />
                <h3 className={`text-lg font-mono font-bold ${isFailed ? 'text-red-400' : 'text-white'}`}>{isFailed ? 'AUCTION FAILED' : 'CHART LOCKED'}</h3>
                <p className="text-xs font-mono text-slate-500 mt-2">{isFailed ? 'The target was not met. Refunds are available.' : 'Initial liquidity is being raised.'}</p>
              </div>
            )}
          </div>

          {/* Holders */}
          <div className="bg-[#111116] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex border-b border-white/5">
              <button onClick={() => setActiveTab('holders')} className={`flex-1 py-3 text-xs font-mono font-bold transition-colors ${activeTab === 'holders' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-white/[0.02]' : 'text-slate-500 hover:text-white'}`}>BACKERS</button>
              <button onClick={() => setActiveTab('trades')} className={`flex-1 py-3 text-xs font-mono font-bold transition-colors ${activeTab === 'trades' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-white/[0.02]' : 'text-slate-500 hover:text-white'}`}>LIVE TRADES</button>
            </div>
            <div className="p-4">
              {activeTab === 'holders' && (
                <div className="space-y-1">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-mono text-slate-500 uppercase px-2 pb-2 border-b border-white/5">
                    <div className="col-span-1">#</div>
                    <div className="col-span-5">Trader</div>
                    <div className="col-span-3 text-right">Allocation</div>
                    <div className="col-span-3 text-right">Value</div>
                  </div>
                  {holders.map((h, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center p-2 hover:bg-white/[0.03] rounded transition-colors group">
                      <div className="col-span-1 text-xs font-mono text-slate-600">{i + 1}</div>
                      <div className="col-span-5 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-[9px] font-mono text-white border border-white/10">
                          {h.profiles?.is_private ? <EyeOff size={10}/> : (h.profiles?.avatar_url ? <img src={h.profiles.avatar_url} className="w-full h-full rounded-full object-cover" /> : 'TR')}
                        </div>
                        <span className="text-xs font-mono text-white group-hover:text-cyan-400 transition-colors">
                          {h.profiles?.is_private ? 'Anonymous' : (h.profiles?.username || `Trader ${i+1}`)}
                        </span>
                      </div>
                      <div className="col-span-3 text-right text-xs font-mono text-slate-300">{((h.amount / raised) * 100).toFixed(1)}%</div>
                      <div className="col-span-3 text-right text-xs font-mono text-emerald-400 font-bold">${(h.amount * SOL_PRICE).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'trades' && (
                <div className="space-y-1">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="flex justify-between items-center p-2 hover:bg-white/[0.03] rounded transition-colors text-xs font-mono">
                      <div className="flex items-center gap-2"><span className={i % 3 === 0 ? 'text-red-400' : 'text-emerald-400'}>{i % 3 === 0 ? 'SELL' : 'BUY'}</span><span className="text-slate-500">12:3{i}:00</span></div>
                      <div className="flex items-center gap-4"><span className="text-white">{(Math.random() * 2).toFixed(2)} SOL</span><span className="text-slate-500">${(Math.random() * 300).toFixed(0)}</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          <div className="bg-[#111116] border border-white/5 rounded-2xl p-5 shadow-2xl sticky top-6">
            
            {phase === 'live' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div><div className="text-xs font-mono text-slate-400">Raised</div><div className="text-2xl font-mono text-white font-bold">{raised.toFixed(2)} <span className="text-sm text-slate-500">/ {target} SOL</span></div></div>
                  <div className="text-right"><div className="text-xs font-mono text-slate-400">Progress</div><div className="text-lg font-mono text-amber-400 font-bold">{progressPercent}%</div></div>
                </div>
                <div className="w-full h-2 bg-black/50 rounded-full border border-white/5 overflow-hidden"><div className="h-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" style={{ width: `${progressPercent}%` }} /></div>
                <div className="relative">
                  <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} onFocus={e => e.target.select()} className="w-full bg-[#050508] border border-white/10 rounded-xl p-4 text-white font-mono text-lg outline-none focus:border-amber-400" />
                  <span className="absolute right-4 top-4 text-sm text-slate-500 font-mono">SOL</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0.1, 0.5, 1, 5].map(val => (<button key={val} onClick={() => setAmount(val.toString())} className="bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] py-2 rounded-lg border border-white/5">{val}</button>))}
                </div>
                <div className="flex items-start gap-2 p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                   <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                   <span className="text-[9px] font-mono text-amber-200/80">A 0.01 SOL reserve is required in your wallet for gas fees.</span>
                </div>
                <button onClick={handleBlindBid} disabled={isSubmitting} className="w-full bg-amber-400 text-black font-bold font-mono py-4 rounded-xl hover:bg-amber-500 transition-colors flex justify-center items-center">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : 'BOOTSTRAP LIQUIDITY'}
                </button>
              </div>
            )}

            {phase === 'settled' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-1 p-1 bg-[#050508] rounded-xl border border-white/5">
                  <button onClick={() => setTradeMode('buy')} className={`py-2 rounded-lg font-mono text-xs font-bold transition-colors ${tradeMode === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-white'}`}>BUY</button>
                  <button onClick={() => setTradeMode('sell')} className={`py-2 rounded-lg font-mono text-xs font-bold transition-colors ${tradeMode === 'sell' ? 'bg-red-500/20 text-red-400' : 'text-slate-500 hover:text-white'}`}>SELL</button>
                </div>
                <div className="relative">
                  <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} onFocus={e => e.target.select()} className="w-full bg-[#050508] border border-white/10 rounded-xl p-4 text-white font-mono text-lg outline-none focus:border-cyan-400" />
                  <span className="absolute right-4 top-4 text-sm text-slate-500 font-mono">{tradeMode === 'buy' ? 'SOL' : auction.ticker}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0.1, 0.5, 1, 5].map(val => (<button key={val} onClick={() => setAmount(val.toString())} className="bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] py-2 rounded-lg border border-white/5">{val}</button>))}
                </div>
                <button onClick={handleTrade} disabled={isTrading} className={`w-full font-bold font-mono py-4 rounded-xl transition-all flex justify-center items-center gap-2 ${tradeMode === 'buy' ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-red-500 hover:bg-red-400 text-white'}`}>
                  {isTrading ? <Loader2 className="animate-spin" size={20}/> : (tradeMode === 'buy' ? 'BUY TOKEN' : 'SELL TOKEN')}
                </button>
              </div>
            )}

            {phase === 'failed' && (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="text-red-400" size={24} />
                </div>
                <h3 className="text-lg font-bold font-mono text-white">AUCTION FAILED</h3>
                <p className="text-xs font-mono text-slate-400">The target was not met. You can claim your refund now.</p>
                <button onClick={handleRefund} disabled={isRefunding} className="w-full bg-red-500 hover:bg-red-400 text-white font-bold font-mono py-4 rounded-xl transition-colors flex justify-center items-center gap-2">
                  {isRefunding ? <Loader2 className="animate-spin" size={20}/> : 'CLAIM REFUND'}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
