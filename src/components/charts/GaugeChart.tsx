import React from 'react';

interface GaugeChartProps {
  value: number;
  label: string;
  sublabel?: string;
  size?: number;
  thresholds?: { value: number; color: string }[];
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value, label, sublabel, size = 120,
  thresholds = [
    { value: 30, color: '#ff4d4d' },
    { value: 50, color: 'rgba(255, 255, 255, 0.25)' },
    { value: 70, color: '#00c896' },
    { value: 100, color: '#e040fb' },
  ],
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const startAngle = -225;
  const endAngle = 45;
  const totalRange = endAngle - startAngle;
  const valueAngle = startAngle + (clampedValue / 100) * totalRange;

  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) * 0.75;
  const strokeWidth = (size / 2) * 0.1;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const polarToXY = (angle: number, r: number) => ({
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  });

  const describeArc = (from: number, to: number) => {
    const start = polarToXY(from, radius);
    const end = polarToXY(to, radius);
    const largeArc = to - from > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  const currentThreshold = thresholds.find((t) => clampedValue <= t.value) || thresholds[thresholds.length - 1];
  const needleColor = currentThreshold.color;

  const needleTip = polarToXY(valueAngle, radius * 0.85);
  const needleBase1 = polarToXY(valueAngle - 90, strokeWidth * 0.3);
  const needleBase2 = polarToXY(valueAngle + 90, strokeWidth * 0.3);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size}`} overflow="visible">
        {/* Background track */}
        <path
          d={describeArc(startAngle, endAngle)}
          fill="none"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
        />

        {/* Colored segments */}
        {thresholds.map((threshold, i) => {
          const prevValue = i === 0 ? 0 : thresholds[i - 1].value;
          const fromAngle = startAngle + (prevValue / 100) * totalRange;
          const toAngle = startAngle + (threshold.value / 100) * totalRange;
          const opacity = clampedValue >= prevValue ? 0.4 : 0.1;
          return (
            <path
              key={threshold.value}
              d={describeArc(fromAngle, toAngle)}
              fill="none"
              stroke={threshold.color}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              opacity={opacity}
            />
          );
        })}

        {/* Active arc */}
        <path
          d={describeArc(startAngle, valueAngle)}
          fill="none"
          stroke={needleColor}
          strokeWidth={strokeWidth * 0.4}
          strokeLinecap="butt"
          opacity={0.7}
        />

        {/* Needle */}
        <polygon
          points={`${needleTip.x},${needleTip.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
          fill={needleColor}
          opacity={0.7}
        />

        {/* Center circle */}
        <circle cx={cx} cy={cy} r={strokeWidth * 0.5} fill={needleColor} opacity={0.6} />
        <circle cx={cx} cy={cy} r={strokeWidth * 0.25} fill="#0a0a0f" />

        {/* Value text */}
        <text
          x={cx}
          y={cy + size * 0.22}
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.8)"
          fontFamily="Inter, sans-serif"
          fontWeight="700"
          fontSize={size * 0.14}
        >
          {clampedValue.toFixed(0)}
        </text>
      </svg>

      <div className="text-center -mt-2">
        <div className="font-mono uppercase tracking-widest" style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '10px' }}>
          {label}
        </div>
        {sublabel && (
          <div className="font-mono mt-0.5" style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.25)' }}>
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
};

export default GaugeChart;