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
        secondsVisible: false,
        rightOffset: 5, // Leave space on the right
        shiftVisibleRangeOnNewBar: true, // Auto-shift on new data
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

    chart.timeScale().fitContent();

    // Simulate live data
    const interval = setInterval(() => {
      const lastCandle = initialData[initialData.length - 1];
      // Smoother price movement
      const move = (Math.random() - 0.45) * 1.5; 
      const newCandle = {
        time: (lastCandle.time as number) + 60,
        open: lastCandle.close,
        high: lastCandle.close + Math.random() * 1.2,
        low: lastCandle.close - Math.random() * 1.2,
        close: lastCandle.close + move,
        volume: Math.floor(Math.random() * 500) + 100,
      };
      initialData.push(newCandle);

      candlestickSeries.update(newCandle);
      lineSeries.update({ time: newCandle.time, value: newCandle.close });
      volumeSeries.update({
        time: newCandle.time, 
        value: newCandle.volume,
        color: newCandle.close >= newCandle.open ? 'rgba(0, 255, 65, 0.4)' : 'rgba(239, 68, 68, 0.4)',
      });

      // AUTO-FOLLOW THE NEWEST CANDLE
      chart.timeScale().scrollToRealTime();
    }, 2000);

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
    // Smaller, smoother moves
    const move = (Math.random() - 0.5) * 2; 
    const close = open + move;
    const high = Math.max(open, close) + Math.random() * 1;
    const low = Math.min(open, close) - Math.random() * 1;
    const volume = Math.floor(Math.random() * 500) + 100;
    
    data.push({ 
      time: (Math.floor(Date.now() / 1000) - (count - i) * 60) as UTCTimestamp, 
      open, high, low, close, volume 
    });
    price = close;
  }
  return data;
}
