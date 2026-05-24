"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, ArrowUpRight } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';

interface BlogCardProps {
  post: {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: string;
    category?: string;
    tags?: string[];
    publishedDate: string;
    readTime?: number;
  };
  index: number;
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

export default function BlogCard({ post, index }: BlogCardProps) {
  const postDate = formatPostDate(post.publishedDate);

  return (
    <Link href={`/blog/${post.slug || ''}`}>
      <motion.article
        initial={{ opacity: 1, y: 20 }} // ✅ Fixed: visible immediately
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }} // ✅ Trigger earlier
        className="group relative bg-background border border-foreground/10 rounded-2xl overflow-hidden hover:border-primary hover:shadow-xl transition-all duration-300"
      >
        {/* Cover image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-foreground/5">
          {post.coverImage ? (
            <SafeImage
              src={post.coverImage}
              alt={post.title || 'Blog post'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              fallback={(
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-8xl font-serif font-bold text-primary/30">
                    {post.title?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
              )}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 flex items-center justify-center">
              <span className="text-8xl font-serif font-bold text-primary/30">
                {post.title?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
          )}

          {/* Category badge */}
          {post.category && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-background/90 backdrop-blur-sm text-foreground text-xs font-mono uppercase tracking-wider rounded-full border border-foreground/10">
              {post.category}
            </div>
          )}

          {/* Arrow icon (appears on hover) */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight size={16} className="text-background" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta row */}
          <div className="flex items-center gap-4 mb-3 text-xs text-foreground/60">
            {postDate && <span className="font-mono uppercase">{postDate}</span>}
            {post.readTime && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={12} />
                {post.readTime} min
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-serif font-bold leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title || 'Untitled'}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-foreground/75 text-sm leading-relaxed mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {(post.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(post.tags || []).slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-foreground/5 text-foreground/60 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.article>
    </Link>
  );
}
