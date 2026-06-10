import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Target, Shield, Activity } from 'lucide-react';
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
  const portfolio = MOCK_PORTFOLIO;

  const portfolioHistory = useMemo(() => generatePortfolioHistory(365), []);
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
      color: p.unrealizedPnL >= 0 ? ('#00c896') : '#ff4d4d',
    }));
  }, [updatedPositions, totalValue, ]);

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

  const accentColor = '#00c896';
  const muted = 'rgba(176,184,204,0.5)';

  return (
    <div className="p-4 space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans font-semibold" style={{ fontSize: '20px', letterSpacing: '-0.02em', color: '#fff' }}>
            Portfolio Command Center
          </h1>
          <p className="font-mono mt-0.5" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)' }}>
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
           <Card key={label}>
             <div className="flex items-start justify-between">
               <div>
                 <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.45)' }} className="font-mono uppercase tracking-widest mb-1">{label}</div>
                 <div style={{ fontSize: '20px', color: '#fff' }} className="font-mono font-bold">{value}</div>
                 <div style={{ fontSize: '12px', color: pos ? '#00c896' : '#ff4d4d' }} className="font-mono mt-1 flex items-center gap-1">
                   {pos ? <TrendingUp size={9} /> : <TrendingDown size={9} />} {sub}
                 </div>
               </div>
               <div style={{
                 padding: '6px',
                 border: '1px solid rgba(0, 200, 150, 0.1)',
                 color: 'rgba(0, 200, 150, 0.4)',
               }}><Icon size={14} /></div>
             </div>
           </Card>
         ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-3">
        {/* Performance Chart */}
        <Card className="col-span-12 lg:col-span-8" title="EQUITY CURVE" subtitle="1Y portfolio vs benchmark"  noPadding>
          <div className="p-3 pt-2">
            <AreaChart data={portfolioHistory} height={200} showBenchmark />
          </div>
        </Card>

        {/* Factor Radar */}
        <Card className="col-span-12 lg:col-span-4" title="FACTOR EXPOSURE" subtitle="Portfolio quality dimensions" >
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(0, 200, 150, 0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 9, fontFamily: 'Space Mono' }} />
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
        <Card className="col-span-12 lg:col-span-5" title="POSITION ALLOCATION" subtitle="% of portfolio by holding"  noPadding>
          <div className="p-3">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={allocationData} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" stroke="rgba(0, 200, 150, 0.08)" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 9, fontFamily: 'Space Mono' }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 10, fontFamily: 'Space Mono', fontWeight: 'bold' }} width={45} />
                <Tooltip
                  formatter={(v: number) => [`${v}%`, 'Weight']}
                  contentStyle={{
                    background: '#13131f',
                    border: '1px solid rgba(0, 200, 150, 0.2)',
                    fontFamily: 'Space Mono',
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.7)',
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
        <Card className="col-span-12 lg:col-span-3" title="SECTOR ALLOCATION"  noPadding>
          <div className="p-3 space-y-2">
{sectorAlloc.map(({ sector, value }) => (
               <div key={sector}>
                 <div className="flex items-center justify-between mb-1">
                   <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)' }} className="font-mono">{sector}</span>
                   <span style={{ fontSize: '10px', color: '#fff' }} className="font-mono font-bold">{value}%</span>
                 </div>
                 <div style={{ height: '4px', width: '100%', background: 'rgba(255, 255, 255, 0.08)' }} className="h-1">
                   <div
                     className="h-full transition-all duration-700"
                     style={{ width: `${value}%`, background: '#00c896', opacity: 0.7 }}
                   />
                 </div>
               </div>
             ))}
          </div>
        </Card>

        {/* Positions Table */}
        <Card className="col-span-12 lg:col-span-4" title="RISK METRICS"  noPadding>
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
               <div key={label} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}>
                 <div>
                   <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)' }} className="font-mono">{label}</div>
                   <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)' }} className="font-mono">{note}</div>
                 </div>
                 <span style={{ fontSize: '14px', color: warn ? 'rgba(255, 255, 255, 0.4)' : '#00c896' }} className="font-mono font-bold">
                   {value}
                 </span>
               </div>
             ))}
          </div>
        </Card>
      </div>

      {/* Positions Detail Table */}
      <Card title="POSITION DETAIL" subtitle="Live P&L tracking" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full font-mono border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                {['SYMBOL', 'QTY', 'AVG COST', 'CURR PRICE', 'TOTAL VALUE', 'UNREALIZED P&L', '% RETURN', 'DAY P&L', 'WEIGHT', 'BETA'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-normal uppercase tracking-widest" style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.35)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {updatedPositions.map((pos) => (
                <tr key={pos.symbol} className="border-b transition-colors" style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                >
                  <td className="px-3 py-2">
                    <div style={{ fontSize: '12px', color: '#fff' }} className="font-mono font-bold">{pos.symbol}</div>
                    <div style={{ fontSize: '9px', maxWidth: '80px', color: 'rgba(255, 255, 255, 0.35)' }} className="truncate">{pos.name}</div>
                  </td>
                  <td style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }} className="px-3 py-2">{pos.quantity.toLocaleString()}</td>
                  <td style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }} className="px-3 py-2">{fmt.currency(pos.avgCost)}</td>
                  <td style={{ fontSize: '12px', color: '#fff' }} className="px-3 py-2 font-bold">{fmt.currency(pos.currentPrice)}</td>
                  <td style={{ fontSize: '12px', color: '#fff' }} className="px-3 py-2 font-bold">{fmt.currency(pos.totalValue)}</td>
                  <td style={{ fontSize: '12px', color: pos.unrealizedPnL >= 0 ? '#00c896' : '#ff4d4d' }} className="px-3 py-2 font-bold">
                    {pos.unrealizedPnL >= 0 ? '+' : ''}{fmt.currency(pos.unrealizedPnL)}
                  </td>
                  <td style={{ fontSize: '12px', color: pos.unrealizedPnLPercent >= 0 ? '#00c896' : '#ff4d4d' }} className="px-3 py-2 font-bold">
                    {fmt.percent(pos.unrealizedPnLPercent)}
                  </td>
                  <td style={{ fontSize: '12px', color: pos.dayPnL >= 0 ? '#00c896' : '#ff4d4d' }} className="px-3 py-2">
                    {pos.dayPnL >= 0 ? '+' : ''}{fmt.currency(pos.dayPnL)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <div style={{ height: '4px', width: '48px', background: 'rgba(255, 255, 255, 0.08)' }}>
                        <div style={{ width: `${pos.weight * 5}%`, background: '#00c896', opacity: 0.7 }} />
                      </div>
                      <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>{pos.weight}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }} className="px-3 py-2">{pos.beta.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}>
                <td colSpan={4} style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.45)' }} className="px-3 py-2 font-mono font-bold uppercase tracking-widest">TOTAL</td>
                <td style={{ fontSize: '12px', color: '#fff' }} className="px-3 py-2 font-mono font-bold">{fmt.currency(totalValue - portfolio.cash)}</td>
                <td style={{ fontSize: '12px', color: '#00c896' }} className="px-3 py-2 font-mono font-bold">+{fmt.currency(portfolio.totalUnrealizedPnL)}</td>
                <td style={{ fontSize: '12px', color: '#00c896' }} className="px-3 py-2 font-mono font-bold">{fmt.percent(portfolio.totalUnrealizedPnLPercent)}</td>
                <td style={{ fontSize: '12px', color: '#00c896' }} className="px-3 py-2 font-mono font-bold">+{fmt.currency(portfolio.dayPnL)}</td>
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