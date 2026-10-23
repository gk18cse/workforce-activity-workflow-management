import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { AnimatedBackground } from '../ui/AnimatedBackground';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex bg-background text-foreground font-sans antialiased selection:bg-primary selection:text-white transition-colors duration-200 overflow-x-hidden">
      {/* Background Ambience */}
      <AnimatedBackground />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 bg-card shadow-2xl z-50">
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
        <Navbar onToggleMobile={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
