"use client";

import { useEffect, useState } from 'react';

interface BlogContentProps {
  post: {
    content?: string;
  };
}

export default function BlogContent({ post }: BlogContentProps) {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const totalScrollable = documentHeight - windowHeight;
      const progress = totalScrollable > 0 ? (scrollTop / totalScrollable) * 100 : 0;

      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-foreground/5 z-50">
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: post.content || '<p>No content available.</p>' }}
        />
      </div>

      {/* Global styles for blog prose */}
      <style jsx global>{`
        .blog-prose {
          color: rgba(var(--color-foreground), 0.85);
        }

        .blog-prose p {
          font-size: 1.125rem;
          line-height: 1.75;
          margin-bottom: 1.5rem;
        }

        .blog-prose h2 {
          font-size: 2.25rem;
          font-family: var(--font-serif);
          font-weight: bold;
          margin-top: 4rem;
          margin-bottom: 1.5rem;
          color: var(--color-foreground);
        }

        .blog-prose h3 {
          font-size: 1.5rem;
          font-family: var(--font-serif);
          font-weight: bold;
          margin-top: 3rem;
          margin-bottom: 1rem;
          color: var(--color-foreground);
        }

        .blog-prose ul,
        .blog-prose ol {
          list-style-position: outside;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .blog-prose ul {
          list-style-type: disc;
        }

        .blog-prose ol {
          list-style-type: decimal;
        }

        .blog-prose li {
          margin-bottom: 0.5rem;
          line-height: 1.75;
        }

        .blog-prose blockquote {
          border-left: 4px solid var(--color-primary);
          padding-left: 1.5rem;
          font-style: italic;
          font-size: 1.25rem;
          margin: 2rem 0;
          color: rgba(var(--color-foreground), 0.7);
        }

        .blog-prose code {
          background-color: rgba(var(--color-foreground), 0.1);
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.875rem;
        }

        .blog-prose pre {
          background-color: rgba(var(--color-foreground), 0.05);
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }

        .blog-prose pre code {
          background-color: transparent;
          padding: 0;
        }

        .blog-prose a {
          color: var(--color-primary);
          text-decoration: underline;
          transition: color 0.2s;
        }

        .blog-prose a:hover {
          color: rgba(var(--color-primary), 0.8);
        }

        .blog-prose img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 2rem 0;
        }

        .blog-prose strong {
          font-weight: 600;
          color: var(--color-foreground);
        }

        .blog-prose em {
          font-style: italic;
        }

        .blog-prose hr {
          border: none;
          border-top: 1px solid rgba(var(--color-foreground), 0.1);
          margin: 3rem 0;
        }
      `}</style>
    </>
  );
}
