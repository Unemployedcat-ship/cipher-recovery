'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors mb-6 group"
    >
      <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
      RETURN TO PREVIOUS SECTOR
    </button>
  );
}
