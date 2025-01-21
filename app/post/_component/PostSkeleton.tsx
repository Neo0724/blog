import { Skeleton } from "@/components/ui/skeleton";
export default function PostSkeleton() {
  return (
    <div className="flex flex-col items-center">
      {/* First  */}
      <div className="max-w-[800px] w-full flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-[250px] h-6" />
          <Skeleton className="w-9 h-9 ml-auto rounded-full" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="w-[50px] h-6" />
          <Skeleton className="w-[200px] h-6" />
          <div className="flex gap-3">
            <Skeleton className="w-[70px] h-6" />
            <Skeleton className="w-[70px] h-6" />
            <Skeleton className="w-[70px] h-6" />
          </div>
        </div>
      </div>
      {/* Second  */}
      <div className="max-w-[800px] w-full flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-[250px] h-6" />
          <Skeleton className="w-9 h-9 ml-auto rounded-full" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="w-[50px] h-6" />
          <Skeleton className="w-[200px] h-6" />
          <div className="flex gap-3">
            <Skeleton className="w-[70px] h-6" />
            <Skeleton className="w-[70px] h-6" />
            <Skeleton className="w-[70px] h-6" />
          </div>
        </div>
      </div>
      {/* Third  */}
      <div className="max-w-[800px] w-full flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-[250px] h-6" />
          <Skeleton className="w-9 h-9 ml-auto rounded-full" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="w-[50px] h-6" />
          <Skeleton className="w-[200px] h-6" />
          <div className="flex gap-3">
            <Skeleton className="w-[70px] h-6" />
            <Skeleton className="w-[70px] h-6" />
            <Skeleton className="w-[70px] h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
