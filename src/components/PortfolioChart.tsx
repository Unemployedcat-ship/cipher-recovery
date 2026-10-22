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
        textColor: '#94a3b8',
        fontFamily: 'monospace',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: 'rgba(148, 163, 184, 0.08)' },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, timeVisible: true },
      autoSize: true,
      crosshair: {
        horzLine: { visible: true, labelVisible: true, color: '#00FF41' },
        vertLine: { visible: true, labelVisible: true, color: '#00FF41' },
      },
    });

    chartRef.current = chart;

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#00FF41',
      topColor: 'rgba(0, 255, 65, 0.3)',
      bottomColor: 'rgba(0, 255, 65, 0)',
      lineWidth: 2,
      priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
    });

    // Generate mock portfolio data
    const data = [];
    let value = 1000.00;
    for (let i = 0; i < 50; i++) {
      value += (Math.random() - 0.4) * 100;
      data.push({ 
        time: (Math.floor(Date.now() / 1000) - (50 - i) * 86400) as UTCTimestamp, 
        value: Math.max(value, 100) 
      });
    }
    
    areaSeries.setData(data);
    chart.timeScale().fitContent();

    return () => { chart.remove(); };
  }, []);

  return <div ref={chartContainerRef} className="w-full h-full min-h-[250px]" />;
}
