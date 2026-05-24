'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Research', href: '#research' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

/**
 * Navbar Component
 * Clean, minimal navbar with scroll effects and active section tracking
 */
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch for theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch resume URL
  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        const response = await fetch('/api/site-settings');
        if (response.ok) {
          const data = await response.json();
          setResumeUrl(data.data?.resumeUrl || null);
        }
      } catch (error) {
        console.error('Failed to fetch resume URL:', error);
      }
    };
    fetchResumeUrl();
  }, []);

  // Track scroll position for navbar effects
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section based on scroll position
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScrollSpy = () => {
      const sections = navLinks.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    handleScrollSpy();
    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (href: string) => {
    const sectionId = href.substring(1);
    const section = document.getElementById(sectionId);

    if (section) {
      const offset = 64; // Navbar height
      const sectionTop = section.offsetTop - offset;

      window.scrollTo({
        top: sectionTop,
        behavior: 'smooth',
      });
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleResumeClick = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50
                 backdrop-blur-md
                 bg-white/10 dark:bg-[#0a0a0a]/40
                 border-b border-white/10 dark:border-white/5
                 shadow-sm shadow-black/10
                 transition-all duration-300"
    >
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={scrollToTop}
          className="text-[#00f5a0] font-bold text-xl tracking-tight hover:scale-105 transition-transform cursor-pointer"
          aria-label="Go to home"
        >
          AJ
        </button>

        {/* Nav Links - centered */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className={`text-sm transition-colors duration-200 flex flex-col items-center gap-1 ${
                  isActive
                    ? 'text-[#00f5a0]'
                    : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <span className="w-4 h-[2px] rounded-full bg-[#00f5a0]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              className="relative text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors duration-200 cursor-pointer"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 top-0 left-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
          )}

          {/* Resume button */}
          <button
            onClick={handleResumeClick}
            disabled={!resumeUrl}
            className="hidden md:flex items-center gap-2 text-sm font-medium px-5 py-2 rounded-full bg-[#00f5a0] text-[#0a0a0a] hover:bg-[#00e090] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Download resume"
          >
            <Download className="w-4 h-4" />
            Resume
          </button>
        </div>
      </div>
    </header>
  );
}
