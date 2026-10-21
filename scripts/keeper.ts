import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { createClient } from '@supabase/supabase-js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC || 'http://127.0.0.1:8899', 'confirmed');
const idl = JSON.parse(fs.readFileSync('./src/lib/solana/idl/cipher_auction.json', 'utf8'));

const KEYPAIR_PATH = './scripts/keeper_keypair.json';
let keeperKeypair: Keypair;

if (fs.existsSync(KEYPAIR_PATH)) {
  keeperKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(KEYPAIR_PATH, 'utf8'))));
} else {
  keeperKeypair = Keypair.generate();
  fs.writeFileSync(KEYPAIR_PATH, JSON.stringify(Array.from(keeperKeypair.secretKey)));
  console.log(`🆕 Created new Keeper Wallet!`);
}

const wallet = new anchor.Wallet(keeperKeypair);
const provider = new anchor.AnchorProvider(connection, wallet, { commitment: 'confirmed' });
anchor.setProvider(provider);
const program = new Program(idl, provider);

console.log(`\n🤖 Keeper Bot Started!`);
console.log(`🔑 Wallet: ${keeperKeypair.publicKey.toBase58()}`);
console.log(`-----------------------------------------------\n`);

// 🔴 AUTO-AIRDROP LOGIC
async function checkAndFundWallet() {
  try {
    const balance = await connection.getBalance(keeperKeypair.publicKey);
    if (balance < 5 * LAMPORTS_PER_SOL) {
      console.log(`💸 Keeper balance is low (${balance / LAMPORTS_PER_SOL} SOL). Requesting local airdrop...`);
      const airdropSig = await connection.requestAirdrop(keeperKeypair.publicKey, 10 * LAMPORTS_PER_SOL);
      
      // Wait for airdrop confirmation
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature: airdropSig,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      });
      console.log(`✅ Airdropped 10 SOL successfully!`);
    } else {
      console.log(`💰 Keeper Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    }
  } catch (err) {
    console.log(`🚨 Auto-airdrop failed. If you are on Devnet/Mainnet, please fund the wallet manually. Error: ${err}`);
  }
}

async function distributeTokens(auctionId: string, pdaAddress: string, mintAddress: string) {
  const auctionPda = new PublicKey(pdaAddress);
  const mintPubkey = new PublicKey(mintAddress);

  const { data: bids, error } = await supabase.from('bids').select('amount, user_id').eq('auction_id', auctionId);

  if (error || !bids) {
    console.error("Failed to fetch bids:", error);
    return;
  }

  for (const bid of bids) {
    // 🔴 MOCK: For Localnet, we use your frontend test wallet. 
    const bidderWallet = "EV2yYUscn9qGC9YMBdjEFVeRtEe8NbaVJwSGRUUSGzQH"; 
    const bidderPubkey = new PublicKey(bidderWallet);

    console.log(`🚀 Distributing to ${bidderWallet}...`);
    
    const receiptPda = PublicKey.findProgramAddressSync([Buffer.from("receipt"), auctionPda.toBuffer(), bidderPubkey.toBuffer()], program.programId)[0];
    const userTokenAccount = await getAssociatedTokenAddress(mintPubkey, bidderPubkey);

    try {
      const tx = await program.methods.claimTokens().accounts({
          auction: auctionPda, 
          receipt: receiptPda, 
          bidder: bidderPubkey,
          mint: mintPubkey, 
          userTokenAccount: userTokenAccount, 
          keeper: keeperKeypair.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID, 
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([keeperKeypair]).rpc();
        
      console.log(`✅ Distributed | Tx: ${tx}`);
    } catch (err: any) { 
      console.error(`❌ Failed to distribute:`, err.message || err); 
    }
  }
}

async function runKeeper() {
  try {
    console.log(`[${new Date().toLocaleTimeString()}] Scanning...`);
    
    const { data: auctions, error } = await supabase.from('auctions').select('*').in('status', ['live', 'settled']);
    if (error) throw error;
    if (!auctions || auctions.length === 0) return;

    const now = Math.floor(Date.now() / 1000);

    for (const auction of auctions) {
      const endTime = new Date(auction.end_time).getTime() / 1000;
      
      if (now >= endTime && auction.status === 'live') {
        console.log(`⏰ Auction "${auction.name}" expired!`);
        const { data: bids } = await supabase.from('bids').select('amount').eq('auction_id', auction.id);
        const totalRaised = bids?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;
        
        if (totalRaised >= Number(auction.graduation_target)) {
          console.log(`✅ Target hit! Marking ${auction.name} as SETTLED.`);
          await supabase.from('auctions').update({ status: 'settled' }).eq('id', auction.id);
          if (auction.pda_address && auction.mint_address) {
             await distributeTokens(auction.id, auction.pda_address, auction.mint_address);
          }
        } else {
          console.log(`❌ Target missed! Marking ${auction.name} as FAILED.`);
          await supabase.from('auctions').update({ status: 'failed' }).eq('id', auction.id);
        }
      } 
      else if (auction.status === 'settled') {
         console.log(`🔄 Retrying distribution for SETTLED auction "${auction.name}"...`);
         if (auction.pda_address && auction.mint_address) {
             await distributeTokens(auction.id, auction.pda_address, auction.mint_address);
         }
      }
    }
  } catch (err) { 
    console.error("Keeper Error:", err); 
  }
}

// Run the auto-funding check first, then start the loop
checkAndFundWallet().then(() => {
  runKeeper();
  setInterval(runKeeper, 30000);
});
