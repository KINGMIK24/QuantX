import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, ArrowRight, Zap, BarChart2, Clock,
  AlertTriangle, Target, Activity, ChevronRight,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Stock, MarketIndex, NewsItem } from '@/types';
import { MOCK_PORTFOLIO, MOCK_SECTORS } from '@/utils/mockData';
import { generatePortfolioHistory } from '@/utils/chartData';
import { fmt } from '@/utils/formatters';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Sparkline from '@/components/ui/Sparkline';
import AreaChart from '@/components/charts/AreaChart';
import HeatmapChart from '@/components/charts/HeatmapChart';
import GaugeChart from '@/components/charts/GaugeChart';

interface DashboardProps {
  stocks: Stock[];
  indices: MarketIndex[];
  news: NewsItem[];
  portfolio: Stock[];
}

const Dashboard: React.FC<DashboardProps> = ({ stocks, indices, news }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const portfolio = MOCK_PORTFOLIO;
  const [selectedPeriod, setSelectedPeriod] = useState<'1M' | '3M' | '6M' | '1Y'>('6M');

  const portfolioHistory = useMemo(() => {
    const days = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365 }[selectedPeriod];
    return generatePortfolioHistory(days);
  }, [selectedPeriod]);

  const topGainers = useMemo(
    () => [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5),
    [stocks],
  );

  const topLosers = useMemo(
    () => [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5),
    [stocks],
  );

  const mostVolatile = useMemo(
    () => [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 6),
    [stocks],
  );

  const getSignalBadgeVariant = (signal: string) => {
    switch (signal) {
      case 'STRONG_BUY': return 'strong-buy';
      case 'BUY': return 'buy';
      case 'SELL': return 'sell';
      case 'STRONG_SELL': return 'strong-sell';
      default: return 'hold';
    }
  };

  return (
    <div className={`p-4 space-y-4 min-h-full ${isDark ? 'text-steel-200' : 'text-lm-text'}`}>

      {/* ── Header Row ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`font-display text-lg font-bold ${isDark ? 'text-steel-50' : 'text-lm-text'}`}>
            Market Intelligence Dashboard
          </h1>
          <p className={`font-mono mt-0.5 ${isDark ? 'text-steel-500' : 'text-lm-muted'}`} style={{ fontSize: '10px' }}>
            QUANTX_TERMINAL v2.1.0 // {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/terminal"
            className={`flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 border transition-all ${
              isDark ? 'border-acid-500/30 text-acid-500 hover:bg-acid-500/10' : 'border-signal-blue/30 text-signal-blue hover:bg-signal-blue/10'
            }`}
          >
            <Zap size={11} />
            LAUNCH TERMINAL
          </Link>
        </div>
      </div>

      {/* ── KPI Row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: 'PORTFOLIO VALUE',
            value: fmt.currency(portfolio.totalValue),
            sub: `${fmt.percent(portfolio.dayPnLPercent)} today`,
            isPositive: portfolio.dayPnLPercent >= 0,
            icon: Zap,
          },
          {
            label: 'TOTAL P&L',
            value: fmt.currency(portfolio.totalUnrealizedPnL),
            sub: `${fmt.percent(portfolio.totalUnrealizedPnLPercent)} total return`,
            isPositive: portfolio.totalUnrealizedPnL >= 0,
            icon: TrendingUp,
          },
          {
            label: 'SHARPE RATIO',
            value: portfolio.sharpeRatio.toFixed(2),
            sub: `Sortino: ${portfolio.sortinRatio.toFixed(2)}`,
            isPositive: portfolio.sharpeRatio > 1,
            icon: Activity,
          },
          {
            label: 'MAX DRAWDOWN',
            value: fmt.percent(portfolio.maxDrawdown),
            sub: `Volatility: ${portfolio.volatility.toFixed(1)}%`,
            isPositive: false,
            icon: Target,
          },
        ].map(({ label, value, sub, isPositive, icon: Icon }) => (
          <Card key={label} accent glowOnHover>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className={`font-mono text-xs uppercase tracking-widest mb-1 ${isDark ? 'text-acid-500/50' : 'text-signal-blue/60'}`} style={{ fontSize: '9px' }}>
                  {label}
                </div>
                <div className={`font-mono text-xl font-bold leading-tight ${isDark ? 'text-steel-50' : 'text-lm-text'}`}>
                  {value}
                </div>
                <div
                  className={`font-mono mt-1 flex items-center gap-1 ${
                    isPositive ? (isDark ? 'text-acid-500' : 'text-emerald-600') : 'text-signal-red'
                  }`}
                  style={{ fontSize: '10px' }}
                >
                  {isPositive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                  {sub}
                </div>
              </div>
              <div className={`p-1.5 border flex-shrink-0 ${isDark ? 'border-acid-500/15 text-acid-500/40' : 'border-signal-blue/20 text-signal-blue/40'}`}>
                <Icon size={14} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Main Content Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-3">

        {/* Portfolio Performance Chart */}
        <Card
          className="col-span-12 lg:col-span-8"
          title="PORTFOLIO PERFORMANCE"
          subtitle={`vs SPY benchmark | ${selectedPeriod} view`}
          accent
          headerRight={
            <div className="flex items-center gap-1">
              {(['1M', '3M', '6M', '1Y'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className={`font-mono text-xs px-2 py-0.5 transition-all border ${
                    selectedPeriod === p
                      ? isDark ? 'bg-acid-500/15 border-acid-500/40 text-acid-500' : 'bg-signal-blue/15 border-signal-blue/40 text-signal-blue'
                      : isDark ? 'border-steel-700/40 text-steel-500 hover:text-steel-300' : 'border-lm-border text-lm-muted hover:text-lm-text'
                  }`}
                  style={{ fontSize: '9px' }}
                >
                  {p}
                </button>
              ))}
            </div>
          }
          noPadding
        >
          <div className="px-3 pt-2 pb-3">
            {/* Perf summary row */}
            <div className="flex items-center gap-6 mb-3 px-1">
              {[
                { label: 'Portfolio', value: fmt.currency(portfolio.totalValue), change: fmt.percent(portfolio.totalUnrealizedPnLPercent), isPos: true, color: isDark ? '#00ff41' : '#059669' },
                { label: 'SPY (Benchmark)', value: '$432.40', change: '+18.2%', isPos: true, color: '#8890b0' },
                { label: 'Alpha', value: '+' + portfolio.alpha + '%', change: 'annualized', isPos: true, color: isDark ? '#0a84ff' : '#2563eb' },
              ].map(({ label, value, change, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-2 h-1" style={{ background: color }} />
                  <div>
                    <div className="font-mono font-bold" style={{ color, fontSize: '11px' }}>{value}</div>
                    <div className={`font-mono ${isDark ? 'text-steel-500' : 'text-lm-muted'}`} style={{ fontSize: '9px' }}>{label} · {change}</div>
                  </div>
                </div>
              ))}
            </div>
            <AreaChart data={portfolioHistory} height={180} showBenchmark />
          </div>
        </Card>

        {/* Market Gauge Panel */}
        <Card className="col-span-12 lg:col-span-4" title="MARKET SENTIMENT" accent>
          <div className="grid grid-cols-2 gap-4">
            <GaugeChart value={62} label="Fear & Greed" sublabel="GREED ZONE" />
            <GaugeChart value={44} label="VIX Stress" sublabel="MODERATE" thresholds={[{ value: 20, color: '#00ff41' }, { value: 30, color: '#ffd60a' }, { value: 50, color: '#ff9f0a' }, { value: 100, color: '#ff3b30' }]} />
            <GaugeChart value={72} label="Momentum" sublabel="BULLISH" />
            <GaugeChart value={58} label="AI Score" sublabel="ABOVE AVG" thresholds={[{ value: 40, color: '#ff3b30' }, { value: 60, color: '#ffd60a' }, { value: 80, color: '#0a84ff' }, { value: 100, color: '#00ff41' }]} />
          </div>
        </Card>

        {/* Sector Heatmap */}
        <Card className="col-span-12 lg:col-span-7" title="SECTOR HEATMAP" subtitle="% change today | size = market cap weight" accent noPadding>
          <div className="p-3" style={{ height: '220px' }}>
            <HeatmapChart sectors={MOCK_SECTORS} />
          </div>
        </Card>

        {/* Top Gainers / Losers */}
        <Card className="col-span-12 lg:col-span-5" title="MOVERS" subtitle="Top gainers & losers" accent noPadding>
          <div className="grid grid-cols-2 divide-x divide-acid-500/8">
            {/* Gainers */}
            <div>
              <div className={`px-3 py-1.5 border-b font-mono text-xs uppercase tracking-widest flex items-center gap-1.5 ${isDark ? 'border-acid-500/8 text-acid-500/50' : 'border-lm-border text-emerald-600/70'}`} style={{ fontSize: '9px' }}>
                <TrendingUp size={9} /> GAINERS
              </div>
              {topGainers.map((stock) => (
                <div key={stock.symbol} className={`flex items-center justify-between px-3 py-2 border-b transition-colors ${isDark ? 'border-acid-500/5 hover:bg-acid-500/4' : 'border-lm-border hover:bg-lm-bg'}`}>
                  <div>
                    <div className={`font-mono text-xs font-bold ${isDark ? 'text-steel-100' : 'text-lm-text'}`}>{stock.symbol}</div>
                    <div className={`font-mono ${isDark ? 'text-steel-500' : 'text-lm-muted'}`} style={{ fontSize: '9px' }}>{fmt.currency(stock.price)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkline data={stock.sparkline} width={40} height={16} />
                    <span className="font-mono text-xs font-bold text-acid-500">{fmt.percent(stock.changePercent)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Losers */}
            <div>
              <div className={`px-3 py-1.5 border-b font-mono text-xs uppercase tracking-widest flex items-center gap-1.5 ${isDark ? 'border-acid-500/8 text-signal-red/50' : 'border-lm-border text-red-600/70'}`} style={{ fontSize: '9px' }}>
                <TrendingDown size={9} /> LOSERS
              </div>
              {topLosers.map((stock) => (
                <div key={stock.symbol} className={`flex items-center justify-between px-3 py-2 border-b transition-colors ${isDark ? 'border-acid-500/5 hover:bg-signal-red/4' : 'border-lm-border hover:bg-lm-bg'}`}>
                  <div>
                    <div className={`font-mono text-xs font-bold ${isDark ? 'text-steel-100' : 'text-lm-text'}`}>{stock.symbol}</div>
                    <div className={`font-mono ${isDark ? 'text-steel-500' : 'text-lm-muted'}`} style={{ fontSize: '9px' }}>{fmt.currency(stock.price)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkline data={stock.sparkline} width={40} height={16} positive={false} />
                    <span className="font-mono text-xs font-bold text-signal-red">{fmt.percent(stock.changePercent)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* News Feed */}
        <Card className="col-span-12 lg:col-span-7" title="MARKET INTELLIGENCE FEED" subtitle="Sentiment-analyzed news" accent noPadding>
          <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
            {news.map((item) => (
              <div
                key={item.id}
                className={`p-3 border-b cursor-pointer transition-colors ${
                  isDark ? 'border-acid-500/6 hover:bg-acid-500/3' : 'border-lm-border hover:bg-lm-bg'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge
                        variant={item.sentiment === 'BULLISH' ? 'bullish' : item.sentiment === 'BEARISH' ? 'bearish' : 'neutral'}
                      >
                        {item.sentiment}
                      </Badge>
                      <span className={`font-mono ${isDark ? 'text-steel-500' : 'text-lm-muted'}`} style={{ fontSize: '9px' }}>
                        {item.category} · {item.source}
                      </span>
                      {item.relatedSymbols.map((sym) => (
                        <span key={sym} className={`font-mono px-1 border ${isDark ? 'border-steel-700/50 text-steel-400' : 'border-lm-border text-lm-muted'}`} style={{ fontSize: '9px' }}>
                          {sym}
                        </span>
                      ))}
                    </div>
                    <p className={`font-sans text-xs font-medium leading-snug ${isDark ? 'text-steel-200' : 'text-lm-text'}`}>
                      {item.headline}
                    </p>
                    <p className={`font-sans mt-1 leading-relaxed ${isDark ? 'text-steel-500' : 'text-lm-muted'}`} style={{ fontSize: '10px' }}>
                      {item.summary}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div
                      className="font-mono font-bold"
                      style={{
                        fontSize: '11px',
                        color: item.sentimentScore > 0 ? (isDark ? '#00ff41' : '#059669') : '#ff3b30',
                      }}
                    >
                      {item.sentimentScore > 0 ? '+' : ''}{(item.sentimentScore * 100).toFixed(0)}
                    </div>
                    <div className={`font-mono flex items-center gap-1 ${isDark ? 'text-steel-600' : 'text-lm-muted'}`} style={{ fontSize: '9px' }}>
                      <Clock size={8} />
                      {fmt.timestamp(item.publishedAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Volume Leaders */}
        <Card className="col-span-12 lg:col-span-5" title="VOLUME LEADERS" subtitle="Highest activity today" accent noPadding>
          <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
            {mostVolatile.map((stock, idx) => (
              <div
                key={stock.symbol}
                className={`flex items-center gap-3 px-3 py-2.5 border-b transition-colors ${
                  isDark ? 'border-acid-500/5 hover:bg-acid-500/4' : 'border-lm-border hover:bg-lm-bg'
                }`}
              >
                {/* Rank */}
                <div className={`font-mono text-xs w-5 flex-shrink-0 ${isDark ? 'text-steel-600' : 'text-lm-muted'}`}>
                  {String(idx + 1).padStart(2, '0')}
                </div>

                {/* Symbol */}
                <div className="flex-shrink-0 w-14">
                  <div className={`font-mono text-xs font-bold ${isDark ? 'text-steel-100' : 'text-lm-text'}`}>{stock.symbol}</div>
                  <div className={`font-mono ${isDark ? 'text-steel-600' : 'text-lm-muted'}`} style={{ fontSize: '9px' }}>{stock.sector.substring(0, 8).toUpperCase()}</div>
                </div>

                {/* Volume bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`font-mono ${isDark ? 'text-steel-400' : 'text-lm-muted'}`} style={{ fontSize: '9px' }}>
                      {fmt.number(stock.volume, true)}
                    </span>
                    <span className={`font-mono ${isDark ? 'text-steel-600' : 'text-lm-muted'}`} style={{ fontSize: '9px' }}>
                      avg {fmt.number(stock.avgVolume, true)}
                    </span>
                  </div>
                  <div className={`w-full h-1 ${isDark ? 'bg-steel-800' : 'bg-gray-100'}`}>
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${Math.min((stock.volume / stock.avgVolume) * 50, 100)}%`,
                        background: stock.volume > stock.avgVolume
                          ? (isDark ? '#00ff41' : '#059669')
                          : (isDark ? '#ff9f0a' : '#d97706'),
                      }}
                    />
                  </div>
                </div>

                {/* Price & Change */}
                <div className="text-right flex-shrink-0">
                  <div className={`font-mono text-xs font-bold ${isDark ? 'text-steel-100' : 'text-lm-text'}`}>
                    {fmt.currency(stock.price)}
                  </div>
                  <div
                    className={`font-mono ${stock.changePercent >= 0 ? (isDark ? 'text-acid-500' : 'text-emerald-600') : 'text-signal-red'}`}
                    style={{ fontSize: '10px' }}
                  >
                    {fmt.percent(stock.changePercent)}
                  </div>
                </div>

                {/* Signal */}
                <Badge variant={getSignalBadgeVariant(stock.signal)}>
                  {fmt.signal(stock.signal)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── AI Insights Row ────────────────────────────────────────────── */}
      <Card title="AI SIGNAL ALERTS" subtitle="Quantitative pattern recognition — live" accent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { symbol: 'META', type: 'MACD BULLISH CROSSOVER', desc: 'MACD crossed above signal line with 3x average volume. RSI at 68 — momentum building.', signal: 'STRONG_BUY', score: 91, color: isDark ? '#00ff41' : '#059669' },
            { symbol: 'SMCI', type: 'DEATH CROSS DETECTED', desc: '50-day SMA crossed below 200-day SMA. Institutional selling pressure detected. Earnings risk elevated.', signal: 'STRONG_SELL', score: 12, color: '#ff3b30' },
            { symbol: 'PLTR', type: 'BREAKOUT PATTERN', desc: 'Breaking above 6-month resistance at $36.80 on DoD contract news. Volume 134% above average.', signal: 'BUY', score: 76, color: isDark ? '#0a84ff' : '#2563eb' },
          ].map(({ symbol, type, desc, signal, score, color }) => (
            <div
              key={symbol}
              className={`p-3 border transition-colors cursor-pointer ${isDark ? 'border-steel-700/40 hover:border-acid-500/25 bg-steel-900/30' : 'border-lm-border hover:border-signal-blue/25 bg-lm-bg'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-8 flex-shrink-0" style={{ background: color }} />
                  <div>
                    <div className={`font-mono text-sm font-bold ${isDark ? 'text-steel-100' : 'text-lm-text'}`}>{symbol}</div>
                    <div className="font-mono font-bold" style={{ color, fontSize: '9px' }}>{type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold" style={{ color, fontSize: '16px' }}>{score}</div>
                  <div className={`font-mono ${isDark ? 'text-steel-600' : 'text-lm-muted'}`} style={{ fontSize: '8px' }}>AI SCORE</div>
                </div>
              </div>
              <p className={`font-sans leading-relaxed mb-2 ${isDark ? 'text-steel-400' : 'text-lm-muted'}`} style={{ fontSize: '10px' }}>
                {desc}
              </p>
              <div className="flex items-center justify-between">
                <Badge variant={getSignalBadgeVariant(signal)}>{fmt.signal(signal)}</Badge>
                <button className={`flex items-center gap-1 font-mono transition-colors ${isDark ? 'text-acid-500/60 hover:text-acid-500' : 'text-signal-blue/60 hover:text-signal-blue'}`} style={{ fontSize: '9px' }}>
                  ANALYZE <ChevronRight size={9} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;