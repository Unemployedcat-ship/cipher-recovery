'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSupabase } from '@/components/SupabaseProvider';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { User, Camera, Save, Loader2, Lock, AlertTriangle, Shield, Upload, Key, TrendingUp, Coins, Activity } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = usePrivy();
  const { supabase } = useSupabase();
  const { address, balance } = useSolanaWallet();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profile, setProfile] = useState({ callsign: '', bio: '', is_private: false, avatar_url: '', syndicate_tag: '' });

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('privy_did', user.id).single();
      if (data) {
        setProfile({ 
          callsign: data.username || '', 
          bio: data.bio || '', 
          is_private: data.is_private || false, 
          avatar_url: data.avatar_url || '',
          syndicate_tag: data.syndicate_tag || ''
        });
      }
      setLoading(false);
    }
    fetchProfile();
  }, [user, supabase]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar_${user?.id}_${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage.from('token-images').upload(fileName, file);
    if (error) {
      alert("Upload failed: " + error.message);
    } else {
      const { data } = supabase.storage.from('token-images').getPublicUrl(fileName);
      setProfile({...profile, avatar_url: data.publicUrl});
    }
    setIsUploading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    if (!profile.callsign.trim()) return alert("You must set a Callsign.");
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ 
      username: profile.callsign, 
      bio: profile.bio, 
      is_private: profile.is_private, 
      avatar_url: profile.avatar_url,
      syndicate_tag: profile.syndicate_tag 
    }).eq('privy_did', user.id);
    setSaving(false);
    if (error) alert("Error saving: " + error.message);
    else alert("Profile saved successfully!");
  };

  if (loading) return <div className="p-20 text-center font-mono text-cyan-400 animate-pulse">Loading Profile...</div>;

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
      
      {/* Main Profile Column */}
      <div className="flex-1 space-y-6">
        <header className="flex items-end justify-between">
          <div>
            <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <User className="text-cyan-400" size={28} /> TRADER PROFILE
            </h1>
            <p className="font-mono text-sm text-slate-400">Your pseudonymous identity in the trenches.</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono px-6 py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center gap-2 text-sm">
            {saving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} COMMIT PROFILE
          </button>
        </header>

        <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 space-y-6 shadow-2xl">
          {!profile.callsign && (
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-amber-400 font-mono text-sm font-bold mb-1">PRIVACY REQUIRED</h4>
                <p className="text-xs font-mono text-slate-400">You must set a Callsign (Username). If you don't, you will appear as a truncated wallet address in chats and leaderboards.</p>
              </div>
            </div>
          )}

          {/* Profile Picture & Info */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-2xl bg-slate-800 border-2 border-white/10 flex items-center justify-center relative overflow-hidden group shadow-xl">
                {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <Camera className="text-slate-500" size={32} />}
                <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/60 hidden group-hover:flex flex-col items-center justify-center cursor-pointer">
                  {isUploading ? <Loader2 className="animate-spin text-white" size={20}/> : <><Upload size={20} className="text-white mb-1"/><span className="text-[9px] font-mono text-white">UPLOAD</span></>}
                </label>
                <input type="file" id="avatar-upload" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10px] text-cyan-400 font-bold block mb-2 uppercase tracking-widest">Callsign (Username)</label>
                  <input value={profile.callsign} onChange={e => setProfile({...profile, callsign: e.target.value})} className="w-full bg-[#050508] border border-white/10 rounded-xl p-3 text-white font-mono text-sm focus:border-cyan-400 outline-none transition-colors" placeholder="e.g. DegenKing" />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-cyan-400 font-bold block mb-2 uppercase tracking-widest">Clan Tag (Synced)</label>
                  <input value={profile.syndicate_tag} readOnly className="w-full bg-[#050508] border border-white/5 rounded-xl p-3 text-slate-500 font-mono text-sm outline-none cursor-not-allowed" placeholder="Join a Syndicate" />
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] text-slate-400 block mb-2 uppercase tracking-widest">Trader Bio</label>
                <textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full bg-[#050508] border border-white/10 rounded-xl p-3 text-white font-mono text-sm focus:border-cyan-400 outline-none h-20 resize-none transition-colors" placeholder="Signal your intent..." />
              </div>
            </div>
          </div>
        </div>

        {/* 🔴 NEW: DENSE STATS SECTION */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#111116] border border-white/5 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Total Volume</span>
            </div>
            <div className="text-2xl font-mono text-white font-bold">0.00 SOL</div>
          </div>
          <div className="bg-[#111116] border border-white/5 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Coins size={16} className="text-cyan-400" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Tokens Launched</span>
            </div>
            <div className="text-2xl font-mono text-white font-bold">0</div>
          </div>
          <div className="bg-[#111116] border border-white/5 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} className="text-amber-400" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Win Rate</span>
            </div>
            <div className="text-2xl font-mono text-white font-bold">--%</div>
          </div>
        </div>
      </div>

      {/* Sidebar Settings Column */}
      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-sm font-mono text-white font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
            <Shield size={16} className="text-emerald-400" /> ACCOUNT SECURITY
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold font-mono text-white mb-1">Private Holdings</h4>
                <p className="text-[9px] font-mono text-slate-400">Hide position size.</p>
              </div>
              <button onClick={() => setProfile({...profile, is_private: !profile.is_private})} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${profile.is_private ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${profile.is_private ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div className="h-px bg-white/5" />
            
            <button className="w-full flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/5 rounded-xl border border-white/5 transition-colors group">
              <div className="flex items-center gap-2">
                <Key size={14} className="text-slate-400 group-hover:text-cyan-400" />
                <span className="text-xs font-mono text-slate-300 group-hover:text-white">Change Password</span>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/5 rounded-xl border border-white/5 transition-colors group">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-slate-400 group-hover:text-red-400" />
                <span className="text-xs font-mono text-slate-300 group-hover:text-red-400">Revoke Sessions</span>
              </div>
            </button>
          </div>
        </div>

        {/* Live Wallet Card */}
        <div className="bg-gradient-to-br from-[#111116] to-[#0A0A0F] border border-emerald-500/20 rounded-2xl p-6 shadow-[0_0_20px_rgba(16,185,129,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl"></div>
          <div className="text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-wider">Live Wallet Balance</div>
          <div className="text-3xl font-mono text-emerald-400 font-bold flex items-center gap-2">
            {balance?.toFixed(3) || '0.000'} <span className="text-sm text-slate-500">SOL</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-2 truncate">
            {address || 'Connect wallet'}
          </div>
        </div>
      </div>
    </div>
  );
}
