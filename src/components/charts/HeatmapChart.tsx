import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { SectorPerformance } from '@/types';
import { fmt } from '@/utils/formatters';

interface HeatmapChartProps {
  sectors: SectorPerformance[];
}

const getColor = (pct: number, isDark: boolean): string => {
  const intensity = Math.min(Math.abs(pct) / 3, 1);
  if (pct > 0) {
    return isDark
      ? `rgba(0, 255, 65, ${0.08 + intensity * 0.32})`
      : `rgba(5, 150, 105, ${0.1 + intensity * 0.35})`;
  } else {
    return isDark
      ? `rgba(255, 59, 48, ${0.08 + intensity * 0.32})`
      : `rgba(220, 38, 38, ${0.1 + intensity * 0.35})`;
  }
};

const getBorderColor = (pct: number, isDark: boolean): string => {
  if (pct > 0) return isDark ? 'rgba(0,255,65,0.2)' : 'rgba(5,150,105,0.3)';
  return isDark ? 'rgba(255,59,48,0.2)' : 'rgba(220,38,38,0.3)';
};

const HeatmapChart: React.FC<HeatmapChartProps> = ({ sectors }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const totalMcap = sectors.reduce((s, sec) => s + sec.marketCap, 0);

  return (
    <div className="w-full h-full grid grid-cols-4 grid-rows-3 gap-1">
      {sectors.slice(0, 11).map((sector) => {
        const weight = sector.marketCap / totalMcap;
        const pct = sector.changePercent;
        const bg = getColor(pct, isDark);
        const border = getBorderColor(pct, isDark);
        const textColor = pct >= 0
          ? (isDark ? '#00ff41' : '#059669')
          : (isDark ? '#ff3b30' : '#dc2626');

        return (
          <div
            key={sector.sector}
            className="relative p-2 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:opacity-90 overflow-hidden"
            style={{
              background: bg,
              border: `1px solid ${border}`,
              gridColumn: weight > 0.12 ? 'span 2' : 'span 1',
            }}
          >
            {/* Background pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, ${border} 0, ${border} 1px, transparent 0, transparent 50%)`,
                backgroundSize: '6px 6px',
              }}
            />

            <div className="relative z-10">
              <div className={`font-mono font-bold leading-tight ${isDark ? 'text-steel-200' : 'text-gray-800'}`} style={{ fontSize: '10px' }}>
                {sector.sector}
              </div>
              <div className={`font-mono mt-0.5 ${isDark ? 'text-steel-500' : 'text-gray-500'}`} style={{ fontSize: '9px' }}>
                {fmt.currency(sector.marketCap, true)} cap
              </div>
            </div>

            <div className="relative z-10 flex items-end justify-between">
              <span className="font-mono font-bold" style={{ color: textColor, fontSize: '13px' }}>
                {fmt.percent(pct)}
              </span>
              <span className={`font-mono ${isDark ? 'text-steel-500' : 'text-gray-500'}`} style={{ fontSize: '8px' }}>
                ↑ {sector.topMover}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HeatmapChart;