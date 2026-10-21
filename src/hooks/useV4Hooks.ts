'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { supabase } from '../lib/supabase';

// V4 Custom JWT Auth Bridge
export function useSupabaseAuth() {
  const { user, authenticated, getAccessToken } = usePrivy();
  const [session, setSession] = useState<{ accessToken: string | null; error: string | null }>({
    accessToken: null,
    error: null,
  });

  useEffect(() => {
    async function syncSession() {
      if (!authenticated || !user) {
        setSession({ accessToken: null, error: null });
        supabase.auth.signOut();
        return;
      }

      try {
        const token = await getAccessToken();
        if (token) {
          // Send to custom Supabase Auth with external Privy JWT Provider
          // @ts-ignore - Temporary bypass for Supabase custom JWT definition mismatch
          const { data, error } = await supabase.auth.signInWithCustomJWT(token);
          if (error) throw error;
          setSession({ accessToken: token, error: null });
        }
      } catch (err: any) {
        console.error('Failed to sync Privy JWT with Supabase:', err.message);
        setSession({ accessToken: null, error: err.message });
      }
    }

    syncSession();
  }, [user, authenticated, getAccessToken]);

  return { session, authenticated, user };
}

// V4 God Mode Native Database Hook - Live FHE Bids
export function useLiveBids(auctionId: string) {
  const [bids, setBids] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auctionId) return;

    // Initial Fetch
    const fetchBids = async () => {
      setIsLoading(true);
      const { data } = await supabase.from('fhe_bids').select('*').eq('auction_id', auctionId);
      setBids(data || []);
      setIsLoading(false);
    };

    fetchBids();

    // Subscribe to new FHE Bids arriving in mempool via Supabase Real-Time
    const channel = supabase.channel(`public:fhe_bids:auction_id=eq.${auctionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'fhe_bids', filter: `auction_id=eq.${auctionId}` }, (payload) => {
        setBids((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auctionId]);

  return { bids, isLoading };
}

// V4 God Mode - Agent Permission Matrix UI Hook
export function useAgentPermissions(agentId: string) {
  const [permissions, setPermissions] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!agentId) return;

    const fetchPermissions = async () => {
      setIsLoading(true);
      const { data } = await supabase.from('agent_permissions').select('*').eq('agent_id', agentId).single();
      setPermissions(data || null);
      setIsLoading(false);
    };

    fetchPermissions();

    const channel = supabase.channel(`public:agent_permissions:agent_id=eq.${agentId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'agent_permissions', filter: `agent_id=eq.${agentId}` }, (payload) => {
        setPermissions(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [agentId]);

  return { permissions, isLoading };
}
