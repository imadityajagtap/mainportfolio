'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProviderProps {
  children: ReactNode;
}

/**
 * Smooth Scroll Provider using Lenis
 * Enables buttery smooth scrolling across the entire site
 */
export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Request animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle hash-based navigation (anchor links)
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        // Remove the # and find the element
        const elementId = hash.substring(1);
        const element = document.getElementById(elementId);
        
        if (element) {
          // Use Lenis to scroll to the element smoothly
          lenis.scrollTo(element, {
            offset: -80, // Account for fixed header
            duration: 1.2,
          });
        }
      }
    };

    // Handle initial hash on mount
    if (window.location.hash) {
      // Small delay to ensure DOM is ready
      setTimeout(handleHashChange, 100);
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
