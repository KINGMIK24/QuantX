import React from 'react';
import { Wifi, Database, Clock, Activity } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Stock } from '@/types';
import { fmt } from '@/utils/formatters';

interface StatusBarProps {
  lastUpdate: Date;
  stocks: Stock[];
  isConnected: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ lastUpdate, stocks, isConnected }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const advancers = stocks.filter((s) => s.changePercent > 0).length;
  const decliners = stocks.filter((s) => s.changePercent < 0).length;
  const unchanged = stocks.length - advancers - decliners;

  return (
    <footer
      className={`flex-shrink-0 flex items-center justify-between px-4 border-t z-50 ${
        isDark
          ? 'bg-void-950/95 border-acid-500/10 text-steel-500'
          : 'bg-white border-lm-border text-lm-muted'
      }`}
      style={{ height: '24px' }}
    >
      {/* Left: Connection Status */}
      <div className="flex items-center gap-4 font-mono" style={{ fontSize: '10px' }}>
        <div className="flex items-center gap-1">
          <Wifi size={9} className={isConnected ? (isDark ? 'text-acid-500' : 'text-signal-blue') : 'text-signal-red'} />
          <span>{isConnected ? 'CONNECTED' : 'DISCONNECTED'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Database size={9} />
          <span>FEED: NYSE/NASDAQ/CBOE</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity size={9} className={isDark ? 'text-acid-500' : 'text-signal-blue'} />
          <span>DELAY: 15min (DEMO)</span>
        </div>
      </div>

      {/* Center: Market Breadth */}
      <div className="flex items-center gap-3 font-mono" style={{ fontSize: '10px' }}>
        <span className={isDark ? 'text-acid-500' : 'text-signal-green'}>▲ {advancers} ADV</span>
        <span className="text-signal-red">▼ {decliners} DEC</span>
        <span className={isDark ? 'text-steel-500' : 'text-lm-muted'}>— {unchanged} UNCH</span>
      </div>

      {/* Right: Last Update */}
      <div className="flex items-center gap-1 font-mono" style={{ fontSize: '10px' }}>
        <Clock size={9} />
        <span>LAST UPDATE: {fmt.timestamp(lastUpdate)}</span>
        <span className={`ml-1 w-1.5 h-1.5 rounded-full inline-block ${isDark ? 'bg-acid-500 animate-pulse' : 'bg-signal-blue animate-pulse'}`} />
      </div>
    </footer>
  );
};

export default StatusBar;