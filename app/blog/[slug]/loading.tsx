export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="max-w-4xl mx-auto pt-32 pb-12 px-6">
        <div className="h-4 w-48 bg-foreground/10 rounded animate-pulse mb-6" />
        <div className="h-16 w-3/4 bg-foreground/10 rounded animate-pulse mb-6" />
        <div className="h-6 w-full bg-foreground/10 rounded animate-pulse mb-8" />
        <div className="h-4 w-64 bg-foreground/10 rounded animate-pulse mb-12" />
        <div className="aspect-[16/9] bg-foreground/10 rounded-2xl animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
        <div className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-foreground/10 rounded animate-pulse" />
        <div className="h-12 bg-foreground/10 rounded animate-pulse mt-8" />
        <div className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
        <div className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-foreground/10 rounded animate-pulse" />
      </div>
    </div>
  );
}
