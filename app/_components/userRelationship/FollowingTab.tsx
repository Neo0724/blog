"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useFollowing } from "../../post/_component/_custom_hook/useFollowingHook";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@uidotdev/usehooks";
import { ToastAction } from "@/components/ui/toast";

type FollowingTabProps = {
  pageOwnerUserId: string;
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

export function FollowingTab({ pageOwnerUserId }: FollowingTabProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [loggedInUserId] = useLocalStorage<string | null>("test-userId");
  const [searchUsername, setSearchUsername] = useState("");
  const newSearchVal = useSearchDebounce(searchUsername, 500);

  // For the page owner
  const {
    allFollowing: pageOwnerFollowing,
    isLoading,
    isValidating,
  } = useFollowing(pageOwnerUserId ?? "", searchUsername);

  // For the currently logged in user
  const {
    allFollowing: loggedInFollowing,
    removeFollowing: loggedInRemoveFollowing,
    addFollowing: loggedInAddFollowing,
  } = useFollowing(loggedInUserId ?? "");

  function handleAuthorProfileNavigation(user_id: string): void {
    router.push(`/user/${user_id}`);
  }

  useEffect(() => {
    mutate(["/api/user-relation/get-following", pageOwnerUserId]);
  }, [newSearchVal, pageOwnerUserId]);

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
      {pageOwnerUserId && isLoading && <ShowSkeleton />}
      {/* Page owner has following and content has finished loading*/}
      {pageOwnerUserId &&
        !isLoading &&
        pageOwnerFollowing &&
        pageOwnerFollowing.length > 0 &&
        pageOwnerFollowing?.map((ownerFollowing) => {
          // Check if the current logged in user is following the current user
          const currentUserIsFollowing = !loggedInUserId
            ? false
            : loggedInFollowing?.find(
                (loggedInUserFollowing) =>
                  loggedInUserFollowing.UserFollowing.user_id ===
                  ownerFollowing.UserFollowing.user_id
              );
          return (
            <div
              key={ownerFollowing.createdAt}
              className="flex justify-between items-center mb-3"
            >
              <Button
                variant="link"
                className="p-0 h-auto text-base leading-none"
                onClick={() =>
                  handleAuthorProfileNavigation(
                    ownerFollowing.UserFollowing.user_id
                  )
                }
              >
                {ownerFollowing.UserFollowing.name}
              </Button>
              {/* We only care about the currently logged in user as they are the one who will be interacting with this follow and unfollow button*/}
              <Button
                variant="ghost"
                className="rounded-xl bg-gray-200 hover:text-red-800 active:text-red-800"
                onClick={() => {
                  // User is not logged in
                  if (!loggedInUserId) {
                    toast({
                      title: "Error",
                      description: "Please sign in to follow",
                      action: (
                        <ToastAction
                          altText="Sign in now"
                          onClick={() => router.push("sign-in")}
                        >
                          Sign in
                        </ToastAction>
                      ),
                    });
                    return;
                  }

                  // Current user is logged in
                  // Remove the user from following
                  if (currentUserIsFollowing) {
                    loggedInRemoveFollowing(
                      loggedInUserId,
                      ownerFollowing.UserFollowing.user_id,
                      toast
                    );
                  } else {
                    // Add the current user to following
                    loggedInAddFollowing(
                      loggedInUserId,
                      ownerFollowing.UserFollowing.user_id,
                      toast
                    );
                  }
                }}
              >
                {!currentUserIsFollowing || !loggedInUserId
                  ? "Follow"
                  : "Unfollow"}
              </Button>
            </div>
          );
        })}
      {/* Current user does not have followings */}
      {pageOwnerUserId &&
        !isLoading &&
        pageOwnerFollowing &&
        pageOwnerFollowing.length === 0 && <div>No following</div>}
    </>
  );
}
