'use client';

import { Hashvatar } from 'hashvatar/react';

interface OperatorAvatarProps {
  seed?: string;
  size?: number;
  className?: string;
}

export function OperatorAvatar({ seed, size = 40, className = '' }: OperatorAvatarProps) {
  // Fallback if no seed is set yet
  if (!seed) {
    return (
      <div className={`bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[10px] text-[var(--text-muted)] font-mono ${className}`}>
        ?
      </div>
    );
  }

  // If it's an old image URL (like the 3D emojis), render an img tag
  if (seed.startsWith('http')) {
    return <img src={seed} alt="Avatar" className={className} />;
  }

  // Otherwise, render the generative Hashvatar
  return (
    <div className={`overflow-hidden flex items-center justify-center bg-black ${className}`}>
      <Hashvatar
        hash={seed}
        size={size}
        mode={seed.includes('dither') ? 'dither' : 'gradient'}
        tones={['#00E5FF', '#FFB800', '#C084FC', '#00FF94']}
      />
    </div>
  );
}
