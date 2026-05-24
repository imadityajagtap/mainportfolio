"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '@/components/providers/SettingsProvider';
import { getApiData } from '@/lib/api-client';
import ExperienceCard from './ExperienceCard';

interface Experience {
  _id: string;
  company?: string;
  role?: string;
  organization?: string;
  title?: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  description?: string;
  achievements?: string[];
  skills?: string[];
  logo?: string;
  type?: string;
}

export default function ExperienceSection() {
  const { settings, isLoading: settingsLoading } = useSettings();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('/api/experience', { cache: 'no-store' });
        if (!response.ok) {
          console.warn('⚠️ Experience API unavailable:', response.statusText);
          setExperiences([]);
          setLoading(false);
          return;
        }

        const data = await response.json();
        const items = getApiData<Experience[]>(data);

        if (Array.isArray(items)) {
          // Sort by startDate descending (most recent first)
          const sorted = [...items].sort((a: Experience, b: Experience) => {
            return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
          });
          setExperiences(sorted || []);
        } else {
          setExperiences([]);
        }
      } catch (error) {
        console.warn('⚠️ Experience API unavailable:', error);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <section id="experience" className="relative py-24 md:py-32 overflow-hidden">
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
              <div className="w-80 h-6 bg-muted animate-pulse rounded mx-auto" />
            </>
          ) : (
            <>
              <p className="text-sm font-mono text-secondary uppercase tracking-[0.3em] mb-4">
                {settings?.experienceLabel || '05 / EXPERIENCE'}
              </p>
              <h2 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
                {settings?.experienceHeading || "Where I've made an impact"}
              </h2>
              <p className="text-lg text-foreground/70 mt-6">
                {settings?.experienceSubtitle || 'A journey through internships, leadership roles, and real-world problem-solving'}
              </p>
            </>
          )}
        </motion.div>

        {/* Timeline */}
        {loading ? (
          <div className="relative max-w-5xl mx-auto">
            {/* Skeleton loader */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative pl-12 md:pl-0 mb-16">
                <div className={`animate-pulse bg-foreground/5 rounded-2xl p-6 md:p-8 h-64 ${
                  i % 2 === 0 ? 'md:mr-[calc(50%+2rem)]' : 'md:ml-[calc(50%+2rem)]'
                }`} />
              </div>
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-foreground/60 text-lg">No experience entries found.</p>
          </div>
        ) : (
          <div className="relative max-w-5xl mx-auto">
            {/* Vertical timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-transparent md:-translate-x-1/2" />

            {/* Experience cards */}
            {experiences.map((exp, idx) => (
              <ExperienceCard
                key={exp._id}
                experience={exp}
                index={idx}
                side={idx % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
