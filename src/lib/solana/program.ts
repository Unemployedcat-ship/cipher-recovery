import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { connection } from './constants';

// 1. YOUR NEW PROGRAM ID
const programIdStr = "7LTGH1LkKhK3fWdyQ7jmu4YKF74QJcxeNbYniRRMhYva";

// 2. YOUR NEW SMART CONTRACT IDL (Hardcoded)
const idl: any = {
  "version": "0.1.0",
  "name": "fair_degens",
  "instructions": [
    {
      "name": "initializeVault",
      "accounts": [
        { "name": "vault", "isMut": true, "isSigner": false },
        { "name": "user", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "deposit",
      "accounts": [
        { "name": "vault", "isMut": true, "isSigner": false },
        { "name": "userAccount", "isMut": true, "isSigner": false },
        { "name": "user", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "amount", "type": "u64" }]
    },
    {
      "name": "withdraw",
      "accounts": [
        { "name": "vault", "isMut": true, "isSigner": false },
        { "name": "userAccount", "isMut": true, "isSigner": false },
        { "name": "user", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "amount", "type": "u64" }]
    },
    {
      "name": "createCoin",
      "accounts": [
        { "name": "mint", "isMut": true, "isSigner": true },
        { "name": "coinData", "isMut": true, "isSigner": true },
        { "name": "mintAuthority", "isMut": false, "isSigner": true },
        { "name": "incinerator", "isMut": true, "isSigner": false },
        { "name": "platformFeeWallet", "isMut": true, "isSigner": false },
        { "name": "creatorVaultAccount", "isMut": true, "isSigner": false },
        { "name": "user", "isMut": true, "isSigner": true },
        { "name": "tokenProgram", "isMut": false, "isSigner": false },
        { "name": "rent", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "name", "type": "string" },
        { "name": "symbol", "type": "string" },
        { "name": "devLiquidity", "type": "u64" }
      ]
    },
    {
      "name": "buy",
      "accounts": [
        { "name": "coinData", "isMut": true, "isSigner": false },
        { "name": "mint", "isMut": true, "isSigner": false },
        { "name": "userAta", "isMut": true, "isSigner": false },
        { "name": "vault", "isMut": true, "isSigner": false },
        { "name": "creatorVaultAccount", "isMut": true, "isSigner": false },
        { "name": "platformFeeWallet", "isMut": true, "isSigner": false },
        { "name": "mintAuthority", "isMut": false, "isSigner": true },
        { "name": "user", "isMut": true, "isSigner": true },
        { "name": "tokenProgram", "isMut": false, "isSigner": false },
        { "name": "associatedTokenProgram", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "solAmount", "type": "u64" }]
    },
    {
      "name": "sell",
      "accounts": [
        { "name": "coinData", "isMut": true, "isSigner": false },
        { "name": "mint", "isMut": true, "isSigner": false },
        { "name": "userAta", "isMut": true, "isSigner": false },
        { "name": "vault", "isMut": true, "isSigner": false },
        { "name": "creatorVaultAccount", "isMut": true, "isSigner": false },
        { "name": "platformFeeWallet", "isMut": true, "isSigner": false },
        { "name": "mintAuthority", "isMut": false, "isSigner": true },
        { "name": "user", "isMut": true, "isSigner": true },
        { "name": "tokenProgram", "isMut": false, "isSigner": false },
        { "name": "associatedTokenProgram", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "tokenAmount", "type": "u64" }]
    }
  ],
  "accounts": [
    {
      "name": "CoinState",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "creator", "type": "publicKey" },
          { "name": "mint", "type": "publicKey" },
          { "name": "name", "type": "string" },
          { "name": "symbol", "type": "string" },
          { "name": "virtualSolReserves", "type": "u64" },
          { "name": "virtualTokenReserves", "type": "u64" },
          { "name": "realSolReserves", "type": "u64" }
        ]
      }
    },
    {
      "name": "VaultState",
      "type": {
        "kind": "struct",
        "fields": [{ "name": "totalDeposited", "type": "u64" }]
      }
    },
    {
      "name": "UserVaultAccount",
      "type": {
        "kind": "struct",
        "fields": [{ "name": "balance", "type": "u64" }]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "DevCannotTrade",
      "msg": "The creator of the coin cannot buy or sell it."
    },
    {
      "code": 6001,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds in vault."
    }
  ]
};

export const getProgram = (wallet: any) => {
  const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
  return new Program(idl, new PublicKey(programIdStr), provider);
};
