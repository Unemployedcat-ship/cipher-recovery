'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/components/SupabaseProvider';
import { usePrivy } from '@privy-io/react-auth';
import { Users, Shield, ArrowRight, Plus, Loader2, X } from 'lucide-react';

export default function SyndicatesPage() {
  const { supabase } = useSupabase();
  const { user } = usePrivy();
  
  const [syndicates, setSyndicates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const [form, setForm] = useState({ name: '', tag: '', bio: '' });

  useEffect(() => {
    async function fetchSyndicates() {
      try {
        const { data, error } = await supabase.from('syndicates').select('*').order('created_at', { ascending: false });
        if (error) console.error("DB Error:", error);
        if (data) setSyndicates(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSyndicates();
  }, [supabase]);

  const handleCreate = async () => {
    if (!user) return alert("Connect wallet first");
    if (form.tag.length < 3 || form.tag.length > 5) return alert("Tag must be 3-5 letters.");
    if (!form.name.trim()) return alert("Name is required.");
    
    setIsCreating(true);
    try {
      const { data: profile } = await supabase.from('profiles').select('id').eq('privy_did', user.id).single();
      if (!profile) throw new Error("Profile not found.");

      const { error } = await supabase.from('syndicates').insert({
        name: form.name, 
        tag: form.tag.toUpperCase(), 
        bio: form.bio, 
        creator_id: profile.id
      });

      if (error) throw error;
      
      alert("Syndicate created successfully!");
      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto relative">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold font-mono text-white mb-2 flex items-center justify-center gap-3">
          <Users className="text-cyan-400" size={28} /> SYNDICATES
        </h1>
        <p className="text-sm font-mono text-slate-400 mb-6">Private alpha groups. High-tier allocations.</p>
        <button onClick={() => setIsModalOpen(true)} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2 mx-auto">
          <Plus size={18} /> CREATE SYNDICATE
        </button>
      </div>

      {loading ? (
        <div className="text-center font-mono text-cyan-400 animate-pulse py-10">Loading Syndicates...</div>
      ) : syndicates.length === 0 ? (
        <div className="text-center font-mono text-slate-500 py-10">No syndicates found. Be the first to create one!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {syndicates.map((s, i) => (
            <div key={i} className="bg-gradient-to-b from-[#15151A] to-[#0A0A0F] border border-white/5 rounded-2xl p-6 shadow-2xl hover:border-cyan-500/30 transition-all group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="text-[10px] font-mono px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 font-bold">
                  [{s.tag}]
                </span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/10 mb-6 group-hover:scale-105 transition-transform shadow-lg overflow-hidden">
                <Shield size={24} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold font-mono text-white mb-2 group-hover:text-cyan-400 transition-colors">{s.name}</h3>
              <p className="text-xs font-mono text-slate-500 mb-6 h-8 line-clamp-2">{s.bio || "No description provided."}</p>
              <button className="w-full bg-white/5 hover:bg-cyan-500 hover:text-black border border-white/10 text-white font-mono text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                VIEW SYNDICATE <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111116] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
            <h2 className="text-xl font-bold font-mono text-white mb-6">CREATE SYNDICATE</h2>
            
            <div className="space-y-4">
              <div>
                <label className="font-mono text-[10px] text-slate-400 block mb-1 uppercase">Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-[#050508] border border-white/10 rounded-lg p-2.5 text-white font-mono text-sm outline-none focus:border-cyan-400" />
              </div>
              <div>
                <label className="font-mono text-[10px] text-slate-400 block mb-1 uppercase">Tag (3-5 letters)</label>
                <input value={form.tag} onChange={e => setForm({...form, tag: e.target.value.toUpperCase()})} maxLength={5} minLength={3} className="w-full bg-[#050508] border border-white/10 rounded-lg p-2.5 text-white font-mono text-sm outline-none focus:border-cyan-400" />
              </div>
              <div>
                <label className="font-mono text-[10px] text-slate-400 block mb-1 uppercase">Bio</label>
                <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full bg-[#050508] border border-white/10 rounded-lg p-2.5 text-white font-mono text-sm outline-none focus:border-cyan-400 h-20 resize-none" />
              </div>
              <button onClick={handleCreate} disabled={isCreating} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono py-3 rounded-lg mt-2 flex justify-center items-center">
                {isCreating ? <Loader2 className="animate-spin" size={18}/> : 'CREATE SYNDICATE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
