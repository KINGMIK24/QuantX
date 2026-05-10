import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Search, Filter, Globe } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Stock, MarketIndex } from '@/types';
import { fmt } from '@/utils/formatters';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Sparkline from '@/components/ui/Sparkline';
import DataTable from '@/components/ui/DataTable';
import { MOCK_SECTORS } from '@/utils/mockData';

interface MarketsProps {
  stocks: Stock[];
  indices: MarketIndex[];
}

const Markets: React.FC<MarketsProps> = ({ stocks, indices }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  const sectors = useMemo(() => ['ALL', ...Array.from(new Set(stocks.map((s) => s.sector)))], [stocks]);

  const filtered = useMemo(() => {
    return stocks.filter((s) => {
      const matchSearch = search === '' || s.symbol.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase());
      const matchSector = selectedSector === 'ALL' || s.sector === selectedSector;
      return matchSearch && matchSector;
    });
  }, [stocks, search, selectedSector]);

  const signalVariant = (signal: string) => {
    switch (signal) {
      case 'STRONG_BUY': return 'strong-buy';
      case 'BUY': return 'buy';
      case 'SELL': return 'sell';
      case 'STRONG_SELL': return 'strong-sell';
      default: return 'hold';
    }
  };

  const columns = [
    {
      key: 'symbol',
      label: 'Symbol',
      width: '90px',
      render: (_: unknown, row: Stock) => (
        <div>
          <div className={`font-mono text-xs font-bold ${isDark ? 'text-steel-100' : 'text-lm-text'}`}>{row.symbol}</div>
          <div className={`font-mono truncate ${isDark ? 'text-steel-600' : 'text-lm-muted'}`} style={{ fontSize: '9px', maxWidth: '80px' }}>{row.name}</div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      align: 'right' as const,
      width: '80px',
      render: (_: unknown, row: Stock) => (
        <span className={`font-mono text-xs font-bold ${isDark ? 'text-steel-100' : 'text-lm-text'}`}>
          {fmt.currency(row.price)}
        </span>
      ),
    },
    {
      key: 'changePercent',
      label: '% Chg',
      align: 'right' as const,
      width: '70px',
      render: (_: unknown, row: Stock) => (
        <span className={`font-mono text-xs font-bold ${row.changePercent >= 0 ? (isDark ? 'text-acid-500' : 'text-emerald-600') : 'text-signal-red'}`}>
          {fmt.percent(row.changePercent)}
        </span>
      ),
    },
    {
      key: 'sparkline',
      label: '5D',
      sortable: false,
      width: '60px',
      render: (_: unknown, row: Stock) => (
        <Sparkline data={row.sparkline} width={52} height={20} positive={row.changePercent >= 0} />
      ),
    },
    {
      key: 'volume',
      label: 'Volume',
      align: 'right' as const,
      width: '80px',
      render: (_: unknown, row: Stock) => (
        <div className="text-right">
          <div className={`font-mono text-xs ${isDark ? 'text-steel-300' : 'text-lm-text'}`}>{fmt.number(row.volume, true)}</div>
          <div className={`font-mono ${row.volume > row.avgVolume ? (isDark ? 'text-acid-500' : 'text-emerald-600') : (isDark ? 'text-steel-600' : 'text-lm-muted')}`} style={{ fontSize: '9px' }}>
            {((row.volume / row.avgVolume) * 100).toFixed(0)}% avg
          </div>
        </div>
      ),
    },
    {
      key: 'marketCap',
      label: 'Mkt Cap',
      align: 'right' as const,
      width: '80px',
      render: (_: unknown, row: Stock) => (
        <span className={`font-mono text-xs ${isDark ? 'text-steel-300' : 'text-lm-text'}`}>{fmt.currency(row.marketCap, true)}</span>
      ),
    },
    {
      key: 'pe',
      label: 'P/E',
      align: 'right' as const,
      width: '55px',
      render: (_: unknown, row: Stock) => (
        <span className={`font-mono text-xs ${row.pe > 50 ? 'text-signal-yellow' : row.pe < 0 ? 'text-signal-red' : (isDark ? 'text-steel-300' : 'text-lm-text')}`}>
          {row.pe > 0 ? row.pe.toFixed(1) : 'N/A'}
        </span>
      ),
    },
    {
      key: 'rsi',
      label: 'RSI',
      align: 'right' as const,
      width: '55px',
      render: (_: unknown, row: Stock) => (
        <span
          className={`font-mono text-xs font-bold ${
            row.rsi >= 70 ? 'text-signal-red' : row.rsi <= 30 ? (isDark ? 'text-acid-500' : 'text-emerald-600') : (isDark ? 'text-steel-300' : 'text-lm-text')
          }`}
        >
          {row.rsi.toFixed(1)}
        </span>
      ),
    },
    {
      key: 'beta',
      label: 'Beta',
      align: 'right' as const,
      width: '55px',
      render: (_: unknown, row: Stock) => (
        <span className={`font-mono text-xs ${isDark ? 'text-steel-400' : 'text-lm-muted'}`}>{row.beta.toFixed(2)}</span>
      ),
    },
    {
      key: 'signal',
      label: 'Signal',
      align: 'center' as const,
      width: '90px',
      render: (_: unknown, row: Stock) => (
        <div className="flex justify-center">
          <Badge variant={signalVariant(row.signal)}>{fmt.signal(row.signal)}</Badge>
        </div>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      align: 'right' as const,
      width: '60px',
      render: (_: unknown, row: Stock) => (
        <div className="flex items-center justify-end gap-1.5">
          <div className={`h-1 w-8 ${isDark ? 'bg-steel-800' : 'bg-gray-100'}`}>
            <div
              className="h-full"
              style={{
                width: `${row.score}%`,
                background: row.score >= 70 ? (isDark ? '#00ff41' : '#059669') : row.score >= 40 ? '#ffd60a' : '#ff3b30',
              }}
            />
          </div>
          <span className={`font-mono text-xs font-bold ${isDark ? 'text-steel-200' : 'text-lm-text'}`}>{row.score}</span>
        </div>
      ),
    },
  ];

  return (
    <div className={`p-4 space-y-4 ${isDark ? 'text-steel-200' : 'text-lm-text'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`font-display text-lg font-bold ${isDark ? 'text-steel-50' : 'text-lm-text'}`}>Markets Overview</h1>
          <p className={`font-mono mt-0.5 ${isDark ? 'text-steel-500' : 'text-lm-muted'}`} style={{ fontSize: '10px' }}>
            REAL-TIME EQUITY SURVEILLANCE · {stocks.length} SECURITIES MONITORED
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Globe size={14} className={isDark ? 'text-acid-500' : 'text-signal-blue'} />
          <span className={`font-mono text-xs ${isDark ? 'text-acid-500' : 'text-signal-blue'}`}>NYSE · NASDAQ · CBOE</span>
        </div>
      </div>

      {/* Index Cards */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
        {indices.map((idx) => (
          <Card key={idx.symbol} className="p-3" glowOnHover>
            <div className={`font-mono text-xs font-bold mb-0.5 ${isDark ? 'text-steel-400' : 'text-lm-muted'}`} style={{ fontSize: '9px' }}>
              {idx.name}
            </div>
            <div className={`font-mono text-sm font-bold ${isDark ? 'text-steel-100' : 'text-lm-text'}`}>
              {idx.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`flex items-center gap-1 mt-0.5 ${idx.changePercent >= 0 ? (isDark ? 'text-acid-500' : 'text-emerald-600') : 'text-signal-red'}`}>
              {idx.changePercent >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
              <span className="font-mono" style={{ fontSize: '10px' }}>{fmt.percent(idx.changePercent)}</span>
            </div>
            <div className="mt-1.5">
              <Sparkline data={idx.sparkline} width={80} height={18} positive={idx.changePercent >= 0} />
            </div>
          </Card>
        ))}
      </div>

      {/* Sector Performance Bar */}
      <Card title="SECTOR PERFORMANCE" accent noPadding>
        <div className="p-3">
          <div className="flex items-end gap-1 h-16">
            {MOCK_SECTORS.map((sec) => {
              const h = Math.abs(sec.changePercent) / 2 * 100;
              const isPos = sec.changePercent >= 0;
              return (
                <div key={sec.sector} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                  <span className={`font-mono font-bold ${isPos ? (isDark ? 'text-acid-500' : 'text-emerald-600') : 'text-signal-red'}`} style={{ fontSize: '8px' }}>
                    {fmt.percent(sec.changePercent, 1)}
                  </span>
                  <div className="w-full flex items-end justify-center" style={{ height: '40px' }}>
                    <div
                      className="w-full max-w-10 transition-all duration-500"
                      style={{
                        height: `${Math.max(4, Math.min(h, 40))}px`,
                        background: isPos ? (isDark ? '#00ff41' : '#059669') : '#ff3b30',
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <span className={`font-mono truncate w-full text-center ${isDark ? 'text-steel-600' : 'text-lm-muted'}`} style={{ fontSize: '7px' }}>
                    {sec.sector.substring(0, 6).toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Stock Table */}
      <Card accent noPadding
        title="EQUITY SURVEILLANCE"
        subtitle={`${filtered.length} of ${stocks.length} securities`}
        headerRight={
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className={`flex items-center gap-1.5 border px-2 py-1 ${isDark ? 'border-steel-700/50' : 'border-lm-border'}`}>
              <Search size={10} className={isDark ? 'text-steel-500' : 'text-lm-muted'} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH SYMBOL..."
                className={`font-mono bg-transparent outline-none w-28 ${isDark ? 'text-steel-200 placeholder-steel-600' : 'text-lm-text placeholder-lm-muted'}`}
                style={{ fontSize: '10px' }}
              />
            </div>

            {/* Sector Filter */}
            <div className={`flex items-center gap-1.5 border px-2 py-1 ${isDark ? 'border-steel-700/50' : 'border-lm-border'}`}>
              <Filter size={10} className={isDark ? 'text-steel-500' : 'text-lm-muted'} />
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className={`font-mono bg-transparent outline-none cursor-pointer ${isDark ? 'text-steel-200' : 'text-lm-text'}`}
                style={{ fontSize: '10px' }}
              >
                {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        }
      >
        <DataTable
          data={filtered as unknown as Record<string, unknown>[]}
          columns={columns as unknown[]}
          maxHeight="480px"
          striped
          compact
        />
      </Card>
    </div>
  );
};

export default Markets;