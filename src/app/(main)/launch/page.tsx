'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { Rocket, ArrowRight, ArrowLeft, ImagePlus, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function LaunchPage() {
  const router = useRouter();
  const { address } = useSolanaWallet();
  const [step, setStep] = useState(1);
  const [isLaunching, setIsLaunching] = useState(false);

  // Centralized State for all form data
  const [formData, setFormData] = useState({
    name: '',
    ticker: '',
    description: '',
    imagePreview: null as string | null,
    twitter: '',
    telegram: '',
    website: '',
    supply: '1000000000',
    gradTarget: '2',
    bootstrapAmount: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imagePreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleLaunch = async () => {
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }
    setIsLaunching(true);
    
    // Simulate Smart Contract Call
    setTimeout(() => {
      setIsLaunching(false);
      alert(`SUCCESS! Token ${formData.ticker} deployed to Solana Devnet.`);
      router.push('/dark-pools');
    }, 2500);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center py-8 px-4 font-mono text-zinc-300 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00FF41]/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <div className="text-center mb-10 relative z-10">
        <div className="flex items-center justify-center gap-2 text-[10px] tracking-[0.3em] text-[#00FF41] mb-2 uppercase font-bold">
          <Rocket size={14} /> Deploy to Solana
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">LAUNCH PROTOCOL</h1>
        <p className="text-sm text-zinc-500">Fair match seeding. 7-Day window. 0% rug risk.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center w-full max-w-2xl mb-8 relative z-10">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center">
            <div className={`flex flex-col items-center justify-center h-10 w-10 rounded-full border-2 transition-colors duration-300 ${
              step >= num ? 'border-[#00FF41] bg-[#00FF41]/10 text-[#00FF41]' : 'border-zinc-800 bg-[#09090B] text-zinc-600'
            }`}>
              <span className="text-sm font-bold">{num}</span>
            </div>
            <div className={`text-[10px] tracking-widest uppercase font-bold mt-2 absolute translate-y-8 ${
              step >= num ? 'text-[#00FF41]' : 'text-zinc-600'
            }`}>
              {num === 1 ? 'Details' : num === 2 ? 'Tokenomics' : 'Deploy'}
            </div>
            {num < 3 && (
              <div className={`w-16 md:w-32 h-[2px] mx-2 transition-colors duration-300 ${step > num ? 'bg-[#00FF41]' : 'bg-zinc-800'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-2xl bg-[#09090B] border border-zinc-800 rounded-xl p-6 md:p-8 relative z-10 shadow-2xl">
        
        {/* STEP 1: DETAILS */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2">1. MEME DETAILS</h2>
            
            <div className="space-y-5">
              <div className="flex justify-center mb-6">
                <label className="relative flex h-28 w-28 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-zinc-700 bg-zinc-900 hover:border-[#00FF41]/50 hover:bg-[#00FF41]/5 transition-all overflow-hidden group">
                  {formData.imagePreview ? (
                    <img src={formData.imagePreview} alt="Token" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-zinc-500 group-hover:text-[#00FF41] transition-colors">
                      <ImagePlus className="h-8 w-8 mb-1" />
                      <span className="text-[9px] font-bold">UPLOAD</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1 tracking-widest">TOKEN NAME</label>
                  <input type="text" value={formData.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="e.g. Doge Killer" className="w-full bg-[#111116] border border-zinc-800 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1 tracking-widest">TICKER</label>
                  <input type="text" value={formData.ticker} onChange={(e) => updateForm('ticker', e.target.value)} placeholder="e.g. DOGEK" className="w-full bg-[#111116] border border-zinc-800 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 mb-1 tracking-widest">DESCRIPTION</label>
                <textarea value={formData.description} onChange={(e) => updateForm('description', e.target.value)} placeholder="Tell the story..." rows={3} className="w-full bg-[#111116] border border-zinc-800 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-800 pt-4 mt-2">
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1">X (TWITTER)</label>
                  <input type="text" value={formData.twitter} onChange={(e) => updateForm('twitter', e.target.value)} placeholder="https://x.com/..." className="w-full bg-[#111116] border border-zinc-800 rounded px-3 py-2 text-xs focus:border-[#00FF41] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1">TELEGRAM</label>
                  <input type="text" value={formData.telegram} onChange={(e) => updateForm('telegram', e.target.value)} placeholder="https://t.me/..." className="w-full bg-[#111116] border border-zinc-800 rounded px-3 py-2 text-xs focus:border-[#00FF41] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1">WEBSITE</label>
                  <input type="text" value={formData.website} onChange={(e) => updateForm('website', e.target.value)} placeholder="https://..." className="w-full bg-[#111116] border border-zinc-800 rounded px-3 py-2 text-xs focus:border-[#00FF41] outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TOKENOMICS */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2">2. TOKENOMICS & SEEDING</h2>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1 tracking-widest">TOTAL SUPPLY</label>
                  <input type="number" value={formData.supply} onChange={(e) => updateForm('supply', e.target.value)} className="w-full bg-[#111116] border border-zinc-800 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1 tracking-widest">GRADUATION TARGET (SOL)</label>
                  <input type="number" value={formData.gradTarget} onChange={(e) => updateForm('gradTarget', e.target.value)} className="w-full bg-[#111116] border border-zinc-800 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all" />
                </div>
              </div>

              <div className="bg-[#00FF41]/5 border border-[#00FF41]/20 rounded-lg p-4 mt-6">
                <h3 className="text-sm font-bold text-[#00FF41] mb-1 flex items-center gap-2"><Zap size={16}/> 7-DAY LAUNCH WINDOW</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">The token has exactly 7 days to hit the graduation target. If it fails, all bidders are automatically refunded their SOL via the smart contract.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DEPLOY */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2">3. REVIEW & DEPLOY</h2>
            
            <div className="bg-[#111116] border border-zinc-800 rounded-lg p-5 mb-6 space-y-3">
              <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                <span className="text-xs text-zinc-500">Name</span>
                <span className="text-sm font-bold text-white">{formData.name || '—'} ({formData.ticker || '—'})</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                <span className="text-xs text-zinc-500">Supply</span>
                <span className="text-sm font-bold text-white">{Number(formData.supply).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                <span className="text-xs text-zinc-500">Grad Target</span>
                <span className="text-sm font-bold text-white">{formData.gradTarget} SOL</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs text-zinc-500">LP Status</span>
                <span className="text-sm font-bold text-[#00FF41] flex items-center gap-1"><ShieldCheck size={14}/> LOCKED & BURNED</span>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 mb-6">
              <h3 className="text-sm font-bold text-amber-500 mb-2 flex items-center gap-2"><Zap size={16}/> DEV BOOTSTRAP (OPTIONAL)</h3>
              <p className="text-xs text-zinc-400 mb-3 leading-relaxed">Seed the initial vault if you want. If left empty, the community determines the starting price. All liquidity is permanently locked & burned. You cannot rug.</p>
              
              <div className="relative">
                <input type="number" value={formData.bootstrapAmount} onChange={(e) => updateForm('bootstrapAmount', e.target.value)} placeholder="Enter SOL amount (e.g. 2)" className="w-full bg-[#09090B] border border-amber-500/30 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-all placeholder-amber-500/30" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-500">SOL</span>
              </div>

              <div className="mt-4 p-3 bg-cyan-950/30 border border-cyan-900/50 rounded text-[11px] text-cyan-400 leading-relaxed">
                💡 <strong>THE FAIR EDGE:</strong> If you don't seed this pool, the token launches in the Community Bootstrap Phase. The first traders set the price. Once trading is live, anyone can add SOL to the liquidity pool, and it will be instantly burned to protect the chart.
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-zinc-500 bg-[#09090B] p-3 rounded border border-zinc-800">
              <span className="flex items-center gap-1"><AlertTriangle size={12} className="text-amber-500"/> Anti-Bot Launch Fee</span>
              <span className="font-bold text-white">0.02 SOL</span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-zinc-800">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-6 py-3 rounded-md border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-xs font-bold tracking-widest">
              <ArrowLeft size={16} /> BACK
            </button>
          ) : <div></div>}
          
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} disabled={!formData.name || !formData.ticker} className="flex items-center gap-2 px-8 py-3 rounded-md bg-[#00FF41] text-black hover:bg-[#00e03a] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-bold tracking-widest shadow-[0_0_15px_rgba(0,255,65,0.3)]">
              NEXT STEP <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleLaunch} disabled={isLaunching} className="flex items-center gap-2 px-8 py-3 rounded-md bg-gradient-to-r from-[#00FF41] to-[#00B32C] text-black hover:from-[#00e03a] hover:to-[#009926] transition-all text-xs font-bold tracking-widest shadow-[0_0_20px_rgba(0,255,65,0.5)]">
              {isLaunching ? (
                <span className="flex items-center gap-2 animate-pulse"><Zap size={16}/> DEPLOYING...</span>
              ) : (
                <span className="flex items-center gap-2"><Rocket size={16}/> LAUNCH FAIR-DEGEN</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
