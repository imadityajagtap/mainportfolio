interface ProjectSectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
  accentColor?: string;
}

/**
 * Reusable Project Content Section
 * Used for Problem, Approach, Analysis, Recommendations, Results
 */
export default function ProjectSection({
  number,
  title,
  children,
  accentColor = "text-secondary",
}: ProjectSectionProps) {
  return (
    <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Number */}
      <div className={`font-serif text-8xl font-bold italic opacity-30 ${accentColor} mb-4`}>
        {number}
      </div>

      {/* Section Title */}
      <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
        {title}
      </h2>

      {/* Decorative Line */}
      <div className="w-24 h-1 bg-primary mb-8" />

      {/* Content */}
      <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
