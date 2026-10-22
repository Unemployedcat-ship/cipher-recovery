'use client';

import { useEffect, useRef } from 'react';
import { createChart, AreaSeries, ColorType, type IChartApi, type UTCTimestamp } from 'lightweight-charts';

export default function PortfolioChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { 
        background: { type: ColorType.Solid, color: 'transparent' }, 
        textColor: '#71717a',
        fontFamily: 'monospace',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: 'rgba(148, 163, 184, 0.05)' },
      },
      rightPriceScale: { 
        borderVisible: false,
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: { 
        borderVisible: false, 
        timeVisible: true,
      },
      autoSize: true,
      crosshair: {
        horzLine: { visible: true, labelVisible: true, color: '#00FF41' },
        vertLine: { visible: true, labelVisible: true, color: '#00FF41' },
      },
    });

    chartRef.current = chart;

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#00FF41',
      topColor: 'rgba(0, 255, 65, 0.2)',
      bottomColor: 'rgba(0, 255, 65, 0)',
      lineWidth: 2,
      priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
    });

    const data = [];
    let value = 1000.00;
    for (let i = 0; i < 30; i++) {
      // Smoother upward trend with slight pullbacks
      value += (Math.random() - 0.35) * 40;
      data.push({ 
        time: (Math.floor(Date.now() / 1000) - (30 - i) * 86400) as UTCTimestamp, 
        value: Math.max(value, 1000) 
      });
    }
    
    areaSeries.setData(data);
    chart.timeScale().fitContent();

    return () => { chart.remove(); };
  }, []);

  return <div ref={chartContainerRef} className="w-full h-full min-h-[250px]" />;
}
