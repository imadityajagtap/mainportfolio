'use client';

import { motion, useInView } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import { ISkill } from '@/types';
import {
  DollarSign,
  TrendingUp,
  Search,
  Users,
  BarChart3,
  Target,
  Brain,
  MessageSquare,
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Category config with defaults
const categoryConfig: Record<string, { icon: any; emoji: string; color: string }> = {
  Financial: {
    icon: DollarSign,
    emoji: '💰',
    color: 'text-green-500',
  },
  Strategy: {
    icon: Target,
    emoji: '📊',
    color: 'text-blue-500',
  },
  Analytical: {
    icon: Search,
    emoji: '🔍',
    color: 'text-purple-500',
  },
  'Soft Skills': {
    icon: Users,
    emoji: '🤝',
    color: 'text-orange-500',
  },
};

// Default config for custom categories
const defaultCategoryConfig = {
  icon: Brain,
  emoji: '⭐',
  color: 'text-primary',
};

/**
 * Skills Section
 * Displays skills grouped by category with proficiency indicators
 */
export default function Skills() {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Fetch skills data
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills');
        if (response.ok) {
          const data = await response.json();
          setSkills(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, ISkill[]>);

  // Sort skills within each category by order
  Object.keys(groupedSkills).forEach((category) => {
    groupedSkills[category].sort((a, b) => a.order - b.order);
  });

  // Get all categories dynamically from grouped skills
  // Prioritize default categories, then add custom ones
  const defaultCategories = ['Financial', 'Strategy', 'Analytical', 'Soft Skills'];
  const allCategories = Object.keys(groupedSkills);
  const customCategories = allCategories.filter(cat => !defaultCategories.includes(cat));
  const categories = [...defaultCategories.filter(cat => groupedSkills[cat]), ...customCategories];

  return (
    <section
      id="skills"
      className="relative py-20 lg:py-28 overflow-hidden bg-muted/20"
      ref={ref}
    >
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="mb-16 text-center">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-primary">
              03 / Core Competencies
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black mt-4">
              My <em className="text-secondary not-italic">toolkit</em>
            </h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              A blend of financial acumen, strategic thinking, and analytical rigor.
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-card border animate-pulse"
                >
                  <div className="w-12 h-12 bg-muted rounded-full mb-4" />
                  <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-4 bg-muted rounded" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Category Cards Grid */}
          {!isLoading && (
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
            >
              {categories.map((category) => {
                // Use predefined config if available, otherwise use default
                const config = categoryConfig[category] || defaultCategoryConfig;
                const categorySkills = groupedSkills[category] || [];
                const IconComponent = config.icon;

                return (
                  <motion.div
                    key={category}
                    variants={fadeInUp}
                    className="group h-full p-6 md:p-7 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden"
                    whileHover={{ y: -4 }}
                  >
                    {/* Background PieChart Doodle */}
                    <svg
                      className="absolute bottom-4 right-4 w-16 h-16 text-primary opacity-[0.05] group-hover:opacity-[0.08] transition-opacity z-0"
                      viewBox="0 0 100 100"
                      fill="none"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M50 50 L50 10 A40 40 0 0 1 85 60 Z"
                        fill="currentColor"
                        opacity="0.3"
                      />
                      <path
                        d="M50 50 L85 60 A40 40 0 0 1 30 85 Z"
                        fill="currentColor"
                        opacity="0.2"
                      />
                    </svg>

                    {/* Category Icon & Content */}
                    <div className="relative z-10 h-full flex flex-col">
                      <div className="text-4xl mb-2">{config.emoji}</div>

                      {/* Category Title */}
                      <h3 className="font-serif text-2xl font-bold mt-3 mb-6 text-foreground">
                        {category}
                      </h3>

                      {/* Skills List */}
                      <div className="space-y-1">
                        {categorySkills.length > 0 ? (
                          categorySkills.map((skill) => (
                            <div
                              key={skill._id}
                              className="flex items-center justify-between gap-3 py-2 border-b border-border/30 last:border-0"
                            >
                              <span className="text-sm font-medium min-w-0 flex-1 truncate text-foreground">
                                {skill.name}
                              </span>
                              {/* Proficiency Dots */}
                              <div className="flex gap-1 flex-shrink-0">
                                {[1, 2, 3, 4].map((level) => (
                                  <div
                                    key={level}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                      level <= skill.proficiency
                                        ? 'bg-primary'
                                        : 'bg-muted'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            No skills in this category yet
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
