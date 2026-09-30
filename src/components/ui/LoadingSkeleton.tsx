import { cn } from "@/utils/cn";

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-sand/60", className)} />;
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <LoadingSkeleton className="aspect-[3/4]" />
          <LoadingSkeleton className="h-4 w-2/3" />
          <LoadingSkeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}
