'use client';

import { useState, useRef, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSupabase } from '@/components/SupabaseProvider';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { PublicKey } from '@solana/web3.js';
import { ChevronDown, User, Shield, LogOut, Wallet, Copy, Check, Settings, PlusSquare } from 'lucide-react';
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
      if (!user || !supabase) return;
      const { data } = await supabase.from('profiles').select('username, syndicate_tag').eq('privy_did', user.id).single();
      if (data) setProfileData(data);
    }
    fetchProfile();
  }, [user, supabase]);

  useEffect(() => {
    if (!address || !connection) return;
    let isMounted = true;
    const fetchBalance = async () => {
      try {
        const pubkey = new PublicKey(address);
        const lamports = await connection.getBalance(pubkey);
        if (isMounted) setLiveBalance(lamports / 1_000_000_000);
      } catch (err) {}
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
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
    <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-[#09090B] relative z-50">
      
      {/* LOGO & BRANDING */}
      <Link href="/" className="flex items-center gap-3 group">
        <img src="/logo.svg" alt="FairDegens" className="h-9 w-9 group-hover:scale-105 transition-transform" />
        <div className="flex flex-col leading-none">
          <span className="font-mono text-xl text-white font-black tracking-wider transition-colors">
            FAIR<span className="text-[#00FF41]">//</span>DEGENS
          </span>
          <span className="text-[8px] text-[#00FF41] tracking-[0.35em] mt-1 font-mono uppercase font-bold">
            Anti-Snipe Protocol
          </span>
        </div>
      </Link>

      {/* WALLET / LOGIN */}
      <div className="flex items-center gap-4">
        {!authenticated ? (
          <button onClick={login} className="flex items-center gap-2 px-5 py-2 bg-[#00FF41] text-black font-bold font-mono text-xs rounded hover:bg-[#00e03a] transition-all shadow-[0_0_15px_rgba(0,255,65,0.3)]">
            CONNECT IDENTITY
          </button>
        ) : !address ? (
          <button onClick={() => createWallet()} disabled={!solanaReady} className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-black font-bold font-mono text-xs rounded hover:bg-amber-500 transition-colors disabled:opacity-50">
            <Wallet size={14} /> CREATE WALLET
          </button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 px-3 py-1.5 rounded-md border border-zinc-800 hover:border-[#00FF41]/50 transition-colors bg-[#111116]">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF41]"></span>
              </div>
              
              {clanTag && <span className="text-[10px] font-mono font-bold text-[#00FF41] bg-[#00FF41]/10 px-1.5 py-0.5 rounded border border-[#00FF41]/20">[{clanTag}]</span>}
              <span className="text-xs font-mono text-zinc-300">{displayName}</span>
              
              <span className="flex items-center gap-1 text-xs font-mono text-[#00FF41] font-bold bg-[#00FF41]/10 px-2 py-1 rounded">
                {liveBalance !== null ? liveBalance.toFixed(2) : '0.00'} SOL
              </span>
              
              <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#111116] border border-zinc-800 rounded-lg shadow-2xl py-2 flex flex-col font-mono text-xs">
                <button onClick={handleCopy} className="flex items-center justify-between px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors border-b border-zinc-800 mb-1">
                  <div className="flex items-center gap-3">
                    <Wallet size={14} className="text-[#00FF41]"/> 
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-zinc-500 uppercase">Wallet</span>
                      <span className="text-xs">{address.slice(0, 6)}...{address.slice(-6)}</span>
                    </div>
                  </div>
                  {copied ? <Check size={14} className="text-[#00FF41]"/> : <Copy size={14} className="text-zinc-500" />}
                </button>

                <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors">
                  <User size={14} /> Profile & Clan
                </Link>
                <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors">
                  <Settings size={14} /> Settings
                </Link>
                <div className="h-px bg-zinc-800 my-1" />
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
