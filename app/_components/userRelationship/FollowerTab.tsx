"use client";
import { useFollower } from "../../post/_component/custom_hook/useFollowerHook";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { mutate } from "swr";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@uidotdev/usehooks";
import SpinnerSkeleton from "./SpinnerSkeleton";
import FollowingFollowerSkeleton from "./FollowingFollowerSkeleton";
import useSearchDebounce from "./customHook/useSearchDebounce";

type FollowerTabProps = {
  pageOwnerUserId: string;
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
    followerMutate,
  } = useFollower(pageOwnerUserId ?? "", searchUsername);

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
          className="bg-[rgb(58,59,60)] border-[rgb(58,59,60)]"
        />
        {/* Show loading spinner when user filtering username */}
        {isValidating && (
          <span className="absolute right-3 top-[0.6rem] border-red-600 w-10">
            <SpinnerSkeleton />
          </span>
        )}
      </div>
      {/* Follower is fetching and loading */}
      {pageOwnerUserId && isLoading && <FollowingFollowerSkeleton />}
      {/* User has following and content has finished loading*/}
      {pageOwnerUserId &&
        pageOwnerFollower &&
        pageOwnerFollower.length > 0 &&
        pageOwnerFollower?.map((eachOwnerFollower) => {
          return (
            <div
              key={eachOwnerFollower.createdAt}
              className="flex justify-between items-center mb-3"
            >
              <Button
                variant="link"
                className="p-0 h-auto text-base leading-none text-white"
                onClick={() =>
                  handleAuthorProfileNavigation(
                    eachOwnerFollower.UserFollower.user_id
                  )
                }
              >
                {eachOwnerFollower.UserFollower.name}
              </Button>

              {/* Current logged in user is the same as the page owner */}
              {pageOwnerUserId === loggedInUserId && (
                <Button
                  variant="ghost"
                  className="rounded-xl hover:text-red-800 active:text-red-800 bg-[rgb(58,59,60)]"
                  onClick={() =>
                    followerMutate(
                      pageOwnerRemoveFollower(
                        pageOwnerUserId,
                        eachOwnerFollower.UserFollower.user_id,
                        toast
                      ),
                      {
                        optimisticData: pageOwnerFollower.filter(
                          (follower) =>
                            follower.UserFollower.user_id !==
                            eachOwnerFollower.UserFollower.user_id
                        ),
                        populateCache: true,
                        revalidate: false,
                        rollbackOnError: true,
                      }
                    )
                  }
                >
                  Remove
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
