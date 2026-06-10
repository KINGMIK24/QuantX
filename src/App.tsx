import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const marketData = useMarketData();

  return (
    <div
      className="min-h-screen flex flex-col font-sans overflow-hidden"
      style={{ background: '#0a0a0f', color: '#fff' }}
    >
      {/* Top Navbar */}
      <Navbar
        indices={marketData.indices}
        lastUpdate={marketData.lastUpdate}
        isLoading={marketData.isLoading}
        onRefresh={marketData.refreshData}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((p) => !p)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeView={activeView}
          onNavigate={(view) => setActiveView(view)}
          collapsed={sidebarCollapsed}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden" style={{ background: '#0a0a0f' }}>
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