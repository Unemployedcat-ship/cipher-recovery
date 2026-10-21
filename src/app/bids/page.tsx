'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Terminal, Fingerprint, Activity, Code, ShieldCheck, Lock, EyeOff } from 'lucide-react';
import { useLiveBids } from '../../hooks/useV4Hooks';
import { CIPHER_NETWORK_CONFIG } from '../../lib/config/networkConfig';

export default function GlobalBidMatrix() {
    const { authenticated, user, login } = usePrivy();
    const { bids, isLoading } = useLiveBids('active_auction_pool');
    
    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 font-mono p-8 selection:bg-cyan-500/30">
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, cyan 1px, transparent 0)', backgroundSize: '32px 32px' }}>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="flex justify-between items-center mb-12 pb-4 border-b border-cyan-500/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-500/10 flex items-center justify-center rounded-lg border border-cyan-500/30">
                            <Terminal className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-wider text-white">CIPHER<span className="text-cyan-400">.MATRIX</span></h1>
                            <p className="text-[10px] text-cyan-500/60 uppercase tracking-widest">Connected via Hyperlane ZK-ISM to {CIPHER_NETWORK_CONFIG.L2_EVM.name}</p>
                        </div>
                    </div>
                    <div>
                        {!authenticated ? (
                            <button onClick={login} className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/50 hover:bg-cyan-500/20 text-cyan-400 py-2 px-6 rounded-md text-xs font-bold tracking-widest transition-all">
                                <Fingerprint className="w-4 h-4" /> AUTHENTICATE
                            </button>
                        ) : (
                            <div className="text-right">
                                <p className="text-xs text-gray-500">SECURE LINK</p>
                                <p className="text-sm text-cyan-400">{user?.email?.address || user?.wallet?.address}</p>
                            </div>
                        )}
                    </div>
                </header>

                <div className="bg-[#0A0A0A] border border-cyan-500/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                    <div className="bg-cyan-500/5 border-b border-cyan-500/20 p-6 flex items-center gap-4">
                        <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-widest">LIVE SHIELDED VICKREY FHE MEMPOOL</h2>
                            <p className="text-xs text-gray-400">Second-Price Auction Processing via Zama fhEVM TFHE lib</p>
                        </div>
                    </div>

                    <div className="p-6">
                        {isLoading ? (
                            <div className="text-center py-12 text-cyan-400/50 animate-pulse">
                                Connecting to Cipher Node...
                            </div>
                        ) : bids.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-3">
                                <Lock className="w-8 h-8 opacity-50" />
                                <p>MEMPOOL EMPTY. WAITING FOR ENCRYPTED COMMITS.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {bids.map((bid, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-black border border-cyan-500/10 rounded-lg hover:border-cyan-500/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-cyan-500/10 rounded-full flex items-center justify-center">
                                                <EyeOff className="w-4 h-4 text-cyan-400" />
                                            </div>
                                            <div>
                                                <p className="text-white text-sm">TxHash: {bid.tx_hash}</p>
                                                <p className="text-[10px] text-gray-500">{new Date(bid.created_at).toISOString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-cyan-400 text-sm font-bold">ENCRYPTED PAYLOAD</p>
                                            <p className="text-[10px] text-gray-500 flex items-center justify-end gap-1">
                                                <ShieldCheck className="w-3 h-3 text-green-500/70" />
                                                Zama fhEVM
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
