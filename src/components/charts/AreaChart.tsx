import React from 'react';
import {
  AreaChart as ReAreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import { fmt } from '@/utils/formatters';

interface AreaChartProps {
  data: { date: string; value: number; benchmark?: number }[];
  height?: number;
  showBenchmark?: boolean;
}

const CustomTooltip: React.FC<{ active?: boolean; payload?: unknown[]; label?: string; isDark: boolean }> = ({
  active, payload, label, isDark,
}) => {
  if (!active || !payload || !Array.isArray(payload) || payload.length === 0) return null;
  return (
    <div
      className={`font-mono text-xs p-2 border ${
        isDark ? 'bg-void-800 border-acid-500/20 text-steel-200' : 'bg-white border-lm-border text-lm-text shadow-md'
      }`}
    >
      <p className={`mb-1 ${isDark ? 'text-acid-500/60' : 'text-signal-blue/60'}`} style={{ fontSize: '9px' }}>{label}</p>
      {(payload as Array<{ name: string; value: number; color: string }>).map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div className="w-2 h-px" style={{ background: entry.color }} />
          <span className={isDark ? 'text-steel-400' : 'text-lm-muted'} style={{ fontSize: '9px' }}>{entry.name}:</span>
          <span className="font-bold">{fmt.currency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

const AreaChart: React.FC<AreaChartProps> = ({ data, height = 200, showBenchmark = false }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const firstValue = data[0]?.value || 0;
  const lastValue = data[data.length - 1]?.value || 0;
  const isPositive = lastValue >= firstValue;
  const mainColor = isDark ? (isPositive ? '#00ff41' : '#ff3b30') : (isPositive ? '#059669' : '#dc2626');

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReAreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={mainColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={mainColor} stopOpacity={0} />
          </linearGradient>
          {showBenchmark && (
            <linearGradient id="benchGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8890b0" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#8890b0" stopOpacity={0} />
            </linearGradient>
          )}
        </defs>

        <CartesianGrid
          strokeDasharray="0"
          stroke={isDark ? 'rgba(0,255,65,0.05)' : 'rgba(15,17,23,0.05)'}
          vertical={false}
        />

        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fill: isDark ? '#5a6080' : '#9ca3af', fontSize: 9, fontFamily: 'JetBrains Mono' }}
          tickFormatter={(v) => {
            const d = new Date(v);
            return `${d.toLocaleString('en', { month: 'short' })} ${d.getDate()}`;
          }}
          interval="preserveStartEnd"
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: isDark ? '#5a6080' : '#9ca3af', fontSize: 9, fontFamily: 'JetBrains Mono' }}
          tickFormatter={(v) => fmt.currency(v, true)}
          domain={['auto', 'auto']}
        />

        <Tooltip content={<CustomTooltip isDark={isDark} />} />

        {showBenchmark && (
          <Area
            type="monotone"
            dataKey="benchmark"
            stroke="#5a6080"
            strokeWidth={1}
            fill="url(#benchGrad)"
            strokeDasharray="3 2"
            name="SPY Benchmark"
            dot={false}
          />
        )}

        <Area
          type="monotone"
          dataKey="value"
          stroke={mainColor}
          strokeWidth={1.5}
          fill="url(#mainGrad)"
          name="Portfolio"
          dot={false}
          activeDot={{ r: 3, fill: mainColor, stroke: isDark ? '#07070f' : '#fff', strokeWidth: 2 }}
        />
      </ReAreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChart;