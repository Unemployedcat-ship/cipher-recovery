'use client';
export default function LegalPage() {
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="font-mono text-3xl font-bold text-white mb-8">COMPLIANCE & TERMS</h1>
      <div className="card p-8 font-mono text-sm text-[var(--text-secondary)] space-y-6 leading-relaxed">
        <div>
          <h2 className="text-white font-bold mb-2 uppercase">1. High-Risk Protocol</h2>
          <p>Trading memecoins and participating in FHE-sealed auctions involves extreme financial risk. Tokens can and will go to zero. You are solely responsible for your capital.</p>
        </div>
        <div>
          <h2 className="text-white font-bold mb-2 uppercase">2. No Financial Advice</h2>
          <p>Nothing on this platform constitutes financial, legal, or tax advice. The Unemployed Cat is an anonymous builder, not a registered broker-dealer.</p>
        </div>
        <div>
          <h2 className="text-white font-bold mb-2 uppercase">3. Smart Contract Risk</h2>
          <p>While our Dark Pools are designed to prevent sniping and rug pulls, you acknowledge that interacting with smart contracts carries inherent technical risks, including bugs and exploits.</p>
        </div>
        <div>
          <h2 className="text-white font-bold mb-2 uppercase">4. Prohibited Conduct</h2>
          <p>You agree not to use Cipher Terminal to launder money, evade sanctions, or engage in market manipulation. Violators will be blacklisted from the Syndicate.</p>
        </div>
      </div>
    </div>
  );
}
