'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSupabase } from '@/components/SupabaseProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Rocket, ArrowRight, Image as ImageIcon, Loader2, ArrowLeft,
  Coins, AtSign, Send, Globe, Target, Info, Flame, Lock, Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Keypair, PublicKey } from '@solana/web3.js';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { createAuctionOnChain, submitBidOnChain } from '@/lib/solana/actions';



export default function LaunchPage() {
  const { user } = usePrivy();
  const { supabase } = useSupabase();
  const router = useRouter();
  const { signer, address, createWallet, solanaReady } = useSolanaWallet();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    ticker: '',
    description: '',
    imageUrl: '',
    supply: '',
    twitter: '',
    telegram: '',
    website: '',
    graduationTarget: '',
    devBootstrap: '',
  });

  const update = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { error } = await supabase.storage
      .from('token-images')
      .upload(fileName, file);
    if (error) alert('Error uploading image: ' + error.message);
    else {
      const { data } = await supabase.storage
        .from('token-images')
        .getPublicUrl(fileName);
      update('imageUrl', data.publicUrl);
    }
    setIsUploading(false);
  };

  const handleLaunch = async () => {
    if (!user) return;
    if (!signer || !address) {
      if (solanaReady) {
        await createWallet();
        alert('Solana wallet generated! Please click Confirm Launch again.');
      }
      return;
    }
    if (form.ticker.length < 3 || form.ticker.length > 5)
      return alert('Ticker must be 3-5 letters.');

    const supplyNum = Number.parseFloat(form.supply);
    const targetNum = Number.parseFloat(form.graduationTarget);
    const devBootstrapNum = Number.parseFloat(form.devBootstrap);

    if (!supplyNum || supplyNum < 1_000_000 || supplyNum > 1_000_000_000_000)
      return alert(
        'Total Supply must be between 1,000,000 and 1,000,000,000,000.'
      );
    if (!targetNum || targetNum < 1 || targetNum > 100)
      return alert('Grad Target must be between 1 SOL and 100 SOL.');
    if (!Number.isFinite(devBootstrapNum) || devBootstrapNum <= 0)
      return alert(
        'You must type a Dev Bootstrap amount (e.g. 2) before launching.'
      );

    setIsSubmitting(true);

    try {
      const maxDurationSeconds = 604800; // 7 days

      let { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('privy_did', user.id)
        .single();

      if (!profile) {
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({ privy_did: user.id, balance: 500 })
          .select('id')
          .single();
        profile = newProfile;
      }

      console.log('Step 1: Creating auction with Keeper Authority...');

      const { auctionId, auctionPda, mintAddress } =
        await createAuctionOnChain(
          signer,
          TEST_AUTHORITY_KEYPAIR.publicKey,
          maxDurationSeconds,
          targetNum,
          supplyNum,
          TEST_AUTHORITY_KEYPAIR
        );

      const endTime = new Date(
        Date.now() + maxDurationSeconds * 1000
      ).toISOString();

      const { data: newAuction, error } = await supabase
        .from('auctions')
        .insert({
          creator_id: profile.id,
          name: form.name,
          ticker: form.ticker.toUpperCase(),
          description: form.description,
          image_url: form.imageUrl,
          supply: supplyNum,
          duration_seconds: maxDurationSeconds,
          status: 'live',
          mint_address: mintAddress,
          end_time: endTime,
          pda_address: auctionPda,
          on_chain_id: auctionId,
          twitter: form.twitter,
          telegram: form.telegram,
          website: form.website,
          lp_locked: true,
          lp_burned: true,
          dev_allocation: 0,
          graduation_target: targetNum,
          liquidity_target: targetNum,
        })
        .select()
        .single();

      if (error) throw error;

      console.log(
        `Step 2: Dev is bootstrapping ${devBootstrapNum} SOL...`
      );

      const auctionPdaKey = new PublicKey(auctionPda);
      const bidderKey = new PublicKey(address);

      const bidTx = await submitBidOnChain(
        signer,
        bidderKey,
        auctionPdaKey,
        devBootstrapNum
      );

      console.log('✅ Dev bootstrap bid confirmed:', bidTx);

      await supabase.from('bids').insert({
        auction_id: newAuction.id,
        user_id: profile.id,
        amount: devBootstrapNum,
      });

      router.push('/dark-pools');
    } catch (err: any) {
      console.error('Launch error:', err);
      alert(`Launch failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user)
    return (
      <div className="p-20 text-center font-mono text-white">
        Connect Identity
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto py-8 relative z-10">
      <Link
        href={isSubmitting ? '#' : '/dark-pools'}
        className={`inline-flex items-center gap-2 text-slate-400 font-mono text-xs mb-8 transition-colors ${
          isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:text-white'
        }`}
      >
        <ArrowLeft size={14} /> BACK TO FEED
      </Link>

      <header className="mb-8 text-center">
        <h1 className="font-mono text-3xl font-bold text-white tracking-widest mb-2 flex items-center justify-center gap-3">
          <Rocket className="text-cyan-400" size={28} /> LAUNCH PROTOCOL
        </h1>
        <p className="font-mono text-sm text-slate-400">
          Fair match seeding. 7-Day window. 0% rug risk.
        </p>
      </header>

      <div className="flex items-center justify-between mb-8 relative px-8">
        <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-white/5 -z-10"></div>
        <div
          className="absolute top-1/2 left-8 h-0.5 bg-cyan-500 transition-all duration-300 -z-10"
          style={{ width: `${(step - 1) * 50}%` }}
        ></div>

        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className="flex flex-col items-center gap-2 bg-[#0A0A0F] px-2"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold border-2 transition-all ${
                step >= s
                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                  : 'border-white/10 bg-[#111116] text-slate-500'
              }`}
            >
              {s}
            </div>
            <span
              className={`text-[10px] font-mono uppercase ${
                step >= s ? 'text-white' : 'text-slate-600'
              }`}
            >
              {s === 1 ? 'Details' : s === 2 ? 'Tokenomics' : 'Deploy'}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="font-mono text-sm text-white font-bold border-b border-white/5 pb-2">
              1. MEME DETAILS
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] text-slate-400 block mb-2 uppercase tracking-wider">
                  Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className="w-full bg-[#050508] border border-white/10 rounded-xl p-3 text-white font-mono text-sm focus:border-cyan-400 outline-none transition-colors"
                  placeholder="e.g. Doge Killer"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-slate-400 block mb-2 uppercase tracking-wider">
                  Ticker (3-5 letters)
                </label>
                <input
                  value={form.ticker}
                  onChange={(e) =>
                    update('ticker', e.target.value.toUpperCase())
                  }
                  maxLength={5}
                  minLength={3}
                  className="w-full bg-[#050508] border border-white/10 rounded-xl p-3 text-white font-mono text-sm focus:border-cyan-400 outline-none transition-colors"
                  placeholder="e.g. DOGEK"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] text-slate-400 block mb-2 flex items-center gap-2 uppercase tracking-wider">
                <ImageIcon size={12} /> Upload Image/GIF
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-white/5 hover:bg-white/10 text-white font-mono text-xs px-4 py-2.5 rounded-lg border border-white/10 flex items-center gap-2 transition-colors"
                >
                  {isUploading ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    'Choose File'
                  )}
                </label>
                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    className="w-10 h-10 rounded-lg object-cover border border-white/10"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] text-slate-400 block mb-2 uppercase tracking-wider">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className="w-full bg-[#050508] border border-white/10 rounded-xl p-3 text-white font-mono text-sm focus:border-cyan-400 outline-none h-24 resize-none transition-colors"
                placeholder="Tell the story..."
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-mono text-[10px] text-slate-400 flex items-center gap-1 mb-2 uppercase tracking-wider">
                  <AtSign size={10} /> X (Twitter)
                </label>
                <input
                  value={form.twitter}
                  onChange={(e) => update('twitter', e.target.value)}
                  className="w-full bg-[#050508] border border-white/10 rounded-lg p-2 text-white font-mono text-xs focus:border-cyan-400 outline-none transition-colors"
                  placeholder="https://x.com/..."
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-slate-400 flex items-center gap-1 mb-2 uppercase tracking-wider">
                  <Send size={10} /> Telegram
                </label>
                <input
                  value={form.telegram}
                  onChange={(e) => update('telegram', e.target.value)}
                  className="w-full bg-[#050508] border border-white/10 rounded-lg p-2 text-white font-mono text-xs focus:border-cyan-400 outline-none transition-colors"
                  placeholder="https://t.me/..."
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-slate-400 flex items-center gap-1 mb-2 uppercase tracking-wider">
                  <Globe size={10} /> Website
                </label>
                <input
                  value={form.website}
                  onChange={(e) => update('website', e.target.value)}
                  className="w-full bg-[#050508] border border-white/10 rounded-lg p-2 text-white font-mono text-xs focus:border-cyan-400 outline-none transition-colors"
                  placeholder="https://..."
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] flex items-center justify-center gap-2 mt-2"
            >
              NEXT STEP <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="font-mono text-sm text-white font-bold border-b border-white/5 pb-2">
              2. TOKENOMICS & SEEDING
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] text-slate-400 block mb-2 uppercase tracking-wider">
                  Total Supply
                </label>
                <input
                  type="number"
                  min="1000000"
                  max="1000000000000"
                  value={form.supply}
                  onChange={(e) => update('supply', e.target.value)}
                  onFocus={(e) => e.target.select()}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full bg-[#050508] border border-white/10 rounded-xl p-3 text-white font-mono text-sm focus:border-cyan-400 outline-none transition-colors"
                  placeholder="Min: 1M / Max: 1T"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-slate-400 flex items-center gap-2 mb-2 uppercase tracking-wider">
                  <Target size={12} /> Grad Target (SOL)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={form.graduationTarget}
                  onChange={(e) => update('graduationTarget', e.target.value)}
                  onFocus={(e) => e.target.select()}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full bg-[#050508] border border-white/10 rounded-xl p-3 text-white font-mono text-sm focus:border-cyan-400 outline-none transition-colors"
                  placeholder="Min: 1 / Max: 100"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-mono text-xs text-cyan-400 font-bold mb-3 flex items-center gap-2">
                <Clock size={14} /> TIME ENFORCEMENT
              </h3>
              <div className="flex items-start gap-3 p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/10">
                <Info size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-white font-mono text-xs font-bold mb-1">
                    7-DAY LAUNCH WINDOW
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 leading-relaxed">
                    The token has exactly 7 days to hit the target. If it fails,
                    all bidders are refunded their SOL.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 border border-white/10 text-slate-400 font-mono text-xs rounded-xl hover:bg-white/5 transition-colors"
              >
                BACK
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] flex items-center justify-center gap-2"
              >
                REVIEW <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="font-mono text-sm text-white font-bold border-b border-white/5 pb-2">
              3. REVIEW & DEPLOY
            </h2>
            <div className="space-y-3 font-mono text-xs p-5 rounded-xl border border-white/5 bg-[#050508]">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">Name:</span>{' '}
                <span className="text-white">
                  {form.name} ({form.ticker})
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">Supply:</span>{' '}
                <span className="text-white">{form.supply}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">Grad Target:</span>{' '}
                <span className="text-cyan-400 font-bold">
                  {form.graduationTarget} SOL
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">LP Status:</span>{' '}
                <span className="text-emerald-400">LOCKED & BURNED</span>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-amber-400 font-mono text-sm font-bold flex items-center gap-2">
                    <Flame size={14} /> DEV BOOTSTRAP (REQUIRED)
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400 mt-1 max-w-sm">
                    Seed your own pool. This SOL goes directly into the vault and
                    is permanently locked & burned. You cannot rug.
                  </p>
                </div>
                <Lock className="text-amber-400" size={20} />
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={form.devBootstrap}
                  onChange={(e) => update('devBootstrap', e.target.value)}
                  onFocus={(e) => e.target.select()}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full bg-[#050508] border border-amber-500/30 rounded-xl p-3 text-white font-mono text-sm focus:border-amber-400 outline-none transition-colors"
                  placeholder="Enter SOL amount (e.g. 2)"
                />
                <span className="absolute right-3 top-3 text-xs text-slate-500 font-mono">
                  SOL
                </span>
              </div>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-xl flex items-start gap-3">
              <Coins className="text-emerald-400 shrink-0 mt-0.5" size={16} />
              <div>
                <h4 className="text-emerald-400 font-mono text-xs font-bold mb-1">
                  ANTI-BOT LAUNCH FEE
                </h4>
                <p className="text-[10px] font-mono text-slate-400">
                  A one-time fee of <strong>0.02 SOL</strong> is required to
                  deploy.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                disabled={isSubmitting}
                className="w-1/3 py-3 border border-white/10 text-slate-400 font-mono text-xs rounded-xl hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                BACK
              </button>
              <button
                onClick={handleLaunch}
                disabled={isSubmitting}
                className="w-2/3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> DEPLOYING...
                  </>
                ) : (
                  'CONFIRM LAUNCH'
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
