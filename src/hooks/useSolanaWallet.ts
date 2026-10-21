'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { connection, lamportsToSol } from '@/lib/solana/constants';

export type SolanaSigner = {
  address: string;
  publicKey: PublicKey;
  walletClientType: string;
  isEmbedded: boolean;
  signTransaction: <T extends Transaction | VersionedTransaction>(tx: T) => Promise<T>;
  signAllTransactions: <T extends Transaction | VersionedTransaction>(txs: T[]) => Promise<T[]>;
  sendTransaction: (tx: Transaction | VersionedTransaction, conn?: Connection) => Promise<string>;
};

export function useSolanaWallet() {
  const { ready: privyReady, authenticated, login, logout } = usePrivy();
  const { wallets: allWallets, ready: walletsReady } = useWallets() as any;
  const { wallets: embeddedWallets, createWallet, ready: solanaReady } = useSolanaWallets() as any;

  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [failCount, setFailCount] = useState(0);

  const activeRaw = useMemo(() => {
    const externalSolana = (allWallets ?? []).find((w: any) => w?.chainType === 'solana' && w?.walletClientType !== 'privy');
    if (externalSolana) return externalSolana;
    if (embeddedWallets && embeddedWallets.length > 0) return embeddedWallets[0];
    return null;
  }, [allWallets, embeddedWallets]);

  const isEmbedded = !!activeRaw && activeRaw.walletClientType === 'privy';

  const signer = useMemo<SolanaSigner | null>(() => {
    if (!activeRaw?.address) return null;
    const raw = activeRaw as any;
    if (raw.address.startsWith('0x')) return null;

    const signOne = async <T extends Transaction | VersionedTransaction>(tx: T): Promise<T> => {
      if (typeof raw.signTransaction === 'function') return (await raw.signTransaction(tx)) as T;
      const provider = raw.getSolanaProvider?.();
      if (provider?.signTransaction) return (await provider.signTransaction(tx)) as T;
      throw new Error(`[cipher] Wallet ${raw.walletClientType} cannot sign transactions`);
    };

    const signAll = async <T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> => {
      if (typeof raw.signAllTransactions === 'function') return (await raw.signAllTransactions(txs)) as T[];
      const provider = raw.getSolanaProvider?.();
      if (provider?.signAllTransactions) return (await provider.signAllTransactions(txs)) as T[];
      const out: T[] = [];
      for (const tx of txs) out.push(await signOne(tx));
      return out;
    };

    const send = async (tx: Transaction | VersionedTransaction, conn: Connection = connection): Promise<string> => {
      if (typeof raw.sendTransaction === 'function') return await raw.sendTransaction(tx, conn);
      const signed = await signOne(tx);
      const rawBytes = signed.serialize();
      return await conn.sendRawTransaction(rawBytes, { skipPreflight: false, preflightCommitment: 'confirmed' });
    };

    return {
      address: raw.address as string,
      publicKey: new PublicKey(raw.address),
      walletClientType: (raw.walletClientType as string) ?? 'unknown',
      isEmbedded,
      signTransaction: signOne,
      signAllTransactions: signAll,
      sendTransaction: send,
    };
  }, [activeRaw, isEmbedded]);

  const address = signer?.address ?? null;

  const refreshBalance = useCallback(async () => {
    if (!address) { setBalance(null); return; }
    if (failCount > 5) return; // Stop trying if it keeps failing

    try {
      setBalanceLoading(true);
      const lamports = await connection.getBalance(new PublicKey(address), 'confirmed');
      setBalance(lamportsToSol(lamports));
      setFailCount(0); // Reset on success
    } catch (e) {
      // Silently fail, don't spam the console
      setFailCount(prev => prev + 1);
    } finally {
      setBalanceLoading(false);
    }
  }, [address, failCount]);

  useEffect(() => {
    void refreshBalance();
    const interval = setInterval(() => { void refreshBalance(); }, 10000);
    return () => clearInterval(interval);
  }, [refreshBalance]);

  return { ready: privyReady && walletsReady, authenticated, login, logout, signer, address, isEmbedded, createWallet, solanaReady, balance, balanceLoading, refreshBalance, connection };
}
