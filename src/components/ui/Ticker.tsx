import React from 'react'
import Badge from './Badge'

interface TickerProps {
  symbol: string
  price: number
  change: number
  changePercent: number
}

const Ticker: React.FC<TickerProps> = ({ symbol, price, change, changePercent }) => {
  const isPositive = change >= 0
  const color = isPositive ? 'text-green-400' : 'text-red-400'
  const badgeVariant = isPositive ? 'success' : 'danger'

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{symbol}</h3>
          <p className="text-2xl font-semibold text-white">${price.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-semibold ${color}`}>
            {isPositive ? '+' : ''}
            {change.toFixed(2)}
          </p>
          <Badge
            label={`${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`}
            variant={badgeVariant}
            size="sm"
          />
        </div>
      </div>
    </div>
  )
}

export default Ticker
