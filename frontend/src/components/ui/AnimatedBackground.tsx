import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Base Warm Beige / Dark Background */}
      <div className="absolute inset-0 bg-background transition-colors duration-700" />

      {/* Gentle, Visually Quiet Organic Ambient Flow Waves */}
      <svg
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full transform-gpu opacity-40 dark:opacity-25"
      >
        <defs>
          <linearGradient id="softBeigeFlow1" x1="0%" y1="10%" x2="100%" y2="90%">
            <stop offset="0%" stopColor="#DDD7CB" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#EAE4D7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#DDD7CB" stopOpacity="0.35" />
          </linearGradient>

          <linearGradient id="softTealAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#176B6B" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#438A87" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#176B6B" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* Wave 1: Gentle top-right drift */}
        <motion.path
          animate={{
            d: [
              'M-100,240 C350,140 650,420 1020,520 C1380,620 1680,420 2050,280 L2050,1180 L-100,1180 Z',
              'M-100,270 C370,170 630,450 990,490 C1350,590 1700,450 2050,310 L2050,1180 L-100,1180 Z',
              'M-100,240 C350,140 650,420 1020,520 C1380,620 1680,420 2050,280 L2050,1180 L-100,1180 Z',
            ],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          fill="url(#softBeigeFlow1)"
        />

        {/* Wave 2: Subtle bottom-left teal accent contour */}
        <motion.path
          animate={{
            d: [
              'M-80,820 C280,880 640,780 1040,640 C1440,500 1720,540 2040,690 L2040,1180 L-80,1180 Z',
              'M-80,790 C300,850 660,750 1060,670 C1460,530 1700,510 2040,660 L2040,1180 L-80,1180 Z',
              'M-80,820 C280,880 640,780 1040,640 C1440,500 1720,540 2040,690 L2040,1180 L-80,1180 Z',
            ],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          fill="url(#softTealAccent)"
        />
      </svg>

      {/* Central Soft Vignette for Maximum Content Contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 65% at 50% 50%, transparent 40%, var(--background) 100%)',
          opacity: 0.6,
        }}
      />
    </div>
  );
};
