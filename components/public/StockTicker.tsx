'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface StockTickerProps {
  items: string[];
  speed?: number; // seconds for full loop
  className?: string;
}

/**
 * Animated Stock Ticker Component
 * Horizontally scrolling marquee with infinite loop
 * Color-coded: green for gains, red for losses
 */
export default function StockTicker({
  items,
  speed = 30,
  className = '',
}: StockTickerProps) {
  const [isPaused, setIsPaused] = useState(false);

  // Determine color based on item content
  const getItemColor = (item: string) => {
    if (item.includes('+')) return 'text-emerald-600 dark:text-emerald-400';
    if (item.includes('-')) return 'text-red-600 dark:text-red-400';
    return 'text-primary';
  };

  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items];

  return (
    <div
      className={`relative overflow-hidden h-10 bg-background/50 backdrop-blur-sm border-y border-border/20 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left fade gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

      {/* Scrolling ticker content */}
      <motion.div
        className="flex gap-8 h-full items-center"
        animate={{
          x: ['0%', '-50%'],
        }}
        transition={{
          duration: isPaused ? 999999 : speed,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 flex-shrink-0 px-4"
          >
            <span
              className={`font-mono text-sm whitespace-nowrap font-medium ${getItemColor(item)}`}
            >
              {item}
            </span>
            <span className="text-primary/40">•</span>
          </div>
        ))}
      </motion.div>

      {/* Right fade gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
    </div>
  );
}
