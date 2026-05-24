"use client";

import { motion } from 'framer-motion';
import { MapPin, Briefcase, GraduationCap, Crown, Sparkles } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';

interface ExperienceCardProps {
  experience: {
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
  };
  index: number;
  side: 'left' | 'right';
}

/**
 * Format date to "JUN 2024" format
 */
function formatDate(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    return new Date(dateString)
      .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      .toUpperCase();
  } catch {
    return '';
  }
}

/**
 * Get type icon and label
 */
function getTypeInfo(type?: string) {
  const normalizedType = type?.toLowerCase();
  switch (normalizedType) {
    case 'internship':
      return { Icon: GraduationCap, label: 'Internship' };
    case 'full-time':
      return { Icon: Briefcase, label: 'Full-time' };
    case 'leadership':
      return { Icon: Crown, label: 'Leadership' };
    case 'freelance':
      return { Icon: Sparkles, label: 'Freelance' };
    case 'competition':
      return { Icon: Sparkles, label: 'Competition' };
    case 'certification':
      return { Icon: GraduationCap, label: 'Certification' };
    default:
      return { Icon: Briefcase, label: type || 'Experience' };
  }
}

export default function ExperienceCard({ experience, index, side }: ExperienceCardProps) {
  const { Icon: TypeIcon, label: typeLabel } = getTypeInfo(experience.type);
  const company = experience.company || experience.organization || '';
  const role = experience.role || experience.title || '';

  const startDateFormatted = formatDate(experience.startDate);
  const endDateFormatted = experience.current
    ? 'PRESENT'
    : experience.endDate
    ? formatDate(experience.endDate)
    : 'PRESENT';

  return (
    <div
      className={`relative pl-12 md:pl-0 mb-16 last:mb-0 ${
        side === 'left'
          ? 'md:pr-[calc(50%+2rem)] md:text-right'
          : 'md:pl-[calc(50%+2rem)] md:text-left'
      }`}
    >
      {/* Timeline dot */}
      <div className="absolute left-4 md:left-1/2 top-6 md:-translate-x-1/2 z-10">
        <div
          className={`w-4 h-4 rounded-full bg-primary border-4 border-background ${
            experience.current ? 'animate-pulse ring-4 ring-primary/30' : ''
          }`}
        />
      </div>

      {/* Card content */}
      <motion.div
        initial={{ opacity: 1, x: side === 'left' ? -20 : 20, y: 10 }} // ✅ Fixed: visible, smaller movement
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }} // ✅ Trigger earlier
        className="group relative bg-background/50 backdrop-blur-sm border border-foreground/10 rounded-2xl p-6 md:p-8 hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        {/* CURRENT badge */}
        {experience.current && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-mono uppercase rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            CURRENT
          </div>
        )}

        {/* Top row - Logo & Company info */}
        <div className={`flex gap-4 items-start ${side === 'left' ? 'md:flex-row-reverse' : ''}`}>
          {/* Logo */}
          <div className="flex-shrink-0">
            {experience.logo ? (
              <SafeImage
                src={experience.logo}
                alt={`${company || 'Company'} logo`}
                className="w-12 h-12 rounded-lg object-cover"
                fallback={(
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    {company?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {company?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>

          {/* Organization & Title */}
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-serif font-bold">{company || 'Company not set'}</h3>
            <p className="text-lg text-primary font-medium mt-1">{role || 'Role not set'}</p>

            {/* Type badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium mt-2 ${
              side === 'left' ? 'md:float-right' : ''
            }`}>
              <TypeIcon size={14} />
              {typeLabel}
            </div>
          </div>
        </div>

        {/* Meta row - Date & Location */}
        <div className={`flex flex-wrap gap-4 mt-4 text-sm text-foreground/60 ${
          side === 'left' ? 'md:justify-end' : ''
        }`}>
          <span className="font-mono uppercase">
            {startDateFormatted} - {endDateFormatted}
          </span>
          {experience.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} />
              {experience.location}
            </span>
          )}
        </div>

        {/* Description */}
        {experience.description && (
          <p className="mt-4 text-foreground/80 leading-relaxed">
            {experience.description}
          </p>
        )}

        {/* Achievements */}
        {(experience.achievements || []).length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-mono text-secondary uppercase tracking-wider mb-3">
              KEY WINS
            </p>
            <ul className="space-y-2">
              {(experience.achievements || []).map((achievement, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-foreground/80 text-sm leading-relaxed">
                    {achievement}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {(experience.skills || []).length > 0 && (
          <div className={`flex flex-wrap gap-2 mt-6 ${
            side === 'left' ? 'md:justify-end' : ''
          }`}>
            {(experience.skills || []).map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
