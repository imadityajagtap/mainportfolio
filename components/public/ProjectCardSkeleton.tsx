/**
 * Project Card Skeleton - Loading state placeholder
 */
export default function ProjectCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card">
      {/* Cover Image Skeleton */}
      <div className="aspect-video w-full bg-muted animate-pulse" />

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title Skeleton */}
        <div className="h-8 bg-muted rounded animate-pulse w-3/4" />

        {/* Hook Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-full" />
          <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
        </div>

        {/* Impact Metric Skeleton */}
        <div className="h-6 bg-muted rounded animate-pulse w-1/2" />

        {/* Tags Skeleton */}
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded-full animate-pulse w-16" />
          <div className="h-6 bg-muted rounded-full animate-pulse w-20" />
          <div className="h-6 bg-muted rounded-full animate-pulse w-14" />
        </div>
      </div>
    </div>
  );
}
