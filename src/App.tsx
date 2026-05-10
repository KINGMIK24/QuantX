import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import StatusBar from '@/components/layout/StatusBar';
import Dashboard from '@/pages/Dashboard';
import Markets from '@/pages/Markets';
import Portfolio from '@/pages/Portfolio';
import Screener from '@/pages/Screener';
import Analytics from '@/pages/Analytics';
import Terminal from '@/pages/Terminal';
import { useMarketData } from '@/hooks/useMarketData';
import type { ViewMode } from '@/types';

const App: React.FC = () => {
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const marketData = useMarketData();

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === 'dark'
          ? 'bg-void-900 text-steel-100'
          : 'bg-lm-bg text-lm-text'
      } font-mono overflow-hidden`}
    >
      {/* Grid Background Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            theme === 'dark'
              ? 'linear-gradient(rgba(0,255,65,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.025) 1px, transparent 1px)'
              : 'linear-gradient(rgba(15,17,23,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,17,23,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top Navbar */}
      <Navbar
        indices={marketData.indices}
        lastUpdate={marketData.lastUpdate}
        isLoading={marketData.isLoading}
        onRefresh={marketData.refreshData}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((p) => !p)}
      />

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar */}
        <Sidebar
          activeView={activeView}
          onNavigate={(view) => setActiveView(view)}
          collapsed={sidebarCollapsed}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  stocks={marketData.stocks}
                  indices={marketData.indices}
                  news={marketData.news}
                  portfolio={marketData.stocks}
                />
              }
            />
            <Route
              path="/markets"
              element={<Markets stocks={marketData.stocks} indices={marketData.indices} />}
            />
            <Route path="/portfolio" element={<Portfolio stocks={marketData.stocks} />} />
            <Route path="/screener" element={<Screener stocks={marketData.stocks} />} />
            <Route
              path="/analytics"
              element={<Analytics stocks={marketData.stocks} indices={marketData.indices} />}
            />
            <Route
              path="/terminal"
              element={<Terminal stocks={marketData.stocks} indices={marketData.indices} />}
            />
          </Routes>
        </main>
      </div>

      {/* Status Bar */}
      <StatusBar
        lastUpdate={marketData.lastUpdate}
        stocks={marketData.stocks}
        isConnected={true}
      />
    </div>
  );
};

export default App;