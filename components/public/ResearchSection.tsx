"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '@/components/providers/SettingsProvider';
import { getApiData } from '@/lib/api-client';
import ResearchCard from './ResearchCard';

interface Research {
  _id: string;
  title: string;
  abstract?: string;
  type?: 'whitepaper' | 'research' | 'analysis' | 'thesis';
  publishedDate?: string;
  date?: string;
  createdAt?: string;
  authors?: string[];
  pdfUrl?: string;
  externalUrl?: string;
  tags?: string[];
  coverImage?: string;
  readTime?: number;
  featured?: boolean;
}

export default function ResearchSection() {
  const { settings, isLoading: settingsLoading } = useSettings();
  const [research, setResearch] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const response = await fetch('/api/research', { cache: 'no-store' });
        if (!response.ok) {
          console.warn('⚠️ Research API unavailable:', response.statusText);
          setResearch([]);
          setLoading(false);
          return;
        }

        const data = await response.json();
        const items = getApiData<Research[]>(data);

        if (Array.isArray(items)) {
          // Sort by publishedDate descending (most recent first)
          const sorted = [...items].sort((a: Research, b: Research) => {
            const aDate = a.publishedDate || a.date || a.createdAt || '';
            const bDate = b.publishedDate || b.date || b.createdAt || '';
            return new Date(bDate).getTime() - new Date(aDate).getTime();
          });
          setResearch(sorted || []);
        } else {
          setResearch([]);
        }
      } catch (error) {
        console.warn('⚠️ Research API unavailable:', error);
        setResearch([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResearch();
  }, []);

  return (
    <section id="research" className="relative py-24 md:py-32 bg-foreground/[0.02] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          {settingsLoading ? (
            <>
              <div className="w-32 h-4 bg-muted animate-pulse rounded mx-auto mb-4" />
              <div className="w-96 h-16 bg-muted animate-pulse rounded mx-auto mb-6" />
              <div className="w-full max-w-xl h-6 bg-muted animate-pulse rounded mx-auto" />
            </>
          ) : (
            <>
              <p className="text-sm font-mono text-secondary uppercase tracking-[0.3em] mb-4">
                {settings?.researchLabel || '06 / RESEARCH'}
              </p>
              <h2 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
                {settings?.researchHeading || 'Thinking deeply about markets'}
              </h2>
              <p className="text-lg text-foreground/70 mt-6">
                {settings?.researchSubtitle || 'Research papers, whitepapers, and analytical deep-dives'}
              </p>
            </>
          )}
        </motion.div>

        {/* Research grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Skeleton loader */}
            {[1, 2].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-foreground/10 animate-pulse" />
            ))}
          </div>
        ) : research.length === 0 ? (
          <div className="text-center py-20 text-foreground/60">
            <p className="text-lg">No research yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {research.map((item, idx) => (
              <ResearchCard key={item._id} research={item} index={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
