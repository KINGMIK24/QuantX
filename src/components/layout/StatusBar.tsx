import React from 'react';
import { Wifi, Database, Clock, Activity } from 'lucide-react';
import { Stock } from '@/types';
import { fmt } from '@/utils/formatters';

interface StatusBarProps {
  lastUpdate: Date;
  stocks: Stock[];
  isConnected: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ lastUpdate, stocks, isConnected }) => {
  const advancers = stocks.filter((s) => s.changePercent > 0).length;
  const decliners = stocks.filter((s) => s.changePercent < 0).length;
  const unchanged = stocks.length - advancers - decliners;

  return (
    <footer
      className="flex-shrink-0 flex items-center justify-between px-4 border-t z-50"
      style={{
        height: '22px',
        background: '#080810',
        borderColor: 'rgba(255, 255, 255, 0.06)',
        color: 'rgba(255, 255, 255, 0.35)',
      }}
    >
      {/* Left: Connection Status */}
      <div className="flex items-center gap-4 font-mono" style={{ fontSize: '10px' }}>
        <div className="flex items-center gap-1">
          <Wifi size={8} style={{ color: isConnected ? '#00c896' : '#ff4d4d' }} />
          <span>{isConnected ? 'CONNECTED' : 'DISCONNECTED'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Database size={8} />
          <span>FEED: NYSE/NASDAQ/CBOE</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity size={8} />
          <span>DELAY: 15min</span>
        </div>
      </div>

      {/* Center: Market Breadth */}
      <div className="flex items-center gap-3 font-mono" style={{ fontSize: '10px' }}>
        <span style={{ color: '#00c896' }}>▲ {advancers}</span>
        <span style={{ color: '#ff4d4d' }}>▼ {decliners}</span>
        <span style={{ color: 'rgba(255, 255, 255, 0.25)' }}>— {unchanged}</span>
      </div>

      {/* Right: Last Update */}
      <div className="flex items-center gap-1 font-mono" style={{ fontSize: '10px' }}>
        <Clock size={8} />
        <span>{fmt.timestamp(lastUpdate)}</span>
      </div>
    </footer>
  );
};

export default StatusBar;