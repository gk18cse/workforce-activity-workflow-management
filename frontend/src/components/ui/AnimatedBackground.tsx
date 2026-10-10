import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground: React.FC = () => {
  // Generate 18 fine parallel guilloche wave lines following the natural flow of the ribbon
  const parallelLines = Array.from({ length: 18 }, (_, i) => {
    const offset = (i - 9) * 7.5;
    const opacity = Math.max(0.08, 0.45 - Math.abs(i - 9) * 0.035);
    return { id: i, offset, opacity };
  });

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Dynamic Base Gradient Backplate */}
      <div className="absolute inset-0 bg-background transition-colors duration-700" />

      {/* 4K Vector Silk Wave Engine (16:9 Aspect Ratio viewBox) */}
      <svg
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full transform-gpu will-change-transform opacity-95 dark:opacity-80"
      >
        <defs>
          {/* Champagne Gold Linear Gradient for Primary Ribbon Edge */}
          <linearGradient id="champagneGoldGrad" x1="0%" y1="20%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#DFBF76" stopOpacity="0.4" />
            <stop offset="25%" stopColor="#F7E6B5" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#C9A654" stopOpacity="0.85" />
            <stop offset="65%" stopColor="#FFF2D1" stopOpacity="1" />
            <stop offset="85%" stopColor="#C59E44" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#DFC383" stopOpacity="0.5" />
          </linearGradient>

          {/* Traveling Shimmer Gradient (Seamless 10s Loop) */}
          <linearGradient id="shimmerTravelGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9A654" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#DFC383" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1">
              <animate
                attributeName="stop-color"
                values="#FFFFFF;#FFF5DC;#FFFFFF"
                dur="10s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="60%" stopColor="#F5DF9E" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C9A654" stopOpacity="0.3" />
          </linearGradient>

          {/* Golden Glow Filter */}
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Deep Diffuse Silk Shadow Filter */}
          <filter id="silkShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="16" />
            <feOffset dx="-4" dy="18" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.12" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Light Mode Silk Wave Shading Gradient */}
          <linearGradient id="silkLightSheet1" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#F4F5F7" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#E9ECEF" stopOpacity="0.6" />
            <stop offset="85%" stopColor="#F8F9FA" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
          </linearGradient>

          {/* Light Mode Silk Wave Shading Gradient 2 (Under-ribbon) */}
          <linearGradient id="silkLightSheet2" x1="80%" y1="15%" x2="20%" y2="85%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#EDF0F3" stopOpacity="0.75" />
            <stop offset="65%" stopColor="#DFE3E8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F8F9FA" stopOpacity="0.85" />
          </linearGradient>

          {/* Dark Mode Silk Wave Shading Gradient 1 */}
          <linearGradient id="silkDarkSheet1" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#252A30" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#1E2329" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#171B20" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#101317" stopOpacity="0.85" />
          </linearGradient>

          {/* Dark Mode Silk Wave Shading Gradient 2 */}
          <linearGradient id="silkDarkSheet2" x1="80%" y1="15%" x2="20%" y2="85%">
            <stop offset="0%" stopColor="#2D333B" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#22272E" stopOpacity="0.7" />
            <stop offset="75%" stopColor="#191D23" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#121519" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* =========================================================================
            LAYER 1: BACKGROUND BILLOWING SILK MANTLE (Deep Parallax Layer)
            ========================================================================= */}
        <motion.path
          animate={{
            d: [
              'M-100,280 C320,180 620,440 980,560 C1340,680 1620,480 2020,320 L2020,1180 L-100,1180 Z',
              'M-100,310 C340,210 600,470 960,530 C1320,650 1640,510 2020,350 L2020,1180 L-100,1180 Z',
              'M-100,280 C320,180 620,440 980,560 C1340,680 1620,480 2020,320 L2020,1180 L-100,1180 Z',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="fill-[url(#silkLightSheet1)] dark:fill-[url(#silkDarkSheet1)]"
          filter="url(#silkShadow)"
        />

        {/* Ambient Silver Shading in Wave Hollows */}
        <motion.path
          animate={{
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          d="M120,480 C480,410 750,600 1100,720 C1450,840 1720,740 2020,620 L2020,1180 L120,1180 Z"
          className="fill-black/5 dark:fill-black/30"
        />

        {/* =========================================================================
            LAYER 2: SECONDARY CROSSING SILK SWEEP (Mid-Parallax Layer)
            ========================================================================= */}
        <motion.path
          animate={{
            d: [
              'M-80,820 C280,890 620,780 1020,620 C1420,460 1720,520 2020,680 L2020,1180 L-80,1180 Z',
              'M-80,790 C300,860 640,750 1040,650 C1440,490 1700,490 2020,650 L2020,1180 L-80,1180 Z',
              'M-80,820 C280,890 620,780 1020,620 C1420,460 1720,520 2020,680 L2020,1180 L-80,1180 Z',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
          className="fill-[url(#silkLightSheet2)] dark:fill-[url(#silkDarkSheet2)]"
          filter="url(#silkShadow)"
        />

        {/* =========================================================================
            LAYER 3: FINE PARALLEL GUILLOCHE WAVE PATTERNS (Subtle Silk Texture)
            ========================================================================= */}
        <g className="transition-opacity duration-500">
          {parallelLines.map((line) => (
            <motion.path
              key={`parallel-line-${line.id}`}
              animate={{
                d: [
                  `M-50,${340 + line.offset} C340,${220 + line.offset * 0.9} 680,${390 + line.offset * 0.8} 1040,${570 + line.offset * 1.1} C1400,${750 + line.offset * 1.2} 1680,${760 + line.offset * 0.9} 2000,${720 + line.offset}`,
                  `M-50,${360 + line.offset} C360,${245 + line.offset * 0.9} 660,${415 + line.offset * 0.8} 1020,${545 + line.offset * 1.1} C1380,${725 + line.offset * 1.2} 1700,${785 + line.offset * 0.9} 2000,${745 + line.offset}`,
                  `M-50,${340 + line.offset} C340,${220 + line.offset * 0.9} 680,${390 + line.offset * 0.8} 1040,${570 + line.offset * 1.1} C1400,${750 + line.offset * 1.2} 1680,${760 + line.offset * 0.9} 2000,${720 + line.offset}`,
                ],
                opacity: [line.opacity * 0.7, line.opacity * 1.1, line.opacity * 0.7],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: line.id * 0.08,
              }}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.85"
              className="text-foreground/20 dark:text-foreground/15"
            />
          ))}
        </g>

        {/* =========================================================================
            LAYER 4: SECONDARY LOWER GOLDEN CURVED FLOW LINE
            ========================================================================= */}
        <motion.path
          animate={{
            d: [
              'M-50,870 C240,940 560,910 920,830 C1280,750 1560,690 1980,820',
              'M-50,850 C260,920 580,890 940,850 C1300,770 1540,670 1980,800',
              'M-50,870 C240,940 560,910 920,830 C1280,750 1560,690 1980,820',
            ],
            opacity: [0.65, 0.9, 0.65],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.2,
          }}
          fill="none"
          stroke="url(#champagneGoldGrad)"
          strokeWidth="1.6"
          filter="url(#goldGlow)"
        />

        {/* =========================================================================
            LAYER 5: PRIMARY HERO GOLDEN CREST LINE WITH TRAVELING SHIMMER
            ========================================================================= */}
        {/* Soft Golden Bloom Halo */}
        <motion.path
          animate={{
            d: [
              'M-50,335 C340,215 680,385 1040,565 C1400,745 1680,755 2000,715',
              'M-50,355 C360,240 660,410 1020,540 C1380,720 1700,780 2000,740',
              'M-50,335 C340,215 680,385 1040,565 C1400,745 1680,755 2000,715',
            ],
            opacity: [0.75, 1, 0.75],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          fill="none"
          stroke="url(#champagneGoldGrad)"
          strokeWidth="4"
          filter="url(#goldGlow)"
          className="opacity-60 dark:opacity-80"
        />

        {/* Sharp Luminous Golden Edge Line */}
        <motion.path
          animate={{
            d: [
              'M-50,335 C340,215 680,385 1040,565 C1400,745 1680,755 2000,715',
              'M-50,355 C360,240 660,410 1020,540 C1380,720 1700,780 2000,740',
              'M-50,335 C340,215 680,385 1040,565 C1400,745 1680,755 2000,715',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          fill="none"
          stroke="url(#champagneGoldGrad)"
          strokeWidth="2.2"
        />

        {/* Traveling Light Shimmer along the Curved Path */}
        <motion.path
          animate={{
            d: [
              'M-50,335 C340,215 680,385 1040,565 C1400,745 1680,755 2000,715',
              'M-50,355 C360,240 660,410 1020,540 C1380,720 1700,780 2000,740',
              'M-50,335 C340,215 680,385 1040,565 C1400,745 1680,755 2000,715',
            ],
            strokeDashoffset: [2200, 0, -2200],
          }}
          transition={{
            d: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
            strokeDashoffset: { duration: 10, repeat: Infinity, ease: 'linear' },
          }}
          fill="none"
          stroke="url(#shimmerTravelGold)"
          strokeWidth="3.2"
          strokeDasharray="220 880"
          filter="url(#goldGlow)"
        />

        {/* Subtle Silk Light Sheen Across Wave Crest */}
        <motion.path
          animate={{
            opacity: [0.15, 0.45, 0.15],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          d="M200,280 C600,240 950,420 1300,560 C1650,700 1850,710 2020,680 L2020,760 C1750,790 1450,760 1150,620 C850,480 500,320 200,350 Z"
          fill="url(#champagneGoldGrad)"
          className="opacity-20 mix-blend-overlay dark:mix-blend-soft-light"
        />
      </svg>

      {/* Presentation Content Safe-Zone Radial Mask */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 60% at 50% 48%, transparent 45%, var(--background) 100%)',
          opacity: 0.35,
        }}
      />
    </div>
  );
};
