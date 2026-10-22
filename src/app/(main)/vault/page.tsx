'use client';

import { useState } from 'react';
import Link from 'next/link';
import PortfolioChart from '@/components/PortfolioChart';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { connection } from '@/lib/solana/constants';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  Wallet, ShieldCheck, ArrowUpRight, Activity, TrendingUp, 
  Droplets, BarChart3, RefreshCcw, Landmark, Zap, Clock, 
  ArrowDownRight, ArrowUpRightSquare, Flame, X, Check, Copy, Send
} from 'lucide-react';

export default function VaultPage() {
  const [activeTab, setActiveTab] = useState<'launches' | 'positions'>('launches');
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Withdraw State
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { address } = useSolanaWallet();
  
  const solanaWallet = wallets.find((w) => w.chainType === 'solana');

  const mockPortfolioValue = 1337.12;
  const mockPnl = 337.12;
  const mockPnlPercent = 33.71;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = async () => {
    if (!solanaWallet || !address) return setErrorMsg("Wallet not connected.");
    if (!withdrawAddress || !withdrawAmount) return setErrorMsg("Please fill in all fields.");

    try {
      setIsProcessing(true);
      setErrorMsg('');
      
      const pubKey = new PublicKey(withdrawAddress);
      const lamports = parseFloat(withdrawAmount) * LAMPORTS_PER_SOL;

      // Check balance
      const balance = await connection.getBalance(new PublicKey(address));
      if (balance < lamports + 5000) { // 5000 lamports for fee
        throw new Error("Insufficient balance for transfer + fee.");
      }

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(address),
          toPubkey: pubKey,
          lamports: lamports,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(address);

      // Sign with Privy
      const provider = await solanaWallet.getProvider();
      const signedTx = await provider.signTransaction(transaction);
      
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(signature, 'confirmed');
      
      setTxHash(signature);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Transaction failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setActiveAction(null);
    setWithdrawAddress('');
    setWithdrawAmount('');
    setTxHash(null);
    setErrorMsg('');
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 lg:p-6 flex flex-col gap-6 font-mono text-zinc-300 bg-[#050505] relative">
      
      {/* Action Modals */}
      {activeAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#09090B] border border-zinc-800 rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-[#050505]">
              <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Zap size={14} className="text-[#00FF41]"/> {activeAction}
              </h2>
              <button onClick={closeModal} className="text-zinc-500 hover:text-white transition-colors"><X size={16}/></button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              
              {/* DEPOSIT MODAL */}
              {activeAction === 'DEPOSIT' && (
                <>
                  <p className="text-xs text-zinc-400 text-center">Send SOL to your connected wallet address below.</p>
                  <div className="bg-[#050505] border border-zinc-800 rounded-sm p-4 flex items-center justify-between gap-4">
                    <span className="font-mono text-sm text-white truncate">{address || 'Not Connected'}</span>
                    <button onClick={() => handleCopy(address || '')} className="h-8 w-8 shrink-0 flex items-center justify-center bg-[#111116] border border-zinc-700 rounded-sm hover:border-[#00FF41] hover:text-[#00FF41]">
                      {copied ? <Check size={14} className="text-[#00FF41]"/> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="text-[10px] text-zinc-500 text-center">Only send SOL on the Solana network to this address.</div>
                </>
              )}

              {/* WITHDRAW MODAL */}
              {activeAction === 'WITHDRAW' && (
                <>
                  {txHash ? (
                    <div className="text-center">
                      <div className="h-12 w-12 bg-[#00FF41]/10 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="text-[#00FF41]" /></div>
                      <h3 className="text-sm font-bold text-white mb-2">Transfer Successful!</h3>
                      <p className="text-[10px] text-zinc-500 break-all mb-4">Tx: {txHash}</p>
                      <button onClick={closeModal} className="w-full rounded-sm border border-zinc-800 py-2 text-xs font-bold text-white hover:bg-zinc-800">CLOSE</button>
                    </div>
                  ) : (
                    <>
                      {errorMsg && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] p-2 rounded-sm">{errorMsg}</div>}
                      <div>
                        <label className="text-[10px] text-zinc-500 font-black tracking-widest mb-1 block">DESTINATION WALLET</label>
                        <input type="text" value={withdrawAddress} onChange={(e) => setWithdrawAddress(e.target.value)} placeholder="Enter Solana address..." className="w-full bg-[#050505] border border-zinc-800 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00FF41]" />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-500 font-black tracking-widest mb-1 block">AMOUNT (SOL)</label>
                        <div className="relative">
                          <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="0.00" className="w-full bg-[#050505] border border-zinc-800 rounded-sm px-4 py-3 text-lg font-black text-white focus:outline-none focus:border-[#00FF41]" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-[#00FF41]">SOL</span>
                        </div>
                      </div>
                      <button onClick={handleWithdraw} disabled={isProcessing} className="w-full rounded-sm bg-[#00FF41] py-3 text-[10px] font-black text-black hover:bg-[#00e03a] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                        {isProcessing ? <RefreshCcw size={14} className="animate-spin"/> : <Send size={14}/>}
                        {isProcessing ? 'PROCESSING...' : 'CONFIRM WITHDRAWAL'}
                      </button>
                    </>
                  )}
                </>
              )}

              {/* REFERRAL MODAL */}
              {activeAction === 'REFERRAL' && (
                <>
                  <p className="text-xs text-zinc-400 text-center">Share your referral link and earn 1% of your friends' trading fees forever.</p>
                  <div className="bg-[#050505] border border-zinc-800 rounded-sm p-4 flex items-center justify-between gap-4">
                    <span className="font-mono text-xs text-white truncate">fairdegens.com/?ref={address?.slice(0, 8) || '...'}</span>
                    <button onClick={() => handleCopy(`https://fairdegens.com/?ref=${address || ''}`)} className="h-8 w-8 shrink-0 flex items-center justify-center bg-[#111116] border border-zinc-700 rounded-sm hover:border-[#00FF41] hover:text-[#00FF41]">
                      {copied ? <Check size={14} className="text-[#00FF41]"/> : <Copy size={14} />}
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-6 gap-4 relative">
        <div className="absolute bottom-0 left-0 w-1/4 h-[2px] bg-gradient-to-r from-[#00FF41] to-transparent"></div>
        <div>
          <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-[#00FF41] mb-2 font-black">
            <ShieldCheck className="h-3 w-3" /> PORTFOLIO MANAGER
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            SECURE VAULT
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/vault/activity" className="rounded-sm border border-zinc-800 bg-[#09090B] px-4 py-2 text-xs font-black text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
            <Download size={14} /> EXPORT
          </Link>
          <button onClick={() => setActiveAction('DEPOSIT')} className="rounded-sm bg-[#00FF41] px-6 py-2 text-xs font-black text-black hover:bg-[#00e03a] transition-all shadow-[0_0_20px_rgba(0,255,65,0.2)] flex items-center gap-2">
            <Wallet size={14} /> DEPOSIT
          </button>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden group">
          <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1 mb-1">
            <Wallet size={10} /> AVAILABLE BALANCE
          </div>
          <div className="text-2xl font-black text-white">0.000 SOL</div>
          <div className="mt-2 text-[10px] text-zinc-500 flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-[#00FF41] rounded-full animate-pulse"></span> Devnet Connected
          </div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden group">
          <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1 mb-1">
            <Activity size={10} /> TOTAL INVESTED
          </div>
          <div className="text-2xl font-black text-white">1.00 SOL</div>
          <div className="mt-2 text-[10px] text-zinc-500">Across 3 active pools</div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden group">
          <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1 mb-1">
            <BarChart3 size={10} /> PORTFOLIO VALUE
          </div>
          <div className="text-2xl font-black text-[#00FF41]">${mockPortfolioValue.toLocaleString()}</div>
          <div className="mt-2 text-[10px] text-zinc-500">Updated 12s ago</div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] p-4 rounded-sm relative overflow-hidden group">
          <div className="text-[9px] text-zinc-500 font-black tracking-widest flex items-center gap-1 mb-1">
            <TrendingUp size={10} /> UNREALIZED PNL
          </div>
          <div className="text-2xl font-black text-[#00FF41] flex items-center gap-2">
            +${mockPnl.toLocaleString()} <span className="text-sm">({mockPnlPercent}%)</span>
          </div>
          <div className="mt-2 text-[10px] text-zinc-500">Since inception</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left Column */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-5 relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-[10px] text-zinc-500 font-black tracking-widest">PORTFOLIO PERFORMANCE</div>
                <div className="text-2xl font-black text-white mt-1">${mockPortfolioValue.toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 px-3 py-1.5 rounded-sm cursor-pointer font-bold">1W</span>
                <span className="text-[10px] bg-[#050505] text-zinc-500 border border-zinc-800 px-3 py-1.5 rounded-sm cursor-pointer hover:text-white transition-colors">1M</span>
                <span className="text-[10px] bg-[#050505] text-zinc-500 border border-zinc-800 px-3 py-1.5 rounded-sm cursor-pointer hover:text-white transition-colors">ALL</span>
              </div>
            </div>
            <div className="h-56 w-full">
              <PortfolioChart />
            </div>
          </div>

          <div className="border border-zinc-800 bg-[#09090B] rounded-sm flex flex-col overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="flex border-b border-zinc-800 bg-[#050505]">
              <button onClick={() => setActiveTab('launches')} className={`px-6 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'launches' ? 'border-[#00FF41] text-white bg-[#111116]' : 'border-transparent text-zinc-500 hover:text-white'}`}>
                <Activity size={14} /> MY LAUNCHES (1)
              </button>
              <button onClick={() => setActiveTab('positions')} className={`px-6 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'positions' ? 'border-[#00FF41] text-white bg-[#111116]' : 'border-transparent text-zinc-500 hover:text-white'}`}>
                <TrendingUp size={14} /> MY POSITIONS (2)
              </button>
            </div>

            {activeTab === 'launches' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                <Link href="/dark-pools/1" className="group border border-zinc-800 bg-[#050505] rounded-sm p-4 hover:border-[#00FF41]/50 transition-all block">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-[#111116] border border-zinc-700 flex items-center justify-center font-black text-[#00FF41] rounded-md">UC</div>
                    <div>
                      <div className="font-bold text-white text-sm">Unemployed Cat</div>
                      <div className="text-[10px] text-zinc-500 font-mono">$UCAT</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-[8px] font-black px-2 py-1 rounded bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30">LIVE</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-t border-zinc-800/80 pt-3">
                    <div><div className="text-[8px] text-zinc-600 font-black tracking-widest mb-0.5">BALANCE</div><div className="text-[11px] font-bold text-white">1,250,000</div></div>
                    <div className="text-right"><div className="text-[8px] text-zinc-600 font-black tracking-widest mb-0.5">VALUE</div><div className="text-[11px] font-bold text-[#00FF41]">$450.00</div></div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                <div className="group border border-zinc-800 bg-[#050505] rounded-sm p-4 hover:border-[#00FF41]/50 transition-all block cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-[#111116] border border-zinc-700 flex items-center justify-center font-black text-[#00FF41] rounded-md">FA</div>
                    <div>
                      <div className="font-bold text-white text-sm">FairDegens</div>
                      <div className="text-[10px] text-zinc-500 font-mono">$FAIR</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-[8px] font-black px-2 py-1 rounded bg-[#FF00FF]/10 text-[#FF00FF] border border-[#FF00FF]/30">BIDDING</div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-zinc-500">Progress to Grad</span>
                      <span className="text-[#00FF41]">1.2 / 2.0 SOL</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00FF41]" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="group border border-zinc-800 bg-[#050505] rounded-sm p-4 hover:border-[#00FF41]/50 transition-all block cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-[#111116] border border-zinc-700 flex items-center justify-center font-black text-[#00FF41] rounded-md">DK</div>
                    <div>
                      <div className="font-bold text-white text-sm">Doge Killer</div>
                      <div className="text-[10px] text-zinc-500 font-mono">$DOGEK</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-[8px] font-black px-2 py-1 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">FILLED</div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-zinc-500">Position Value</span>
                      <span className="text-white">$890.00</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-zinc-500">PnL</span>
                      <span className="text-[#00FF41]">+$120.00 (+15%)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <h2 className="text-[10px] font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
              <Landmark size={12} className="text-[#00FF41]"/> ASSET ALLOCATION
            </h2>
            <div className="flex items-center justify-center h-40 mb-6 relative">
               <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
                 <circle cx="50" cy="50" r="40" fill="transparent" stroke="#27272a" strokeWidth="8" />
                 <circle cx="50" cy="50" r="40" fill="transparent" stroke="#00FF41" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="60" className="transition-all duration-1000" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <div className="text-[10px] text-zinc-500">TOTAL</div>
                 <div className="text-lg font-black text-white">$1,337</div>
               </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 text-zinc-400"><span className="h-2 w-2 bg-[#00FF41] rounded-sm"></span> SOL</span>
                <span className="text-white font-mono">76%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 text-zinc-400"><span className="h-2 w-2 bg-[#FF00FF] rounded-sm"></span> Tokens</span>
                <span className="text-white font-mono">24%</span>
              </div>
            </div>
          </div>

          <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <h2 className="text-[10px] font-black text-white mb-4 uppercase tracking-widest flex items-center gap-2">
              <Zap size={12} className="text-[#00FF41]"/> QUICK ACTIONS
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setActiveAction('DEPOSIT')} className="flex flex-col items-center justify-center p-3 border border-zinc-800 rounded-sm hover:border-[#00FF41]/50 hover:bg-[#00FF41]/5 transition-all group">
                <ArrowDownRight size={16} className="text-zinc-500 group-hover:text-[#00FF41] mb-1" />
                <span className="text-[10px] font-bold text-zinc-300 group-hover:text-white">DEPOSIT</span>
              </button>
              <button onClick={() => setActiveAction('WITHDRAW')} className="flex flex-col items-center justify-center p-3 border border-zinc-800 rounded-sm hover:border-[#00FF41]/50 hover:bg-[#00FF41]/5 transition-all group">
                <ArrowUpRight size={16} className="text-zinc-500 group-hover:text-[#00FF41] mb-1" />
                <span className="text-[10px] font-bold text-zinc-300 group-hover:text-white">WITHDRAW</span>
              </button>
              <button onClick={() => window.location.reload()} className="flex flex-col items-center justify-center p-3 border border-zinc-800 rounded-sm hover:border-[#00FF41]/50 hover:bg-[#00FF41]/5 transition-all group">
                <RefreshCcw size={16} className="text-zinc-500 group-hover:text-[#00FF41] mb-1" />
                <span className="text-[10px] font-bold text-zinc-300 group-hover:text-white">REFRESH</span>
              </button>
              <button onClick={() => setActiveAction('REFERRAL')} className="flex flex-col items-center justify-center p-3 border border-zinc-800 rounded-sm hover:border-[#00FF41]/50 hover:bg-[#00FF41]/5 transition-all group">
                <UsersIcon size={16} className="text-zinc-500 group-hover:text-[#00FF41] mb-1" />
                <span className="text-[10px] font-bold text-zinc-300 group-hover:text-white">REFERRAL</span>
              </button>
            </div>
          </div>

          <div className="border border-zinc-800 bg-[#09090B] rounded-sm p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Clock size={12} className="text-zinc-400"/> RECENT ACTIVITY
              </h2>
              <Link href="/vault/activity" className="text-[9px] text-[#00FF41] hover:underline cursor-pointer">VIEW ALL</Link>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center group cursor-pointer">
                <div className="flex gap-3 items-center">
                  <div className="h-8 w-8 rounded-sm bg-[#00FF41]/10 border border-[#00FF41]/30 flex items-center justify-center text-[#00FF41]"><ArrowDownRight size={14}/></div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-[#00FF41] transition-colors">Deposited SOL</div>
                    <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1"><Clock size={8}/> 2 hrs ago</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-white">+0.50</div>
                  <div className="text-[9px] text-[#00FF41] font-mono">SUCCESS</div>
                </div>
              </div>
              <div className="flex justify-between items-center group cursor-pointer">
                <div className="flex gap-3 items-center">
                  <div className="h-8 w-8 rounded-sm bg-[#FF00FF]/10 border border-[#FF00FF]/30 flex items-center justify-center text-[#FF00FF]"><Zap size={14}/></div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-[#FF00FF] transition-colors">Bid Placed</div>
                    <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1"><Clock size={8}/> Yesterday</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-white">-0.10</div>
                  <div className="text-[9px] text-[#00FF41] font-mono">SUCCESS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icon since we removed the import
function UsersIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
