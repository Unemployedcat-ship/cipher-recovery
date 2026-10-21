export const CIPHER_NETWORK_CONFIG = {
  // Primary EVM target handling FHE & Advanced Logic
  L2_EVM: {
    name: 'Zama fhEVM Devnet',
    rpc: process.env.NEXT_PUBLIC_ZAMA_RPC || 'https://devnet.zama.ai',
    chainId: 8008135,
    contracts: {
      AntiRugHook: '0x...', // To be populated post-deployment
      OtterAMM: '0x...',
      AgentPermissionManager: '0x...',
      CipherLock: '0x...',
      ProofOfBelief: '0x...',
      ShieldedVickrey: '0x...'
    }
  },
  // Base Layer for High Frequency & Transfer Hooks
  L1_BASE: {
    name: 'Solana Mainnet',
    rpc: process.env.NEXT_PUBLIC_HELIUS_RPC || 'https://mainnet.helius-rpc.com/?api-key=...',
    programIds: {
      Token2022TransferHook: 'Hook11111111111111111111111111111111111111'
    }
  },
  // Cross-Chain Bridging
  MESSAGING: {
    provider: 'Hyperlane ZK-ISM',
    mailboxEth: '0x...',
    mailboxSol: 'HyPRL1111111111111111111111111111111111111'
  }
};
