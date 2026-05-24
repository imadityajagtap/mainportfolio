import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-9xl font-serif font-bold text-primary mb-6">404</h1>
        <h2 className="text-4xl font-serif font-bold mb-4">Post not found</h2>
        <p className="text-lg text-foreground/60 mb-8">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          <span>←</span>
          Back to journal
        </Link>
      </div>
    </div>
  );
}
