import React from 'react';
import { SectorPerformance } from '@/types';
import { fmt } from '@/utils/formatters';

interface HeatmapChartProps {
  sectors: SectorPerformance[];
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ sectors }) => {
  const totalMcap = sectors.reduce((s, sec) => s + sec.marketCap, 0);

  return (
    <div className="w-full h-full grid grid-cols-4 grid-rows-3 gap-px">
      {sectors.slice(0, 11).map((sector) => {
        const weight = sector.marketCap / totalMcap;
        const pct = sector.changePercent;

        let bg: string;
        let textColor: string;
        if (pct > 0) {
          bg = 'rgba(0, 200, 150, 0.25)';
          textColor = '#00c896';
        } else if (pct < 0) {
          bg = 'rgba(255, 77, 77, 0.2)';
          textColor = '#ff4d4d';
        } else {
          bg = 'rgba(255, 255, 255, 0.05)';
          textColor = 'rgba(255, 255, 255, 0.5)';
        }

        return (
          <div
            key={sector.sector}
            className="relative p-2 flex flex-col justify-between cursor-pointer transition-all duration-150 overflow-hidden rounded"
            style={{
              background: bg,
              gridColumn: weight > 0.12 ? 'span 2' : 'span 1',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            <div>
              <div className="font-mono font-bold leading-tight" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)' }}>
                {sector.sector}
              </div>
              <div className="font-mono mt-0.5" style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.35)' }}>
                {fmt.currency(sector.marketCap, true)}
              </div>
            </div>

            <div className="flex items-end justify-between mt-1">
              <span className="font-mono font-bold" style={{ color: textColor, fontSize: '13px' }}>
                {fmt.percent(pct)}
              </span>
              <span className="font-mono" style={{ fontSize: '8px', color: 'rgba(255, 255, 255, 0.25)' }}>
                {sector.topMover}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HeatmapChart;