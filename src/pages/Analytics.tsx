import React, { useState, useMemo } from 'react';
import { BarChart2, TrendingUp, TrendingDown,  Target } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Stock, MarketIndex } from '@/types';
import { MOCK_SECTORS } from '@/utils/mockData';
import { generateOHLCVData } from '@/utils/mockData';
import { fmt } from '@/utils/formatters';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import AreaChart from '@/components/charts/AreaChart';
import GaugeChart from '@/components/charts/GaugeChart';
import HeatmapChart from '@/components/charts/HeatmapChart';
import { generatePortfolioHistory } from '@/utils/chartData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell,
} from 'recharts';

interface AnalyticsProps {
  stocks: Stock[];
  indices: MarketIndex[];
}

const Analytics: React.FC<AnalyticsProps> = ({ stocks, indices }) => {
  
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const accentColor = '#00c896';
  const muted = 'rgba(176,184,204,0.5)';

  const ohlcvData = useMemo(() => generateOHLCVData(selectedStock), [selectedStock]);

  // Build price history from OHLCV
  const priceHistory = useMemo(() =>
    ohlcvData.map((d) => ({
      date: new Date(d.time).toISOString().split('T')[0],
      value: Math.round(d.close * 100) / 100,
    })),
    [ohlcvData],
  );

  // RSI data (mock)
  const rsiData = useMemo(() =>
    priceHistory.slice(-30).map((d, i) => ({
      date: d.date,
      rsi: 40 + Math.sin(i * 0.4) * 20 + Math.random() * 5,
    })),
    [priceHistory],
  );

  // Scatter: Risk vs Return
  const riskReturnData = useMemo(() =>
    stocks.map((s) => ({
      name: s.symbol,
      risk: s.beta * 15,
      return: s.changePercent,
      vol: s.volume / s.avgVolume,
      color: s.changePercent >= 0 ? accentColor : '#ff4d4d',
    })),
    [stocks, accentColor],
  );

  // Volume bar data
  const volumeData = useMemo(() =>
    [...stocks]
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 8)
      .map((s) => ({
        name: s.symbol,
        volume: Math.round(s.volume / 1e6),
        avg: Math.round(s.avgVolume / 1e6),
        color: s.volume > s.avgVolume ? accentColor : 'rgba(255, 255, 255, 0.2)',
      })),
    [stocks, accentColor],
  );

  const selectedStockData = stocks.find((s) => s.symbol === selectedStock);

  return (
    <div className="p-4 space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans font-semibold" style={{ fontSize: '20px', letterSpacing: '-0.02em', color: '#fff' }}>
            Analytics Suite
          </h1>
          <p className="font-mono mt-0.5" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)' }}>
            QUANTITATIVE ANALYSIS · MULTI-FACTOR MODELING
          </p>
        </div>
        {/* Stock selector */}
        <div className="flex items-center gap-1.5 border px-2 py-1" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <BarChart2 size={10} style={{ color: '#00c896' }} />
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="font-mono bg-transparent outline-none cursor-pointer"
            style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.8)' }}
          >
            {stocks.map((s) => (
              <option key={s.symbol} value={s.symbol}>{s.symbol}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI gauges row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card  >
          <GaugeChart
            value={selectedStockData?.rsi ?? 50}
            label="RSI"
            sublabel={
              (selectedStockData?.rsi ?? 50) >= 70
                ? 'OVERBOUGHT'
                : (selectedStockData?.rsi ?? 50) <= 30
                  ? 'OVERSOLD'
                  : 'NEUTRAL'
            }
            thresholds={[
              { value: 30, color: '#e040fb' },
              { value: 50, color: '#ffd60a' },
              { value: 70, color: 'rgba(255, 255, 255, 0.2)' },
              { value: 100, color: '#ff4d4d' },
            ]}
          />
        </Card>
        <Card  >
          <GaugeChart
            value={selectedStockData?.score ?? 50}
            label="AI Score"
            sublabel={
              (selectedStockData?.score ?? 50) >= 70
                ? 'BULLISH'
                : (selectedStockData?.score ?? 50) >= 40
                  ? 'NEUTRAL'
                  : 'BEARISH'
            }
            thresholds={[
              { value: 40, color: '#ff4d4d' },
              { value: 60, color: '#ffd60a' },
              { value: 80, color: '#e040fb' },
              { value: 100, color: '#00c896' },
            ]}
          />
        </Card>
        <Card  >
          <GaugeChart
            value={62}
            label="Fear & Greed"
            sublabel="GREED ZONE"
          />
        </Card>
        <Card  >
          <GaugeChart
            value={16.84}
            label="VIX Index"
            sublabel="LOW VOLATILITY"
            thresholds={[
              { value: 20, color: '#00c896' },
              { value: 30, color: '#ffd60a' },
              { value: 50, color: 'rgba(255, 255, 255, 0.2)' },
              { value: 100, color: '#ff4d4d' },
            ]}
          />
        </Card>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-3">
        {/* Price Chart */}
        <Card
          className="col-span-12 lg:col-span-8"
          title={`${selectedStock} PRICE ACTION`}
          subtitle="90-day close price history"
          
          noPadding
        >
          <div className="p-3 pt-2">
            {selectedStockData && (
              <div className="flex items-center gap-4 mb-2 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-1" style={{ background: accentColor }} />
                  <div>
                    <div className="font-mono font-bold" style={{ color: accentColor, fontSize: '11px' }}>
                      {fmt.currency(selectedStockData.price)}
                    </div>
<div className="font-mono" style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '9px' }}>
              {selectedStock} · {fmt.percent(selectedStockData.changePercent)} today
            </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {[
                    { label: 'SMA20', value: selectedStockData.sma20 },
                    { label: 'SMA50', value: selectedStockData.sma50 },
                    { label: 'SMA200', value: selectedStockData.sma200 },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col">
                      <span style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.45)' }} className="font-mono">{label}</span>
                      <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }} className="font-mono font-bold">{fmt.currency(value)}</span>
                    </div>
                  ))}
                  <div className="flex flex-col">
                    <span style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.45)' }} className="font-mono">ATR</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }} className="font-mono font-bold">{selectedStockData.atr.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
            <AreaChart data={priceHistory} height={200} />
          </div>
        </Card>

        {/* Technical Summary */}
        <Card className="col-span-12 lg:col-span-4" title="TECHNICAL SUMMARY">
          {selectedStockData && (
            <div className="space-y-2">
              {[
                { label: 'Signal', value: <Badge variant={selectedStockData.signal === 'STRONG_BUY' ? 'strong-buy' : selectedStockData.signal === 'BUY' ? 'buy' : selectedStockData.signal === 'SELL' ? 'sell' : selectedStockData.signal === 'STRONG_SELL' ? 'strong-sell' : 'hold'}>{fmt.signal(selectedStockData.signal)}</Badge> },
                { label: 'RSI (14)', value: selectedStockData.rsi.toFixed(1), warn: selectedStockData.rsi > 70 || selectedStockData.rsi < 30 },
                { label: 'MACD', value: selectedStockData.macd.toFixed(2), isPos: selectedStockData.macd >= 0 },
                { label: 'MACD Signal', value: selectedStockData.macdSignal.toFixed(2), isPos: selectedStockData.macdSignal >= 0 },
                { label: 'BB Upper', value: fmt.currency(selectedStockData.bollingerUpper) },
                { label: 'BB Lower', value: fmt.currency(selectedStockData.bollingerLower) },
                { label: '52W High', value: fmt.currency(selectedStockData.high52) },
                { label: '52W Low', value: fmt.currency(selectedStockData.low52) },
                { label: 'Beta', value: selectedStockData.beta.toFixed(2), warn: selectedStockData.beta > 2 },
                { label: 'AI Score', value: `${selectedStockData.score}/100`, isPos: selectedStockData.score >= 60 },
              ].map(({ label, value, warn, isPos }) => (
                <div key={label} className="flex items-center justify-between py-1 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}>
                  <span className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.45)' }}>{label}</span>
                  {typeof value === 'string' ? (
                    <span className="font-mono text-xs font-bold" style={{
                      color: warn ? 'rgba(255, 255, 255, 0.4)' :
                        isPos === true ? '#00c896' :
                        isPos === false ? '#ff4d4d' :
                        '#fff'
                    }}>{value}</span>
                  ) : value}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Sector Heatmap */}
        <Card
          className="col-span-12 lg:col-span-6"
          title="SECTOR HEATMAP"
          subtitle="% change today | size = market cap"
          
          noPadding
        >
          <div className="p-3" style={{ height: '200px' }}>
            <HeatmapChart sectors={MOCK_SECTORS} />
          </div>
        </Card>

        {/* Volume Analysis */}
        <Card
          className="col-span-12 lg:col-span-6"
          title="VOLUME LEADERS"
          subtitle="Current vs average volume (M shares)"
          
          noPadding
        >
          <div className="p-3">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={volumeData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" stroke="rgba(0, 200, 150, 0.08)" horizontal vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: muted, fontSize: 9, fontFamily: 'JetBrains Mono' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: muted, fontSize: 9, fontFamily: 'JetBrains Mono' }}
                  tickFormatter={(v) => `${v}M`}
                />
<Tooltip
                  formatter={(v: number) => [`${v}M`, '']}
                  contentStyle={{
                    background: '#13131f',
                    border: '1px solid rgba(0, 200, 150, 0.2)',
                    fontFamily: 'Space Mono',
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                />
                <Bar dataKey="avg" fill="#111119" radius={0} name="Avg" />
                <Bar dataKey="volume" radius={0} name="Current">
                  {volumeData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Risk/Return Scatter */}
        <Card
          className="col-span-12 lg:col-span-7"
          title="RISK VS RETURN"
          subtitle="Beta (risk) vs daily % change (return)"
          
          noPadding
        >
          <div className="p-3">
            <ResponsiveContainer width="100%" height={220}>
              <ScatterChart margin={{ top: 4, right: 24, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" stroke="rgba(0, 200, 150, 0.08)" />
                <XAxis
                  dataKey="risk"
                  name="Beta × 15"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: muted, fontSize: 9, fontFamily: 'JetBrains Mono' }}
                  label={{ value: 'Risk (Beta)', fill: muted, fontSize: 9, position: 'insideBottom', offset: -2 }}
                />
                <YAxis
                  dataKey="return"
                  name="Return"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: muted, fontSize: 9, fontFamily: 'JetBrains Mono' }}
                  tickFormatter={(v) => `${v.toFixed(1)}%`}
                />
                <ZAxis dataKey="vol" range={[30, 120]} />
<Tooltip
                  cursor={{ strokeDasharray: '3 3', stroke: 'rgba(0, 200, 150, 0.2)' }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = riskReturnData[payload[0].payload?.index as number] || (payload[0].payload as typeof riskReturnData[0]);
                    return (
                      <div style={{
                        fontSize: '12px',
                        padding: '8px',
                        border: '1px solid rgba(0, 200, 150, 0.2)',
                        background: '#13131f',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontFamily: 'Space Mono',
                      }} className="font-mono">
                        <div className="font-bold">{d.name}</div>
                        <div>Return: {fmt.percent(d.return)}</div>
                      </div>
                    );
                  }}
                />
                <Scatter data={riskReturnData} name="Stocks">
                  {riskReturnData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} fillOpacity={0.7} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Index Performance */}
        <Card
          className="col-span-12 lg:col-span-5"
          title="INDEX PERFORMANCE"
          subtitle="Major market indices"
          
          noPadding
        >
          <div className="overflow-y-auto" style={{ maxHeight: '265px' }}>
            {indices.map((idx) => (
              <div
                key={idx.symbol}
                className="flex items-center justify-between px-3 py-3 border-b transition-colors"
                style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '')}
              >
                <div>
                  <div className="font-mono font-bold" style={{ fontSize: '12px', color: '#fff' }}>{idx.symbol}</div>
                  <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.45)' }} className="font-mono">{idx.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold" style={{ fontSize: '12px', color: '#fff' }}>
                    {idx.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="font-mono font-bold flex items-center justify-end gap-1" style={{ fontSize: '12px', color: idx.changePercent >= 0 ? '#00c896' : '#ff4d4d' }}>
                    {idx.changePercent >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                    {fmt.percent(idx.changePercent)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
