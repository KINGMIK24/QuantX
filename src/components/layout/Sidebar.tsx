import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, Briefcase, Filter,
  BarChart2, Terminal as TerminalIcon, ChevronRight,
  Target, Cpu, Shield, Settings,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import type { ViewMode } from '@/types';

interface NavItem {
  id: ViewMode;
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  group?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, group: 'CORE' },
  { id: 'markets', label: 'Markets', path: '/markets', icon: TrendingUp, badge: 'LIVE', group: 'CORE' },
  { id: 'portfolio', label: 'Portfolio', path: '/portfolio', icon: Briefcase, group: 'CORE' },
  { id: 'screener', label: 'Screener', path: '/screener', icon: Filter, badge: 'AI', group: 'RESEARCH' },
  { id: 'analytics', label: 'Analytics', path: '/analytics', icon: BarChart2, group: 'RESEARCH' },
  { id: 'terminal', label: 'Terminal', path: '/terminal', icon: TerminalIcon, badge: 'PRO', group: 'TOOLS' },
];

const GROUPS = ['CORE', 'RESEARCH', 'TOOLS'];

interface SidebarProps {
  activeView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, collapsed }) => {
  const { theme } = useTheme();
  const location = useLocation();
  const isDark = theme === 'dark';

  if (collapsed) return null;

  const currentPath = location.pathname;

  return (
    <aside
      className={`flex-shrink-0 flex flex-col border-r transition-all duration-300 ${
        isDark
          ? 'bg-void-950/80 border-acid-500/10'
          : 'bg-white border-lm-border'
      }`}
      style={{ width: '200px' }}
    >
      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {GROUPS.map((group) => {
          const groupItems = NAV_ITEMS.filter((item) => item.group === group);
          return (
            <div key={group} className="mb-2">
              {/* Group Label */}
              <div className={`px-4 py-1.5 font-mono text-xs tracking-widest ${isDark ? 'text-acid-500/30' : 'text-signal-blue/40'}`}>
                {group}
              </div>

              {groupItems.map((item) => {
                const isActive = currentPath === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => onNavigate(item.id)}
                    className={`group relative flex items-center gap-2.5 px-4 py-2 mx-2 transition-all duration-150 ${
                      isActive
                        ? isDark
                          ? 'bg-acid-500/8 text-acid-500 border border-acid-500/20'
                          : 'bg-signal-blue/8 text-signal-blue border border-signal-blue/20'
                        : isDark
                          ? 'text-steel-400 hover:text-steel-100 hover:bg-steel-800/30 border border-transparent'
                          : 'text-lm-muted hover:text-lm-text hover:bg-lm-bg border border-transparent'
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-px ${isDark ? 'bg-acid-500' : 'bg-signal-blue'}`}
                      />
                    )}

                    <Icon
                      size={13}
                      className={`flex-shrink-0 transition-colors ${
                        isActive
                          ? isDark ? 'text-acid-500' : 'text-signal-blue'
                          : 'text-current'
                      }`}
                    />

                    <span className="font-mono text-xs tracking-wide flex-1">{item.label}</span>

                    {item.badge && (
                      <span
                        className={`font-mono text-xs px-1 py-0 border leading-none ${
                          item.badge === 'LIVE'
                            ? 'text-acid-500 border-acid-500/40'
                            : item.badge === 'AI'
                              ? 'text-signal-purple border-signal-purple/40'
                              : 'text-signal-yellow border-signal-yellow/40'
                        }`}
                        style={{ fontSize: '8px' }}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <ChevronRight size={10} className={isDark ? 'text-acid-500/60' : 'text-signal-blue/60'} />
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* System Stats */}
      <div className={`p-3 border-t ${isDark ? 'border-acid-500/10' : 'border-lm-border'}`}>
        <div className={`font-mono text-xs space-y-1.5 ${isDark ? 'text-steel-500' : 'text-lm-muted'}`}>
          {[
            { icon: Target, label: 'SIGNALS', value: '142', color: isDark ? 'text-acid-500' : 'text-signal-blue' },
            { icon: Cpu, label: 'LATENCY', value: '2ms', color: isDark ? 'text-acid-500' : 'text-signal-blue' },
            { icon: Shield, label: 'UPTIME', value: '99.9%', color: isDark ? 'text-acid-500' : 'text-signal-blue' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Icon size={9} className={color} />
                <span style={{ fontSize: '9px' }}>{label}</span>
              </div>
              <span className={`font-bold ${color}`} style={{ fontSize: '9px' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Settings Link */}
        <button className={`mt-2 w-full flex items-center gap-1.5 px-2 py-1.5 border transition-colors ${isDark ? 'border-steel-700/40 text-steel-500 hover:text-steel-300 hover:border-steel-600' : 'border-lm-border text-lm-muted hover:text-lm-text'}`}>
          <Settings size={10} />
          <span style={{ fontSize: '9px' }} className="font-mono tracking-widest uppercase">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;