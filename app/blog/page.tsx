"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import BlogCard from '@/components/public/BlogCard';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  author?: string;
  publishedDate: string;
  readTime?: number;
  published?: boolean;
}

const CATEGORIES = ['All', 'Finance', 'Strategy', 'Consulting', 'Markets', 'Personal'];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog?published=true&sort=-publishedDate');
        if (!response.ok) throw new Error('Failed to fetch blog posts');

        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setPosts(data.data || []);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts by category and search query
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === 'All' ||
      post.category?.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-mono text-secondary uppercase tracking-[0.3em] mb-4">
            THE JOURNAL
          </p>
          <h1 className="text-6xl md:text-8xl font-serif font-bold leading-tight mb-6">
            Ideas worth <em className="italic text-primary">sharing</em>
          </h1>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          {/* Category chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-primary text-background shadow-lg'
                    : 'bg-foreground/5 text-foreground/70 hover:bg-foreground/10 border border-foreground/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search input (desktop only) */}
          <div className="hidden md:flex justify-center">
            <div className="relative w-full max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
              />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-background border border-foreground/10 rounded-full text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </motion.div>

        {/* Blog grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-foreground/10 animate-pulse" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-foreground/60"
          >
            <p className="text-xl mb-2">
              {posts.length === 0 ? '✍️ First post coming soon' : 'No posts match your filters'}
            </p>
            {posts.length > 0 && (
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
              <BlogCard key={post._id} post={post} index={idx} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
