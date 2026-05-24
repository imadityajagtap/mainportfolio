"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { IProject } from "@/types";

interface ProjectHeroProps {
  project: IProject;
}

/**
 * Project Hero Section - Full-width hero with breadcrumb, title, and meta
 */
export default function ProjectHero({ project }: ProjectHeroProps) {
  // Extract year from createdAt or use a default
  const year = project.createdAt
    ? new Date(project.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <section className="relative min-h-[70vh] flex flex-col justify-center py-20 overflow-hidden bg-gradient-to-b from-background to-background/50">
      {/* Background Doodles */}
      <motion.svg
        className="absolute top-20 right-10 w-32 h-32 text-primary opacity-10"
        viewBox="0 0 100 100"
        fill="none"
        initial={{ opacity: 0, rotate: -10 }}
        animate={{ opacity: 0.1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {/* Circle doodle */}
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="3" />
        <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="2" />
      </motion.svg>

      <motion.svg
        className="absolute bottom-32 left-10 w-40 h-20 text-secondary opacity-10"
        viewBox="0 0 100 50"
        fill="none"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.1, x: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        {/* Arrow doodle */}
        <path
          d="M10 25 L70 25 M70 25 L60 15 M70 25 L60 35"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </motion.svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm text-muted-foreground mb-6"
        >
          Projects / {project.category} / {project.title}
        </motion.div>

        {/* Category Badge & Featured Star */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
            {project.category}
          </span>
          {project.featured && (
            <span className="flex items-center gap-1 text-secondary">
              <Star className="w-4 h-4 fill-current" />
            </span>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6"
        >
          {project.title}
        </motion.h1>

        {/* Hook/Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl italic text-foreground/70 max-w-3xl mb-12"
        >
          {project.hook}
        </motion.p>

        {/* Bottom Meta Row: Duration | Role | Year */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center gap-4 text-sm text-muted-foreground"
        >
          {(project as any).duration && (
            <>
              <span className="font-medium">{(project as any).duration}</span>
              <span className="text-muted-foreground/50">•</span>
            </>
          )}
          {(project as any).role && (
            <>
              <span className="font-medium">{(project as any).role}</span>
              <span className="text-muted-foreground/50">•</span>
            </>
          )}
          <span className="font-medium">{year}</span>
        </motion.div>
      </div>
    </section>
  );
}
