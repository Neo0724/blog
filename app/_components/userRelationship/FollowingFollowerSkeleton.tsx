import { Skeleton } from "@/components/ui/skeleton";

export default function FollowingFollowerSkeleton() {
  return (
    <div className="flex items-center space-x-4 w-full">
      <Skeleton className="h-12 rounded-lg flex-[7]" />
      <Skeleton className="h-12 flex-1" />
    </div>
  );
}
