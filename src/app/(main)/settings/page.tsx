'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ShieldAlert, Monitor, BellRing } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = usePrivy();
  const [notifications, setNotifications] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <header className="mb-10">
        <h1 className="font-mono text-3xl font-bold text-white">SYSTEM CONFIG</h1>
        <p className="font-mono text-sm text-[var(--text-muted)] mt-2">Manage your terminal preferences and identity.</p>
      </header>

      <div className="space-y-6">
        {/* Identity Section */}
        <div className="card p-6">
          <h2 className="font-mono text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShieldAlert size={18} className="text-[var(--accent-cyan)]" /> Identity & Auth
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-[var(--border-subtle)]">
              <div>
                <div className="font-mono text-sm text-white">Connected Wallet</div>
                <div className="font-mono text-xs text-[var(--text-muted)]">Your primary EVM address</div>
              </div>
              <div className="font-mono text-xs bg-[var(--bg-elevated)] px-3 py-1 rounded border border-[var(--border-subtle)]">
                {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 'Not Connected'}
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-mono text-sm text-white">Session Status</div>
                <div className="font-mono text-xs text-[var(--text-muted)]">Your current login status</div>
              </div>
              <div className="font-mono text-xs text-[var(--status-live)] flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--status-live)] rounded-full animate-pulse"></span> Active
              </div>
            </div>
          </div>
        </div>

        {/* Interface Section */}
        <div className="card p-6">
          <h2 className="font-mono text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Monitor size={18} className="text-[var(--accent-cyan)]" /> Interface & Performance
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-[var(--border-subtle)]">
              <div>
                <div className="font-mono text-sm text-white">Reduced Motion</div>
                <div className="font-mono text-xs text-[var(--text-muted)]">Disable heavy animations for better performance</div>
              </div>
              <button onClick={() => setReducedMotion(!reducedMotion)} className={`w-12 h-6 rounded-full transition-colors relative ${reducedMotion ? 'bg-[var(--accent-cyan)]' : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)]'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${reducedMotion ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-mono text-sm text-white">Audio Alerts</div>
                <div className="font-mono text-xs text-[var(--text-muted)]">Play sounds on successful trades (Coming Soon)</div>
              </div>
              <button disabled className="w-12 h-6 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] opacity-50 cursor-not-allowed relative">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="card p-6">
          <h2 className="font-mono text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BellRing size={18} className="text-[var(--accent-cyan)]" /> Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-mono text-sm text-white">Email Alerts</div>
                <div className="font-mono text-xs text-[var(--text-muted)]">Receive alerts for dark pool settlements</div>
              </div>
              <button onClick={() => setNotifications(!notifications)} className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-[var(--accent-cyan)]' : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)]'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${notifications ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border border-[var(--status-rug)] bg-[var(--status-rug)] bg-opacity-5 rounded-lg p-6">
          <h2 className="font-mono text-lg font-bold text-[var(--status-rug)] mb-4">DANGER ZONE</h2>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-mono text-sm text-white">Disconnect Session</div>
              <div className="font-mono text-xs text-[var(--text-muted)]">Securely log out of the terminal</div>
            </div>
            <button onClick={logout} className="bg-[var(--status-rug)] hover:bg-red-600 text-white font-mono text-sm px-6 py-2 rounded-md transition-colors">
              LOG OUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
