"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useFollowing } from "../../post/_component/custom_hook/useFollowingHook";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@uidotdev/usehooks";
import { ToastAction } from "@/components/ui/toast";
import useNotification from "@/app/post/_component/custom_hook/useNotificationHook";
import { NotificationType } from "@/app/post/_component/Enum";
import useSearchDebounce from "./customHook/useSearchDebounce";
import SpinnerSkeleton from "./SpinnerSkeleton";
import FollowingFollowerSkeleton from "./FollowingFollowerSkeleton";

type FollowingTabProps = {
  pageOwnerUserId: string;
};

export function FollowingTab({ pageOwnerUserId }: FollowingTabProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [loggedInUserId] = useLocalStorage<string | null>("test-userId");
  const [searchUsername, setSearchUsername] = useState("");
  const newSearchVal = useSearchDebounce(searchUsername, 500);
  const { addNotification, deleteNotification } = useNotification(
    loggedInUserId ?? ""
  );

  // For the page owner
  const {
    allFollowing: pageOwnerFollowing,
    isLoading,
    isValidating,
    followingMutate,
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
      <div className="flex my-3 relative bg-[rgb(58,59,60)]">
        <Input
          placeholder="Search"
          value={searchUsername}
          onChange={(e) => {
            setSearchUsername(e.target.value);
          }}
          className="bg-[rgb(58,59,60)] border-[rgb(58,59,60)]"
        />
        {/* Show loading spinner when user filtering username */}
        {isValidating && (
          <span className="absolute right-3 top-[0.6rem] border-red-600 w-10">
            <SpinnerSkeleton />
          </span>
        )}
      </div>
      {/* Following is fetching and loading */}
      {pageOwnerUserId && isLoading && <FollowingFollowerSkeleton />}
      {/* Page owner has following and content has finished loading*/}
      {pageOwnerUserId &&
        !isLoading &&
        pageOwnerFollowing &&
        pageOwnerFollowing.length > 0 &&
        pageOwnerFollowing?.map((eachOwnerFollowing) => {
          // Check if the current logged in user is following the current user
          const currentUserIsFollowing = !loggedInUserId
            ? false
            : loggedInFollowing?.find(
                (loggedInUserFollowing) =>
                  loggedInUserFollowing.UserFollowing.user_id ===
                  eachOwnerFollowing.UserFollowing.user_id
              );
          return (
            <div
              key={eachOwnerFollowing.createdAt}
              className="flex justify-between items-center mb-3"
            >
              <Button
                variant="link"
                className="p-0 h-auto text-base leading-none text-white"
                onClick={() =>
                  handleAuthorProfileNavigation(
                    eachOwnerFollowing.UserFollowing.user_id
                  )
                }
              >
                {eachOwnerFollowing.UserFollowing.name}
              </Button>
              {/* We only care about the currently logged in user as they are the one who will be interacting with this follow and unfollow button*/}
              {/* Only show the button if the currently logged in user is not the current following user list*/}
              {loggedInUserId !== eachOwnerFollowing.UserFollowing.user_id && (
                <Button
                  variant="ghost"
                  className="rounded-xl hover:text-red-800 active:text-red-800 bg-[rgb(58,59,60)]"
                  onClick={() => {
                    // User is not logged in
                    if (!loggedInUserId) {
                      toast({
                        title: "Error",
                        description: "Please sign in to follow",
                        action: (
                          <ToastAction
                            altText="Sign in now"
                            onClick={() => {
                              window.location.replace("/sign-in");
                            }}
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
                      followingMutate(
                        loggedInRemoveFollowing(
                          loggedInUserId,
                          eachOwnerFollowing.UserFollowing.user_id,
                          toast
                        ),
                        {
                          optimisticData: loggedInFollowing?.filter(
                            (logInFollowing) =>
                              logInFollowing.UserFollowing.user_id !==
                              eachOwnerFollowing.UserFollowing.user_id
                          ),
                          populateCache: true,
                          revalidate: false,
                          rollbackOnError: true,
                        }
                      );
                      // Delete the follow notification
                      deleteNotification({
                        fromUserId: loggedInUserId,
                        targetUserId: eachOwnerFollowing.UserFollowing.user_id,
                        type: NotificationType.FOLLOW,
                        resourceId: loggedInUserId,
                      });
                    } else {
                      // Add the current user to following
                      followingMutate(
                        loggedInAddFollowing(
                          loggedInUserId,
                          eachOwnerFollowing.UserFollowing.user_id,
                          toast
                        ),
                        {
                          optimisticData: [
                            eachOwnerFollowing,
                            ...(loggedInFollowing ?? []),
                          ],
                          populateCache: true,
                          revalidate: false,
                          rollbackOnError: true,
                        }
                      );
                      // Send notification to the target user that someone started following him or her
                      addNotification({
                        fromUserId: loggedInUserId,
                        targetUserId: [
                          eachOwnerFollowing.UserFollowing.user_id,
                        ],
                        type: NotificationType.FOLLOW,
                        resourceId: loggedInUserId,
                      });
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
      {/* Current user does not have followings */}
      {pageOwnerUserId &&
        !isLoading &&
        pageOwnerFollowing &&
        pageOwnerFollowing.length === 0 && <div>No following</div>}
    </>
  );
}
