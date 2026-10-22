'use client';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';

export function TopBar() {
  const { authenticated, login } = usePrivy();
  const { address } = useSolanaWallet();

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid #222228', backgroundColor: '#09090B', flexShrink: 0 }}>
      <Link href="/" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <img src="/logo.svg" alt="FairDegens" style={{ height: '35px', width: '35px' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'white', fontWeight: 900, fontSize: '18px', letterSpacing: '1px' }}>
            FAIR<span style={{ color: '#00FF41' }}>//</span>DEGENS
          </span>
          <span style={{ color: '#00FF41', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            Anti-Snipe Protocol
          </span>
        </div>
      </Link>

      <div>
        {!authenticated ? (
          <button onClick={login} style={{ backgroundColor: '#00FF41', color: 'black', fontWeight: 'bold', fontSize: '12px', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
            CONNECT IDENTITY
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#111116', border: '1px solid #222228', padding: '6px 12px', borderRadius: '4px' }}>
            <div style={{ height: '8px', width: '8px', backgroundColor: '#00FF41', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '12px', color: '#a1a1aa' }}>{address?.slice(0,4)}...{address?.slice(-4)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
