import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { fleetService } from '@/services/fleetService';

export const AppLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openAlertsCount, setOpenAlertsCount] = useState<number>(0);

  const refreshAlertCount = async () => {
    try {
      const alerts = await fleetService.getAlerts();
      const openCount = alerts.filter((a) => a.status !== 'resolved').length;
      setOpenAlertsCount(openCount);
    } catch {
      // Non-blocking
    }
  };

  useEffect(() => {
    refreshAlertCount();
    const interval = setInterval(refreshAlertCount, 15000); // 15s refresh loop
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-canvas-bg font-sans">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col h-screen flex-shrink-0">
        <Sidebar openAlertsCount={openAlertsCount} />
      </div>

      {/* Mobile Slide-over Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/10 transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-10 flex shadow-2xl">
            <Sidebar
              onCloseMobile={() => setMobileSidebarOpen(false)}
              openAlertsCount={openAlertsCount}
            />
          </div>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Fixed Top Bar */}
        <Header
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          openAlertsCount={openAlertsCount}
        />
        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
