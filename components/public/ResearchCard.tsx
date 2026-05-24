"use client";

import { motion } from 'framer-motion';
import { Quote, ExternalLink, Download, Clock, Star } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';

interface ResearchCardProps {
  research: {
    _id: string;
    title: string;
    abstract?: string;
    type?: string;
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
  };
  index: number;
}

/**
 * Format date to "MAR 2024" format
 */
function formatPublishDate(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date
      .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      .toUpperCase();
  } catch {
    return '';
  }
}

export default function ResearchCard({ research, index }: ResearchCardProps) {
  const publishDate = formatPublishDate(research.publishedDate || research.date || research.createdAt);

  return (
    <motion.article
      initial={{ opacity: 1, y: 20 }} // ✅ Fixed: opacity 1 (visible), smaller movement
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }} // ✅ Trigger earlier
      whileHover={{ y: -4 }}
      className="group relative bg-background border border-foreground/10 rounded-3xl hover:border-secondary hover:shadow-2xl transition-all duration-500 overflow-hidden"
    >
      {research.coverImage && (
        <div className="relative aspect-video overflow-hidden bg-secondary/10">
          <SafeImage
            src={research.coverImage}
            alt={research.title || 'Research cover'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            fallback={<div className="h-full w-full bg-secondary/10" />}
          />
        </div>
      )}

      {/* Featured star */}
      {research.featured && (
        <div className="absolute top-6 right-6 z-20">
          <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
        </div>
      )}

      {/* Background quote mark decoration */}
      <div className="absolute top-4 left-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
        <Quote className="w-20 h-20 text-secondary/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-10">
        {/* Top row - Type & Date */}
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-wider rounded-full">
            {research.type?.toUpperCase() || 'RESEARCH'}
          </span>
          {publishDate && (
            <span className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
              {publishDate}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-4 group-hover:text-secondary transition-colors">
          {research.title || 'Untitled'}
        </h3>

        {/* Authors */}
        {(research.authors || []).length > 0 && (
          <p className="text-sm text-foreground/60 mb-4 italic">
            by {(research.authors || []).join(', ')}
          </p>
        )}

        {/* Abstract */}
        {research.abstract && (
          <p className="text-foreground/75 leading-relaxed mb-6 line-clamp-3">
            {research.abstract}
          </p>
        )}

        {/* Tags */}
        {(research.tags || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {(research.tags || []).map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-foreground/5 text-foreground/70 text-xs rounded-full border border-foreground/10"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom row - Action links & Read time */}
        <div className="flex items-center justify-between pt-6 border-t border-foreground/10">
          {/* Action links */}
          <div className="flex gap-4">
            {research.pdfUrl && (
              <a
                href={research.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              >
                <Download size={16} />
                Read paper
              </a>
            )}
            {research.externalUrl && (
              <a
                href={research.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 text-sm font-medium transition-colors"
              >
                <ExternalLink size={16} />
                View online
              </a>
            )}
          </div>

          {/* Read time */}
          {research.readTime && (
            <div className="inline-flex items-center gap-1.5 text-xs text-foreground/60 font-mono">
              <Clock size={14} />
              {research.readTime} min read
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
