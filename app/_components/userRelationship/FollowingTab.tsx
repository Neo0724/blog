"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useFollowing } from "../../post/_component/_custom_hook/useFollowingHook";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

type FollowingTabProps = {
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

export function FollowingTab({ userId }: FollowingTabProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [searchUsername, setSearchUsername] = useState("");
  const { allFollowing, removeFollowing, isLoading, isValidating } =
    useFollowing(userId ?? "", searchUsername);

  const newSearchVal = useSearchDebounce(searchUsername, 1500);

  function handleAuthorProfileNavigation(user_id: string): void {
    router.push(`/user/${user_id}`);
  }

  useEffect(() => {
    mutate(["/api/user-relation/get-following", userId]);
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
      {/* Following is fetching and loading */}
      {userId && isLoading && <ShowSkeleton />}
      {/* User has following and content has finished loading*/}
      {userId &&
        !isLoading &&
        allFollowing &&
        allFollowing.length > 0 &&
        allFollowing?.map((following) => (
          <div
            key={following.createdAt}
            className="flex justify-between items-center mb-3"
          >
            <Button
              variant="link"
              className="p-0 h-auto text-base leading-none"
              onClick={() =>
                handleAuthorProfileNavigation(following.UserFollowing.user_id)
              }
            >
              {following.UserFollowing.name}
            </Button>
            <Button
              variant="ghost"
              className="rounded-xl bg-gray-200 hover:text-red-800 active:text-red-800"
              onClick={() =>
                removeFollowing(userId, following.UserFollowing.user_id, toast)
              }
            >
              Unfollow
            </Button>
          </div>
        ))}
      {/* Current user does not have followings */}
      {userId && !isLoading && allFollowing && allFollowing.length === 0 && (
        <div>No following</div>
      )}
    </>
  );
}
