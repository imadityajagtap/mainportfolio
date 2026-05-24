"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import BlogCard from '@/components/public/BlogCard';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  publishedDate: string;
  readTime?: number;
}

interface RelatedPostsProps {
  currentSlug: string;
  category?: string;
}

export default function RelatedPosts({ currentSlug, category }: RelatedPostsProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const categoryParam = category ? `&category=${encodeURIComponent(category)}` : '';
        const response = await fetch(
          `/api/blog?published=true&limit=4&sort=-publishedDate${categoryParam}`
        );

        if (!response.ok) throw new Error('Failed to fetch related posts');

        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          // Filter out current post and take first 3
          const filtered = (data.data || [])
            .filter((post: BlogPost) => post.slug !== currentSlug)
            .slice(0, 3);
          setPosts(filtered);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching related posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentSlug, category]);

  // Don't render if no related posts
  if (!loading && posts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-foreground/[0.02] border-t border-foreground/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-mono text-secondary uppercase tracking-[0.3em] mb-4">
            KEEP READING
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold">
            More from the journal
          </h2>
        </motion.div>

        {/* Related posts grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-foreground/10 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {posts.map((post, idx) => (
              <BlogCard key={post._id} post={post} index={idx} />
            ))}
          </div>
        )}

        {/* View all CTA */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
            >
              View all posts
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
