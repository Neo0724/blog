"use client";
import { useFollower } from "../../post/_component/_custom_hook/useFollowerHook";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, SVGProps } from "react";
import { mutate } from "swr";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

type FollowerTabProps = {
  userId: string;
};

const ShowSkeleton = () => {
  return (
    <div className="flex items-center space-x-4 w-full">
      <Skeleton className="h-12 rounded-lg flex-[7]" />
      <Skeleton className="h-12 flex-1" />
    </div>
  );
};

const ShowSpinner = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150">
      <path
        fill="none"
        stroke="#000000"
        stroke-width="15"
        stroke-linecap="round"
        stroke-dasharray="300 385"
        stroke-dashoffset="0"
        d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
      >
        <animate
          attributeName="stroke-dashoffset"
          calcMode="spline"
          dur="2"
          values="685;-685"
          keySplines="0 0 1 1"
          repeatCount="indefinite"
        ></animate>
      </path>
    </svg>
  );
};

const useSearchDebounce = (searchValue: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(searchValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue, delay]);

  return debouncedValue;
};

export function FollowerTab({ userId }: FollowerTabProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [searchUsername, setSearchUsername] = useState("");
  const { allFollower, removeFollower, isLoading, isValidating } = useFollower(
    userId ?? "",
    searchUsername
  );

  const newSearchVal = useSearchDebounce(searchUsername, 500);

  const handleAuthorProfileNavigation = (user_id: string) => {
    router.push(`/user/${user_id}`);
  };

  useEffect(() => {
    mutate(["/api/user-relation/get-follower", userId]);
  }, [newSearchVal, userId]);

  return (
    <>
      {/* Search bar */}
      <div className="flex my-3 relative">
        <Input
          placeholder="Search"
          value={searchUsername}
          onChange={(e) => {
            setSearchUsername(e.target.value);
          }}
        />
        {/* Show loading spinner when user filtering username */}
        {isValidating && (
          <span className="absolute right-3 top-[0.6rem] border-red-600 w-10">
            <ShowSpinner />
          </span>
        )}
      </div>
      {/* Follower is fetching and loading */}
      {userId && isLoading && <ShowSkeleton />}
      {/* User has following and content has finished loading*/}
      {userId &&
        allFollower &&
        allFollower.length > 0 &&
        allFollower?.map((follower) => (
          <div
            key={follower.createdAt}
            className="flex justify-between items-center mb-3"
          >
            <Button
              variant="link"
              className="p-0 h-auto text-base leading-none"
              onClick={() =>
                handleAuthorProfileNavigation(follower.UserFollower.user_id)
              }
            >
              {follower.UserFollower.name}
            </Button>
            <Button
              variant="ghost"
              className="rounded-xl bg-gray-200 hover:text-red-800 active:text-red-800"
              onClick={() =>
                removeFollower(userId, follower.UserFollower.user_id, toast)
              }
            >
              Remove
            </Button>
          </div>
        ))}
      {/* Current user does not have followers */}
      {userId && !isLoading && allFollower && allFollower.length === 0 && (
        <div>No follower</div>
      )}
    </>
  );
}
