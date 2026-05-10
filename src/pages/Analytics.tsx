import React, { useState, useMemo } from 'react';
import { BarChart2, TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const accentColor = isDark ? '#00ff41' : '#0a84ff';
  const muted = isDark ? 'rgba(176,184,204,0.5)' : '#9ca3af';

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
      color: s.changePercent >= 0 ? accentColor : '#ff3b30',
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
        color: s.volume > s.avgVolume ? accentColor : '#ff9f0a',
      })),
    [stocks, accentColor],
  );

  const selectedStockData = stocks.find((s) => s.symbol === selectedStock);

  return (
    <div className={`p-4 space-y-4 ${isDark ? 'text-steel-200' : 'text-lm-text'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`font-display text-lg font-bold ${isDark ? 'text-steel-50' : 'text-lm-text'}`}>
            Analytics Suite
          </h1>
          <p className={`font-mono mt-0.5 ${isDark ? 'text-steel-500' : 'text-lm-muted'}`} style={{ fontSize: '10px' }}>
            QUANTITATIVE ANALYSIS · MULTI-FACTOR MODELING
          </p>
        </div>
        {/* Stock selector */}
        <div className={`flex items-center gap-1.5 border px-2 py-1 ${isDark ? 'border-steel-700/50' : 'border-lm-border'}`}>
          <BarChart2 size={10} className={isDark ? 'text-acid-500' : 'text-signal-blue'} />
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className={`font-mono bg-transparent outline-none cursor-pointer ${isDark ? 'text-steel-200' : 'text-lm-text'}`}
            style={{ fontSize: '10px' }}
          >
            {stocks.map((s) => (
              <option key={s.symbol} value={s.symbol}>{s.symbol}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI gauges row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card accent glowOnHover>
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
              { value: 30, color: '#0a84ff' },
              { value: 50, color: '#ffd60a' },
              { value: 70, color: '#ff9f0a' },
              { value: 100, color: '#ff3b30' },
            ]}
          />
        </Card>
        <Card accent glowOnHover>
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
              { value: 40, color: '#ff3b30' },
              { value: 60, color: '#ffd60a' },
              { value: 80, color: '#0a84ff' },
              { value: 100, color: '#00ff41' },
            ]}
          />
        </Card>
        <Card accent glowOnHover>
          <GaugeChart
            value={62}
            label="Fear & Greed"
            sublabel="GREED ZONE"
          />
        </Card>
        <Card accent glowOnHover>
          <GaugeChart
            value={16.84}
            label="VIX Index"
            sublabel="LOW VOLATILITY"
            thresholds={[
              { value: 20, color: '#00ff41' },
              { value: 30, color: '#ffd60a' },
              { value: 50, color: '#ff9f0a' },
              { value: 100, color: '#ff3b30' },
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
          accent
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
                    <div className={`font-mono ${isDark ? 'text-steel-500' : 'text-lm-muted'}`} style={{ fontSize: '9px' }}>
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
                      <span className={`font-mono ${isDark ? 'text-steel-500' : 'text-lm-muted'}`} style={{ fontSize: '9px' }}>{label}</span>
                      <span className={`font-mono font-bold text-xs ${isDark ? 'text-steel-300' : 'text-lm-text'}`}>{fmt.currency(value)}</span>
                    </div>
                  ))}
                  <div className="flex flex-col">
                    <span className={`font-mono ${isDark ? 'text-steel-500' : 'text-lm-muted'}`} style={{ fontSize: '9px' }}>ATR</span>
                    <span className={`font-mono font-bold text-xs ${isDark ? 'text-steel-300' : 'text-lm-text'}`}>{selectedStockData.atr.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
            <AreaChart data={priceHistory} height={200} />
          </div>
        </Card>

        {/* Technical Summary */}
        <Card className="col-span-12 lg:col-span-4" title="TECHNICAL SUMMARY" accent>
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
                <div key={label} className={`flex items-center justify-between py-1 border-b ${isDark ? 'border-acid-500/5' : 'border-lm-border'}`}>
                  <span className={`font-mono text-xs ${isDark ? 'text-steel-400' : 'text-lm-muted'}`}>{label}</span>
                  {typeof value === 'string' ? (
                    <span className={`font-mono text-xs font-bold ${
                      warn ? 'text-signal-yellow' :
                      isPos === true ? (isDark ? 'text-acid-500' : 'text-emerald-600') :
                      isPos === false ? 'text-signal-red' :
                      isDark ? 'text-steel-100' : 'text-lm-text'
                    }`}>{value}</span>
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
          accent
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
          accent
          noPadding
        >
          <div className="p-3">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={volumeData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" stroke={isDark ? 'rgba(0,255,65,0.05)' : 'rgba(0,0,0,0.05)'} horizontal vertical={false} />
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
                    background: isDark ? '#0d0d1a' : '#fff',
                    border: isDark ? '1px solid rgba(0,255,65,0.2)' : '1px solid #e5e7eb',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '11px',
                    color: isDark ? '#b0b8cc' : '#374151',
                  }}
                />
                <Bar dataKey="avg" fill={isDark ? '#242840' : '#e5e7eb'} radius={0} name="Avg" />
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
          accent
          noPadding
        >
          <div className="p-3">
            <ResponsiveContainer width="100%" height={220}>
              <ScatterChart margin={{ top: 4, right: 24, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" stroke={isDark ? 'rgba(0,255,65,0.05)' : 'rgba(0,0,0,0.05)'} />
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
                  cursor={{ strokeDasharray: '3 3', stroke: isDark ? 'rgba(0,255,65,0.2)' : 'rgba(0,0,0,0.1)' }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = riskReturnData[payload[0].payload?.index as number] || (payload[0].payload as typeof riskReturnData[0]);
                    return (
                      <div className={`font-mono text-xs p-2 border ${isDark ? 'bg-void-800 border-acid-500/20 text-steel-200' : 'bg-white border-lm-border text-lm-text shadow-md'}`}>
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
          accent
          noPadding
        >
          <div className="overflow-y-auto" style={{ maxHeight: '265px' }}>
            {indices.map((idx) => (
              <div
                key={idx.symbol}
                className={`flex items-center justify-between px-3 py-3 border-b transition-colors ${isDark ? 'border-acid-500/5 hover:bg-acid-500/4' : 'border-lm-border hover:bg-lm-bg'}`}
              >
                <div>
                  <div className={`font-mono text-xs font-bold ${isDark ? 'text-steel-100' : 'text-lm-text'}`}>{idx.symbol}</div>
                  <div className={`font-mono ${isDark ? 'text-steel-500' : 'text-lm-muted'}`} style={{ fontSize: '9px' }}>{idx.name}</div>
                </div>
                <div className="text-right">
                  <div className={`font-mono text-xs font-bold ${isDark ? 'text-steel-100' : 'text-lm-text'}`}>
                    {idx.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className={`font-mono text-xs font-bold flex items-center justify-end gap-1 ${idx.changePercent >= 0 ? (isDark ? 'text-acid-500' : 'text-emerald-600') : 'text-signal-red'}`}>
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
