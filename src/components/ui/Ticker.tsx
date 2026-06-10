import React from 'react'

interface TickerProps {
  symbol: string
  price: number
  change: number
  changePercent: number
}

const Ticker: React.FC<TickerProps> = ({ symbol, price, change, changePercent }) => {
  const isPositive = change >= 0
  const deltaColor = isPositive ? '#00c896' : '#ff4d4d'

  return (
    <div
      className="font-mono p-3 border-b"
      style={{
        background: '#0f0f17',
        borderColor: 'rgba(255, 255, 255, 0.06)',
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-white">{symbol}</div>
          <p style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '11px' }}>
            ${price.toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold" style={{ color: deltaColor, fontSize: '11px' }}>
            {isPositive ? '+' : ''}
            {change.toFixed(2)}
          </p>
          <p style={{ color: deltaColor, fontSize: '10px' }}>
            {isPositive ? '+' : ''}
            {changePercent.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  )
}

export default Ticker
