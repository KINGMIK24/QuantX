import React, { useState, useMemo, useCallback } from 'react';
import { Filter, X, Zap, Download, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Stock, ScreenerFilter } from '@/types';
import { fmt } from '@/utils/formatters';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Sparkline from '@/components/ui/Sparkline';

interface ScreenerProps {
  stocks: Stock[];
}

const PRESET_SCREENERS = [
  { name: 'AI LEADERS', desc: 'High-momentum AI theme plays', filters: { minScore: 70, sectors: ['Technology'], signals: ['BUY', 'STRONG_BUY'] as Stock['signal'][], minRevenueGrowth: 15 } },
  { name: 'DEEP VALUE', desc: 'Low P/E with strong fundamentals', filters: { maxPE: 20, minScore: 50, minEarningsGrowth: 5 } },
  { name: 'RSI OVERSOLD', desc: 'Technically oversold opportunities', filters: { maxRSI: 35 } },
  { name: 'RSI OVERBOUGHT', desc: 'Overbought candidates for shorts', filters: { minRSI: 68 } },
  { name: 'HIGH MOMENTUM', desc: 'Breakout candidates with volume', filters: { minScore: 65, signals: ['BUY', 'STRONG_BUY'] as Stock['signal'][], minVolume: 20000000 } },
  { name: 'LARGE CAP', desc: 'Mega & large cap stability', filters: { minMarketCap: 100000000000 } },
];

type Signal = Stock['signal'];

