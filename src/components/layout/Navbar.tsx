import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bell, Search, RefreshCw, Menu, X,
  Zap, TrendingUp, TrendingDown, Activity,
} from 'lucide-react';
import { MarketIndex } from '@/types';
import { fmt } from '@/utils/formatters';

interface NavbarProps {
  indices: MarketIndex[];
  lastUpdate: Date;
  isLoading: boolean;
  onRefresh: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  indices, lastUpdate, isLoading, onRefresh, sidebarCollapsed, onToggleSidebar,
}) => {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertCount] = useState(3);
  const [isMarketOpen, setIsMarketOpen] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const hour = now.getHours();
      const day = now.getDay();
      setIsMarketOpen(day > 0 && day < 6 && hour >= 9 && hour < 16);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const displayIndices = indices.slice(0, 4);
  const pageName = location.pathname.replace('/', '').toUpperCase() || 'DASHBOARD';

  return (
    <header
      className="relative flex-shrink-0 z-50 border-b"
      style={{
        height: '44px',
        background: '#0c0c14',
        borderColor: 'rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="flex items-center h-full px-3 gap-3">
        {/* Hamburger + Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onToggleSidebar}
            className="p-1 transition-colors"
            style={{ color: 'rgba(255, 255, 255, 0.45)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)')}
          >
            {sidebarCollapsed ? <Menu size={14} /> : <X size={14} />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-1.5">
            <Zap size={14} style={{ color: '#e040fb' }} />
            <span className="font-sans font-bold text-sm" style={{ color: '#fff', letterSpacing: '-0.02em' }}>
              QUANT<span style={{ color: '#e040fb' }}>X</span>
            </span>
          </Link>

          <span
            className="font-mono px-1.5 py-0.5 rounded"
            style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: '10px', background: 'rgba(255, 255, 255, 0.05)' }}
          >
            {pageName}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-5 flex-shrink-0" style={{ background: 'rgba(255, 255, 255, 0.08)' }} />

        {/* Market Status */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div
            className={`w-1.5 h-1.5 rounded-full ${isMarketOpen ? 'animate-pulse' : ''}`}
            style={{ background: isMarketOpen ? '#00c896' : '#ff4d4d' }}
          />
          <span className="font-mono" style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '10px' }}>
            {isMarketOpen ? 'LIVE' : 'CLOSED'}
          </span>
        </div>

        {/* Index Tickers */}
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          {displayIndices.map((idx) => (
            <div key={idx.symbol} className="flex items-center gap-1.5 flex-shrink-0">
              <span className="font-mono font-bold" style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '11px' }}>
                {idx.symbol}
              </span>
              <span className="font-mono" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '11px' }}>
                {idx.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div className="flex items-center gap-0.5" style={{ color: idx.changePercent >= 0 ? '#00c896' : '#ff4d4d' }}>
                {idx.changePercent >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                <span className="font-mono" style={{ fontSize: '10px' }}>{fmt.percent(idx.changePercent)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Clock */}
          <div
            className="font-mono px-2 py-0.5 rounded flex items-center gap-1"
            style={{ background: 'rgba(255, 255, 255, 0.04)', color: 'rgba(255, 255, 255, 0.45)', fontSize: '10px' }}
          >
            <Activity size={9} style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </div>

          {[
            { icon: Search, onClick: undefined },
            { icon: Bell, onClick: undefined, badge: alertCount },
            { icon: RefreshCw, onClick: onRefresh, spin: isLoading },
          ].map(({ icon: Icon, onClick, badge, spin }, i) => (
            <button
              key={i}
              onClick={onClick}
              className={`p-1.5 rounded transition-colors ${spin ? 'animate-spin' : ''}`}
              style={{ color: 'rgba(255, 255, 255, 0.35)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.35)')}
            >
              <Icon size={13} />
              {badge && badge > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-3 h-3 text-white flex items-center justify-center font-bold leading-none rounded-full"
                  style={{ fontSize: '8px', background: '#ff4d4d' }}
                >
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;