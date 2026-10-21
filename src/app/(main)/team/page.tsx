'use client';

export default function TeamPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      <header className="text-center mb-16">
        <h1 className="font-mono text-4xl font-bold text-white tracking-widest mb-4">THE SYNDICATE</h1>
        <p className="font-mono text-[var(--text-secondary)] max-w-2xl mx-auto">
          Cipher Terminal wasn't built in a boardroom. It was built in the trenches of the mempool.
        </p>
      </header>

      <div className="space-y-8">
        {/* The Story Card */}
        <div className="card p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent-cyan)]" />
          <h2 className="font-mono text-2xl font-bold text-white mb-6">THE ORIGIN STORY</h2>
          <div className="font-mono text-sm text-[var(--text-secondary)] space-y-4 leading-relaxed">
            <p>
              It started with a realization: the game was rigged. We watched as snipers and bots drained the life out of every new launch before retail even had a chance to buy. The mempool was a hunting ground, and the everyday trader was the prey.
            </p>
            <p>
              So, the Unemployed Cat—a degen who lost his job but found his purpose—decided to build a better way. A place where the launch is fair, the bids are sealed, and the community actually has a chance to win.
            </p>
            <p>
              We are an anonymous collective of engineers, traders, and cyberpunks. We don't want your real name. We just want a fair shot.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Founder Card */}
          <div className="card p-8 relative overflow-hidden flex flex-col items-center text-center">
            <div className="text-6xl mb-4">🐱</div>
            <h3 className="font-mono text-xl font-bold text-white mb-2">UNEMPLOYED CAT</h3>
            <div className="font-mono text-xs text-[var(--accent-cyan)] tracking-widest border border-[var(--accent-cyan)] px-2 py-1 rounded-full mb-4">FOUNDER</div>
            <p className="font-mono text-sm text-[var(--text-secondary)]">
              The architect of the dark pool. When he's not fighting the SEC, he's posting alpha on X.
            </p>
            <a href="https://x.com/JoblessCat_SOI" target="_blank" rel="noreferrer" className="mt-6 font-mono text-sm text-white hover:text-[var(--accent-cyan)] transition-colors flex items-center gap-2">
              Follow @JoblessCat_SOI &rarr;
            </a>
          </div>

          {/* Community Card */}
          <div className="card p-8 relative overflow-hidden flex flex-col items-center text-center justify-center">
            <div className="text-6xl mb-4">🦍</div>
            <h3 className="font-mono text-xl font-bold text-white mb-2">THE SYNDICATE</h3>
            <div className="font-mono text-xs text-[var(--status-live)] tracking-widest border border-[var(--status-live)] px-2 py-1 rounded-full mb-4">CORE COMMUNITY</div>
            <p className="font-mono text-sm text-[var(--text-secondary)]">
              The traders, builders, and analysts holding the line. We are the immune system of the terminal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
