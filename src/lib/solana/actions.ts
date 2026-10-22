import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { AnchorProvider, Program, BN, Idl } from '@coral-xyz/anchor';
import CipherIDL from './idl/cipher_auction.json';
import { TREASURY_WALLET } from './constants';

// Force the public devnet URL to avoid the CORS errors from the dead Codespace
const RPC_URL = 'https://api.devnet.solana.com';

export const connection = new Connection(RPC_URL, 'confirmed');

// Use your ACTUAL program ID from your previous files
export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_CIPHER_AUCTION_PROGRAM_ID || 
  '7GEibaWAAFwANcfSaCfGwpLocKcEfrnhpxK2cwRp9q7W'
);

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
    throw new Error(`Cannot reach Solana RPC.`);
  }
}

export async function waitForConfirmation(signature: string, timeout = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const status = await connection.getSignatureStatus(signature);
    if (status?.value?.confirmationStatus === 'confirmed' || status?.value?.confirmationStatus === 'finalized') {
      return status;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error('Transaction confirmation timeout');
}

export async function createAuctionOnChain(
  signer: any,
  authority: PublicKey,
  durationSeconds: number,
  targetSol: number,
  supply: number,
  authorityKeypair?: Keypair
) {
  await assertRpcHealthy('createAuctionOnChain');
  const program = getCipherProgram(signer);
  const mintKeypair = Keypair.generate();
  const [auctionPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('auction'), mintKeypair.publicKey.toBuffer()],
    PROGRAM_ID
  );

  const targetLamports = new BN(targetSol * 1_000_000_000);
  const supplyBN = new BN(supply);

  const tx = await program.methods
    .createAuction(supplyBN, new BN(durationSeconds), targetLamports, Array(32).fill(0))
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

  const signedTx = await signer.signTransaction(tx);
  const sig = await connection.sendRawTransaction(signedTx.serialize(), { maxRetries: 3 });
  await waitForConfirmation(sig);

  return {
    auctionId: auctionPda.toBase58(),
    auctionPda: auctionPda.toBase58(),
    mintAddress: mintKeypair.publicKey.toBase58(),
  };
}

export async function submitBidOnChain(
  signer: any,
  bidder: PublicKey,
  auctionPda: PublicKey,
  amountInSol: number
) {
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
  const sig = await connection.sendRawTransaction(signedTx.serialize(), { maxRetries: 3 });
  await waitForConfirmation(sig);

  return sig;
}
