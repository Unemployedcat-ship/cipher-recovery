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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [formData, setFormData] = useState({
    name: '', ticker: '', description: '', imageUrl: '',
    twitter: '', telegram: '', website: '', supply: '1000000000', gradTarget: '2', bootstrapAmount: ''
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    setUploadError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'token-images');

      // Send to our secure moderation route
      const res = await fetch('/api/moderate', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Image failed moderation');
      }

      setFormData(prev => ({ ...prev, imageUrl: data.url }));
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const updateForm = (key: string, value: string) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleLaunch = async () => {
    if (!address) return alert("Please connect your wallet first.");
    setIsLaunching(true);
    
    try {
      const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, creatorId: address })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to launch');

      router.push(`/dark-pools/${data.token.id}`);
    } catch (err: any) {
      alert(`Launch failed: ${err.message}`);
      setIsLaunching(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center py-10 px-4 font-mono text-zinc-300 relative">
      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-sm text-[10px] tracking-[0.2em] text-[#00FF41] mb-6 uppercase font-black shadow-[0_0_20px_rgba(0,255,65,0.15)]">
          <Terminal size={12} className="animate-pulse" /> Secure Deployment Protocol
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
          LAUNCH <span className="text-[#00FF41] drop-shadow-[0_0_15px_rgba(0,255,65,0.5)]">PROTOCOL</span>
        </h1>
      </div>

      <div className="w-full max-w-2xl bg-[#09090B] border border-zinc-800 rounded-sm relative shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 md:p-10">
        
        {step === 1 && (
          <div className="animate-in fade-in">
            <h2 className="text-lg font-black text-white mb-6 uppercase tracking-widest"><span className="text-[#00FF41]">01.</span> MEME DETAILS</h2>
            <div className="space-y-6">
              
              <div className="flex justify-center mb-8">
                <label className="relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-sm border-2 border-dashed border-zinc-700 bg-[#111116] hover:border-[#00FF41] transition-colors group overflow-hidden">
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Token" className="h-full w-full object-cover" />
                  ) : uploadingImage ? (
                    <div className="flex flex-col items-center text-[#00FF41]"><div className="h-6 w-6 border-2 border-[#00FF41] border-t-transparent rounded-full animate-spin"></div></div>
                  ) : (
                    <div className="flex flex-col items-center text-zinc-500 group-hover:text-[#00FF41] transition-colors">
                      <ImagePlus className="h-8 w-8 mb-2" />
                      <span className="text-[10px] font-black tracking-widest">UPLOAD</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
              </div>
              
              {uploadError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-sm text-center">
                  {uploadError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-black tracking-widest">TOKEN NAME</label>
                  <input type="text" value={formData.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="e.g. Doge Killer" className="w-full bg-[#050505] border border-zinc-800 rounded-sm px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00FF41]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-black tracking-widest">TICKER</label>
                  <input type="text" value={formData.ticker} onChange={(e) => updateForm('ticker', e.target.value)} placeholder="e.g. DOGEK" className="w-full bg-[#050505] border border-zinc-800 rounded-sm px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00FF41]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-black tracking-widest">DESCRIPTION</label>
                <textarea value={formData.description} onChange={(e) => updateForm('description', e.target.value)} placeholder="Tell the story..." rows={3} className="w-full bg-[#050505] border border-zinc-800 rounded-sm px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00FF41] resize-none" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in">
            <h2 className="text-lg font-black text-white mb-6 uppercase tracking-widest"><span className="text-[#00FF41]">02.</span> TOKENOMICS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-black tracking-widest">TOTAL SUPPLY</label>
                <input type="number" value={formData.supply} onChange={(e) => updateForm('supply', e.target.value)} className="w-full bg-[#050505] border border-zinc-800 rounded-sm px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00FF41]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-black tracking-widest">GRAD TARGET (SOL)</label>
                <input type="number" value={formData.gradTarget} onChange={(e) => updateForm('gradTarget', e.target.value)} className="w-full bg-[#050505] border border-zinc-800 rounded-sm px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00FF41]" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in">
            <h2 className="text-lg font-black text-white mb-6 uppercase tracking-widest"><span className="text-[#00FF41]">03.</span> DEPLOYMENT</h2>
            <div className="bg-[#000000] border border-zinc-800 p-6 mb-6 space-y-3">
              <div className="flex justify-between"><span className="text-zinc-500 text-sm">Asset</span><span className="font-bold text-white">{formData.name} ({formData.ticker})</span></div>
              <div className="flex justify-between"><span className="text-zinc-500 text-sm">Supply</span><span className="font-bold text-white">{Number(formData.supply).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500 text-sm">Target</span><span className="font-bold text-white">{formData.gradTarget} SOL</span></div>
              <div className="flex justify-between border-t border-zinc-800/50 pt-3"><span className="text-zinc-500 text-sm">LP Security</span><span className="font-bold text-[#00FF41] flex items-center gap-1"><ShieldCheck size={16}/> LOCKED & BURNED</span></div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-10 pt-6 border-t border-zinc-800/80">
          {step > 1 ? <button onClick={() => setStep(step - 1)} className="px-6 py-3 border border-zinc-800 text-zinc-400 hover:text-white transition-all text-xs font-black"><ArrowLeft size={16} className="inline mr-2"/> BACK</button> : <div></div>}
          
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} disabled={!formData.name || !formData.ticker || !formData.imageUrl} className="px-8 py-3 bg-[#00FF41] text-black hover:bg-[#00e03a] disabled:opacity-50 transition-all text-xs font-black">
              NEXT STEP <ArrowRight size={16} className="inline ml-2"/>
            </button>
          ) : (
            <button onClick={handleLaunch} disabled={isLaunching} className="px-8 py-3 bg-[#00FF41] text-black hover:bg-[#00e03a] transition-all text-xs font-black">
              {isLaunching ? 'DEPLOYING...' : 'LAUNCH PROTOCOL'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
