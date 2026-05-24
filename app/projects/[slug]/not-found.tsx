import Link from "next/link";

/**
 * 404 Not Found page for project detail
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Doodle */}
      <svg
        className="absolute top-1/4 right-10 w-48 h-48 text-secondary opacity-10"
        viewBox="0 0 100 100"
        fill="none"
      >
        {/* Rose gold accent doodle - star shape */}
        <path
          d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <div className="text-center max-w-2xl relative z-10">
        {/* Large 404 */}
        <div className="font-serif text-9xl md:text-[12rem] font-bold text-primary mb-8 leading-none">
          404
        </div>

        {/* Heading */}
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
          Case study not found
        </h1>

        {/* Description */}
        <p className="text-xl text-muted-foreground mb-10">
          The project you're looking for doesn't exist or may have been moved.
        </p>

        {/* CTA Button */}
        <Link
          href="/#projects"
          className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all hover:scale-105 duration-300"
        >
          Back to all projects
        </Link>
      </div>
    </div>
  );
}
