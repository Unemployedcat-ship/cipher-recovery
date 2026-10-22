import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { AnchorProvider, Program, BN, Idl } from '@coral-xyz/anchor';
import CipherIDL from './idl/cipher_auction.json';
import { TREASURY_WALLET, connection } from './constants';

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

export async function submitBidOnChain(
  signer: any,
  bidder: PublicKey,
  auctionPda: PublicKey,
  amountInSol: number
) {
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
      treasury: TREASURY_WALLET, // <--- YOUR PHONE WALLET GOES HERE
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
  await connection.confirmTransaction(sig, 'confirmed');

  return sig;
}
