'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { Rocket, ArrowRight, ArrowLeft, ImagePlus, ShieldCheck, Zap, AlertTriangle, AtSign, Send, Globe, Check } from 'lucide-react';

export default function LaunchPage() {
  const router = useRouter();
  const { address } = useSolanaWallet();
  const [step, setStep] = useState(1);
  const [isLaunching, setIsLaunching] = useState(false);

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
    setTimeout(() => {
      setIsLaunching(false);
      alert(`SUCCESS! Token ${formData.ticker} deployed to Solana Devnet.`);
      router.push('/dark-pools');
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center py-10 px-4 font-mono text-zinc-300 bg-[#050505]">
      
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-full text-[10px] tracking-[0.2em] text-[#00FF41] mb-4 uppercase font-bold">
          <Rocket size={12} /> Deploy to Solana
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-3">LAUNCH <span className="text-[#00FF41]">PROTOCOL</span></h1>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">Fair match seeding. 7-Day window. 0% rug risk. The ultimate anti-snipe launchpad.</p>
      </div>

      {/* Sleek Stepper */}
      <div className="flex items-center justify-center w-full max-w-lg mb-10">
        {[1, 2, 3].map((num) => {
          const isActive = step === num;
          const isCompleted = step > num;
          return (
            <div key={num} className="flex items-center relative flex-1 last:flex-none">
              <div className="flex flex-col items-center relative z-10">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full border-2 transition-all duration-300 ${
                  isActive ? 'border-[#00FF41] bg-[#00FF41] text-black shadow-[0_0_15px_rgba(0,255,65,0.4)]' 
                  : isCompleted ? 'border-[#00FF41] bg-[#09090B] text-[#00FF41]' 
                  : 'border-zinc-800 bg-[#09090B] text-zinc-600'
                }`}>
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : <span className="text-xs font-bold">{num}</span>}
                </div>
                <div className={`absolute top-10 text-[9px] font-bold tracking-[0.15em] uppercase whitespace-nowrap transition-colors duration-300 ${
                  isActive || isCompleted ? 'text-[#00FF41]' : 'text-zinc-600'
                }`}>
                  {num === 1 ? 'Details' : num === 2 ? 'Tokenomics' : 'Deploy'}
                </div>
              </div>
              {num < 3 && (
                <div className="flex-1 h-[2px] mx-2 bg-zinc-800 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-[#00FF41] transition-transform duration-300 origin-left ${isCompleted ? 'scale-x-100' : 'scale-x-0'}`}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Card - Solid, Crisp, No Blur */}
      <div className="w-full max-w-2xl bg-[#09090B] border border-zinc-800 rounded-2xl p-6 md:p-8 relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/30 to-transparent"></div>
        
        {/* STEP 1: DETAILS */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">1. MEME DETAILS</h2>
            
            <div className="space-y-6">
              <div className="flex justify-center mb-8">
                <label className="relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700 bg-[#111116] hover:border-[#00FF41]/50 hover:bg-[#00FF41]/5 transition-colors duration-200 overflow-hidden group">
                  {formData.imagePreview ? (
                    <img src={formData.imagePreview} alt="Token" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-zinc-500 group-hover:text-[#00FF41] transition-colors">
                      <ImagePlus className="h-8 w-8 mb-2" />
                      <span className="text-[10px] font-bold tracking-widest">UPLOAD LOGO</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold tracking-widest">TOKEN NAME</label>
                  <input type="text" value={formData.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="e.g. Doge Killer" className="w-full bg-[#111116] border border-zinc-800 rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all duration-200" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold tracking-widest">TICKER</label>
                  <input type="text" value={formData.ticker} onChange={(e) => updateForm('ticker', e.target.value)} placeholder="e.g. DOGEK" className="w-full bg-[#111116] border border-zinc-800 rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all duration-200" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold tracking-widest">DESCRIPTION</label>
                <textarea value={formData.description} onChange={(e) => updateForm('description', e.target.value)} placeholder="Tell the story..." rows={3} className="w-full bg-[#111116] border border-zinc-800 rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all duration-200 resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-800 pt-5 mt-2">
                <div className="relative">
                  <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input type="text" value={formData.twitter} onChange={(e) => updateForm('twitter', e.target.value)} placeholder="X (Twitter)" className="w-full bg-[#111116] border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs focus:border-[#00FF41] outline-none transition-colors duration-200" />
                </div>
                <div className="relative">
                  <Send size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input type="text" value={formData.telegram} onChange={(e) => updateForm('telegram', e.target.value)} placeholder="Telegram" className="w-full bg-[#111116] border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs focus:border-[#00FF41] outline-none transition-colors duration-200" />
                </div>
                <div className="relative">
                  <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input type="text" value={formData.website} onChange={(e) => updateForm('website', e.target.value)} placeholder="Website" className="w-full bg-[#111116] border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs focus:border-[#00FF41] outline-none transition-colors duration-200" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TOKENOMICS */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">2. TOKENOMICS & SEEDING</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold tracking-widest">TOTAL SUPPLY</label>
                  <input type="number" value={formData.supply} onChange={(e) => updateForm('supply', e.target.value)} className="w-full bg-[#111116] border border-zinc-800 rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all duration-200" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold tracking-widest">GRADUATION TARGET (SOL)</label>
                  <input type="number" value={formData.gradTarget} onChange={(e) => updateForm('gradTarget', e.target.value)} className="w-full bg-[#111116] border border-zinc-800 rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all duration-200" />
                </div>
              </div>

              <div className="bg-[#00FF41]/5 border border-[#00FF41]/20 rounded-xl p-5 mt-6">
                <h3 className="text-sm font-bold text-[#00FF41] mb-2 flex items-center gap-2"><Zap size={18}/> 7-DAY LAUNCH WINDOW</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">The token has exactly 7 days to hit the graduation target. If it fails, all bidders are automatically refunded their SOL via the smart contract.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DEPLOY */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">3. REVIEW & DEPLOY</h2>
            
            {/* Terminal Receipt Style - Solid Black */}
            <div className="bg-[#000000] border border-zinc-800 rounded-xl p-5 mb-6 font-mono text-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 w-1 h-full bg-[#00FF41]"></div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-zinc-500 text-xs uppercase tracking-widest">Target Asset</span>
                <span className="font-bold text-white tracking-wider">{formData.name || 'UNKNOWN'} <span className="text-[#00FF41]">({formData.ticker || '???'})</span></span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-zinc-500 text-xs uppercase tracking-widest">Total Supply</span>
                <span className="font-bold text-white">{Number(formData.supply).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-zinc-500 text-xs uppercase tracking-widest">Grad Target</span>
                <span className="font-bold text-white">{formData.gradTarget} SOL</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
                <span className="text-zinc-500 text-xs uppercase tracking-widest">LP Security</span>
                <span className="font-bold text-[#00FF41] flex items-center gap-1"><ShieldCheck size={16}/> LOCKED & BURNED</span>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 mb-6">
              <h3 className="text-sm font-bold text-amber-500 mb-2 flex items-center gap-2"><Zap size={16}/> DEV BOOTSTRAP (OPTIONAL)</h3>
              <p className="text-xs text-zinc-400 mb-4 leading-relaxed">Seed the initial vault if you want. If left empty, the community determines the starting price. All liquidity is permanently locked & burned. You cannot rug.</p>
              
              <div className="relative group">
                <input type="number" value={formData.bootstrapAmount} onChange={(e) => updateForm('bootstrapAmount', e.target.value)} placeholder="Enter SOL amount (e.g. 2)" className="w-full bg-[#09090B] border border-amber-500/30 rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors duration-200 placeholder-amber-500/20" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-500">SOL</span>
              </div>

              <div className="mt-4 p-3 bg-cyan-950/30 border border-cyan-900/50 rounded text-[11px] text-cyan-400 leading-relaxed">
                💡 <strong>THE FAIR EDGE:</strong> If you don't seed this pool, the token launches in the Community Bootstrap Phase. The first traders set the price. Once trading is live, anyone can add SOL to the liquidity pool, and it will be instantly burned to protect the chart.
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-zinc-500 bg-[#09090B] p-4 rounded-lg border border-zinc-800">
              <span className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500"/> Anti-Bot Launch Fee</span>
              <span className="font-bold text-white">0.02 SOL</span>
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="flex justify-between mt-8 pt-6 border-t border-zinc-800">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-6 py-3.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors duration-200 text-xs font-bold tracking-widest">
              <ArrowLeft size={16} /> BACK
            </button>
          ) : <div></div>}
          
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} disabled={!formData.name || !formData.ticker} className="flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#00FF41] text-black hover:bg-[#00e03a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-xs font-bold tracking-widest">
              NEXT STEP <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleLaunch} disabled={isLaunching} className="flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#00FF41] text-black hover:bg-[#00e03a] transition-colors duration-200 text-xs font-bold tracking-widest">
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
