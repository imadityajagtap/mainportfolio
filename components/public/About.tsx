"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coffee, BookOpen, TrendingUp, Users, Award, Target, Briefcase, Star, BarChart3, Lightbulb } from "lucide-react";
import { getApiData } from "@/lib/api-client";
import SafeImage from "@/components/ui/SafeImage";

interface FunFact {
  icon: string;
  label: string;
  value: string;
}

interface AboutData {
  bio?: string;
  photo?: string;
  philosophyQuote?: string;
  currentlyReading?: string;
  currentlyLearning?: string;
  funFacts?: FunFact[];
}

export default function About() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/about", { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        const aboutData = getApiData<AboutData>(data);
        if (aboutData) setAbout(aboutData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const iconMap: Record<string, any> = {
    Coffee, BookOpen, TrendingUp, Users, Award, Target,
    Briefcase, Star, BarChart3, Lightbulb
  };

  const renderIcon = (icon: string) => {
    // Check if it's a Lucide icon name
    if (iconMap[icon]) {
      const Icon = iconMap[icon];
      return <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />;
    }
    // Otherwise, show as emoji/text
    return <span className="text-3xl">{icon}</span>;
  };

  return (
    <section id="about" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-primary">
            02 / About Me
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black mt-4 leading-tight">
            The story behind the{" "}
            <em className="text-secondary italic">numbers</em>
          </h2>
        </motion.div>

        {/* Main 2-column grid */}
        <div className="grid lg:grid-cols-5 gap-12 items-start">

          {/* LEFT: Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 relative"
          >
            <div className="aspect-square w-full max-w-md mx-auto relative">
              {about?.photo ? (
                <SafeImage
                  src={about.photo}
                  alt="Aditya Jagtap"
                  className="w-full h-full object-cover rounded-[2rem] border-4 border-primary/20 shadow-2xl shadow-primary/10"
                  fallback={(
                    <div className="w-full h-full rounded-[2rem] border-4 border-primary/30 shadow-2xl shadow-primary/10 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="font-serif text-9xl font-black text-primary">A</span>
                    </div>
                  )}
                />
              ) : (
                <div className="w-full h-full rounded-[2rem] border-4 border-primary/30 shadow-2xl shadow-primary/10 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="font-serif text-9xl font-black text-primary">A</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* RIGHT: Content */}
          <div className="lg:col-span-3 space-y-8">

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg leading-relaxed text-foreground/90"
              dangerouslySetInnerHTML={{
                __html: about?.bio ||
                  "MBA final year student passionate about the intersection of finance, strategy, and consulting. I thrive on turning complex business problems into clear, actionable insights through rigorous analysis and creative frameworks."
              }}
            />

            {/* Philosophy Quote */}
            {about?.philosophyQuote && (
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="border-l-4 border-secondary pl-6 py-2"
              >
                <p className="font-serif italic text-2xl text-secondary leading-snug">
                  "{about.philosophyQuote}"
                </p>
              </motion.blockquote>
            )}

            {/* Fun Facts Grid */}
            {about?.funFacts && about.funFacts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {about.funFacts.map((fact: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    className="p-5 rounded-xl bg-card border hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left"
                  >
                    <div className="mb-3 flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      {renderIcon(fact.icon)}
                    </div>
                    <div className="font-mono text-3xl font-bold text-primary leading-none mb-2">
                      {fact.value}
                    </div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                      {fact.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Currently Reading & Learning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="p-5 rounded-xl border bg-card/50 hover:border-primary/30 transition-all">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  <span className="text-base">📖</span>
                  <span className="font-medium">Currently Reading</span>
                </div>
                <div className="font-serif text-xl font-bold leading-snug">
                  {about?.currentlyReading || "Good Strategy Bad Strategy"}
                </div>
              </div>
              <div className="p-5 rounded-xl border bg-card/50 hover:border-primary/30 transition-all">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  <span className="text-base">🧠</span>
                  <span className="font-medium">Currently Learning</span>
                </div>
                <div className="font-serif text-xl font-bold leading-snug">
                  {about?.currentlyLearning || "Advanced Financial Modeling"}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
