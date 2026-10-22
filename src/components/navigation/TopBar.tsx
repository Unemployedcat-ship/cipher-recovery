'use client';

import { useState, useRef, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSupabase } from '@/components/SupabaseProvider';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { PublicKey } from '@solana/web3.js';
import { ChevronDown, User, Users, Shield, FileText, LogOut, Wallet, Copy, Check, AlertTriangle, Settings, PlusSquare } from 'lucide-react';
import Link from 'next/link';
import { connection } from '@/lib/solana/constants';

export function TopBar() {
  const { user, logout, authenticated, login } = usePrivy();
  const { supabase } = useSupabase();
  const { address, createWallet, solanaReady } = useSolanaWallet();
  
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [liveBalance, setLiveBalance] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const { data } = await supabase.from('profiles').select('username, syndicate_tag').eq('privy_did', user.id).single();
      if (data) setProfileData(data);
    }
    fetchProfile();
  }, [user, supabase]);

  // Bulletproof live balance fetch using the shared connection
  useEffect(() => {
    if (!address) {
      setLiveBalance(null);
      return;
    }

    let isMounted = true;
    let consecutiveFails = 0;

    const fetchBalance = async () => {
      if (consecutiveFails > 3) return;
      try {
        const pubkey = new PublicKey(address);
        const lamports = await connection.getBalance(pubkey);
        if (isMounted) {
          setLiveBalance(lamports / 1_000_000_000);
          consecutiveFails = 0;
        }
      } catch (err) {
        consecutiveFails++;
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [address]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayName = profileData?.username || (address ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'Degen');
  const clanTag = profileData?.syndicate_tag;

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#09090B] relative z-50">
      
      <Link href="/" className="flex items-center gap-3">
        <img src="/logo.svg" alt="FairDegens Logo" className="h-8 w-8" />
        <div className="flex flex-col leading-none">
          <span className="font-mono text-xl text-white font-bold tracking-widest">
            FAIR<span className="text-[#00FF41]">//</span>DEGENS
          </span>
          <span className="text-[8px] text-[#00FF41] tracking-[0.3em] mt-1 font-mono">ANTI-SNIPE PROTOCOL</span>
        </div>
      </Link>


      <div className="flex items-center gap-4">
        {!authenticated ? (
          <button onClick={login} className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-black font-bold font-mono text-xs rounded-lg hover:bg-cyan-400 transition-colors">
            CONNECT IDENTITY
          </button>
        ) : !address ? (
          <button onClick={() => createWallet()} disabled={!solanaReady} className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-black font-bold font-mono text-xs rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50">
            <Wallet size={14} /> CREATE WALLET
          </button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-colors bg-[#111116]">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              
              {clanTag && <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-800/50">[{clanTag}]</span>}
              <span className="text-xs font-mono text-white">{displayName}</span>
              
              <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                <Wallet size={12} />
                {liveBalance !== null ? liveBalance.toFixed(3) : '...'} SOL
              </span>
              
              <ChevronDown size={12} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#111116] border border-white/10 rounded-xl shadow-2xl py-2 flex flex-col font-mono text-xs">
                <button onClick={handleCopy} className="flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 mb-1">
                  <div className="flex items-center gap-3">
                    <Wallet size={14} className="text-cyan-400"/> 
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-slate-500 uppercase">Your Wallet</span>
                      <span className="text-xs">{address.slice(0, 6)}...{address.slice(-6)}</span>
                    </div>
                  </div>
                  {copied ? <Check size={14} className="text-emerald-400"/> : <Copy size={14} className="text-slate-500" />}
                </button>

                <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                  <User size={14} /> Profile & Clan
                </Link>
                <Link href="/syndicates" className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                  <PlusSquare size={14} /> Create Syndicate
                </Link>
                <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                  <Settings size={14} /> Account Settings
                </Link>
                <div className="h-px bg-white/5 my-1" />
                <button onClick={logout} className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors text-left">
                  <LogOut size={14} /> Disconnect
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
