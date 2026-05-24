"use client";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Clock, Users, Target, Award } from "lucide-react";

interface Metric {
  value: string;
  label: string;
  icon?: string;
}

interface ImpactMetricsProps {
  metrics: Metric[];
}

const iconMap: Record<string, any> = {
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Target,
  Award,
};

/**
 * Impact Metrics Grid - Displays key project outcomes
 */
export default function ImpactMetrics({ metrics }: ImpactMetricsProps) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="font-serif text-3xl md:text-4xl font-bold">
            Impact at a Glance
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon ? iconMap[metric.icon] : TrendingUp;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="absolute top-6 right-6">
                  {IconComponent && (
                    <IconComponent className="w-6 h-6 text-secondary" />
                  )}
                </div>

                {/* Value */}
                <div className="font-mono text-5xl font-bold text-primary mb-2">
                  {metric.value}
                </div>

                {/* Label */}
                <div className="text-sm uppercase tracking-wider text-muted-foreground">
                  {metric.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
