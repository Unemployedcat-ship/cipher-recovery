'use client';

import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  ColorType,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts';

export default function TradingChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { 
        background: { type: ColorType.Solid, color: 'transparent' }, 
        textColor: '#94a3b8',
        fontFamily: 'monospace',
      },
      grid: {
        vertLines: { color: 'rgba(148, 163, 184, 0.08)' },
        horzLines: { color: 'rgba(148, 163, 184, 0.08)' },
      },
      rightPriceScale: { 
        borderColor: 'rgba(148, 163, 184, 0.2)',
        scaleMargins: { top: 0.1, bottom: 0.2 },
      },
      timeScale: { 
        borderColor: 'rgba(148, 163, 184, 0.2)', 
        timeVisible: true, 
        secondsVisible: true, // Show seconds for high-frequency feel
        rightOffset: 5, 
        shiftVisibleRangeOnNewBar: false, // REMOVED AUTO-SCROLL
      },
      autoSize: true,
      crosshair: {
        horzLine: { visible: true, labelVisible: true, color: '#00FF41' },
        vertLine: { visible: true, labelVisible: true, color: '#00FF41' },
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00FF41', downColor: '#ef4444',
      borderUpColor: '#00FF41', borderDownColor: '#ef4444',
      wickUpColor: '#00FF41', wickDownColor: '#ef4444',
      priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
    });
    candlestickSeriesRef.current = candlestickSeries;

    const lineSeries = chart.addSeries(LineSeries, { 
      color: '#00FF41', 
      lineWidth: 2,
      priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
    });
    lineSeriesRef.current = lineSeries;
    lineSeries.applyOptions({ visible: false });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' }, 
      priceScaleId: 'volume', 
    });
    volumeSeriesRef.current = volumeSeries;
    chart.priceScale('volume').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });

    const initialData = generateMockOHLCV(100);
    
    candlestickSeries.setData(initialData);
    lineSeries.setData(initialData.map(d => ({ time: d.time, value: d.close })));
    volumeSeries.setData(initialData.map(d => ({ 
      time: d.time, 
      value: d.volume, 
      color: d.close >= d.open ? 'rgba(0, 255, 65, 0.4)' : 'rgba(239, 68, 68, 0.4)' 
    })));

    // FRAME THE CURRENT PRICE PERFECTLY ON LOAD
    const totalBars = initialData.length;
    chart.timeScale().setVisibleLogicalRange({
      from: totalBars - 50, // Show last 50 candles
      to: totalBars + 5,    // Leave a little space on the right
    });

    let lastCandle = { ...initialData[initialData.length - 1] };
    let tickCount = 0;

    // FAST LIVE DATA (500ms)
    const interval = setInterval(() => {
      tickCount++;
      
      // Small price fluctuation
      const move = (Math.random() - 0.49) * 0.8; 
      const newClose = lastCandle.close + move;
      
      // Update current candle's high, low, and close
      lastCandle.high = Math.max(lastCandle.high, newClose);
      lastCandle.low = Math.min(lastCandle.low, newClose);
      lastCandle.close = newClose;
      lastCandle.volume += Math.floor(Math.random() * 50);

      candlestickSeries.update(lastCandle);
      lineSeries.update({ time: lastCandle.time, value: lastCandle.close });
      volumeSeries.update({
        time: lastCandle.time, 
        value: lastCandle.volume,
        color: lastCandle.close >= lastCandle.open ? 'rgba(0, 255, 65, 0.4)' : 'rgba(239, 68, 68, 0.4)',
      });

      // Every 10 ticks (5 seconds), create a NEW candle
      if (tickCount % 10 === 0) {
        lastCandle = {
          time: (lastCandle.time as number) + 60,
          open: lastCandle.close,
          high: lastCandle.close,
          low: lastCandle.close,
          close: lastCandle.close,
          volume: 0,
        };
      }

    }, 500); // 500ms interval

    return () => { clearInterval(interval); chart.remove(); };
  }, []);

  useEffect(() => {
    if (!candlestickSeriesRef.current || !lineSeriesRef.current) return;
    if (chartType === 'candlestick') {
      candlestickSeriesRef.current.applyOptions({ visible: true });
      lineSeriesRef.current.applyOptions({ visible: false });
    } else {
      candlestickSeriesRef.current.applyOptions({ visible: false });
      lineSeriesRef.current.applyOptions({ visible: true });
    }
  }, [chartType]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-end gap-2 mb-2 z-10">
        <button onClick={() => setChartType('candlestick')} className={`px-3 py-1 text-[10px] font-bold rounded-sm transition-colors ${chartType === 'candlestick' ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/30' : 'text-zinc-500 hover:text-white'}`}>CANDLES</button>
        <button onClick={() => setChartType('line')} className={`px-3 py-1 text-[10px] font-bold rounded-sm transition-colors ${chartType === 'line' ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/30' : 'text-zinc-500 hover:text-white'}`}>LINE</button>
      </div>
      <div ref={chartContainerRef} className="flex-1 w-full min-h-[300px]" />
    </div>
  );
}

function generateMockOHLCV(count: number) {
  const data = [];
  let price = 125.00;
  for (let i = 0; i < count; i++) {
    const open = price;
    // Smoother initial data generation
    const move = (Math.random() - 0.5) * 1.5; 
    const close = open + move;
    const high = Math.max(open, close) + Math.random() * 0.8;
    const low = Math.min(open, close) - Math.random() * 0.8;
    const volume = Math.floor(Math.random() * 500) + 100;
    
    data.push({ 
      time: (Math.floor(Date.now() / 1000) - (count - i) * 60) as UTCTimestamp, 
      open, high, low, close, volume 
    });
    price = close;
  }
  return data;
}
