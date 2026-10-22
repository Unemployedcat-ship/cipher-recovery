'use client';
import { Wallet, ShieldCheck } from 'lucide-react';

export default function VaultPage() {
  return (
    <div className="p-4 md:p-8 font-mono text-zinc-300 w-full max-w-7xl mx-auto overflow-x-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><ShieldCheck className="text-[#00FF41]"/> SECURE VAULT</h1>
        <p className="text-sm text-zinc-500">Manage your active bids and portfolio positions.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border border-zinc-800 bg-[#09090B] rounded-lg p-4">
          <div className="text-[10px] text-zinc-500">AVAILABLE BALANCE</div><div className="text-2xl font-bold text-white mt-1">0.000 SOL</div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] rounded-lg p-4">
          <div className="text-[10px] text-zinc-500">TOTAL INVESTED</div><div className="text-2xl font-bold text-white mt-1">0.00 SOL</div>
        </div>
        <div className="border border-zinc-800 bg-[#09090B] rounded-lg p-4">
          <div className="text-[10px] text-zinc-500">EST. PORTFOLIO VALUE</div><div className="text-2xl font-bold text-[#00FF41] mt-1">$0.00</div>
        </div>
      </div>
      <div className="border border-zinc-800 bg-[#09090B] rounded-lg overflow-hidden">
        <div className="flex border-b border-zinc-800 text-xs text-zinc-500 overflow-x-auto">
          <button className="px-6 py-3 border-b-2 border-[#00FF41] text-white font-bold flex items-center gap-2 whitespace-nowrap"><Wallet size={14}/> MY LAUNCHES (0)</button>
          <button className="px-6 py-3 hover:text-white transition-colors whitespace-nowrap">MY POSITIONS (0)</button>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm min-w-[500px]">
            <thead className="text-[10px] text-zinc-600 border-b border-zinc-800 bg-[#111116]">
              <tr>
                <th className="px-6 py-3 font-normal">TOKEN</th><th className="px-6 py-3 font-normal">BALANCE</th>
                <th className="px-6 py-3 font-normal">VALUE</th><th className="px-6 py-3 font-normal">STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-zinc-800 text-center flex items-center justify-center text-xs text-zinc-500">?</div>
                  <span className="text-zinc-500 italic whitespace-nowrap">No tokens launched yet</span>
                </td>
                <td className="px-6 py-4 text-zinc-600">-</td><td className="px-6 py-4 text-zinc-600">-</td><td className="px-6 py-4 text-zinc-600">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}