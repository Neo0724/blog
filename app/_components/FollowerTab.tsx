"use client";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useFollower } from "../(post)/_component/_custom_hook/useFollowerHook";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { mutate } from "swr";
import { Input } from "@/components/ui/input";

type FollowerTabProps = {
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

export function FollowerTab({ userId }: FollowerTabProps) {
  const { toast } = useToast();
  const [searchUsername, setSearchUsername] = useState("");
  const { allFollower, removeFollower } = useFollower(
    userId ?? "",
    searchUsername
  );

  const newSearchVal = searchDebounce(searchUsername, 1500);

  useEffect(() => {
    mutate(["/api/get-follower", userId]);
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
      {userId && allFollower && allFollower.length > 0 ? (
        allFollower?.map((follower) => (
          <div
            key={follower.createdAt}
            className="flex justify-between items-center mb-3"
          >
            {follower.UserFollower.name}
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
        ))
      ) : (
        <div>No followers...</div>
      )}
    </>
  );
}
