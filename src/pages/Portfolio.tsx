import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, PieChart, Target, Shield, Activity } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Stock } from '@/types';
import { MOCK_PORTFOLIO } from '@/utils/mockData';
import { generatePortfolioHistory } from '@/utils/chartData';
import { fmt } from '@/utils/formatters';
import Card from '@/components/ui/Card';
import Sparkline from '@/components/ui/Sparkline';
import AreaChart from '@/components/charts/AreaChart';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';

interface PortfolioProps {
  stocks: Stock[];
}

const Portfolio: React.FC<PortfolioProps> = ({ stocks }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const portfolio = MOCK_PORTFOLIO;

  const portfolioHistory = useMemo(() => generatePortfolioHistory(365), []);

  // Update positions with current prices
  const updatedPositions = useMemo(() => {
    return portfolio.positions.map((pos) => {
      const live = stocks.find((s) => s.symbol === pos.symbol);
      if (!live) return pos;
      const currentPrice = live.price;
      const totalValue = currentPrice * pos.quantity;
      const totalCost = pos.avgCost * pos.quantity;
      const unrealizedPnL = totalValue - totalCost;
      const unrealizedPnLPercent = (unrealizedPnL / totalCost) * 100;
      const dayPnL = live.change * pos.quantity;
      return { ...pos, currentPrice, totalValue, totalCost, unrealizedPnL, unrealizedPnLPercent, dayPnL };
    });
  }, [portfolio.positions, stocks]);

  const totalValue = useMemo(() => updatedPositions.reduce((s, p) => s + p.totalValue, 0) + portfolio.cash, [updatedPositions, portfolio.cash]);

  const allocationData = useMemo(() => {
    return updatedPositions.map((p) => ({
      name: p.symbol,
      value: Math.round((p.totalValue / totalValue) * 100 * 10) / 10,
      pnl: p.unrealizedPnLPercent,
      color: p.unrealizedPnL >= 0 ? (isDark ? '#00ff41' : '#059669') : '#ff3b30',
    }));
  }, [updatedPositions, totalValue, isDark]);

  const radarData = [
    { subject: 'Momentum', A: 72, fullMark: 100 },
    { subject: 'Value', A: 48, fullMark: 100 },
    { subject: 'Quality', A: 84, fullMark: 100 },
    { subject: 'Growth', A: 78, fullMark: 100 },
    { subject: 'Income', A: 32, fullMark: 100 },
    { subject: 'Safety', A: 56, fullMark: 100 },
  ];

  const sectorAlloc = useMemo(() => {
    const map: Record<string, number> = {};
    updatedPositions.forEach((p) => {
      map[p.sector] = (map[p.sector] || 0) + p.totalValue;
    });
    return Object.entries(map).map(([sector, value]) => ({
      sector,
      value: Math.round((value / totalValue) * 100 * 10) / 10,
      abs: value,
    })).sort((a, b) => b.value - a.value);
  }, [updatedPositions, totalValue]);

  const accentColor = isDark ? '#00ff41' : '#0a84ff';
  const muted = isDark ? 'rgba(176,184,204,0.5)' : '#9ca3af';

  return (
    <div className={`p-4 space-y-4 ${isDark ? 'text-steel-200' : 'text-lm-text'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`font-display text-lg font-bold ${isDark ? 'text-steel-50' : 'text-lm-text'}`}>Portfolio Command Center</h1>
          <p className={`font-mono mt-0.5 ${isDark ? 'text-steel-500' : 'text-lm-muted'}`} style={{ fontSize: '10px' }}>
            {updatedPositions.length} POSITIONS · RISK-ADJUSTED ANALYTICS
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'TOTAL VALUE', value: fmt.currency(totalValue), sub: `+${fmt.currency(portfolio.totalUnrealizedPnL)} unrealized`, pos: true, icon: Target },
          { label: 'DAY P&L', value: fmt.currency(portfolio.dayPnL), sub: fmt.percent(portfolio.dayPnLPercent) + ' today', pos: portfolio.dayPnL >= 0, icon: TrendingUp },
          { label: 'SHARPE RATIO', value: portfolio.sharpeRatio.toFixed(2), sub: `Alpha: +${portfolio.alpha}%`, pos: true, icon: Activity },
          { label: 'BETA', value: portfolio.beta.toFixed(2), sub: `Max DD: ${fmt.percent(portfolio.maxDrawdown)}`, pos: portfolio.beta < 1.5, icon: Shield },
        ].map(({ label, value, sub, pos, icon: Icon }) => (
          <Card key={label} accent glowOnHover>
            <div className="flex items-start justify-between">
              <div>
                <div className={`font-mono text-xs uppercase tracking-widest mb-1 ${isDark ? 'text-acid-500/50' : 'text-signal-blue/60'}`} style={{ fontSize: '9px' }}>{label}</div>
                <div className={`font-mono text-xl font-bold ${isDark ? 'text-steel-50' : 'text-lm-text'}`}>{value}</div>
                <div className={`font-mono mt-1 flex items-center gap-1 ${pos ? (isDark ? 'text-acid-500' : 'text-emerald-600') : 'text-signal-red'}`} style={{ fontSize: '10px' }}>
                  {pos ? <TrendingUp size={9} /> : <TrendingDown size={9} />} {sub}
                </div>
              </div>
              <div className={`p-1.5 border ${isDark ? 'border-acid-500/15 text-acid-500/40' : 'border-signal-blue/20 text-signal-blue/40'}`}><Icon size={14} /></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-3">
        {/* Performance Chart */}
        <Card className="col-span-12 lg:col-span-8" title="EQUITY CURVE" subtitle="1Y portfolio vs benchmark" accent noPadding>
          <div className="p-3 pt-2">
            <AreaChart data={portfolioHistory} height={200} showBenchmark />
          </div>
        </Card>

        {/* Factor Radar */}
        <Card className="col-span-12 lg:col-span-4" title="FACTOR EXPOSURE" subtitle="Portfolio quality dimensions" accent>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={isDark ? 'rgba(0,255,65,0.08)' : 'rgba(0,0,0,0.08)'} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: muted, fontSize: 9, fontFamily: 'JetBrains Mono' }} />
              <Radar
                name="Portfolio"
                dataKey="A"
                stroke={accentColor}
                fill={accentColor}
                fillOpacity={0.12}
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Allocation Bar Chart */}
        <Card className="col-span-12 lg:col-span-5" title="POSITION ALLOCATION" subtitle="% of portfolio by holding" accent noPadding>
          <div className="p-3">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={allocationData} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" stroke={isDark ? 'rgba(0,255,65,0.05)' : 'rgba(0,0,0,0.05)'} horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: muted, fontSize: 9, fontFamily: 'JetBrains Mono' }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#b0b8cc' : '#374151', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 'bold' }} width={45} />
                <Tooltip
                  formatter={(v: number) => [`${v}%`, 'Weight']}
                  contentStyle={{
                    background: isDark ? '#0d0d1a' : '#fff',
                    border: isDark ? '1px solid rgba(0,255,65,0.2)' : '1px solid #e5e7eb',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '11px',
                    color: isDark ? '#b0b8cc' : '#374151',
                  }}
                />
                <Bar dataKey="value" radius={0}>
                  {allocationData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sector Allocation */}
        <Card className="col-span-12 lg:col-span-3" title="SECTOR ALLOCATION" accent noPadding>
          <div className="p-3 space-y-2">
            {sectorAlloc.map(({ sector, value }) => (
              <div key={sector}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-mono ${isDark ? 'text-steel-300' : 'text-lm-text'}`} style={{ fontSize: '10px' }}>{sector}</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-steel-100' : 'text-lm-text'}`} style={{ fontSize: '10px' }}>{value}%</span>
                </div>
                <div className={`h-1 w-full ${isDark ? 'bg-steel-800' : 'bg-gray-100'}`}>
                  <div
                    className="h-full transition-all duration-700"
                    style={{ width: `${value}%`, background: accentColor, opacity: 0.7 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Positions Table */}
        <Card className="col-span-12 lg:col-span-4" title="RISK METRICS" accent noPadding>
          <div className="p-3 space-y-2">
            {[
              { label: 'Portfolio Beta', value: portfolio.beta.toFixed(2), note: 'vs SPY', warn: portfolio.beta > 1.5 },
              { label: 'Sharpe Ratio', value: portfolio.sharpeRatio.toFixed(2), note: '1Y risk-adj return', warn: false },
              { label: 'Sortino Ratio', value: portfolio.sortinRatio.toFixed(2), note: 'downside deviation', warn: false },
              { label: 'Max Drawdown', value: fmt.percent(portfolio.maxDrawdown), note: 'peak-to-trough', warn: true },
              { label: 'Volatility (Ann.)', value: `${portfolio.volatility.toFixed(1)}%`, note: 'annualized std dev', warn: portfolio.volatility > 25 },
              { label: 'Alpha (Ann.)', value: `+${portfolio.alpha}%`, note: 'vs S&P 500', warn: false },
              { label: 'Positions', value: `${updatedPositions.length}`, note: 'individual holdings', warn: false },
              { label: 'Cash Weight', value: `${((portfolio.cash / totalValue) * 100).toFixed(1)}%`, note: fmt.currency(portfolio.cash), warn: false },
            ].map(({ label, value, note, warn }) => (
              <div key={label} className={`flex items-center justify-between py-1.5 border-b ${isDark ? 'border-acid-500/5' : 'border-lm-border'}`}>
                <div>
                  <div className={`font-mono text-xs ${isDark ? 'text-steel-400' : 'text-lm-muted'}`}>{label}</div>
                  <div className={`font-mono ${isDark ? 'text-steel-600' : 'text-lm-muted'}`} style={{ fontSize: '8px' }}>{note}</div>
                </div>
                <span className={`font-mono text-sm font-bold ${warn ? 'text-signal-yellow' : (isDark ? 'text-acid-500' : 'text-signal-blue')}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Positions Detail Table */}
      <Card title="POSITION DETAIL" subtitle="Live P&L tracking" accent noPadding>
        <div className="overflow-x-auto">
          <table className="w-full font-mono border-collapse">
            <thead>
              <tr className={`border-b ${isDark ? 'border-acid-500/10' : 'border-lm-border'}`}>
                {['SYMBOL', 'QTY', 'AVG COST', 'CURR PRICE', 'TOTAL VALUE', 'UNREALIZED P&L', '% RETURN', 'DAY P&L', 'WEIGHT', 'BETA'].map((h) => (
                  <th key={h} className={`px-3 py-2 text-left font-normal uppercase tracking-widest ${isDark ? 'text-acid-500/40' : 'text-signal-blue/50'}`} style={{ fontSize: '9px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {updatedPositions.map((pos) => (
                <tr key={pos.symbol} className={`border-b transition-colors ${isDark ? 'border-acid-500/5 hover:bg-acid-500/3' : 'border-lm-border hover:bg-lm-bg'}`}>
                  <td className="px-3 py-2">
                    <div className={`font-bold text-xs ${isDark ? 'text-steel-100' : 'text-lm-text'}`}>{pos.symbol}</div>
                    <div className={`${isDark ? 'text-steel-600' : 'text-lm-muted'} truncate`} style={{ fontSize: '9px', maxWidth: '80px' }}>{pos.name}</div>
                  </td>
                  <td className={`px-3 py-2 text-xs ${isDark ? 'text-steel-300' : 'text-lm-text'}`}>{pos.quantity.toLocaleString()}</td>
                  <td className={`px-3 py-2 text-xs ${isDark ? 'text-steel-400' : 'text-lm-muted'}`}>{fmt.currency(pos.avgCost)}</td>
                  <td className={`px-3 py-2 text-xs font-bold ${isDark ? 'text-steel-100' : 'text-lm-text'}`}>{fmt.currency(pos.currentPrice)}</td>
                  <td className={`px-3 py-2 text-xs font-bold ${isDark ? 'text-steel-100' : 'text-lm-text'}`}>{fmt.currency(pos.totalValue)}</td>
                  <td className={`px-3 py-2 text-xs font-bold ${pos.unrealizedPnL >= 0 ? (isDark ? 'text-acid-500' : 'text-emerald-600') : 'text-signal-red'}`}>
                    {pos.unrealizedPnL >= 0 ? '+' : ''}{fmt.currency(pos.unrealizedPnL)}
                  </td>
                  <td className={`px-3 py-2 text-xs font-bold ${pos.unrealizedPnLPercent >= 0 ? (isDark ? 'text-acid-500' : 'text-emerald-600') : 'text-signal-red'}`}>
                    {fmt.percent(pos.unrealizedPnLPercent)}
                  </td>
                  <td className={`px-3 py-2 text-xs ${pos.dayPnL >= 0 ? (isDark ? 'text-acid-500' : 'text-emerald-600') : 'text-signal-red'}`}>
                    {pos.dayPnL >= 0 ? '+' : ''}{fmt.currency(pos.dayPnL)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`h-1 w-12 ${isDark ? 'bg-steel-800' : 'bg-gray-100'}`}>
                        <div className="h-full" style={{ width: `${pos.weight * 5}%`, background: isDark ? '#00ff41' : '#0a84ff', opacity: 0.7 }} />
                      </div>
                      <span className={`text-xs ${isDark ? 'text-steel-300' : 'text-lm-text'}`}>{pos.weight}%</span>
                    </div>
                  </td>
                  <td className={`px-3 py-2 text-xs ${isDark ? 'text-steel-400' : 'text-lm-muted'}`}>{pos.beta.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={`border-t ${isDark ? 'border-acid-500/20' : 'border-lm-border'}`}>
                <td colSpan={4} className={`px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest ${isDark ? 'text-acid-500/60' : 'text-signal-blue/60'}`}>TOTAL</td>
                <td className={`px-3 py-2 font-mono text-xs font-bold ${isDark ? 'text-steel-50' : 'text-lm-text'}`}>{fmt.currency(totalValue - portfolio.cash)}</td>
                <td className={`px-3 py-2 font-mono text-xs font-bold ${isDark ? 'text-acid-500' : 'text-emerald-600'}`}>+{fmt.currency(portfolio.totalUnrealizedPnL)}</td>
                <td className={`px-3 py-2 font-mono text-xs font-bold ${isDark ? 'text-acid-500' : 'text-emerald-600'}`}>{fmt.percent(portfolio.totalUnrealizedPnLPercent)}</td>
                <td className={`px-3 py-2 font-mono text-xs font-bold ${isDark ? 'text-acid-500' : 'text-emerald-600'}`}>+{fmt.currency(portfolio.dayPnL)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Portfolio;