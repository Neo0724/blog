"use client";
import { useFollower } from "../../post/_component/_custom_hook/useFollowerHook";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, SVGProps } from "react";
import { mutate } from "swr";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useFollowing } from "@/app/post/_component/_custom_hook/useFollowingHook";
import { ToastAction } from "@/components/ui/toast";

type FollowerTabProps = {
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

export function FollowerTab({ pageOwnerUserId }: FollowerTabProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [loggedInUserId] = useLocalStorage<string | null>("test-userId");
  const [searchUsername, setSearchUsername] = useState("");
  const newSearchVal = useSearchDebounce(searchUsername, 500);

  // For the page owner
  const {
    allFollower: pageOwnerFollower,
    removeFollower: pageOwnerRemoveFollower,
    isLoading,
    isValidating,
  } = useFollower(pageOwnerUserId ?? "", searchUsername);

  // For the currently logged in user
  const {
    allFollowing: loggedInFollowing,
    removeFollowing: loggedInRemoveFollowing,
    addFollowing: loggedInAddFollowing,
  } = useFollowing(loggedInUserId ?? "");

  const handleAuthorProfileNavigation = (user_id: string) => {
    router.push(`/user/${user_id}`);
  };

  useEffect(() => {
    mutate(["/api/user-relation/get-follower", pageOwnerUserId]);
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
      {/* Follower is fetching and loading */}
      {pageOwnerUserId && isLoading && <ShowSkeleton />}
      {/* User has following and content has finished loading*/}
      {pageOwnerUserId &&
        pageOwnerFollower &&
        pageOwnerFollower.length > 0 &&
        pageOwnerFollower?.map((ownerFollower) => {
          // Check if the current logged in user is following the current user
          const currentUserIsFollowing = !loggedInUserId
            ? false
            : loggedInFollowing?.find(
                (loggedInUserFollowing) =>
                  loggedInUserFollowing.UserFollowing.user_id ===
                  ownerFollower.UserFollower.user_id
              );

          return (
            <div
              key={ownerFollower.createdAt}
              className="flex justify-between items-center mb-3"
            >
              <Button
                variant="link"
                className="p-0 h-auto text-base leading-none"
                onClick={() =>
                  handleAuthorProfileNavigation(
                    ownerFollower.UserFollower.user_id
                  )
                }
              >
                {ownerFollower.UserFollower.name}
              </Button>

              {/* Current logged in user is the same as the page owner */}
              {pageOwnerUserId === loggedInUserId && (
                <Button
                  variant="ghost"
                  className="rounded-xl bg-gray-200 hover:text-red-800 active:text-red-800"
                  onClick={() =>
                    pageOwnerRemoveFollower(
                      pageOwnerUserId,
                      ownerFollower.UserFollower.user_id,
                      toast
                    )
                  }
                >
                  Remove
                </Button>
              )}

              {/* Current logged in user is different from the page owner */}
              {pageOwnerUserId !== loggedInUserId && (
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
                        ownerFollower.UserFollower.user_id,
                        toast
                      );
                    } else {
                      // Add the current user to following
                      loggedInAddFollowing(
                        loggedInUserId,
                        ownerFollower.UserFollower.user_id,
                        toast
                      );
                    }
                  }}
                >
                  {!currentUserIsFollowing || !loggedInUserId
                    ? "Follow"
                    : "Unfollow"}
                </Button>
              )}
            </div>
          );
        })}
      {/* Current user does not have followers */}
      {pageOwnerUserId &&
        !isLoading &&
        pageOwnerFollower &&
        pageOwnerFollower.length === 0 && <div>No follower</div>}
    </>
  );
}
