import { Connection, VersionedTransaction } from '@solana/web3.js';
import { SolanaSigner } from '@/hooks/useSolanaWallet';

const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6/quote';
const JUPITER_SWAP_API = 'https://quote-api.jup.ag/v6/swap';

// Wrapped SOL mint address
export const SOL_MINT = 'So11111111111111111111111111111111111111112';

export interface JupiterQuote {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  priceImpactPct: string;
  routePlan: any[];
}

/**
 * 1. Fetch a quote for a swap
 */
export async function fetchJupiterQuote(
  inputMint: string,
  outputMint: string,
  amountInSol: number,
  slippageBps: number = 50 // 0.5% default
): Promise<JupiterQuote> {
  // SOL has 9 decimals on Solana
  const amountInLamports = Math.floor(amountInSol * 1_000_000_000).toString();

  const url = new URL(JUPITER_QUOTE_API);
  url.searchParams.append('inputMint', inputMint);
  url.searchParams.append('outputMint', outputMint);
  url.searchParams.append('amount', amountInLamports);
  url.searchParams.append('slippageBps', slippageBps.toString());

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch quote: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * 2. Request the swap transaction and execute it using the signer
 */
export async function executeJupiterSwap(
  signer: SolanaSigner,
  quote: JupiterQuote,
  connection: Connection
): Promise<string> {
  // Request the serialized transaction from Jupiter
  const swapResponse = await fetch(JUPITER_SWAP_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quoteResponse: quote,
      userPublicKey: signer.publicKey.toBase58(),
      wrapAndUnwrapSol: true, // Automatically wraps/unwraps native SOL
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: 'auto', // Automatically estimate priority fees
    }),
  });

  if (!swapResponse.ok) {
    throw new Error(`Failed to build swap transaction: ${swapResponse.statusText}`);
  }

  const { swapTransaction } = await swapResponse.json();

  // Deserialize the base64 encoded transaction
  const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
  const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

  // Sign the transaction using the Privy signer
  console.log('[Jupiter] Requesting signature...');
  const signedTransaction = await signer.signTransaction(transaction);

  // Send the signed transaction to the network
  console.log('[Jupiter] Sending transaction...');
  const rawTransaction = signedTransaction.serialize();
  const txid = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
    maxRetries: 3,
  });

  console.log(`[Jupiter] Swap sent! Tx: ${txid}`);
  return txid;
}
