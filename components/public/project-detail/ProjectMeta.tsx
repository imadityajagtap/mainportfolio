"use client";
import { motion } from "framer-motion";
import { Target, Clock, User, Wrench } from "lucide-react";

interface ProjectMetaProps {
  impactMetric?: string;
  duration?: string;
  role?: string;
  tools?: string[];
}

/**
 * Project Meta - Horizontal metrics strip below hero
 */
export default function ProjectMeta({
  impactMetric,
  duration,
  role,
  tools,
}: ProjectMetaProps) {
  const metrics = [
    {
      icon: Target,
      label: "Impact",
      value: impactMetric || "Significant",
    },
    {
      icon: Clock,
      label: "Duration",
      value: duration || "3 months",
    },
    {
      icon: User,
      label: "Role",
      value: role || "Analyst",
    },
    {
      icon: Wrench,
      label: "Tools",
      value: tools && tools.length > 0 ? `${tools.length} tools` : tools?.join(", ") || "Various",
    },
  ];

  return (
    <section className="py-12 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border border-border p-6 hover:border-primary transition-all duration-300 bg-card"
              >
                <Icon className="w-5 h-5 text-secondary mb-3" />
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  {metric.label}
                </div>
                <div className="font-serif text-2xl font-bold text-primary">
                  {metric.value}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
