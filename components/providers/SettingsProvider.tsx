'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getApiData } from '@/lib/api-client';

interface SiteSettings {
  // HERO
  heroGreeting?: string;
  heroName?: string;
  heroTagline?: string;
  heroSubtitle?: string;
  heroLabel?: string;
  heroPhoto?: string;
  tickerText?: string[];
  ctaPrimary?: { text: string; link: string };
  ctaSecondary?: { text: string; link: string };

  // CONTACT
  contactEmail?: string;
  contactPhone?: string;
  contactLocation?: string;
  contactHeading?: string;
  contactSubtitle?: string;
  contactResponseTime?: string;
  calendlyLink?: string;

  // SOCIAL
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  websiteUrl?: string;

  // FOOTER
  footerTagline?: string;
  footerLocation?: string;
  copyrightText?: string;
  logoInitials?: string;

  // SECTION HEADINGS
  aboutLabel?: string;
  aboutHeading?: string;
  aboutSubtitle?: string;

  skillsLabel?: string;
  skillsHeading?: string;
  skillsSubtitle?: string;

  projectsLabel?: string;
  projectsHeading?: string;
  projectsSubtitle?: string;

  experienceLabel?: string;
  experienceHeading?: string;
  experienceSubtitle?: string;

  researchLabel?: string;
  researchHeading?: string;
  researchSubtitle?: string;

  achievementsLabel?: string;
  achievementsHeading?: string;
  achievementsSubtitle?: string;

  blogLabel?: string;
  blogHeading?: string;
  blogSubtitle?: string;

  // RESUME
  resumeUrl?: string;
  resumeLabel?: string;
  resumeUpdatedAt?: string | null;

  // SEO
  siteTitle?: string;
  siteDescription?: string;
  ogImage?: string;
  favicon?: string;
}

// Default fallback settings - used when API fails to prevent UI breakage
const DEFAULT_SETTINGS: SiteSettings = {
  heroGreeting: "Hi, I'm Aditya 👋",
  heroName: 'Aditya Jagtap',
  heroTagline: 'Decoding business, one framework at a time.',
  heroSubtitle: 'MBA student exploring the intersection of finance, strategy, and technology.',
  heroLabel: 'MBA Candidate · Finance × Strategy',
  tickerText: ['AAPL +2.3%', 'TSLA -1.2%', 'ADITYA +∞%', 'GOOGL +1.8%', 'MSFT +0.9%'],
  ctaPrimary: { text: 'View Case Studies', link: '#projects' },
  ctaSecondary: { text: 'Download Resume', link: '' },

  contactEmail: 'contact@example.com',
  contactPhone: '+91 XXXXX XXXXX',
  contactLocation: 'Mumbai, India',
  contactHeading: "Let's build something remarkable",
  contactSubtitle: 'Open to opportunities in strategy, finance, and consulting.',
  contactResponseTime: 'Usually responds within 24 hours',

  linkedinUrl: '',
  githubUrl: '',
  twitterUrl: '',
  instagramUrl: '',

  footerTagline: 'Finance meets strategy. Numbers meet stories.',
  footerLocation: 'Based in Mumbai · Open to opportunities worldwide',
  copyrightText: `© ${new Date().getFullYear()} Aditya Jagtap · All rights reserved`,
  logoInitials: 'AJ',

  projectsLabel: '04 / SELECTED WORK',
  projectsHeading: 'Projects that tell a story',
  projectsSubtitle: 'Real problems. Real analysis. Real impact.',

  experienceLabel: '05 / EXPERIENCE',
  experienceHeading: "Where I've made an impact",
  experienceSubtitle: 'A journey through internships, leadership, and consulting.',

  researchLabel: '06 / RESEARCH',
  researchHeading: 'Thinking deeply about markets',
  researchSubtitle: 'Research papers, whitepapers, and analytical deep-dives.',

  siteTitle: 'Aditya Jagtap — Strategy & Finance Portfolio',
  siteDescription: 'Personal portfolio showcasing case studies, experience, and research.',
};

interface SettingsContextValue {
  settings: SiteSettings | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/site-settings', { cache: 'no-store' });

      if (!response.ok) {
        console.warn('⚠️ Site settings API unavailable, using defaults:', response.statusText);
        setError(`Failed to fetch settings: ${response.statusText}`);
        setSettings(DEFAULT_SETTINGS);
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      const settingsData = getApiData<SiteSettings>(data);

      if (settingsData) {
        console.log('✅ Settings loaded:', {
          contactEmail: settingsData.contactEmail,
          contactPhone: settingsData.contactPhone,
          contactLocation: settingsData.contactLocation,
          linkedinUrl: settingsData.linkedinUrl,
        });
        setSettings(settingsData);
      } else {
        console.warn('⚠️ Invalid settings data, using defaults');
        setError('Invalid settings data');
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (err) {
      console.warn('⚠️ Site settings API unavailable, using defaults:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Use comprehensive defaults to prevent UI breakage
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Listen for custom 'settings-updated' event from admin panel
    const handleSettingsUpdated = () => {
      console.log('🔄 Settings updated event received, refetching...');
      fetchSettings();
    };

    window.addEventListener('settings-updated', handleSettingsUpdated);

    // Refetch on window focus (when user switches back from admin tab)
    const handleFocus = () => {
      console.log('👀 Window focused, checking for settings updates...');
      fetchSettings();
    };

    window.addEventListener('focus', handleFocus);

    // Cleanup listeners
    return () => {
      window.removeEventListener('settings-updated', handleSettingsUpdated);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const refresh = async () => {
    await fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, isLoading, error, refresh, refreshSettings: refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
}
