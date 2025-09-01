import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function RecentEquipmentSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-[160px] sm:w-[160px] w-[120px]" /> {/* CardTitle */}
        <Skeleton className="h-4 w-[200px] sm:w-[200px] w-[140px]" /> {/* CardDescription */}
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0"
            >
              <div className="flex items-center sm:block">
                <Skeleton className="h-9 w-9 rounded-full" /> {/* Avatar */}
              </div>
              <div className="sm:ml-4 space-y-1 flex-1">
                <Skeleton className="h-4 w-[150px] sm:w-[150px] w-[100px]" /> {/* Equipment Name */}
                <Skeleton className="h-4 w-[180px] sm:w-[180px] w-[120px]" /> {/* Description */}
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-5 w-[60px] rounded-full" /> {/* Category Badge */}
                  <Skeleton className="h-5 w-[50px] rounded-full" /> {/* Status Badge */}
                </div>
              </div>
              <div className="sm:ml-auto sm:text-right space-y-1 flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                <Skeleton className="h-3 w-[60px] sm:w-[60px] w-[50px]" /> {/* "Valid Until" label */}
                <Skeleton className="h-4 w-[80px] sm:w-[80px] w-[60px]" /> {/* Date */}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
