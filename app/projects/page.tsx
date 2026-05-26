"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import ProjectCard from '@/components/public/ProjectCard';
import { IProject } from '@/types';

// Project categories matching the database schema
const CATEGORIES = ['All', 'Strategy', 'Finance', 'Consulting', 'Research', 'Academic'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch projects');

        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          // Sort: featured first, then by createdAt desc
          const sorted = [...data.data].sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          setProjects(sorted);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects by category and search query
  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      activeCategory === 'All' ||
      project.category === activeCategory;

    const matchesSearch =
      !searchQuery ||
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.hook?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

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
            THE PORTFOLIO
          </p>
          <h1 className="text-6xl md:text-8xl font-serif font-bold leading-tight mb-6">
            Selected <em className="italic text-primary">works</em>
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
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-background border border-foreground/10 rounded-full text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </motion.div>

        {/* Projects grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-foreground/10 animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-foreground/60"
          >
            <p className="text-xl mb-2">
              {projects.length === 0 ? '🚀 Projects coming soon' : 'No projects match your filters'}
            </p>
            {projects.length > 0 && (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={project._id} project={project} index={idx} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
