import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Zap, Clock,
  Target, Activity, ChevronRight,
} from 'lucide-react';
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

const Dashboard: React.FC<DashboardProps> = ({ stocks, news }) => {
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

  const kpis = [
    {
      label: 'PORTFOLIO VALUE',
      value: fmt.currency(portfolio.totalValue),
      sub: `${fmt.percent(portfolio.dayPnLPercent)} today`,
      isPositive: portfolio.dayPnLPercent >= 0,
      icon: Zap,
      primary: true,
    },
    {
      label: 'TOTAL P&L',
      value: fmt.currency(portfolio.totalUnrealizedPnL),
      sub: `${fmt.percent(portfolio.totalUnrealizedPnLPercent)} total return`,
      isPositive: portfolio.totalUnrealizedPnL >= 0,
      icon: TrendingUp,
      primary: false,
    },
    {
      label: 'SHARPE RATIO',
      value: portfolio.sharpeRatio.toFixed(2),
      sub: `Sortino: ${portfolio.sortinRatio.toFixed(2)}`,
      isPositive: portfolio.sharpeRatio > 1,
      icon: Activity,
      primary: false,
    },
    {
      label: 'MAX DRAWDOWN',
      value: fmt.percent(portfolio.maxDrawdown),
      sub: `Volatility: ${portfolio.volatility.toFixed(1)}%`,
      isPositive: false,
      icon: Target,
      primary: false,
    },
  ];

  return (
    <div className="p-4 space-y-4 min-h-full font-sans">

      {/* ── Header Row ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans font-semibold" style={{ fontSize: '20px', letterSpacing: '-0.02em', color: '#fff' }}>
            Market Intelligence Dashboard
          </h1>
          <p className="font-mono mt-0.5" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)' }}>
            // QUANTX_TERMINAL v2.1.0 · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          to="/terminal"
          className="flex items-center gap-1.5 font-mono px-3 py-1.5 rounded-md transition-all"
          style={{
            fontSize: '11px',
            border: '1px solid rgba(224, 64, 251, 0.2)',
            color: '#e040fb',
            background: 'rgba(224, 64, 251, 0.06)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(224, 64, 251, 0.12)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(224, 64, 251, 0.06)')}
        >
          <Zap size={11} />
          TERMINAL
        </Link>
      </div>

      {/* ── KPI Row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(({ label, value, sub, isPositive, icon: Icon, primary }) => (
          <div
            key={label}
            className="qx-card p-4"
            style={{
              borderTop: primary ? '2px solid var(--accent1, #e040fb)' : undefined,
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="font-sans" style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)' }}>
                  {label}
                </div>
                <div className="font-sans font-bold mt-1" style={{ fontSize: '28px', color: '#fff', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                  {value}
                </div>
                <div
                  className="font-mono mt-1.5 flex items-center gap-1"
                  style={{
                    fontSize: '11px',
                    color: isPositive ? '#00c896' : '#ff4d4d',
                  }}
                >
                  {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {sub}
                </div>
              </div>
              <div className="flex-shrink-0" style={{ color: 'rgba(255, 255, 255, 0.15)' }}>
                <Icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Content Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-3">

        {/* Portfolio Performance Chart */}
        <Card
          className="col-span-12 lg:col-span-8"
          title="PORTFOLIO PERFORMANCE"
          subtitle={`vs SPY benchmark · ${selectedPeriod} view`}
          headerRight={
            <div className="flex items-center gap-1">
              {(['1M', '3M', '6M', '1Y'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className="font-mono px-2 py-0.5 rounded transition-all"
                  style={{
                    fontSize: '10px',
                    background: selectedPeriod === p ? 'rgba(224, 64, 251, 0.12)' : 'transparent',
                    color: selectedPeriod === p ? '#e040fb' : 'rgba(255, 255, 255, 0.4)',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          }
          noPadding
        >
          <div className="px-3 pt-2 pb-3">
            <div className="flex items-center gap-6 mb-3 px-1">
              {[
                { label: 'Portfolio', value: fmt.currency(portfolio.totalValue), change: fmt.percent(portfolio.totalUnrealizedPnLPercent), color: '#e040fb' },
                { label: 'SPY', value: '$432.40', change: '+18.2%', color: 'rgba(255, 255, 255, 0.4)' },
                { label: 'Alpha', value: '+' + portfolio.alpha + '%', change: 'ann.', color: '#00c896' },
              ].map(({ label, value, change, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-2 h-0.5 rounded-full" style={{ background: color }} />
                  <div>
                    <div className="font-mono font-bold" style={{ color, fontSize: '11px' }}>{value}</div>
                    <div className="font-mono" style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.25)' }}>{label} · {change}</div>
                  </div>
                </div>
              ))}
            </div>
            <AreaChart data={portfolioHistory} height={180} showBenchmark />
          </div>
        </Card>

        {/* Market Gauge Panel */}
        <Card className="col-span-12 lg:col-span-4" title="MARKET SENTIMENT">
          <div className="grid grid-cols-2 gap-4">
            <GaugeChart value={62} label="Fear & Greed" sublabel="GREED" />
            <GaugeChart value={44} label="VIX Stress" sublabel="MODERATE" thresholds={[{ value: 20, color: '#00c896' }, { value: 30, color: 'rgba(255,255,255,0.25)' }, { value: 50, color: '#e040fb' }, { value: 100, color: '#ff4d4d' }]} />
            <GaugeChart value={72} label="Momentum" sublabel="BULLISH" />
            <GaugeChart value={58} label="AI Score" sublabel="ABOVE AVG" thresholds={[{ value: 40, color: '#ff4d4d' }, { value: 60, color: 'rgba(255,255,255,0.25)' }, { value: 80, color: '#e040fb' }, { value: 100, color: '#00c896' }]} />
          </div>
        </Card>

        {/* Sector Heatmap */}
        <Card className="col-span-12 lg:col-span-7" title="SECTOR HEATMAP" subtitle="% change today · size = market cap weight" noPadding>
          <div className="p-3" style={{ height: '220px' }}>
            <HeatmapChart sectors={MOCK_SECTORS} />
          </div>
        </Card>

        {/* Top Gainers / Losers */}
        <Card className="col-span-12 lg:col-span-5" title="MOVERS" subtitle="Top gainers & losers" noPadding>
          <div className="grid grid-cols-2" style={{ borderRight: 'none' }}>
            {/* Gainers */}
            <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div className="px-3 py-1.5 border-b font-mono uppercase tracking-widest flex items-center gap-1.5" style={{ fontSize: '10px', borderColor: 'rgba(255, 255, 255, 0.05)', color: '#00c896' }}>
                <TrendingUp size={9} /> GAINERS
              </div>
              {topGainers.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between px-3 py-2 border-b transition-colors"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                >
                  <div>
                    <div className="font-mono text-xs font-bold" style={{ color: '#fff' }}>{stock.symbol}</div>
                    <div className="font-mono" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)' }}>{fmt.currency(stock.price)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkline data={stock.sparkline} width={40} height={16} />
                    <span className="font-mono text-xs font-bold" style={{ color: '#00c896' }}>{fmt.percent(stock.changePercent)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Losers */}
            <div>
              <div className="px-3 py-1.5 border-b font-mono uppercase tracking-widest flex items-center gap-1.5" style={{ fontSize: '10px', borderColor: 'rgba(255, 255, 255, 0.05)', color: '#ff4d4d' }}>
                <TrendingDown size={9} /> LOSERS
              </div>
              {topLosers.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between px-3 py-2 border-b transition-colors"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                >
                  <div>
                    <div className="font-mono text-xs font-bold" style={{ color: '#fff' }}>{stock.symbol}</div>
                    <div className="font-mono" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)' }}>{fmt.currency(stock.price)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkline data={stock.sparkline} width={40} height={16} positive={false} />
                    <span className="font-mono text-xs font-bold" style={{ color: '#ff4d4d' }}>{fmt.percent(stock.changePercent)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* News Feed */}
        <Card className="col-span-12 lg:col-span-7" title="MARKET INTELLIGENCE" subtitle="Sentiment-analyzed news" noPadding>
          <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
            {news.map((item) => (
              <div
                key={item.id}
                className="p-3 border-b cursor-pointer transition-colors"
                style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '')}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge
                        variant={item.sentiment === 'BULLISH' ? 'bullish' : item.sentiment === 'BEARISH' ? 'bearish' : 'neutral'}
                      >
                        {item.sentiment}
                      </Badge>
                      <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.3)' }}>
                        {item.category} · {item.source}
                      </span>
                      {item.relatedSymbols.map((sym) => (
                        <span key={sym} className="font-mono px-1 rounded" style={{ fontSize: '10px', background: 'rgba(255, 255, 255, 0.06)', color: 'rgba(255, 255, 255, 0.5)' }}>
                          {sym}
                        </span>
                      ))}
                    </div>
                    <p className="font-sans text-xs font-medium leading-snug" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {item.headline}
                    </p>
                    <p className="font-sans mt-1 leading-relaxed" style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.35)' }}>
                      {item.summary}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div
                      className="font-mono font-bold"
                      style={{
                        fontSize: '11px',
                        color: item.sentimentScore > 0 ? '#00c896' : '#ff4d4d',
                      }}
                    >
                      {item.sentimentScore > 0 ? '+' : ''}{(item.sentimentScore * 100).toFixed(0)}
                    </div>
                    <div className="font-mono flex items-center gap-1" style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.25)' }}>
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
        <Card className="col-span-12 lg:col-span-5" title="VOLUME LEADERS" subtitle="Highest activity today" noPadding>
          <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
            {mostVolatile.map((stock, idx) => (
              <div
                key={stock.symbol}
                className="flex items-center gap-3 px-3 py-2.5 border-b transition-colors"
                style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '')}
              >
                <div className="font-mono w-5 flex-shrink-0" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.25)' }}>
                  {String(idx + 1).padStart(2, '0')}
                </div>

                <div className="flex-shrink-0 w-14">
                  <div className="font-mono text-xs font-bold" style={{ color: '#fff' }}>{stock.symbol}</div>
                  <div className="font-mono" style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.25)' }}>{stock.sector.substring(0, 8).toUpperCase()}</div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.45)' }}>
                      {fmt.number(stock.volume, true)}
                    </span>
                    <span className="font-mono" style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.2)' }}>
                      avg {fmt.number(stock.avgVolume, true)}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '3px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '2px' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: '2px',
                        width: `${Math.min((stock.volume / stock.avgVolume) * 50, 100)}%`,
                        background: stock.volume > stock.avgVolume ? '#00c896' : 'rgba(255, 255, 255, 0.2)',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="font-mono text-xs font-bold" style={{ color: '#fff' }}>
                    {fmt.currency(stock.price)}
                  </div>
                  <div
                    className="font-mono"
                    style={{ fontSize: '10px', color: stock.changePercent >= 0 ? '#00c896' : '#ff4d4d' }}
                  >
                    {fmt.percent(stock.changePercent)}
                  </div>
                </div>

                <Badge variant={getSignalBadgeVariant(stock.signal)}>
                  {fmt.signal(stock.signal)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── AI Insights Row ────────────────────────────────────────────── */}
      <Card title="AI SIGNAL ALERTS" subtitle="Quantitative pattern recognition">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { symbol: 'META', type: 'MACD BULLISH CROSSOVER', desc: 'MACD crossed above signal line with 3x average volume. RSI at 68 — momentum building.', signal: 'STRONG_BUY', score: 91, color: '#00c896' },
            { symbol: 'SMCI', type: 'DEATH CROSS DETECTED', desc: '50-day SMA crossed below 200-day SMA. Institutional selling pressure detected.', signal: 'STRONG_SELL', score: 12, color: '#ff4d4d' },
            { symbol: 'PLTR', type: 'BREAKOUT PATTERN', desc: 'Breaking above 6-month resistance at $36.80 on DoD contract news. Volume 134% above average.', signal: 'BUY', score: 76, color: '#e040fb' },
          ].map(({ symbol, type, desc, signal, score, color }) => (
            <div
              key={symbol}
              className="p-3 rounded-lg transition-colors cursor-pointer"
              style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)')}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-8 rounded-full flex-shrink-0" style={{ background: color }} />
                  <div>
                    <div className="font-mono text-sm font-bold" style={{ color: '#fff' }}>{symbol}</div>
                    <div className="font-mono" style={{ color, fontSize: '10px' }}>{type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-sans font-bold" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px' }}>{score}</div>
                  <div className="font-mono" style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.25)' }}>SCORE</div>
                </div>
              </div>
              <p className="font-sans leading-relaxed mb-2" style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)' }}>
                {desc}
              </p>
              <div className="flex items-center justify-between">
                <Badge variant={getSignalBadgeVariant(signal)}>{fmt.signal(signal)}</Badge>
                <button
                  className="flex items-center gap-1 font-mono transition-colors"
                  style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.35)')}
                >
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