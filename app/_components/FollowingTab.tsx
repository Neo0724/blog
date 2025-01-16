"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useFollowing } from "../(post)/_component/_custom_hook/useFollowingHook";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { mutate } from "swr";

type FollowingTabProps = {
  userId: string;
};

const searchDebounce = (searchValue: string, delay: number) => {
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
  const [searchUsername, setSearchUsername] = useState("");
  const { allFollowing, removeFollowing } = useFollowing(
    userId ?? "",
    searchUsername
  );

  const newSearchVal = searchDebounce(searchUsername, 1500);

  useEffect(() => {
    mutate(["/api/get-following", userId]);
  }, [newSearchVal]);

  return (
    <>
      {/* Search bar */}
      <div className="flex my-3">
        <Input
          placeholder="Search"
          value={searchUsername}
          onChange={(e) => {
            setSearchUsername(e.target.value);
          }}
        />
      </div>
      {userId && allFollowing && allFollowing.length > 0 ? (
        allFollowing?.map((following) => (
          <div
            key={following.createdAt}
            className="flex justify-between items-center mb-3"
          >
            {following.UserFollowing.name}
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
        ))
      ) : (
        <div>No following...</div>
      )}
    </>
  );
}
