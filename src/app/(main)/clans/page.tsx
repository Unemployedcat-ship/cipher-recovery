'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/components/SupabaseProvider';
import { usePrivy } from '@privy-io/react-auth';
import { ClanAvatar } from '@/components/ui/ClanAvatar';
import Link from 'next/link';
import { Shield, Plus, Users } from 'lucide-react';

type Clan = {
  id: string;
  name: string;
  tag: string;
  description: string;
  avatar_seed: string | null;
  owner_id: string;
};

export default function ClansPage() {
  const { supabase, loading } = useSupabase();
  const { user: privyUser } = usePrivy();
  
  const [clans, setClans] = useState<Clan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [myProfileId, setMyProfileId] = useState<string | null>(null);

  // Creation state
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [createError, setCreateError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      // Load clans
      const { data: clanData } = await supabase.from('clans').select('*').order('created_at', { ascending: false });
      if (clanData) setClans(clanData);

      // Load current user profile
      if (privyUser) {
        const { data: mapping } = await supabase
          .from('user_mappings')
          .select('supabase_uid')
          .eq('privy_did', privyUser.id)
          .single();
        if (mapping) setMyProfileId(mapping.supabase_uid);
      }
      
      setIsLoading(false);
    }
    loadData();
  }, [privyUser, supabase]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myProfileId) return;

    setIsSubmitting(true);
    setCreateError('');

    // Generate a random seed for the clan glyph
    const clanSeed = `${newName}-${Math.floor(Math.random() * 10000)}`;

    const { data: newClan, error: clanErr } = await supabase
      .from('clans')
      .insert({
        name: newName,
        tag: newTag.toUpperCase(),
        description: newDesc,
        owner_id: myProfileId,
        avatar_seed: clanSeed,
      })
      .select()
      .single();

    if (clanErr) {
        setCreateError(clanErr.message);
        setIsSubmitting(false);
        return;
    }

    // Add creator as the Owner in clan_members
    await supabase.from('clan_members').insert({
      clan_id: newClan.id,
      profile_id: myProfileId,
      role: 'owner',
    });

    // Refresh list
    setClans([newClan, ...clans]);
    setIsCreating(false);
    setNewName('');
    setNewTag('');
    setNewDesc('');
    setIsSubmitting(false);
  };

  if (loading || isLoading) {
    return <div className="p-8 font-mono text-white">Loading Syndicates...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-[var(--accent-cyan)]" />
            <h1 className="font-mono text-4xl font-bold tracking-tight text-white">SYNDICATES</h1>
          </div>
          <p className="font-mono text-sm text-[var(--text-secondary)] ml-4">Join a faction. Pool your intel.</p>
        </div>
        {myProfileId && (
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 bg-[var(--accent-cyan)] text-black px-4 py-2 rounded-md font-mono text-sm font-bold hover:brightness-110 transition-all"
          >
            {isCreating ? 'CANCEL' : <><Plus size={16} /> CREATE SYNDICATE</>}
          </button>
        )}
      </header>

      {isCreating && (
        <div className="mb-8 card p-6 border-[var(--accent-cyan)] shadow-[0_0_30px_rgba(0,229,255,0.1)]">
          <h2 className="font-mono text-lg font-bold text-white mb-4">FOUND A NEW SYNDICATE</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block font-mono text-xs text-[var(--text-muted)] mb-1 uppercase">Syndicate Name</label>
                <input required value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. The Degen Council" className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-md px-3 py-2 font-mono text-sm text-white focus:border-[var(--accent-cyan)] outline-none" />
              </div>
              <div>
                <label className="block font-mono text-xs text-[var(--text-muted)] mb-1 uppercase">Tag (3-5 chars)</label>
                <input required value={newTag} onChange={e => setNewTag(e.target.value)} maxLength={5} placeholder="e.g. DEGEN" className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-md px-3 py-2 font-mono text-sm text-white focus:border-[var(--accent-cyan)] outline-none uppercase" />
              </div>
            </div>
            <div>
              <label className="block font-mono text-xs text-[var(--text-muted)] mb-1 uppercase">Description</label>
              <textarea required value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={2} placeholder="What is your syndicate's purpose?" className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-md px-3 py-2 font-mono text-sm text-white focus:border-[var(--accent-cyan)] outline-none resize-none" />
            </div>
            {createError && <div className="text-red-400 font-mono text-xs">{createError}</div>}
            <button type="submit" disabled={isSubmitting} className="bg-[var(--accent-cyan)] text-black px-6 py-2 rounded-md font-mono text-sm font-bold disabled:opacity-50 hover:brightness-110">
              {isSubmitting ? 'FOUNDING...' : 'LAUNCH SYNDICATE'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clans.length === 0 ? (
          <div className="col-span-full text-center py-12 font-mono text-sm text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded-lg">
            No Syndicates have been founded yet. Be the first.
          </div>
        ) : (
          clans.map(clan => (
            <Link key={clan.id} href={`/clans/${clan.id}`} className="card p-5 hover:border-[var(--accent-cyan)] hover:shadow-[0_0_20px_rgba(0,229,255,0.1)] transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-[var(--border-subtle)] group-hover:border-[var(--accent-cyan)] transition-colors">
                  <ClanAvatar seed={clan.avatar_seed || clan.id} size={64} className="w-full h-full" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs bg-[var(--accent-cyan-dim)] text-[var(--accent-cyan)] px-1.5 py-0.5 rounded">[{clan.tag}]</span>
                    <h3 className="font-mono text-lg font-bold text-white line-clamp-1">{clan.name}</h3>
                  </div>
                  <p className="font-mono text-xs text-[var(--text-secondary)] line-clamp-2">{clan.description}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-4">
                <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)]">
                  <Users size={14} /> <span>Syndicate</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)]">
                  <Shield size={14} /> <span>Active</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
