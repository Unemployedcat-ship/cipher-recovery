import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { AnchorProvider, Program, BN, Idl } from '@coral-xyz/anchor';
import { IDL as CipherIDL } from './cipher_idl';
import { TREASURY_WALLET } from './constants';

// ─────────────────────────────────────────────────────────────
// RPC CONNECTION (robust, with devnet fallback)
// ─────────────────────────────────────────────────────────────
const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  process.env.NEXT_PUBLIC_HELIUS_RPC_URL ||
  'https://api.devnet.solana.com';

if (typeof window !== 'undefined') {
  console.log('[solana/actions] RPC_URL =', RPC_URL);
}

export const connection = new Connection(RPC_URL, 'confirmed');

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID ||
    'CiphAuCt111111111111111111111111111111111'
);

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
export function getCipherProgram(signer: any) {
  const provider = new AnchorProvider(connection, signer, {
    commitment: 'confirmed',
  });
  return new Program(CipherIDL as Idl, PROGRAM_ID, provider);
}

export function findVaultPda(auctionPda: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), auctionPda.toBuffer()],
    PROGRAM_ID
  );
}

export function findReceiptPda(
  auctionPda: PublicKey,
  bidder: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('receipt'), auctionPda.toBuffer(), bidder.toBuffer()],
    PROGRAM_ID
  );
}

async function assertRpcHealthy(label: string) {
  try {
    const slot = await connection.getSlot();
    console.log(`[${label}] RPC OK — slot:`, slot);
  } catch (e: any) {
    console.error(`[${label}] RPC FAILED:`, e);
    throw new Error(
      `Cannot reach Solana RPC at ${RPC_URL}. ` +
        `Check NEXT_PUBLIC_SOLANA_RPC_URL in .env.local and your network connection.`
    );
  }
}

export async function waitForConfirmation(
  signature: string,
  timeout = 60000
) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const status = await connection.getSignatureStatus(signature);
    if (
      status?.value?.confirmationStatus === 'confirmed' ||
      status?.value?.confirmationStatus === 'finalized'
    ) {
      return status;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error('Transaction confirmation timeout');
}

// ─────────────────────────────────────────────────────────────
// CREATE AUCTION
// ─────────────────────────────────────────────────────────────
export async function createAuctionOnChain(
  signer: any,
  authority: PublicKey,
  durationSeconds: number,
  targetSol: number,
  supply: number,
  authorityKeypair?: Keypair
) {
  console.log('[createAuctionOnChain] RPC:', RPC_URL);
  await assertRpcHealthy('createAuctionOnChain');

  const program = getCipherProgram(signer);

  const mintKeypair = Keypair.generate();
  const [auctionPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('auction'), mintKeypair.publicKey.toBuffer()],
    PROGRAM_ID
  );

  const targetLamports = new BN(targetSol * 1_000_000_000);
  const supplyBN = new BN(supply);

  // ⚠️ If your program method args differ, keep your original method call
  // and only replace the connection/health-check parts above.
  const tx = await program.methods
    .createAuction(
      supplyBN,
      new BN(durationSeconds),
      targetLamports,
      Array(32).fill(0) // manifest hash placeholder
    )
    .accounts({
      creator: authority,
      tokenMint: mintKeypair.publicKey,
      auction: auctionPda,
      treasury: TREASURY_WALLET,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  const { blockhash } = await connection.getLatestBlockhash('confirmed');
  tx.recentBlockhash = blockhash;
  tx.feePayer = authority;

  if (authorityKeypair) {
    tx.sign(authorityKeypair);
    const sig = await connection.sendRawTransaction(tx.serialize(), {
      maxRetries: 3,
    });
    await waitForConfirmation(sig);
    return {
      auctionId: auctionPda.toBase58(),
      auctionPda: auctionPda.toBase58(),
      mintAddress: mintKeypair.publicKey.toBase58(),
    };
  }

  const signedTx = await signer.signTransaction(tx);
  const sig = await connection.sendRawTransaction(signedTx.serialize(), {
    maxRetries: 3,
  });
  await waitForConfirmation(sig);

  return {
    auctionId: auctionPda.toBase58(),
    auctionPda: auctionPda.toBase58(),
    mintAddress: mintKeypair.publicKey.toBase58(),
  };
}

// ─────────────────────────────────────────────────────────────
// SUBMIT BID
// ─────────────────────────────────────────────────────────────
export async function submitBidOnChain(
  signer: any,
  bidder: PublicKey,
  auctionPda: PublicKey,
  amountInSol: number
) {
  console.log('[submitBidOnChain] RPC:', RPC_URL);
  await assertRpcHealthy('submitBidOnChain');

  const program = getCipherProgram(signer);

  const [vaultPda] = findVaultPda(auctionPda);
  const [receiptPda] = findReceiptPda(auctionPda, bidder);
  const amountLamports = new BN(amountInSol * 1_000_000_000);

  const tx = await program.methods
    .submitBid(amountLamports)
    .accounts({
      auction: auctionPda,
      receipt: receiptPda,
      vault: vaultPda,
      treasury: TREASURY_WALLET,
      bidder: bidder,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  const { blockhash } = await connection.getLatestBlockhash('confirmed');
  tx.recentBlockhash = blockhash;
  tx.feePayer = bidder;

  const signedTx = await signer.signTransaction(tx);
  const sig = await connection.sendRawTransaction(signedTx.serialize(), {
    maxRetries: 3,
  });
  await waitForConfirmation(sig);

  return sig;
}
export const createAuction = createAuctionOnChain;
