"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, ExternalLink, Trophy } from 'lucide-react';
import { useSettings } from '@/components/providers/SettingsProvider';
import { getApiData } from '@/lib/api-client';
import SafeImage from '@/components/ui/SafeImage';

interface Achievement {
  _id: string;
  title?: string;
  issuer?: string;
  description?: string;
  credentialUrl?: string;
  imageUrl?: string;
  badge?: string;
  type?: string;
  category?: string;
  rank?: string;
  verified?: boolean;
  date?: string;
  createdAt?: string;
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
}

export default function AchievementsSection() {
  const { settings, isLoading: settingsLoading } = useSettings();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/achievements', { cache: 'no-store' });
        if (!response.ok) {
          console.warn('Achievements API unavailable:', response.statusText);
          setAchievements([]);
          return;
        }

        const payload = await response.json();
        const items = getApiData<Achievement[]>(payload);
        if (!Array.isArray(items)) {
          setAchievements([]);
          return;
        }

        const sorted = [...items].sort((a, b) => {
          const aDate = a.date || a.createdAt || '';
          const bDate = b.date || b.createdAt || '';
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        });
        setAchievements(sorted);
      } catch (error) {
        console.warn('Achievements API unavailable:', error);
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <section id="achievements" className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          {settingsLoading ? (
            <>
              <div className="w-40 h-4 bg-muted animate-pulse rounded mx-auto mb-4" />
              <div className="w-96 h-16 bg-muted animate-pulse rounded mx-auto mb-6" />
              <div className="w-full max-w-xl h-6 bg-muted animate-pulse rounded mx-auto" />
            </>
          ) : (
            <>
              <p className="text-sm font-mono text-secondary uppercase tracking-[0.3em] mb-4">
                {settings?.achievementsLabel || '07 / ACHIEVEMENTS'}
              </p>
              <h2 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
                {settings?.achievementsHeading || 'Recognition and milestones'}
              </h2>
              <p className="text-lg text-foreground/70 mt-6">
                {settings?.achievementsSubtitle || 'Awards, certifications, and competitive wins'}
              </p>
            </>
          )}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-72 rounded-2xl bg-foreground/10 animate-pulse" />
            ))}
          </div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-20 text-foreground/60">
            <p className="text-lg">No achievements yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {achievements.map((achievement, index) => {
              const imageUrl = achievement.imageUrl || achievement.badge || '';
              const type = achievement.type || achievement.category || 'Achievement';
              const date = formatDate(achievement.date || achievement.createdAt);

              return (
                <motion.article
                  key={achievement._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="group overflow-hidden rounded-2xl border border-foreground/10 bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl"
                >
                  <div className="relative aspect-video bg-primary/10">
                    <SafeImage
                      src={imageUrl}
                      alt={achievement.title || 'Achievement'}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      fallback={(
                        <div className="flex h-full w-full items-center justify-center">
                          <Trophy className="h-14 w-14 text-primary/60" />
                        </div>
                      )}
                    />
                  </div>

                  <div className="p-6">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                        <Award className="h-3.5 w-3.5" />
                        {type}
                      </span>
                      {achievement.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-2xl font-bold leading-tight">
                      {achievement.title || 'Untitled achievement'}
                    </h3>

                    {(achievement.issuer || date || achievement.rank) && (
                      <p className="mt-2 text-sm text-foreground/60">
                        {[achievement.issuer, achievement.rank, date].filter(Boolean).join(' | ')}
                      </p>
                    )}

                    {achievement.description && (
                      <p className="mt-4 text-sm leading-relaxed text-foreground/75">
                        {achievement.description}
                      </p>
                    )}

                    {achievement.credentialUrl && (
                      <a
                        href={achievement.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
                      >
                        View credential
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
