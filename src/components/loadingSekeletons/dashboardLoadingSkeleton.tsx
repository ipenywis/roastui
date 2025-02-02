import { Skeleton } from '@/components/ui/skeleton';
import { container } from '../userSavedDesigns';

export default function DashboardLoadingSkeleton() {
  return (
    <div className={container()}>
      {/* Header */}
      <div className="mb-6 flex justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Example repeated card skeleton */}
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="flex flex-col">
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 mt-4" />
            <Skeleton className="h-2 w-3/5 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
