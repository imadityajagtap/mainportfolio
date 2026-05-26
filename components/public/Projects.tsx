"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen } from "lucide-react";
import Link from "next/link";
import { IProject } from "@/types";
import ProjectCard from "./ProjectCard";
import ProjectFilters from "./ProjectFilters";
import ProjectCardSkeleton from "./ProjectCardSkeleton";

const CATEGORIES = ["All", "Strategy", "Finance", "Consulting", "Research", "Academic"];

/**
 * Projects Section - Main projects grid with filtering
 */
export default function Projects() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  // Fetch projects on mount
  useEffect(() => {
    fetch("/api/projects", { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          // Sort: featured first, then by createdAt desc
          const sorted = [...data.data].sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          setProjects(sorted);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter projects based on active category
  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [projects, activeFilter]);

  // Calculate counts per category
  const counts = useMemo(() => {
    const result: Record<string, number> = { All: projects.length };
    CATEGORIES.slice(1).forEach((cat) => {
      result[cat] = projects.filter((p) => p.category === cat).length;
    });
    return result;
  }, [projects]);

  return (
    <section id="projects" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
              04 / SELECTED WORK
            </span>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-black mt-4 leading-tight">
              Projects that tell a{" "}
              <em className="text-secondary italic">story</em>
            </h2>
            <p className="text-lg text-muted-foreground mt-6">
              Real problems. Real analysis. Real impact.
            </p>
          </motion.div>

          {/* View all link - desktop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="hidden md:block"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
            >
              View all projects
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <ProjectFilters
            categories={CATEGORIES}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={counts}
          />
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {!loading && filteredProjects.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence mode="wait">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <FolderOpen className="w-16 h-16 text-muted-foreground mb-6" />
            <p className="text-xl text-muted-foreground mb-6">
              No projects in this category yet — check back soon! 🚧
            </p>
            <button
              onClick={() => setActiveFilter("All")}
              className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              View All Projects
            </button>
          </motion.div>
        )}

        {/* View all link - mobile */}
        {!loading && filteredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:hidden text-center mt-12"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
            >
              View all projects
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
