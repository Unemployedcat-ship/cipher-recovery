'use client';

import { useEffect, useState, useRef } from 'react';
import { useSupabase } from '@/components/SupabaseProvider';
import { usePrivy } from '@privy-io/react-auth';
import { useParams } from 'next/navigation';
import { ClanAvatar } from '@/components/ui/ClanAvatar';
import { OperatorAvatar } from '@/components/ui/OperatorAvatar';
import { BackButton } from '@/components/ui/BackButton';
import { Shield, ShieldAlert, Crown, MessageSquare, Users, RefreshCw, Save, LogOut, Lock, Activity, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

type Clan = {
  id: string;
  name: string;
  tag: string;
  description: string;
  avatar_seed: string | null;
  owner_id: string;
};

type Member = {
  profile_id: string;
  role: string;
  profile: {
    username: string;
    avatar_url: string | null;
  };
};

type Message = {
  id: string;
  identity: string;
  content: string;
  profile_id: string;
  created_at: string;
};

export default function ClanPage() {
  const { supabase } = useSupabase();
  const { user: privyUser } = usePrivy();
  const params = useParams();
  const clanId = params.id as string;

  const [clan, setClan] = useState<Clan | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [myProfileId, setMyProfileId] = useState<string | null>(null);
  const [myRole, setMyRole] = useState<string | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [newSeed, setNewSeed] = useState('');

  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const isOwner = myRole === 'owner';
  const isMember = myRole !== null;

  useEffect(() => {
    async function loadData() {
      const { data: clanData } = await supabase
        .from('clans')
        .select('*')
        .eq('id', clanId)
        .maybeSingle();
      
      if (clanData) {
        setClan(clanData);
        setNewSeed(clanData.avatar_seed || clanData.id);
      }

      const { data: membersData } = await supabase
        .from('clan_members')
        .select('profile_id, role')
        .eq('clan_id', clanId);

      if (membersData) {
        const profileIds = membersData.map((m: any) => m.profile_id);
        if (profileIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .in('id', profileIds);

          if (profilesData) {
            const merged = membersData.map((m: any) => ({
              profile_id: m.profile_id,
              role: m.role,
              profile: profilesData.find((p: any) => p.id === m.profile_id) || { username: 'Unknown', avatar_url: null }
            }));
            setMembers(merged);
          }
        } else {
            setMembers([]);
        }
      }

      if (privyUser) {
        const { data: mapping } = await supabase
          .from('user_mappings')
          .select('supabase_uid')
          .eq('privy_did', privyUser.id)
          .single();
        
        if (mapping) {
          setMyProfileId(mapping.supabase_uid);
          const { data: roleData } = await supabase
            .from('clan_members')
            .select('role')
            .eq('clan_id', clanId)
            .eq('profile_id', mapping.supabase_uid)
            .maybeSingle();

          if (roleData) setMyRole(roleData.role);
        }
      }

      setIsLoading(false);
    }
    loadData();
  }, [clanId, privyUser, supabase]);

  useEffect(() => {
    if (!isMember) return;

    const loadChat = async () => {
      const { data } = await supabase
        .from('faction_intel')
        .select('*')
        .eq('clan_id', clanId)
        .order('created_at', { ascending: true })
        .limit(100);
      if (data) setMessages(data);
    };
    loadChat();

    const channel = supabase
      .channel(`clan_chat_${clanId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'faction_intel', filter: `clan_id=eq.${clanId}` }, 
        (payload: any) => {
          const newMessage = payload.new as Message;
          setMessages(prev => {
            if (prev.some((m: any) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [clanId, isMember, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleJoin = async () => {
    if (!myProfileId) return alert("Please set an Operator ID first.");
    await supabase.from('clan_members').insert({ clan_id: clanId, profile_id: myProfileId, role: 'member' });
    setMyRole('member');
    window.location.reload();
  };

  const handleLeave = async () => {
    if (!myProfileId) return;
    if (isOwner) return alert("Owners cannot leave their own syndicate.");
    await supabase.from('clan_members').delete().eq('clan_id', clanId).eq('profile_id', myProfileId);
    setMyRole(null);
    window.location.reload();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !clan) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `clan-${clan.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('token-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('token-images')
        .getPublicUrl(filePath);

      setNewSeed(publicUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to upload crest.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveAvatar = async () => {
    if (!clan || !isOwner) return;
    setIsSaving(true);
    const { error } = await supabase.from('clans').update({ avatar_seed: newSeed }).eq('id', clan.id);
    if (error) { alert('Error saving: ' + error.message); } else { setSaveMsg('Crest Saved!'); setTimeout(() => setSaveMsg(''), 3000); }
    setClan({ ...clan, avatar_seed: newSeed });
    setIsSaving(false);
  };

  const handlePost = async () => {
    if (!draft.trim() || !myProfileId) return;
    setIsPosting(true);
    
    const myMemberData = members.find((m: any) => m.profile_id === myProfileId);
    const identity = myMemberData?.profile.username || 'Operator';

    const { error } = await supabase.from('faction_intel').insert({
      clan_id: clanId,
      profile_id: myProfileId,
      identity: identity,
      content: draft.trim()
    });

    if (error) {
      alert(`Failed to send: ${error.message}`);
    } else {
      setDraft('');
    }
    setIsPosting(false);
  };

  if (isLoading) return <div className="p-8 font-mono text-white">Loading Syndicate Data...</div>;
  if (!clan) return <div className="p-8 font-mono text-white">Syndicate not found.</div>;

  const getRoleIcon = (role: string) => {
    if (role === 'owner') return <Crown size={14} className="text-[#FFD700]" />;
    if (role === 'officer') return <ShieldAlert size={14} className="text-[var(--accent-cyan)]" />;
    return <Shield size={14} className="text-[var(--text-muted)]" />;
  };

  const isCustomImage = newSeed.startsWith('http');

  return (
    <div className="max-w-7xl mx-auto p-8 min-h-screen relative z-10">
      <BackButton />

      <div className="glass-panel p-8 relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-cyan)]/5 to-transparent opacity-50 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-36 h-36 rounded-3xl bg-black/40 border border-white/10 p-2 flex-shrink-0 shadow-2xl overflow-hidden">
             {clan.avatar_seed?.startsWith('http') ? (
               <img src={clan.avatar_seed} alt="Clan Crest" className="w-full h-full object-cover rounded-2xl" />
             ) : (
               <ClanAvatar seed={clan.avatar_seed || clan.id} size={144} className="w-full h-full rounded-2xl" />
             )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
              <span className="font-mono text-sm bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] px-3 py-1 rounded-full border border-[var(--accent-cyan)]/20 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                [{clan.tag}]
              </span>
              <h1 className="font-mono text-5xl font-bold text-white tracking-tight">{clan.name}</h1>
            </div>
            <p className="font-mono text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              {clan.description}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
              <div className="flex items-center gap-2 font-mono text-sm text-[var(--text-secondary)]">
                <Users size={16} className="text-[var(--accent-cyan)]" /> <strong className="text-white">{members.length}</strong> Members
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {!isMember && privyUser && (
              <button onClick={handleJoin} className="bg-[var(--accent-cyan)] text-black px-8 py-3 rounded-xl font-mono text-sm font-bold hover:brightness-110 shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all">
                JOIN SYNDICATE
              </button>
            )}
            {isMember && !isOwner && (
              <button onClick={handleLeave} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-2 rounded-xl font-mono text-sm transition-all">
                <LogOut size={14} /> Leave
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <h2 className="font-mono text-lg font-bold text-white">ROSTER</h2>
              <span className="font-mono text-xs text-[var(--text-muted)]">{members.length} Operators</span>
            </div>
            <div className="overflow-y-auto flex-1 space-y-2 pr-2 custom-scrollbar">
              {members.map((member: any) => (
                <div key={member.profile_id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-black shadow-inner">
                      <OperatorAvatar seed={member.profile.avatar_url || undefined} size={40} className="w-full h-full" />
                    </div>
                    <div>
                      <div className="font-mono text-sm text-white group-hover:text-[var(--accent-cyan)] transition-colors">{member.profile.username || 'Anonymous'}</div>
                      <div className="font-mono text-[10px] text-[var(--text-muted)]">{member.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getRoleIcon(member.role)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          
          {isOwner && (
            <div className="glass-panel p-6 border-l-2 border-l-[var(--accent-cyan)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                    {isCustomImage ? (
                      <img src={newSeed} alt="Crest Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ClanAvatar seed={newSeed} size={48} className="w-full h-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-white">Syndicate Crest</h3>
                    <p className="font-mono text-xs text-[var(--text-muted)]">Reroll generative art or upload a custom image.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setNewSeed(`${clan.name}-${Math.floor(Math.random() * 100000)}`)} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors text-white" title="Reroll Generative">
                    <RefreshCw size={16} />
                  </button>
                  <label className="cursor-pointer p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors text-white flex items-center justify-center" title="Upload Image">
                    <UploadCloud size={16} />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                  </label>
                  <button onClick={handleSaveAvatar} disabled={isSaving || isUploading} className="px-4 py-2 bg-[var(--accent-cyan)] text-black font-mono text-xs font-bold rounded-md hover:brightness-110 transition-all disabled:opacity-50">
                    {isSaving ? 'SAVING...' : saveMsg ? saveMsg : 'SAVE'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare size={18} className="text-[var(--accent-cyan)]" /> CLAN COMMS
              </h2>
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--status-live)]">
                <span className="w-2 h-2 rounded-full bg-[var(--status-live)] animate-pulse" /> Encrypted
              </div>
            </div>

            {!isMember ? (
              <div className="glass-panel p-16 flex flex-col items-center justify-center text-center h-[500px] border-dashed border-white/10">
                <Lock size={48} className="text-[var(--text-muted)] mb-6 opacity-30" />
                <h3 className="font-mono text-xl font-bold text-white mb-2">ENCRYPTED CHANNEL</h3>
                <p className="font-mono text-sm text-[var(--text-secondary)] max-w-md">
                  Join {clan.name} to decrypt the Syndicate frequency.
                </p>
              </div>
            ) : (
              <div className="glass-panel flex flex-col h-[500px] overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/20">
                  {messages.length === 0 ? (
                     <div className="text-center font-mono text-sm text-[var(--text-muted)] py-12">Frequency clear. Start transmitting.</div>
                  ) : messages.map((m: any) => (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={m.id} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-black flex-shrink-0">
                        <OperatorAvatar seed={members.find((x: any) => x.profile_id === m.profile_id)?.profile.avatar_url || undefined} size={32} className="w-full h-full" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <div className="font-mono text-xs font-bold text-[var(--accent-cyan)]">{m.identity}</div>
                          <div className="font-mono text-[10px] text-[var(--text-muted)]">{new Date(m.created_at).toLocaleTimeString()}</div>
                        </div>
                        <div className="font-mono text-sm text-[var(--text-primary)] bg-white/5 px-4 py-2.5 rounded-xl rounded-tl-none border border-white/5 inline-block">
                          {m.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <div className="p-4 border-t border-white/5 bg-[var(--bg-surface)]">
                  <div className="flex gap-3">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handlePost(); }}
                      placeholder="Transmit to Syndicate..."
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[var(--accent-cyan)] transition-colors"
                    />
                    <button onClick={handlePost} disabled={isPosting || !draft.trim()} className="bg-[var(--accent-cyan)] text-black px-6 py-3 rounded-xl font-mono text-sm font-bold disabled:opacity-50 hover:brightness-110 transition-all">
                      SEND
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
