import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { connection } from './constants';

const programIdStr = process.env.NEXT_PUBLIC_CIPHER_AUCTION_PROGRAM_ID || "7GEibaWAAFwANcfSaCfGwpLocKcEfrnhpxK2cwRp9q7W";

const idl: any = {
  "address": programIdStr,
  "metadata": { "name": "cipher_auction", "version": "0.1.0", "spec": "0.1.0", "description": "Created with Anchor" },
  "instructions": [
    {
      "name": "create_auction",
      "discriminator": [234, 6, 201, 246, 47, 219, 176, 107],
      "accounts": [
        { "name": "auction", "writable": true, "pda": { "seeds": [ { "kind": "const", "value": [97, 117, 99, 116, 105, 111, 110] }, { "kind": "account", "path": "authority" }, { "kind": "arg", "path": "auction_id" } ] } },
        { "name": "mint", "writable": true, "signer": true },
        { "name": "vaultTokenAccount", "writable": true },
        { "name": "vault", "writable": true, "pda": { "seeds": [ { "kind": "const", "value": [118, 97, 117, 108, 116] }, { "kind": "account", "path": "auction" } ] } },
        { "name": "authority", "writable": true, "signer": true },
        { "name": "system_program", "address": "11111111111111111111111111111111" },
        { "name": "token_program", "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
        { "name": "rent", "address": "SysvarRent111111111111111111111111111111111" }
      ],
      "args": [
        { "name": "auction_id", "type": "u64" },
        { "name": "end_time", "type": "i64" },
        { "name": "graduation_target", "type": "u64" },
        { "name": "total_supply", "type": "u64" }
      ]
    },
    {
      "name": "submit_bid",
      "discriminator": [19, 164, 237, 254, 64, 139, 237, 93],
      "accounts": [
        { "name": "auction", "writable": true },
        { "name": "receipt", "writable": true, "pda": { "seeds": [ { "kind": "const", "value": [114, 101, 99, 101, 112, 116] }, { "kind": "account", "path": "auction" }, { "kind": "account", "path": "bidder" } ] } },
        { "name": "vault", "writable": true, "pda": { "seeds": [ { "kind": "const", "value": [118, 97, 117, 108, 116] }, { "kind": "account", "path": "auction" } ] } },
        { "name": "bidder", "writable": true, "signer": true },
        { "name": "system_program", "address": "11111111111111111111111111111111" }
      ],
      "args": [ { "name": "amount", "type": "u64" } ]
    },
    {
      "name": "claim_tokens",
      "discriminator": [108, 216, 119, 125, 15, 94, 52, 116],
      "accounts": [
        { "name": "auction", "writable": true },
        { "name": "receipt", "pda": { "seeds": [ { "kind": "const", "value": [114, 101, 99, 101, 112, 116] }, { "kind": "account", "path": "auction" }, { "kind": "account", "path": "bidder" } ] } },
        { "name": "mint", "writable": true },
        { "name": "user_token_account", "writable": true },
        { "name": "bidder", "writable": true, "signer": true },
        { "name": "token_program", "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
        { "name": "associated_token_program", "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL" },
        { "name": "system_program", "address": "11111111111111111111111111111111" }
      ],
      "args": []
    },
    {
      "name": "refund_bid",
      "discriminator": [115, 183, 138, 52, 170, 101, 47, 119],
      "accounts": [
        { "name": "auction", "writable": true },
        { "name": "receipt", "writable": true, "pda": { "seeds": [ { "kind": "const", "value": [114, 101, 99, 101, 112, 116] }, { "kind": "account", "path": "auction" }, { "kind": "account", "path": "bidder" } ] } },
        { "name": "vault", "writable": true, "pda": { "seeds": [ { "kind": "const", "value": [118, 97, 117, 108, 116] }, { "kind": "account", "path": "auction" } ] } },
        { "name": "bidder", "writable": true, "signer": true },
        { "name": "system_program", "address": "11111111111111111111111111111111" }
      ],
      "args": []
    }
  ],
  "accounts": [ { "name": "Auction", "discriminator": [218, 94, 247, 242, 126, 233, 131, 81] } ],
  "types": [
    { "name": "Auction", "type": { "kind": "struct", "fields": [ { "name": "authority", "type": "pubkey" }, { "name": "auction_id", "type": "u64" }, { "name": "end_time", "type": "i64" }, { "name": "graduation_target", "type": "u64" }, { "name": "total_raised", "type": "u64" }, { "name": "total_supply", "type": "u64" }, { "name": "status", "type": { "defined": { "name": "AuctionStatus" } } }, { "name": "bump", "type": "u8" }, { "name": "vault_bump", "type": "u8" }, { "name": "mint", "type": "pubkey" } ] } },
    { "name": "AuctionStatus", "type": { "kind": "enum", "variants": [ { "name": "Live" }, { "name": "Settled" }, { "name": "Failed" } ] } }
  ]
};

export const PROGRAM_ID = new PublicKey(programIdStr);

export type AnchorWalletLike = {
  publicKey: PublicKey;
  signTransaction: <T extends Transaction | VersionedTransaction>(tx: T) => Promise<T>;
  signAllTransactions: <T extends Transaction | VersionedTransaction>(txs: T[]) => Promise<T[]>;
};

export function getCipherProgram(wallet: AnchorWalletLike, conn: Connection = connection) {
  const provider = new AnchorProvider(conn, wallet as any, {
    commitment: 'confirmed',
    preflightCommitment: 'confirmed',
  });
  
  const freshIdl = JSON.parse(JSON.stringify(idl));
  return new Program(freshIdl, provider);
}

export const findAuctionPda = (authority: PublicKey, auctionId: BN | bigint | number): PublicKey => {
  const bnId = BN.isBN(auctionId) ? auctionId : new BN(auctionId);
  const idBuffer = Buffer.from(bnId.toArrayLike(Buffer, 'le', 8));
  
  return PublicKey.findProgramAddressSync(
    [Buffer.from("auction"), authority.toBuffer(), idBuffer],
    PROGRAM_ID
  )[0];
};

export const findVaultPda = (auction: PublicKey): PublicKey => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), auction.toBuffer()],
    PROGRAM_ID
  )[0];
};

export const findReceiptPda = (auction: PublicKey, bidder: PublicKey): PublicKey => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("receipt"), auction.toBuffer(), bidder.toBuffer()],
    PROGRAM_ID
  )[0];
};
