export function TickerTape() {
  return (
    <div style={{ backgroundColor: '#050505', borderBottom: '1px solid #222228', padding: '6px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#a1a1aa', fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        <span>24H VOL: <span style={{ color: '#00FF41' }}>$0</span></span>
        <span>LIQUIDITY: <span style={{ color: '#00FF41' }}>$0</span></span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ height: '6px', width: '6px', backgroundColor: '#00FF41', borderRadius: '50%', display: 'inline-block' }}></span>
        SOLANA MAINNET
      </div>
    </div>
  );
}
