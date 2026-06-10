import React from 'react'

interface CandlestickChartProps {
  data: any[]
  width?: number
  height?: number
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  width = 800,
  height = 400,
}) => {
  return (
    <div className="ghost-card p-4 flex items-center justify-center" style={{ width, height }}>
      <div className="text-center" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
        <p className="font-mono text-lg font-bold mb-2 uppercase tracking-widest" style={{ color: '#00e5ff' }}>// Candlestick Chart</p>
        <p className="font-mono text-sm">{data.length} candles</p>
      </div>
    </div>
  )
}

export default CandlestickChart
