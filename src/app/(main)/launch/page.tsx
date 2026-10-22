'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { Rocket, ArrowRight, ArrowLeft, ImagePlus, ShieldCheck, Zap, AlertTriangle, AtSign, Send, Globe, Check, Terminal } from 'lucide-react';

export default function LaunchPage() {
  const router = useRouter();
  const { address } = useSolanaWallet();
  const [step, setStep] = useState(1);
  const [isLaunching, setIsLaunching] = useState(false);

  const [formData, setFormData] = useState({
    name: '', ticker: '', description: '', imagePreview: null as string | null,
    twitter: '', telegram: '', website: '', supply: '1000000000', gradTarget: '2', bootstrapAmount: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, imagePreview: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const updateForm = (key: string, value: string) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleLaunch = async () => {
    if (!address) return alert("Please connect your wallet first.");
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      alert(`SUCCESS! Token ${formData.ticker} deployed to Solana Devnet.`);
      router.push('/dark-pools');
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center py-10 px-4 font-mono text-zinc-300">
      
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-sm text-[10px] tracking-[0.2em] text-[#00FF41] mb-6 uppercase font-bold shadow-[0_0_15px_rgba(0,255,65,0.1)]">
          <Terminal size={12} /> Secure Deployment Protocol
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">LAUNCH <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF41] to-[#00B32C]">PROTOCOL</span></h1>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">Fair match seeding. 7-Day window. 0% rug risk. The ultimate anti-snipe launchpad.</p>
      </div>

      {/* Tactical Stepper */}
      <div className="flex items-center justify-center w-full max-w-lg mb-12">
        {[1, 2, 3].map((num) => {
          const isActive = step === num;
          const isCompleted = step > num;
          return (
            <div key={num} className="flex items-center relative flex-1 last:flex-none">
              <div className="flex flex-col items-center relative z-10">
                <div className={`flex items-center justify-center h-10 w-10 rounded-sm border-2 transition-all duration-300 transform rotate-45 ${
                  isActive ? 'border-[#00FF41] bg-[#00FF41]/10 text-[#00FF41] shadow-[0_0_20px_rgba(0,255,65,0.3)] scale-110' 
                  : isCompleted ? 'border-[#00FF41] bg-[#00FF41] text-black' 
                  : 'border-zinc-800 bg-[#09090B] text-zinc-600'
                }`}>
                  <div className="-rotate-45">
                    {isCompleted ? <Check size={16} strokeWidth={3} /> : <span className="text-sm font-black">{num}</span>}
                  </div>
                </div>
                <div className={`absolute top-14 text-[9px] font-bold tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-300 ${
                  isActive || isCompleted ? 'text-[#00FF41]' : 'text-zinc-600'
                }`}>
                  {num === 1 ? 'Details' : num === 2 ? 'Tokenomics' : 'Deploy'}
                </div>
              </div>
              {num < 3 && (
                <div className="flex-1 h-[2px] mx-4 bg-zinc-800 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-[#00FF41] transition-transform duration-500 origin-left ${isCompleted ? 'scale-x-100' : 'scale-x-0'}`}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Card */}
      <div className="w-full max-w-2xl bg-[#09090B] border border-zinc-800 rounded-sm relative shadow-2xl">
        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00FF41]"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00FF41]"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00FF41]"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00FF41]"></div>
        
        <div className="p-6 md:p-10">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest"><span className="text-[#00FF41]">01.</span> MEME DETAILS</h2>
              <div className="space-y-6">
                <div className="flex justify-center mb-8">
                  <label className="relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-sm border-2 border-dashed border-zinc-700 bg-[#111116] hover:border-[#00FF41] transition-colors duration-200 group">
                    {formData.imagePreview ? (
                      <img src={formData.imagePreview} alt="Token" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-zinc-500 group-hover:text-[#00FF41] transition-colors">
                        <ImagePlus className="h-8 w-8 mb-2" />
                        <span className="text-[10px] font-black tracking-widest">UPLOAD</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 font-black tracking-widest">TOKEN NAME</label>
                    <input type="text" value={formData.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="e.g. Doge Killer" className="w-full bg-[#050505] border border-zinc-800 rounded-sm px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00FF41] transition-colors duration-200" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 font-black tracking-widest">TICKER</label>
                    <input type="text" value={formData.ticker} onChange={(e) => updateForm('ticker', e.target.value)} placeholder="e.g. DOGEK" className="w-full bg-[#050505] border border-zinc-800 rounded-sm px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00FF41] transition-colors duration-200" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-black tracking-widest">DESCRIPTION</label>
                  <textarea value={formData.description} onChange={(e) => updateForm('description', e.target.value)} placeholder="Tell the story..." rows={3} className="w-full bg-[#050505] border border-zinc-800 rounded-sm px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00FF41] transition-colors duration-200 resize-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/50">
                  <div className="relative">
                    <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input type="text" value={formData.twitter} onChange={(e) => updateForm('twitter', e.target.value)} placeholder="X (Twitter)" className="w-full bg-[#050505] border border-zinc-800 rounded-sm pl-9 pr-3 py-2.5 text-xs focus:border-[#00FF41] outline-none transition-colors" />
                  </div>
                  <div className="relative">
                    <Send size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input type="text" value={formData.telegram} onChange={(e) => updateForm('telegram', e.target.value)} placeholder="Telegram" className="w-full bg-[#050505] border border-zinc-800 rounded-sm pl-9 pr-3 py-2.5 text-xs focus:border-[#00FF41] outline-none transition-colors" />
                  </div>
                  <div className="relative">
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input type="text" value={formData.website} onChange={(e) => updateForm('website', e.target.value)} placeholder="Website" className="w-full bg-[#050505] border border-zinc-800 rounded-sm pl-9 pr-3 py-2.5 text-xs focus:border-[#00FF41] outline-none transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest"><span className="text-[#00FF41]">02.</span> TOKENOMICS</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 font-black tracking-widest">TOTAL SUPPLY</label>
                    <input type="number" value={formData.supply} onChange={(e) => updateForm('supply', e.target.value)} className="w-full bg-[#050505] border border-zinc-800 rounded-sm px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00FF41] transition-colors duration-200" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 font-black tracking-widest">GRAD TARGET (SOL)</label>
                    <input type="number" value={formData.gradTarget} onChange={(e) => updateForm('gradTarget', e.target.value)} className="w-full bg-[#050505] border border-zinc-800 rounded-sm px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00FF41] transition-colors duration-200" />
                  </div>
                </div>
                <div className="bg-[#00FF41]/5 border-l-2 border-[#00FF41] p-5 mt-6">
                  <h3 className="text-sm font-black text-[#00FF41] mb-2 flex items-center gap-2 tracking-widest"><Zap size={18}/> 7-DAY LAUNCH WINDOW</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">The token has exactly 7 days to hit the graduation target. If it fails, all bidders are automatically refunded their SOL via the smart contract.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest"><span className="text-[#00FF41]">03.</span> DEPLOYMENT</h2>
              
              {/* Terminal Receipt */}
              <div className="bg-[#000000] border border-zinc-800 p-6 mb-6 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDQwdjRIMHoiIGZpbGw9IiMwMEZGNDEiIGZpbGwtb3BhY2l0eT0iLjIiLz48L3N2Zz4=')] opacity-50"></div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-widest">Target Asset</span>
                  <span className="font-bold text-white tracking-wider">{formData.name || 'UNKNOWN'} <span className="text-[#00FF41]">({formData.ticker || '???'})</span></span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-widest">Total Supply</span>
                  <span className="font-bold text-white">{Number(formData.supply).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-widest">Grad Target</span>
                  <span className="font-bold text-white">{formData.gradTarget} SOL</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-widest">LP Security</span>
                  <span className="font-bold text-[#00FF41] flex items-center gap-1"><ShieldCheck size={16}/> LOCKED & BURNED</span>
                </div>
              </div>

              <div className="border border-amber-500/30 bg-amber-500/5 p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-amber-500/30"></div>
                <h3 className="text-sm font-black text-amber-500 mb-2 flex items-center gap-2 tracking-widest"><Zap size={16}/> DEV BOOTSTRAP (OPTIONAL)</h3>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">Seed the initial vault if you want. If left empty, the community determines the starting price.</p>
                <div className="relative">
                  <input type="number" value={formData.bootstrapAmount} onChange={(e) => updateForm('bootstrapAmount', e.target.value)} placeholder="Amount" className="w-full bg-[#050505] border border-amber-500/30 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors placeholder-amber-500/20" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-amber-500">SOL</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-zinc-400 bg-[#050505] p-4 border border-zinc-800">
                <span className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500"/> Anti-Bot Fee</span>
                <span className="font-black text-white">0.02 SOL</span>
              </div>
            </div>
          )}

          {/* Navigation Footer */}
          <div className="flex justify-between mt-10 pt-6 border-t border-zinc-800/80">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-6 py-3 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors duration-200 text-xs font-black tracking-widest">
                <ArrowLeft size={16} /> BACK
              </button>
            ) : <div></div>}
            
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} disabled={!formData.name || !formData.ticker} className="flex items-center gap-2 px-8 py-3 bg-[#00FF41] text-black hover:bg-[#00e03a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-xs font-black tracking-widest">
                NEXT STEP <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={handleLaunch} disabled={isLaunching} className="flex items-center gap-2 px-8 py-3 bg-[#00FF41] text-black hover:bg-[#00e03a] transition-colors duration-200 text-xs font-black tracking-widest shadow-[0_0_15px_rgba(0,255,65,0.3)]">
                {isLaunching ? (
                  <span className="flex items-center gap-2 animate-pulse"><Zap size={16}/> DEPLOYING...</span>
                ) : (
                  <span className="flex items-center gap-2"><Rocket size={16}/> LAUNCH PROTOCOL</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
