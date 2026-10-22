export function TickerTape() {
  return (
    <div className="bg-[#050505] border-b border-zinc-800 px-6 py-1.5 flex justify-between items-center text-[11px] text-zinc-400 font-mono">
      <div className="flex gap-6">
        <span>24H VOL: <span className="text-[#00FF41]">$0</span></span>
        <span>LIQUIDITY: <span className="text-[#00FF41]">$0</span></span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 bg-[#00FF41] rounded-full"></span>
        SOLANA MAINNET
      </div>
    </div>
  );
}
