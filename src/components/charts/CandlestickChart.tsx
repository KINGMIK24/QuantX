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
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center justify-center">
      <div className="text-center text-slate-400">
        <p className="text-lg font-semibold mb-2">Candlestick Chart</p>
        <p className="text-sm">{data.length} candles</p>
      </div>
    </div>
  )
}

export default CandlestickChart
