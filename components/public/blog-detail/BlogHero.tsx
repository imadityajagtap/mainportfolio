"use client";

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';

interface BlogHeroProps {
  post: {
    title: string;
    excerpt?: string;
    category?: string;
    author?: string;
    publishedDate: string;
    readTime?: number;
    coverImage?: string;
  };
}

/**
 * Format date to "MAR 15, 2024" format
 */
function formatPostDate(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase();
  } catch {
    return '';
  }
}

export default function BlogHero({ post }: BlogHeroProps) {
  const postDate = formatPostDate(post.publishedDate);
  const authorName = post.author || 'Aditya Jagtap';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-4xl mx-auto pt-32 pb-12 px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Breadcrumb */}
        <motion.div variants={itemVariants} className="text-sm text-foreground/60 mb-6">
          <Link href="/blog" className="hover:text-primary transition-colors">
            Journal
          </Link>
          {post.category && (
            <>
              <span className="mx-2">/</span>
              <span>{post.category}</span>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-foreground/40">{post.title || 'Post'}</span>
        </motion.div>

        {/* Category badge */}
        {post.category && (
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-xs font-mono uppercase tracking-wider rounded-full">
              {post.category}
            </span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6"
        >
          {post.title || 'Untitled Post'}
        </motion.h1>

        {/* Excerpt */}
        {post.excerpt && (
          <motion.p
            variants={itemVariants}
            className="text-xl italic text-foreground/70 leading-relaxed mb-8"
          >
            {post.excerpt}
          </motion.p>
        )}

        {/* Meta row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center gap-4 text-sm text-foreground/60 mb-12"
        >
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background font-bold text-xs">
              {authorName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <span className="font-medium">{authorName}</span>
          </div>

          <span className="text-foreground/30">•</span>

          {/* Date */}
          {postDate && <span>{postDate}</span>}

          {post.readTime && (
            <>
              <span className="text-foreground/30">•</span>
              {/* Read time */}
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{post.readTime} min read</span>
              </div>
            </>
          )}
        </motion.div>

        {/* Cover image */}
        <motion.div variants={itemVariants}>
          {post.coverImage ? (
            <SafeImage
              src={post.coverImage}
              alt={post.title || 'Blog post cover'}
              className="w-full aspect-[16/9] object-cover rounded-2xl"
              fallback={(
                <div className="w-full aspect-[16/9] bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                  <span className="text-9xl font-serif font-bold text-primary/30">
                    {post.title?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
              )}
            />
          ) : (
            <div className="w-full aspect-[16/9] bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 rounded-2xl flex items-center justify-center">
              <span className="text-9xl font-serif font-bold text-primary/30">
                {post.title?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
