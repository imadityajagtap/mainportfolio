'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Custom Cursor Component
 * Shows a small dot + trailing ring on desktop devices
 * Reacts to hoverable elements (buttons, links)
 */
export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Cursor position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring animation for trailing ring
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device has fine pointer (desktop)
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    setIsDesktop(hasPointer);

    if (!hasPointer) return;

    // Track mouse position
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    // Track hover state for interactive elements
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Add event listeners
    window.addEventListener('mousemove', moveCursor);

    // Find all hoverable elements
    const hoverElements = document.querySelectorAll(
      'a, button, [data-cursor="hover"], input[type="button"], input[type="submit"]'
    );

    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Observe DOM changes to catch dynamically added elements
    const observer = new MutationObserver(() => {
      const newElements = document.querySelectorAll(
        'a, button, [data-cursor="hover"], input[type="button"], input[type="submit"]'
      );
      newElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      hoverElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      observer.disconnect();
    };
  }, [cursorX, cursorY]);

  // Don't render on touch devices
  if (!isDesktop) return null;

  return (
    <>
      {/* Small dot - follows instantly */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
      </motion.div>

      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="rounded-full -translate-x-1/2 -translate-y-1/2 border-2"
          animate={{
            width: isHovering ? 60 : 40,
            height: isHovering ? 60 : 40,
            borderColor: isHovering
              ? 'hsl(var(--primary))'
              : 'hsl(var(--foreground) / 0.3)',
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </>
  );
}
