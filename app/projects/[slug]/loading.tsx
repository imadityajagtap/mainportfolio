/**
 * Loading skeleton for project detail page
 */
export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="min-h-[70vh] flex flex-col justify-center py-20 bg-gradient-to-b from-background to-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 w-64 bg-foreground/10 rounded mb-6 animate-pulse" />

          {/* Category Badge Skeleton */}
          <div className="h-8 w-24 bg-foreground/10 rounded-full mb-8 animate-pulse" />

          {/* Title Skeleton */}
          <div className="space-y-4 mb-6">
            <div className="h-16 bg-foreground/10 rounded w-3/4 animate-pulse" />
            <div className="h-16 bg-foreground/10 rounded w-2/3 animate-pulse" />
          </div>

          {/* Hook Skeleton */}
          <div className="h-8 bg-foreground/10 rounded w-1/2 mb-12 animate-pulse" />

          {/* Meta Row Skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-5 w-20 bg-foreground/10 rounded animate-pulse" />
            <div className="h-5 w-5 bg-foreground/10 rounded-full animate-pulse" />
            <div className="h-5 w-28 bg-foreground/10 rounded animate-pulse" />
            <div className="h-5 w-5 bg-foreground/10 rounded-full animate-pulse" />
            <div className="h-5 w-16 bg-foreground/10 rounded animate-pulse" />
          </div>
        </div>
      </section>

      {/* Content Skeleton Blocks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-12 bg-foreground/10 rounded w-48 animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 bg-foreground/10 rounded animate-pulse" />
              <div className="h-4 bg-foreground/10 rounded animate-pulse" />
              <div className="h-4 bg-foreground/10 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-foreground/10 rounded w-4/6 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
