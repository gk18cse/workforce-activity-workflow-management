import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { AnimatedBackground } from '../ui/AnimatedBackground';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen flex bg-background text-foreground font-sans antialiased selection:bg-primary selection:text-foreground transition-colors duration-200 overflow-x-hidden">
      {/* Animated Geometric Diamonds Background (Strictly Authenticated Views) */}
      <AnimatedBackground />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area (Transparent container over animated geometric background) */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
