'use client';
export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="font-mono text-3xl font-bold text-white mb-8">DATA PRIVACY POLICY</h1>
      <div className="card p-8 font-mono text-sm text-[var(--text-secondary)] space-y-6 leading-relaxed">
        <div>
          <h2 className="text-white font-bold mb-2 uppercase">1. Data Sovereignty</h2>
          <p>Cipher Terminal operates on the principles of data minimization. We utilize Privy for decentralized authentication. Your private keys never touch our servers.</p>
        </div>
        <div>
          <h2 className="text-white font-bold mb-2 uppercase">2. On-Chain Transparency</h2>
          <p>Any action you take within the Dark Pool (bidding, launching) is recorded on the public blockchain. This data is immutable and publicly verifiable by anyone.</p>
        </div>
        <div>
          <h2 className="text-white font-bold mb-2 uppercase">3. Analytics & Telemetry</h2>
          <p>We collect anonymized telemetry to monitor platform health and prevent malicious activity (e.g., bot spam). We do not sell this data to third parties.</p>
        </div>
        <div>
          <h2 className="text-white font-bold mb-2 uppercase">4. Contact</h2>
          <p>For data deletion requests or privacy concerns, reach out to the Founder on X at <a href="https://x.com/JoblessCat_SOI" className="text-[var(--accent-cyan)] hover:underline">@JoblessCat_SOI</a>.</p>
        </div>
      </div>
    </div>
  );
}
