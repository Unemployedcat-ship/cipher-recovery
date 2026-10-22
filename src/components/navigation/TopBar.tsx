'use client';

import { useState, useRef, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSupabase } from '@/components/SupabaseProvider';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { PublicKey } from '@solana/web3.js';
import { ChevronDown, User, LogOut, Wallet, Copy, Check, Settings } from 'lucide-react';
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

  return (
    // Using inline styles to FORCE the layout to be horizontal
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid #222228', backgroundColor: '#09090B', position: 'relative', zIndex: 50 }}>
      
      <Link href="/" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <img src="/logo.svg" alt="FairDegens" style={{ height: '40px', width: '40px' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'white', fontWeight: 900, fontSize: '20px', letterSpacing: '1px' }}>
            FAIR<span style={{ color: '#00FF41' }}>//</span>DEGENS
          </span>
          <span style={{ color: '#00FF41', fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '2px' }}>
            Anti-Snipe Protocol
          </span>
        </div>
      </Link>

      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
        {!authenticated ? (
          <button onClick={login} style={{ backgroundColor: '#00FF41', color: 'black', fontWeight: 'bold', fontSize: '12px', padding: '8px 20px', borderRadius: '4px', border: 'none', cursor: 'pointer', boxShadow: '0 0 15px rgba(0,255,65,0.3)' }}>
            CONNECT IDENTITY
          </button>
        ) : !address ? (
          <button onClick={() => createWallet()} disabled={!solanaReady} style={{ backgroundColor: '#FBBF24', color: 'black', fontWeight: 'bold', fontSize: '12px', padding: '8px 20px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
            CREATE WALLET
          </button>
        ) : (
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', backgroundColor: '#111116', border: '1px solid #222228', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}>
              <div style={{ height: '8px', width: '8px', backgroundColor: '#00FF41', borderRadius: '50%' }}></div>
              <span style={{ color: '#d4d4d8', fontSize: '12px' }}>{displayName}</span>
              <span style={{ color: '#00FF41', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(0,255,65,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                {liveBalance !== null ? liveBalance.toFixed(2) : '0.00'} SOL
              </span>
              <ChevronDown size={14} color="#71717a" />
            </button>

            {isOpen && (
              <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '8px', width: '256px', backgroundColor: '#111116', border: '1px solid #222228', borderRadius: '8px', padding: '8px 0', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                <button onClick={handleCopy} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #222228', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Wallet size={14} color="#00FF41" /> 
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '9px', color: '#71717a', textTransform: 'uppercase' }}>Wallet</span>
                      <span style={{ color: 'white', fontSize: '12px' }}>{address.slice(0, 6)}...{address.slice(-6)}</span>
                    </div>
                  </div>
                  {copied ? <Check size={14} color="#00FF41"/> : <Copy size={14} color="#71717a" />}
                </button>

                <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#d4d4d8', textDecoration: 'none', fontSize: '12px' }}>
                  <User size={14} /> Profile
                </Link>
                <Link href="/settings" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#d4d4d8', textDecoration: 'none', fontSize: '12px' }}>
                  <Settings size={14} /> Settings
                </Link>
                <div style={{ height: '1px', backgroundColor: '#222228', margin: '4px 0' }} />
                <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#f87171', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '12px' }}>
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
