'use client';

import Avatar from 'boring-avatars';

interface ClanAvatarProps {
  seed?: string | null;
  size?: number;
  className?: string;
}

export function ClanAvatar({ seed, size = 64, className = '' }: ClanAvatarProps) {
  // Fallback if no seed
  if (!seed) {
    return (
      <div className={`bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center ${className}`}>
         <span className="font-mono text-xs text-[var(--text-muted)]">?</span>
      </div>
    );
  }

  // NEW: If it's an uploaded image URL, render an img tag
  if (seed.startsWith('http')) {
    return <img src={seed} alt="Clan Crest" className={`${className} object-cover`} />;
  }

  // Otherwise, render the generative Bauhaus avatar
  return (
    <div className={`overflow-hidden ${className}`}>
      <Avatar
        size={size}
        name={seed}
        variant="bauhaus"
        colors={['#00E5FF', '#FFB800', '#C084FC', '#00FF94', '#FF4060']}
      />
    </div>
  );
}
