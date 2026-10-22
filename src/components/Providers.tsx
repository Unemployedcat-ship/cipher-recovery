'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { SOLANA_RPC } from '@/lib/solana/constants';
import { SupabaseProvider } from './SupabaseProvider';

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: false, // Turn off auto-connect to stop the Phantom rejection noise
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: { theme: 'dark', accentColor: '#22d3ee', logo: '/logo.svg', walletList: ['metamask', 'coinbase_wallet', 'backpack'], walletChainType: 'ethereum-and-solana' },
        loginMethods: ['wallet', 'email', 'google', 'twitter'],
        embeddedWallets: {
          solana: { createOnLogin: 'all-users' },
        },
        externalWallets: {
          solana: { connectors: solanaConnectors },
        },
        solana: { rpcUrl: SOLANA_RPC },
      }}
    >
      <SupabaseProvider>
        {children}
      </SupabaseProvider>
    </PrivyProvider>
  );
}

export default Providers;
