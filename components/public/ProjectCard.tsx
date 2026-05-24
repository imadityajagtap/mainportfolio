"use client";
import { IProject } from "@/types";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";

interface ProjectCardProps {
  project: IProject;
  index: number;
}

/**
 * Project Card - Individual project display with hover effects
 */
export default function ProjectCard({ project, index }: ProjectCardProps) {
  // Get first letter of title for fallback
  const title = project.title || 'Untitled project';
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const firstLetter = title.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group relative block h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/50"
      >
        {/* Cover Image or Fallback */}
        <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
          {project.coverImage ? (
            <SafeImage
              src={project.coverImage}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              fallback={(
                <div className="flex items-center justify-center w-full h-full">
                  <span className="font-serif text-8xl font-black text-primary/30">
                    {firstLetter}
                  </span>
                </div>
              )}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <span className="font-serif text-8xl font-black text-primary/30">
                {firstLetter}
              </span>
            </div>
          )}

          {/* Category Badge - Top Left */}
          <div className="absolute top-3 left-3 rounded-full bg-background/80 backdrop-blur px-3 py-1">
            <span className="text-xs font-medium text-foreground">
              {project.category || 'Project'}
            </span>
          </div>

          {/* Featured Badge - Top Right */}
          {project.featured && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
              <Star className="w-3 h-3 text-white fill-white" />
              <span className="text-xs font-bold text-white">FEATURED</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <h3 className="font-serif text-2xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Hook/Tagline */}
          <p className="text-muted-foreground line-clamp-2 leading-relaxed">
            {project.hook}
          </p>

          {/* Impact Metric */}
          {project.impactMetric && (
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-bold text-primary">
                {project.impactMetric}
              </span>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="rounded-full bg-muted px-3 py-1 text-xs text-foreground"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                +{tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
