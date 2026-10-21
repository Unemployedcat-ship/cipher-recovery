'use client';

import { useState, useEffect, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSupabase } from '@/components/SupabaseProvider';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { Hash, Send, Users, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

type Message = {
  id: string;
  channel: string;
  username: string;
  avatar_url: string | null;
  text: string;
  created_at: string;
};

export default function CommunityPage() {
  const { user } = usePrivy();
  const { supabase } = useSupabase();
  const { address } = useSolanaWallet();
  
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const { data } = await supabase.from('profiles').select('id, username, avatar_url').eq('privy_did', user.id).single();
      if (data) {
        setUsername(data.username);
        setUserId(data.id);
        setAvatarUrl(data.avatar_url);
      }
    }
    fetchProfile();
  }, [user, supabase]);

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const { data } = await supabase.from('messages').select('*').eq('channel', activeChannel).order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel=eq.${activeChannel}` }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeChannel, supabase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !userId || !username) return;
    
    const textToSend = input;
    setInput('');

    await supabase.from('messages').insert({
      channel: activeChannel,
      user_id: userId,
      username: username,
      avatar_url: avatarUrl,
      text: textToSend
    });
  };

  const channelList = ['general', 'alpha-calls', 'price-talk', 'memes'];

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] flex gap-4">
      <div className="w-56 bg-[#111116] border border-white/5 rounded-2xl flex flex-col shadow-2xl p-3 hidden md:flex">
        <h2 className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest mb-3 px-2">Channels</h2>
        <div className="space-y-1">
          {channelList.map((chan) => (
            <button 
              key={chan} 
              onClick={() => setActiveChannel(chan)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-mono transition-colors ${
                activeChannel === chan ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Hash size={14} /> {chan}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-[#111116] border border-white/5 rounded-2xl flex flex-col shadow-2xl relative overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Hash size={18} className="text-cyan-400" />
            <h1 className="text-sm font-bold font-mono text-white">{activeChannel}</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          {messages.length === 0 && <div className="text-center text-slate-500 font-mono text-sm mt-10">No messages yet. Start the conversation.</div>}
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-4 hover:bg-white/[0.02] p-2 -mx-2 rounded transition-colors group">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-cyan-400 shrink-0 overflow-hidden">
                {msg.avatar_url ? <img src={msg.avatar_url} className="w-full h-full object-cover" /> : msg.username.slice(0,2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-bold font-mono text-cyan-400">{msg.username}</span>
                  <span className="text-[10px] font-mono text-slate-500">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-sm font-mono text-slate-300 leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {!username && user && (
          <div className="px-4 py-2 bg-amber-500/10 border-t border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 text-[10px] font-mono">
              <AlertTriangle size={12} /> You must set a username to chat.
            </div>
            <Link href="/profile" className="text-[10px] font-mono font-bold text-black bg-amber-400 px-2 py-1 rounded hover:bg-amber-300">SET USERNAME</Link>
          </div>
        )}

        <div className="p-4 border-t border-white/5 bg-[#0A0A0F]">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={username ? `Message #${activeChannel}...` : "Set a username to chat..."}
              disabled={!username}
              className="w-full bg-[#050508] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm font-mono text-white outline-none focus:border-cyan-400 transition-colors disabled:opacity-50"
            />
            <button type="submit" disabled={!username || !input.trim()} className="absolute right-2 top-2 p-1.5 bg-cyan-500 rounded-lg text-black hover:bg-cyan-400 transition-colors disabled:opacity-50">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
