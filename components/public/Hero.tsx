'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { useSettings } from '@/components/providers/SettingsProvider';
import Container from '@/components/ui/Container';
import SafeImage from '@/components/ui/SafeImage';
import StockTicker from '@/components/public/StockTicker';
import {
  CandlestickChart,
  TrendArrow,
  LightBulb,
  GraphBars,
  PieChart,
  Calculator,
  Briefcase,
  Target,
  Rocket,
  Documents,
} from '@/components/public/doodles';

/**
 * Hero Section
 * The first thing visitors see - greeting, tagline, profile, CTAs, and animated doodles
 */
export default function Hero() {
  const { settings, isLoading } = useSettings();

  // Stock ticker items - use from settings or defaults
  const tickerItems = settings?.tickerText || [
    'AAPL +2.3%',
    'TSLA -1.2%',
    'ADITYA +∞%',
    'GOOGL +1.8%',
    'MSFT +0.9%',
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen pt-20 overflow-hidden bg-gradient-to-b from-background via-background to-muted/20"
    >
      {/* Doodle Background Layer */}
      <DoodleBackground />

      {/* Stock Ticker */}
      <StockTicker items={tickerItems} speed={35} />

      {/* Main Content */}
      <Container>
        <div className="grid lg:grid-cols-5 gap-12 items-center py-16 lg:py-24">
          {/* LEFT: Text Content */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial="hidden"
            animate="show"
            variants={containerVariants}
          >
            {/* Label */}
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-2 text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-primary"
            >
              {isLoading ? (
                <span className="inline-block w-full h-4 bg-muted animate-pulse rounded" />
              ) : (
                settings?.heroLabel || 'MBA Candidate · Finance × Strategy × Consulting'
              )}
            </motion.span>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="font-serif font-black text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-foreground"
            >
              {isLoading ? (
                <span className="inline-block w-full h-24 bg-muted animate-pulse rounded-lg" />
              ) : (
                settings?.heroGreeting || "Hi, I'm Aditya 👋"
              )}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={itemVariants}
              className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-secondary max-w-2xl leading-tight"
            >
              {isLoading ? (
                <span className="inline-block w-3/4 h-12 bg-muted animate-pulse rounded-lg" />
              ) : (
                settings?.heroTagline ||
                'Decoding business, one framework at a time.'
              )}
            </motion.p>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              {isLoading ? (
                <span className="inline-block w-full h-8 bg-muted animate-pulse rounded-lg" />
              ) : (
                settings?.heroSubtitle ||
                'Turning complex problems into actionable strategies through data-driven insights and strategic frameworks.'
              )}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              {isLoading ? (
                <>
                  <div className="w-48 h-14 bg-muted animate-pulse rounded-full" />
                  <div className="w-48 h-14 bg-muted animate-pulse rounded-full" />
                </>
              ) : (
                <>
                  <Link
                    href={settings?.ctaPrimary?.link || '#projects'}
                    className="group rounded-full bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:scale-105"
                    data-cursor="hover"
                  >
                    {settings?.ctaPrimary?.text || 'View Projects'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href={settings?.ctaSecondary?.link || '#blog'}
                    className="group rounded-full border-2 border-border hover:border-primary bg-transparent hover:bg-primary/5 px-8 py-4 text-base font-medium flex items-center justify-center gap-2 transition-all"
                    data-cursor="hover"
                  >
                    {settings?.ctaSecondary?.text || 'Read Blog'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* RIGHT: Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2 relative flex justify-center lg:justify-end"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] lg:w-[400px] lg:h-[400px]"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-[2rem] bg-primary/20 blur-3xl scale-90" />

              {/* Photo or Fallback */}
              {isLoading ? (
                <div className="relative z-10 w-full h-full rounded-[2rem] bg-muted animate-pulse" />
              ) : settings?.heroPhoto ? (
                <SafeImage
                  src={settings.heroPhoto}
                  alt={settings.heroName || 'Aditya Jagtap'}
                  className="relative z-10 h-full w-full rounded-[2rem] border-4 border-primary/20 object-cover shadow-2xl"
                  fallback={(
                    <div className="relative z-10 w-full h-full rounded-[2rem] bg-gradient-to-br from-primary/20 to-secondary/20 border-4 border-primary/30 flex items-center justify-center shadow-2xl">
                      <span className="font-serif text-9xl font-black text-primary">
                        {(settings?.logoInitials || 'AJ')[0]}
                      </span>
                    </div>
                  )}
                />
              ) : (
                <div className="relative z-10 w-full h-full rounded-[2rem] bg-gradient-to-br from-primary/20 to-secondary/20 border-4 border-primary/30 flex items-center justify-center shadow-2xl">
                  <span className="font-serif text-9xl font-black text-primary">
                    {(settings?.logoInitials || 'AJ')[0]}
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs font-mono uppercase tracking-[0.2em]">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/**
 * Doodle Background Component
 * Scattered doodles with parallax scrolling effect
 */
function DoodleBackground() {
  const { scrollY } = useScroll();

  // Different parallax speeds for different layers
  const y1 = useTransform(scrollY, [0, 500], [0, -80]);
  const y2 = useTransform(scrollY, [0, 500], [0, 60]);
  const y3 = useTransform(scrollY, [0, 500], [0, -40]);
  const y4 = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top Left Area */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-24 left-8 w-24 h-24 text-primary opacity-[0.12] rotate-12"
      >
        <LightBulb className="w-full h-full" />
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="absolute top-40 left-1/4 w-20 h-20 text-secondary opacity-[0.15] -rotate-6"
      >
        <Target className="w-full h-full" />
      </motion.div>

      {/* Top Right Area */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-32 right-16 w-32 h-32 text-primary opacity-[0.1] rotate-[-15deg]"
      >
        <CandlestickChart className="w-full h-full" />
      </motion.div>

      <motion.div
        style={{ y: y3 }}
        className="absolute top-20 right-1/3 w-28 h-28 text-secondary opacity-[0.12] rotate-6"
      >
        <TrendArrow className="w-full h-full" />
      </motion.div>

      {/* Middle Left */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-1/2 left-12 w-28 h-28 text-primary opacity-[0.08] rotate-12 hidden lg:block"
      >
        <GraphBars className="w-full h-full" />
      </motion.div>

      <motion.div
        style={{ y: y4 }}
        className="absolute top-1/3 left-1/4 w-24 h-24 text-secondary opacity-[0.1] -rotate-12 hidden md:block"
      >
        <Calculator className="w-full h-full" />
      </motion.div>

      {/* Middle Right */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-1/3 right-20 w-20 h-20 text-primary opacity-[0.12] rotate-[-8deg] hidden md:block"
      >
        <PieChart className="w-full h-full" />
      </motion.div>

      <motion.div
        style={{ y: y3 }}
        className="absolute top-2/3 right-1/4 w-32 h-32 text-secondary opacity-[0.09] rotate-15 hidden lg:block"
      >
        <Briefcase className="w-full h-full" />
      </motion.div>

      {/* Bottom Left Area */}
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-32 left-20 w-36 h-36 text-primary opacity-[0.1] -rotate-6"
      >
        <Rocket className="w-full h-full" />
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-1/4 left-1/3 w-20 h-20 text-secondary opacity-[0.12] rotate-12 hidden lg:block"
      >
        <Documents className="w-full h-full" />
      </motion.div>

      {/* Bottom Right Area */}
      <motion.div
        style={{ y: y4 }}
        className="absolute bottom-40 right-16 w-24 h-24 text-primary opacity-[0.15] -rotate-12"
      >
        <Target className="w-full h-full" />
      </motion.div>

      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-24 right-1/3 w-28 h-28 text-secondary opacity-[0.1] rotate-6 hidden md:block"
      >
        <LightBulb className="w-full h-full" />
      </motion.div>
    </div>
  );
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};
