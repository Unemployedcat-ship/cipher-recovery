'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ShieldAlert } from 'lucide-react';

export function LegalGate({ children }: { children: React.ReactNode }) {
  const { authenticated, ready } = usePrivy();
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check local storage so they don't have to agree every refresh
    const agreed = localStorage.getItem('cipher_legal_agreed_v1');
    if (agreed === 'true') setHasAgreed(true);
  }, []);

  const handleAgree = () => {
    if (!isChecked) return;
    localStorage.setItem('cipher_legal_agreed_v1', 'true');
    setHasAgreed(true);
  };

  if (!mounted || !ready) return null;

  // If they are logged in but haven't agreed, block the screen
  if (authenticated && !hasAgreed) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-[#0D0D14] border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-cyan-500" />
          
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert className="text-cyan-400 w-8 h-8" />
            <h2 className="text-2xl font-mono text-white font-bold">LEGAL & RISK DISCLOSURE</h2>
          </div>

          <div className="h-64 overflow-y-auto bg-[#05050A] border border-slate-800 rounded-lg p-4 mb-6 text-slate-400 font-mono text-sm space-y-4 custom-scrollbar">
            <p className="text-white font-bold">1. HIGH RISK INVESTMENT</p>
            <p>Memecoins and fair-launch auctions are highly experimental and inherently volatile. You may lose 100% of your funds. Do not invest money you cannot afford to lose.</p>
            
            <p className="text-white font-bold mt-4">2. NO FINANCIAL ADVICE</p>
            <p>Cipher Terminal is a decentralized software protocol, not a financial advisor, broker, or exchange. We do not endorse any tokens launched on this platform.</p>

            <p className="text-white font-bold mt-4">3. SMART CONTRACT RISK</p>
            <p>You acknowledge that interacting with Solana smart contracts involves technical risk, including but not limited to, bugs, exploits, and irreversible transactions.</p>

            <p className="text-white font-bold mt-4">4. ANTI-DUMP MECHANISM</p>
            <p>Funds locked in escrow during the anti-dump phase are subject to the smart contract rules. You cannot withdraw early.</p>

            <p className="text-white font-bold mt-4">5. JURISDICTION</p>
            <p>It is your responsibility to ensure that interacting with this protocol is legal in your jurisdiction. Do not use this platform if you are in a restricted territory.</p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer mb-6 group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input 
                type="checkbox" 
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="peer appearance-none w-5 h-5 border border-slate-600 rounded bg-[#05050A] checked:bg-cyan-500 checked:border-cyan-500 transition-colors cursor-pointer"
              />
              <svg className="absolute w-3 h-3 text-black pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-mono text-slate-300 group-hover:text-white transition-colors">
              I have read and agree to the Terms of Service, Privacy Policy, and Risk Disclosure. I confirm that I am not in a restricted jurisdiction.
            </span>
          </label>

          <button 
            onClick={handleAgree}
            disabled={!isChecked}
            className="w-full bg-cyan-400 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-black font-bold font-mono py-4 rounded-lg transition-colors"
          >
            ACCEPT & ENTER TERMINAL
          </button>
        </div>
      </div>
    );
  }

  // If they agreed (or aren't logged in yet), show the app normally
  return <>{children}</>;
}