const Screener: React.FC<ScreenerProps> = ({ stocks }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [filters, setFilters] = useState<ScreenerFilter>({});
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [sortKey, setSortKey] = useState<keyof Stock>('score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const applyPreset = useCallback((preset: typeof PRESET_SCREENERS[0]) => {
    setFilters(preset.filters);
    setActivePreset(preset.name);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setActivePreset(null);
  }, []);

  const filtered = useMemo(() => {
    return stocks.filter((s) => {
      if (filters.minPrice !== undefined && s.price < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && s.price > filters.maxPrice) return false;
      if (filters.minMarketCap !== undefined && s.marketCap < filters.minMarketCap) return false;
      if (filters.maxMarketCap !== undefined && s.marketCap > filters.maxMarketCap) return false;
      if (filters.minVolume !== undefined && s.volume < filters.minVolume) return false;
      if (filters.minPE !== undefined && s.pe < filters.minPE) return false;
      if (filters.maxPE !== undefined && (s.pe > filters.maxPE || s.pe <= 0)) return false;
      if (filters.minRSI !== undefined && s.rsi < filters.minRSI) return false;
      if (filters.maxRSI !== undefined && s.rsi > filters.maxRSI) return false;
      if (filters.minScore !== undefined && s.score < filters.minScore) return false;
      if (filters.sectors?.length && !filters.sectors.includes(s.sector)) return false;
      if (filters.signals?.length && !filters.signals.includes(s.signal)) return false;
      if (filters.minRevenueGrowth !== undefined && s.revenueGrowth < filters.minRevenueGrowth) return false;
      if (filters.minEarningsGrowth !== undefined && s.earningsGrowth < filters.minEarningsGrowth) return false;
      return true;
    }).sort((a, b) => {
      const av = a[sortKey] as number;
      const bv = b[sortKey] as number;
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return 0;
    });
  }, [stocks, filters, sortKey, sortDir]);

  const handleSort = (key: keyof Stock) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }: { k: keyof Stock }) => {
    if (sortKey !== k) return null;
    return sortDir === 'asc' ? <ChevronUp size={9} /> : <ChevronDown size={9} />;
  };

  const getSignalVariant = (signal: string) => {
    switch (signal) {
      case 'STRONG_BUY': return 'strong-buy' as const;
      case 'BUY': return 'buy' as const;
      case 'SELL': return 'sell' as const;
      case 'STRONG_SELL': return 'strong-sell' as const;
      default: return 'hold' as const;
    }
  };

  const filterLabelClass = `font-mono uppercase tracking-widest ${isDark ? 'text-acid-500/50' : 'text-signal-blue/60'}`;
  const inputClass = `font-mono bg-transparent outline-none w-full border px-2 py-1 ${isDark ? 'border-steel-700/50 text-steel-200 placeholder-steel-700' : 'border-lm-border text-lm-text placeholder-lm-muted'}`;

  return (
    <div className={`p-4 space-y-4 ${isDark ? 'text-steel-200' : 'text-lm-text'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`font-display text-lg font-bold ${isDark ? 'text-steel-50' : 'text-lm-text'}`}>
            Stock Screener
          </h1>
          <p className={`font-mono mt-0.5 ${isDark ? 'text-steel-500' : 'text-lm-muted'}`} style={{ fontSize: '10px' }}>
            AI-POWERED MULTI-FACTOR SCREENER · {filtered.length} OF {stocks.length} MATCHES
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            className={`flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 border transition-all ${isDark ? 'border-steel-700/50 text-steel-400 hover:text-signal-red hover:border-signal-red/30' : 'border-lm-border text-lm-muted hover:text-red-500'}`}
          >
            <X size={10} />
            RESET
          </button>
          <button
            className={`flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 border transition-all ${isDark ? 'border-acid-500/30 text-acid-500 hover:bg-acid-500/10' : 'border-signal-blue/30 text-signal-blue hover:bg-signal-blue/10'}`}
          >
            <Download size={10} />
            EXPORT
          </button>
        </div>
      </div>

      {/* Preset Screeners */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {PRESET_SCREENERS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            className={`p-2.5 border text-left transition-all ${
              activePreset === preset.name
                ? isDark
                  ? 'border-acid-500/50 bg-acid-500/8 text-acid-500'
                  : 'border-signal-blue/50 bg-signal-blue/8 text-signal-blue'
                : isDark
                  ? 'border-steel-700/40 text-steel-400 hover:border-acid-500/25 hover:text-steel-200'
                  : 'border-lm-border text-lm-muted hover:border-signal-blue/25 hover:text-lm-text'
            }`}
          >
            <div className={`font-mono font-bold uppercase tracking-wider ${activePreset === preset.name ? '' : ''}`} style={{ fontSize: '9px' }}>
              {preset.name}
            </div>
            <div className={`font-sans mt-0.5 leading-tight ${isDark ? 'text-steel-600' : 'text-lm-muted'}`} style={{ fontSize: '9px' }}>
              {preset.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Filter Panel */}
      <Card accent noPadding>
        <div
          className={`flex items-center justify-between px-4 py-2.5 border-b cursor-pointer ${isDark ? 'border-acid-500/8' : 'border-lm-border'}`}
          onClick={() => setFiltersOpen((o) => !o)}
        >
          <div className="flex items-center gap-2">
            <Filter size={11} className={isDark ? 'text-acid-500' : 'text-signal-blue'} />
            <span className={`font-mono text-xs font-bold uppercase tracking-widest ${isDark ? 'text-acid-500/70' : 'text-signal-blue/70'}`}>
              FILTERS
            </span>
            {Object.keys(filters).length > 0 && (
              <span className={`font-mono text-xs px-1.5 border ${isDark ? 'border-acid-500/40 text-acid-500' : 'border-signal-blue/40 text-signal-blue'}`} style={{ fontSize: '8px' }}>
                {Object.keys(filters).length} ACTIVE
              </span>
            )}
          </div>
          {filtersOpen ? <ChevronUp size={12} className={isDark ? 'text-steel-500' : 'text-lm-muted'} /> : <ChevronDown size={12} className={isDark ? 'text-steel-500' : 'text-lm-muted'} />}
        </div>

        {filtersOpen && (
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Price range */}
            <div>
              <div className={filterLabelClass} style={{ fontSize: '8px' }}>PRICE MIN</div>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value ? +e.target.value : undefined }))}
                className={inputClass}
                style={{ fontSize: '11px' }}
              />
            </div>
            <div>
              <div className={filterLabelClass} style={{ fontSize: '8px' }}>PRICE MAX</div>
              <input
                type="number"
                placeholder="∞"
                value={filters.maxPrice ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value ? +e.target.value : undefined }))}
                className={inputClass}
                style={{ fontSize: '11px' }}
              />
            </div>

            {/* P/E */}
            <div>
              <div className={filterLabelClass} style={{ fontSize: '8px' }}>P/E MIN</div>
              <input
                type="number"
                placeholder="0"
                value={filters.minPE ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, minPE: e.target.value ? +e.target.value : undefined }))}
                className={inputClass}
                style={{ fontSize: '11px' }}
              />
            </div>
            <div>
              <div className={filterLabelClass} style={{ fontSize: '8px' }}>P/E MAX</div>
              <input
                type="number"
                placeholder="∞"
                value={filters.maxPE ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, maxPE: e.target.value ? +e.target.value : undefined }))}
                className={inputClass}
                style={{ fontSize: '11px' }}
              />
            </div>

            {/* RSI */}
            <div>
              <div className={filterLabelClass} style={{ fontSize: '8px' }}>RSI MIN</div>
              <input
                type="number"
                placeholder="0"
                value={filters.minRSI ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, minRSI: e.target.value ? +e.target.value : undefined }))}
                className={inputClass}
                style={{ fontSize: '11px' }}
              />
            </div>
            <div>
              <div className={filterLabelClass} style={{ fontSize: '8px' }}>RSI MAX</div>
              <input
                type="number"
                placeholder="100"
                value={filters.maxRSI ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, maxRSI: e.target.value ? +e.target.value : undefined }))}
                className={inputClass}
                style={{ fontSize: '11px' }}
              />
            </div>

            {/* AI Score */}
            <div>
              <div className={filterLabelClass} style={{ fontSize: '8px' }}>MIN SCORE</div>
              <input
                type="number"
                placeholder="0"
                value={filters.minScore ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, minScore: e.target.value ? +e.target.value : undefined }))}
                className={inputClass}
                style={{ fontSize: '11px' }}
              />
            </div>

            {/* Min Volume */}
            <div>
              <div className={filterLabelClass} style={{ fontSize: '8px' }}>MIN VOL (M)</div>
              <input
                type="number"
                placeholder="0"
                value={filters.minVolume ? filters.minVolume / 1e6 : ''}
                onChange={(e) => setFilters((f) => ({ ...f, minVolume: e.target.value ? +e.target.value * 1e6 : undefined }))}
                className={inputClass}
                style={{ fontSize: '11px' }}
              />
            </div>

            {/* Signal filter */}
            <div className="col-span-2">
              <div className={filterLabelClass} style={{ fontSize: '8px' }}>SIGNAL</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {(['STRONG_BUY', 'BUY', 'HOLD', 'SELL', 'STRONG_SELL'] as Signal[]).map((sig) => {
                  const active = filters.signals?.includes(sig);
                  return (
                    <button
                      key={sig}
                      onClick={() => {
                        const current = filters.signals ?? [];
                        setFilters((f) => ({
                          ...f,
                          signals: active
                            ? current.filter((s) => s !== sig)
                            : [...current, sig],
                        }));
                        setActivePreset(null);
                      }}
                      className={`font-mono px-1.5 py-0.5 border transition-all ${
                        active
                          ? isDark
                            ? 'border-acid-500/50 bg-acid-500/10 text-acid-500'
                            : 'border-signal-blue/50 bg-signal-blue/10 text-signal-blue'
                          : isDark
                            ? 'border-steel-700/50 text-steel-500 hover:text-steel-300'
                            : 'border-lm-border text-lm-muted hover:text-lm-text'
                      }`}
                      style={{ fontSize: '8px' }}
                    >
                      {fmt.signal(sig)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rev Growth */}
            <div>
              <div className={filterLabelClass} style={{ fontSize: '8px' }}>MIN REV GR%</div>
              <input
                type="number"
                placeholder="0"
                value={filters.minRevenueGrowth ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, minRevenueGrowth: e.target.value ? +e.target.value : undefined }))}
                className={inputClass}
                style={{ fontSize: '11px' }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Results Table */}
      <Card accent noPadding title={`RESULTS — ${filtered.length} SECURITIES`} subtitle="Click column headers to sort">
        <div className="overflow-x-auto" style={{ maxHeight: '480px' }}>
          <table className="w-full font-mono border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className={`border-b ${isDark ? 'border-acid-500/10 bg-void-900/95' : 'border-lm-border bg-lm-bg'}`}>
                {([
                  { key: 'symbol' as keyof Stock, label: 'Symbol', align: 'left', w: '90px' },
                  { key: 'price' as keyof Stock, label: 'Price', align: 'right', w: '80px' },
                  { key: 'changePercent' as keyof Stock, label: '% Chg', align: 'right', w: '70px' },
                  { key: 'sparkline' as keyof Stock, label: '5D', align: 'center', w: '60px', nosort: true },
                  { key: 'volume' as keyof Stock, label: 'Volume', align: 'right', w: '80px' },
                  { key: 'marketCap' as keyof Stock, label: 'Mkt Cap', align: 'right', w: '80px' },
                  { key: 'pe' as keyof Stock, label: 'P/E', align: 'right', w: '55px' },
                  { key: 'rsi' as keyof Stock, label: 'RSI', align: 'right', w: '55px' },
                  { key: 'beta' as keyof Stock, label: 'Beta', align: 'right', w: '55px' },
                  { key: 'revenueGrowth' as keyof Stock, label: 'Rev Gr%', align: 'right', w: '70px' },
                  { key: 'grossMargin' as keyof Stock, label: 'GM%', align: 'right', w: '55px' },
                  { key: 'signal' as keyof Stock, label: 'Signal', align: 'center', w: '90px' },
                  { key: 'score' as keyof Stock, label: 'Score', align: 'right', w: '70px' },
                ] as { key: keyof Stock; label: string; align: string; w: string; nosort?: boolean }[]).map((col) => (
                  <th
                    key={col.key}
                    className={`px-3 py-1.5 font-normal uppercase tracking-widest select-none transition-colors ${col.nosort ? '' : 'cursor-pointer'} ${isDark ? 'text-acid-500/40 hover:text-acid-500/70' : 'text-signal-blue/50 hover:text-signal-blue'}`}
                    style={{ textAlign: col.align as 'left' | 'right' | 'center', width: col.w, fontSize: '9px' }}
                    onClick={() => !col.nosort && handleSort(col.key)}
                  >
                    <div className={`flex items-center gap-0.5 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : ''}`}>
                      {col.label}
                      {!col.nosort && <SortIcon k={col.key} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={13} className={`px-3 py-8 text-center font-mono text-xs ${isDark ? 'text-steel-600' : 'text-lm-muted'}`}>
                    No securities match the current filters. Try adjusting or clearing filters.
                  </td>
                </tr>
              ) : filtered.map((stock, idx) => (
                <tr
                  key={stock.symbol}
                  className={`border-b transition-colors ${isDark ? `border-acid-500/5 hover:bg-acid-500/4 ${idx % 2 === 1 ? 'bg-steel-900/10' : ''}` : `border-lm-border hover:bg-lm-bg ${idx % 2 === 1 ? 'bg-gray-50/60' : ''}`}`}
                >
                  {/* Symbol */}
                  <td className="px-3 py-2">
                    <div className={`font-mono text-xs font-bold ${isDark ? 'text-steel-100' : 'text-lm-text'}`}>{stock.symbol}</div>
                    <div className={`font-mono truncate ${isDark ? 'text-steel-600' : 'text-lm-muted'}`} style={{ fontSize: '9px', maxWidth: '80px' }}>{stock.name}</div>
                  </td>
                  {/* Price */}
                  <td className="px-3 py-2 text-right">
                    <span className={`font-mono text-xs font-bold ${isDark ? 'text-steel-100' : 'text-lm-text'}`}>{fmt.currency(stock.price)}</span>
                  </td>
                  {/* Change% */}
                  <td className="px-3 py-2 text-right">
                    <span className={`font-mono text-xs font-bold ${stock.changePercent >= 0 ? (isDark ? 'text-acid-500' : 'text-emerald-600') : 'text-signal-red'}`}>
                      {fmt.percent(stock.changePercent)}
                    </span>
                  </td>
                  {/* Sparkline */}
                  <td className="px-3 py-2 text-center">
                    <Sparkline data={stock.sparkline} width={52} height={20} positive={stock.changePercent >= 0} />
                  </td>
                  {/* Volume */}
                  <td className="px-3 py-2 text-right">
                    <div className={`font-mono text-xs ${isDark ? 'text-steel-300' : 'text-lm-text'}`}>{fmt.number(stock.volume, true)}</div>
                    <div className={`font-mono ${stock.volume > stock.avgVolume ? (isDark ? 'text-acid-500' : 'text-emerald-600') : (isDark ? 'text-steel-600' : 'text-lm-muted')}`} style={{ fontSize: '9px' }}>
                      {((stock.volume / stock.avgVolume) * 100).toFixed(0)}% avg
                    </div>
                  </td>
                  {/* Market Cap */}
                  <td className="px-3 py-2 text-right">
                    <span className={`font-mono text-xs ${isDark ? 'text-steel-300' : 'text-lm-text'}`}>{fmt.currency(stock.marketCap, true)}</span>
                  </td>
                  {/* P/E */}
                  <td className="px-3 py-2 text-right">
                    <span className={`font-mono text-xs ${stock.pe > 50 ? 'text-signal-yellow' : stock.pe < 0 ? 'text-signal-red' : (isDark ? 'text-steel-300' : 'text-lm-text')}`}>
                      {stock.pe > 0 ? stock.pe.toFixed(1) : 'N/A'}
                    </span>
                  </td>
                  {/* RSI */}
                  <td className="px-3 py-2 text-right">
                    <span className={`font-mono text-xs font-bold ${stock.rsi >= 70 ? 'text-signal-red' : stock.rsi <= 30 ? (isDark ? 'text-acid-500' : 'text-emerald-600') : (isDark ? 'text-steel-300' : 'text-lm-text')}`}>
                      {stock.rsi.toFixed(1)}
                    </span>
                  </td>
                  {/* Beta */}
                  <td className="px-3 py-2 text-right">
                    <span className={`font-mono text-xs ${isDark ? 'text-steel-400' : 'text-lm-muted'}`}>{stock.beta.toFixed(2)}</span>
                  </td>
                  {/* Rev Growth */}
                  <td className="px-3 py-2 text-right">
                    <span className={`font-mono text-xs ${stock.revenueGrowth >= 15 ? (isDark ? 'text-acid-500' : 'text-emerald-600') : stock.revenueGrowth < 0 ? 'text-signal-red' : (isDark ? 'text-steel-300' : 'text-lm-text')}`}>
                      {fmt.percent(stock.revenueGrowth, 1)}
                    </span>
                  </td>
                  {/* Gross Margin */}
                  <td className="px-3 py-2 text-right">
                    <span className={`font-mono text-xs ${stock.grossMargin >= 50 ? (isDark ? 'text-acid-500' : 'text-emerald-600') : (isDark ? 'text-steel-300' : 'text-lm-text')}`}>
                      {stock.grossMargin.toFixed(1)}%
                    </span>
                  </td>
                  {/* Signal */}
                  <td className="px-3 py-2">
                    <div className="flex justify-center">
                      <Badge variant={getSignalVariant(stock.signal)}>{fmt.signal(stock.signal)}</Badge>
                    </div>
                  </td>
                  {/* Score */}
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className={`h-1 w-8 ${isDark ? 'bg-steel-800' : 'bg-gray-100'}`}>
                        <div
                          className="h-full"
                          style={{
                            width: `${stock.score}%`,
                            background: stock.score >= 70 ? (isDark ? '#00ff41' : '#059669') : stock.score >= 40 ? '#ffd60a' : '#ff3b30',
                          }}
                        />
                      </div>
                      <span className={`font-mono text-xs font-bold ${isDark ? 'text-steel-200' : 'text-lm-text'}`}>{stock.score}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Screener;