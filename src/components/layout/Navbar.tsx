import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sun, Moon, Bell, Search, RefreshCw, Menu, X,
  Zap, TrendingUp, TrendingDown, Activity,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
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
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertCount] = useState(3);
  const [isMarketOpen, setIsMarketOpen] = useState(true);
  const isDark = theme === 'dark';

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
      className={`relative flex-shrink-0 z-50 border-b ${
        isDark
          ? 'bg-void-950/95 border-acid-500/10 backdrop-blur-sm'
          : 'bg-white/95 border-lm-border backdrop-blur-sm'
      }`}
      style={{ height: '48px' }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: isDark
            ? 'linear-gradient(90deg, transparent 0%, rgba(0,255,65,0.6) 30%, rgba(0,255,65,0.6) 70%, transparent 100%)'
            : 'linear-gradient(90deg, transparent 0%, rgba(10,132,255,0.6) 30%, rgba(10,132,255,0.6) 70%, transparent 100%)',
        }}
      />

      <div className="flex items-center h-full px-3 gap-3">
        {/* Hamburger + Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onToggleSidebar}
            className={`p-1 transition-colors ${isDark ? 'text-steel-400 hover:text-acid-500' : 'text-lm-muted hover:text-lm-text'}`}
          >
            {sidebarCollapsed ? <Menu size={14} /> : <X size={14} />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-1.5">
            <div className={`w-6 h-6 flex items-center justify-center border ${isDark ? 'border-acid-500/40 bg-acid-500/5' : 'border-signal-blue/40 bg-signal-blue/5'}`}>
              <Zap size={12} className={isDark ? 'text-acid-500' : 'text-signal-blue'} />
            </div>
            <span className={`font-display font-bold text-sm tracking-wider ${isDark ? 'text-acid-500' : 'text-signal-blue'}`}>
              QUANT<span className={isDark ? 'text-steel-50' : 'text-lm-text'}>X</span>
            </span>
          </Link>

          <span className={`font-mono text-xs px-1.5 py-0.5 border ${isDark ? 'text-steel-400 border-steel-600/40' : 'text-lm-muted border-lm-border'}`}>
            {pageName}
          </span>
        </div>

        {/* Divider */}
        <div className={`w-px h-6 flex-shrink-0 ${isDark ? 'bg-steel-700' : 'bg-lm-border'}`} />

        {/* Market Status */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div
            className={`w-1.5 h-1.5 rounded-full ${isMarketOpen ? 'bg-acid-500 animate-pulse' : 'bg-signal-red'}`}
          />
          <span className={`font-mono text-xs ${isDark ? 'text-steel-400' : 'text-lm-muted'}`}>
            {isMarketOpen ? 'LIVE' : 'CLOSED'}
          </span>
        </div>

        {/* Index Tickers */}
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          {displayIndices.map((idx) => (
            <div key={idx.symbol} className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`font-mono text-xs font-bold ${isDark ? 'text-steel-300' : 'text-lm-text'}`}>
                {idx.symbol}
              </span>
              <span className={`font-mono text-xs font-bold ${isDark ? 'text-steel-100' : 'text-lm-text'}`}>
                {idx.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div className={`flex items-center gap-0.5 ${idx.changePercent >= 0 ? 'text-acid-500' : 'text-signal-red'}`}>
                {idx.changePercent >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                <span className="font-mono text-xs">{fmt.percent(idx.changePercent)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Clock */}
          <div className={`font-mono text-xs px-2 py-0.5 border flex items-center gap-1 ${isDark ? 'border-steel-700/50 text-steel-400' : 'border-lm-border text-lm-muted'}`}>
            <Activity size={10} className={isDark ? 'text-acid-500/60' : 'text-signal-blue/60'} />
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </div>

          {/* Search */}
          <button
            className={`p-1.5 border transition-colors ${isDark ? 'border-steel-700/50 text-steel-400 hover:border-acid-500/40 hover:text-acid-500' : 'border-lm-border text-lm-muted hover:border-signal-blue/40 hover:text-signal-blue'}`}
          >
            <Search size={12} />
          </button>

          {/* Alerts */}
          <button className={`relative p-1.5 border transition-colors ${isDark ? 'border-steel-700/50 text-steel-400 hover:border-acid-500/40 hover:text-acid-500' : 'border-lm-border text-lm-muted hover:border-signal-blue/40 hover:text-signal-blue'}`}>
            <Bell size={12} />
            {alertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-signal-red text-white text-xs flex items-center justify-center font-bold leading-none" style={{ fontSize: '8px' }}>
                {alertCount}
              </span>
            )}
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            className={`p-1.5 border transition-colors ${isDark ? 'border-steel-700/50 text-steel-400 hover:border-acid-500/40 hover:text-acid-500' : 'border-lm-border text-lm-muted hover:border-signal-blue/40 hover:text-signal-blue'} ${isLoading ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={12} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-1.5 border transition-all duration-300 ${
              isDark
                ? 'border-steel-700/50 text-steel-400 hover:border-acid-500/40 hover:text-acid-500'
                : 'border-lm-border text-lm-muted hover:border-signal-blue/40 hover:text-signal-blue'
            }`}
          >
            {isDark ? <Sun size={12} /> : <Moon size={12} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;