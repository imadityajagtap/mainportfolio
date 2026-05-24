"use client";
import { motion } from "framer-motion";

interface ProjectFiltersProps {
  categories: string[];
  activeFilter: string;
  onFilterChange: (category: string) => void;
  counts: Record<string, number>;
}

/**
 * Project Filters - Category filter tabs with animated active state
 */
export default function ProjectFilters({
  categories,
  activeFilter,
  onFilterChange,
  counts,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onFilterChange(category)}
          className={`
            relative px-6 py-3 rounded-full text-sm font-medium
            transition-colors duration-300
            ${
              activeFilter === category
                ? "text-white"
                : "bg-muted text-foreground hover:bg-muted/70"
            }
          `}
        >
          {/* Animated background for active tab */}
          {activeFilter === category && (
            <motion.div
              layoutId="activePill"
              className="absolute inset-0 bg-primary rounded-full"
              style={{ zIndex: -1 }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 30,
              }}
            />
          )}

          {/* Label with count */}
          <span className="relative z-10">
            {category}
            <span className="ml-2 opacity-70">({counts[category] || 0})</span>
          </span>
        </button>
      ))}
    </div>
  );
}
