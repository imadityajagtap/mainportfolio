"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return; // ✅ SSR guard at top

    const handleScroll = () => {
      setIsVisible(window.scrollY > 600);
    };

    handleScroll(); // Check initial state
    window.addEventListener('scroll', handleScroll, { passive: true }); // ✅ Passive for performance
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClick}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-background shadow-xl flex items-center justify-center hover:scale-110 transition-all z-40"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
