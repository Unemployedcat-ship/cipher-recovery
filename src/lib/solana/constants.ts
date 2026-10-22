import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

export const SOLANA_RPC =
  process.env.NEXT_PUBLIC_SOLANA_RPC?.trim() || clusterApiUrl('devnet');

export const connection = new Connection(SOLANA_RPC, {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60_000,
  wsEndpoint: undefined,
});

export const LAMPORTS_PER_SOL = 1_000_000_000;
export const solToLamports = (sol: number | string): number => Math.round(Number(sol) * LAMPORTS_PER_SOL);
export const lamportsToSol = (lamports: number | bigint): number => Number(lamports) / LAMPORTS_PER_SOL;
export const shortAddr = (a?: string | null, n = 4): string => a ? `${a.slice(0, n)}...${a.slice(-n)}` : '';

// 🚨 YOUR PHONE WALLET - ALL FEES GO HERE AUTOMATICALLY
export const TREASURY_WALLET = new PublicKey("7kFmtJr5hEUB7fRr2b9bAVidt6XoQyJAcD188itUHmdu"); 
