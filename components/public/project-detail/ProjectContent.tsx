"use client";
import { motion } from "framer-motion";
import { IProject } from "@/types";

interface ProjectContentProps {
  project: IProject;
}

interface ContentSectionProps {
  number: string;
  label: string;
  heading: string;
  content: string;
  index: number;
}

function ContentSection({ number, label, heading, content, index }: ContentSectionProps) {
  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group hover:border-l-4 hover:border-primary hover:pl-8 transition-all duration-300"
      >
        {/* Section Number Label */}
        <div className="font-mono text-xs uppercase tracking-wider text-secondary mb-3">
          {number} / {label}
        </div>

        {/* Section Heading */}
        <h2 className="font-serif text-4xl font-bold mb-6">{heading}</h2>

        {/* Content Body */}
        <div
          className="text-lg leading-relaxed text-foreground/80 prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </motion.section>

      {/* Divider */}
      <div className="h-px bg-foreground/10" />
    </>
  );
}

/**
 * Project Content - 5 vertically stacked sections with animations
 */
export default function ProjectContent({ project }: ProjectContentProps) {
  const sections = [
    {
      number: "01",
      label: "THE PROBLEM",
      heading: "The Challenge",
      content: project.problemStatement,
    },
    {
      number: "02",
      label: "APPROACH",
      heading: "My Strategy",
      content: project.approach,
    },
    {
      number: "03",
      label: "ANALYSIS",
      heading: "Deep Dive & Insights",
      content: project.analysis,
    },
    {
      number: "04",
      label: "RECOMMENDATIONS",
      heading: "Strategic Recommendations",
      content: project.recommendations,
    },
    {
      number: "05",
      label: "RESULTS & IMPACT",
      heading: "Outcomes Delivered",
      content: project.results,
    },
  ];

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {sections.map((section, index) => {
          if (!section.content) return null;
          return (
            <ContentSection
              key={section.number}
              number={section.number}
              label={section.label}
              heading={section.heading}
              content={section.content}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
}
