import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, Briefcase, Filter,
  BarChart2, Terminal as TerminalIcon, ChevronRight,
  Target, Cpu, Shield, Settings,
} from 'lucide-react';
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

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, collapsed }) => {
  const location = useLocation();

  if (collapsed) return null;

  const currentPath = location.pathname;

  return (
    <aside
      className="flex-shrink-0 flex flex-col border-r transition-all duration-300"
      style={{
        width: '200px',
        background: '#0f0f17',
        borderColor: 'rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {GROUPS.map((group) => {
          const groupItems = NAV_ITEMS.filter((item) => item.group === group);
          return (
            <div key={group} className="mb-2">
              {/* Group Label */}
              <div
                className="px-4 py-1.5 font-mono uppercase"
                style={{ color: 'rgba(255, 255, 255, 0.25)', letterSpacing: '0.08em', fontSize: '10px' }}
              >
                // {group}
              </div>

              {groupItems.map((item) => {
                const isActive = currentPath === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => onNavigate(item.id)}
                    className="group relative flex items-center gap-2.5 px-4 py-2 mx-1 rounded-md transition-all duration-150"
                    style={{
                      background: isActive ? 'rgba(224, 64, 251, 0.08)' : 'transparent',
                      borderLeft: isActive ? '2px solid #e040fb' : '2px solid transparent',
                      color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.45)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)';
                      }
                    }}
                  >
                    <Icon size={14} className="flex-shrink-0" />

                    <span className="font-sans text-xs flex-1" style={{ fontSize: '13px' }}>{item.label}</span>

                    {item.badge && (
                      <span
                        className="font-mono px-1 rounded"
                        style={{
                          fontSize: '9px',
                          background: item.badge === 'LIVE' ? 'rgba(0, 200, 150, 0.15)' : item.badge === 'AI' ? 'rgba(224, 64, 251, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                          color: item.badge === 'LIVE' ? '#00c896' : item.badge === 'AI' ? '#e040fb' : 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <ChevronRight size={10} style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* System Stats */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
        <div className="font-mono space-y-1.5" style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '10px' }}>
          {[
            { icon: Target, label: 'SIGNALS', value: '142' },
            { icon: Cpu, label: 'LATENCY', value: '2ms' },
            { icon: Shield, label: 'UPTIME', value: '99.9%' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Icon size={9} />
                <span>{label}</span>
              </div>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Settings Link */}
        <button
          className="mt-2 w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-colors font-mono uppercase tracking-wider"
          style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.35)';
          }}
        >
          <Settings size={10} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;