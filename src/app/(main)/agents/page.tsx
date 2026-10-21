'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Cpu, ShieldCheck, Lock, CheckCircle2, Key } from 'lucide-react';

export default function AgentsPage() {
  const { authenticated, login } = usePrivy();

  if (!authenticated) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="card p-16 text-center space-y-4">
          <Cpu className="w-12 h-12 mx-auto text-[var(--accent-cyan)]" />
          <h1 className="font-mono text-2xl font-bold">AGENT MANAGER</h1>
          <p className="font-mono text-sm text-[var(--text-muted)]">
            Connect your identity to authorize AI trading delegates.
          </p>
          <button onClick={login} className="btn-primary">
            CONNECT IDENTITY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-[var(--accent-cyan)]" />
          <h1 className="font-mono text-4xl font-bold tracking-tight">
            AGENT DELEGATES
          </h1>
        </div>
        <p className="font-mono text-sm text-[var(--text-secondary)] ml-4">
          Configure native spending allowances for AI swarm agents.
        </p>
      </header>

      <div className="card p-8">
        <div className="flex justify-between items-center mb-8 border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-full border border-purple-500/30 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg font-mono">CLAUDE-OP-1</h3>
              <p className="text-[var(--accent-cyan)] text-xs flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3" /> Verified Swarm Agent
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[var(--text-secondary)] text-xs font-mono">Total Agent Balance</p>
            <p className="text-xl text-[var(--text-primary)] font-mono">15.50 SOL</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2 text-sm font-mono">
              <span className="text-[var(--text-secondary)]">Daily Trade Limit (SOL)</span>
              <span className="text-[var(--accent-cyan)]">2.50 / 5.00 MAX</span>
            </div>
            <div className="w-full bg-[var(--bg-void)] h-2 rounded-full overflow-hidden border border-[var(--border-subtle)]">
              <div className="bg-[var(--accent-cyan)] h-full w-[50%]"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--bg-elevated)] p-4 rounded-lg border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm mb-2 font-mono">
                 <ShieldCheck className="w-4 h-4 text-green-400" /> Max Slippage Allowed
              </div>
              <p className="text-2xl text-[var(--text-primary)] font-mono">1.0%</p>
            </div>
            <div className="bg-[var(--bg-elevated)] p-4 rounded-lg border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm mb-2 font-mono">
                 <Key className="w-4 h-4 text-[var(--status-rug)]" /> Withdrawal Rights
              </div>
              <p className="text-xl text-[var(--status-rug)] font-mono font-bold">REVOKED</p>
            </div>
          </div>

          <button className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
            <Lock className="w-4 h-4" />
            UPDATE ON-CHAIN AGENT HOOKS
          </button>
        </div>
      </div>
    </div>
  );
}
