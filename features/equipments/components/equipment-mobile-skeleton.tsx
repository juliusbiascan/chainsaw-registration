import { EquipmentCardSkeleton } from './equipment-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

interface EquipmentMobileSkeletonProps {
  cardCount?: number;
}

export function EquipmentMobileSkeleton({ cardCount = 8 }: EquipmentMobileSkeletonProps) {
  return (
    <div className="md:hidden">
      {/* Sticky Toolbar Skeleton */}
      <div className="sticky top-0 z-10 bg-background pb-4">
        <div className="flex w-full items-center justify-between gap-2 overflow-auto p-1">
          <div className="flex flex-1 items-center gap-2">
            <Skeleton className="h-7 w-[4.5rem] border-dashed" />
            <Skeleton className="h-7 w-[4.5rem] border-dashed" />
          </div>
          <Skeleton className="h-7 w-[4.5rem]" />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="space-y-4 pb-20">
        {Array.from({ length: cardCount }).map((_, index) => (
          <EquipmentCardSkeleton key={index} />
        ))}

        {/* Mobile Pagination Skeleton */}
        <div className="flex items-center justify-between px-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}
