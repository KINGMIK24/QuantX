import React, { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
  strokeWidth?: number;
  showArea?: boolean;
}

const Sparkline: React.FC<SparklineProps> = ({
  data, width = 64, height = 24, positive, strokeWidth = 1.5, showArea = true,
}) => {
  const { path, areaPath, isPositive } = useMemo(() => {
    if (!data || data.length < 2) return { path: '', areaPath: '', isPositive: true };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const xStep = width / (data.length - 1);
    const yScale = (height - 2) / range;

    const points = data.map((v, i) => ({
      x: i * xStep,
      y: height - 1 - (v - min) * yScale,
    }));

    const linePath = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');

    const areaP = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${height} L 0 ${height} Z`;

    const firstVal = data[0];
    const lastVal = data[data.length - 1];
    const pos = positive !== undefined ? positive : lastVal >= firstVal;

    return { path: linePath, areaPath: areaP, isPositive: pos };
  }, [data, width, height, positive]);

  const color = isPositive ? '#00c896' : '#ff4d4d';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-grad-${isPositive}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {showArea && (
        <path d={areaPath} fill={`url(#spark-grad-${isPositive})`} />
      )}
      <path d={path} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default Sparkline;