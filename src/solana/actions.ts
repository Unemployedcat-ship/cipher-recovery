import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@anchor-lang/core';
import CipherIDL from './cipher_idl.json';

export const CIPHER_PROGRAM_ID = new PublicKey(
  (CipherIDL as any).address || (CipherIDL as any).metadata?.address
);

// ⚠️ This is your Codespace URL you provided earlier
const RPC_URL = 'https://probable-orbit-5v5vg55gx6g6c4jvp-8899.app.github.dev'; 

export const connection = new Connection(RPC_URL, 'confirmed');

export function getCipherProgram(wallet: AnchorProvider['wallet']) {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });
  return new Program(CipherIDL as Idl, provider);
}
