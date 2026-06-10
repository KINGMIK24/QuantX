import React from 'react';
import {
  AreaChart as ReAreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { fmt } from '@/utils/formatters';

interface AreaChartProps {
  data: { date: string; value: number; benchmark?: number }[];
  height?: number;
  showBenchmark?: boolean;
}

const CustomTooltip: React.FC<{ active?: boolean; payload?: unknown[] }> = ({
  active, payload,
}) => {
  if (!active || !payload || !Array.isArray(payload) || payload.length === 0) return null;
  return (
    <div
      className="font-mono text-xs p-2 rounded-md"
      style={{
        background: '#1a1a28',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#fff',
      }}
    >
      {(payload as Array<{ name: string; value: number; color: string }>).map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div className="w-2 h-px" style={{ background: entry.color }} />
          <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '11px' }}>{entry.name}:</span>
          <span className="font-bold">{fmt.currency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

const AreaChart: React.FC<AreaChartProps> = ({ data, height = 200, showBenchmark = false }) => {
  const firstValue = data[0]?.value || 0;
  const lastValue = data[data.length - 1]?.value || 0;
  const isPositive = lastValue >= firstValue;
  const mainColor = '#e040fb';
  const negColor = '#ff4d4d';
  const strokeColor = isPositive ? mainColor : negColor;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReAreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.15} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
          {showBenchmark && (
            <linearGradient id="benchGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.08)" stopOpacity={1} />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" stopOpacity={1} />
            </linearGradient>
          )}
        </defs>

        <CartesianGrid
          strokeDasharray="0"
          stroke="rgba(255, 255, 255, 0.04)"
          vertical={false}
        />

        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255, 255, 255, 0.25)', fontSize: 10, fontFamily: 'Space Mono' }}
          tickFormatter={(v) => {
            const d = new Date(v);
            return `${d.toLocaleString('en', { month: 'short' })} ${d.getDate()}`;
          }}
          interval="preserveStartEnd"
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255, 255, 255, 0.25)', fontSize: 10, fontFamily: 'Space Mono' }}
          tickFormatter={(v) => fmt.currency(v, true)}
          domain={['auto', 'auto']}
        />

        <Tooltip content={<CustomTooltip />} />

        {showBenchmark && (
          <Area
            type="monotone"
            dataKey="benchmark"
            stroke="rgba(255, 255, 255, 0.25)"
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
          stroke={strokeColor}
          strokeWidth={1.5}
          fill="url(#mainGrad)"
          name="Portfolio"
          dot={false}
          activeDot={{ r: 3, fill: strokeColor, stroke: '#13131f', strokeWidth: 2 }}
        />
      </ReAreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChart;