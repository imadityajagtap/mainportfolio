"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { IProject } from "@/types";
import ProjectCard from "../ProjectCard";

interface RelatedProjectsProps {
  currentSlug: string;
  category: string;
}

/**
 * Related Projects - Fetches and displays 3 related projects
 */
export default function RelatedProjects({
  currentSlug,
  category,
}: RelatedProjectsProps) {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects?category=${category}&limit=4`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          // Filter out current project and limit to 3
          const filtered = data.data
            .filter((p: IProject) => p.slug !== currentSlug)
            .slice(0, 3);
          setProjects(filtered);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentSlug, category]);

  // Don't render if no related projects
  if (!loading && projects.length === 0) return null;

  return (
    <section className="py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="font-mono text-xs uppercase tracking-wider text-secondary mb-3">
            KEEP EXPLORING
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold">
            More case studies
          </h2>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border overflow-hidden">
                <div className="aspect-video bg-muted animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))}
          </div>
        )}

        {/* CTA Button */}
        {!loading && projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all hover:scale-105 duration-300"
            >
              View all projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
