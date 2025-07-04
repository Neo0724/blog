import useSWR from "swr";
import axios from "axios";
import { UserType } from "../postComponent/RenderPost";
import { ToastFunctionType } from "./usePostHook";
import customAxios from "@/lib/custom-axios";

export type UserFollower = {
  UserFollower: UserType;
  UserFollowing: UserType;
  createdAt: string;
};

export const useFollower = (targetId: string, queryUsername = "") => {
  const fetchFollower = async (
    targetId: string,
    queryUsername: string
  ): Promise<UserFollower[] | []> => {
    let follower = [];
    try {
      const res = await customAxios.get(
        `/api/user-relation/get-follower?target_id=${targetId}&query_username=${queryUsername}`
      );

      if (res.status === 200) {
        follower = res.data;
      }
    } catch (err) {
      console.log(err);
    }
    return follower;
  };

  const removeFollower = async (
    ownerId: string,
    followerId: string,
    showToast: ToastFunctionType
  ): Promise<UserFollower[] | []> => {
    let excludeDeletedFollower: UserFollower[] | [] = [];
    try {
      const res = await customAxios.delete(
        "/api/user-relation/delete-follower",
        {
          params: {
            owner_id: ownerId,
            follower_id: followerId,
          },
        }
      );
      if (res.status === 200) {
        excludeDeletedFollower =
          data?.filter(
            (follower) => follower.UserFollower.user_id !== followerId
          ) ?? [];
      } else {
        showToast({
          title: "Error",
          description: "Error removing the follower. Please try again later",
        });
      }
    } catch (error) {
      showToast({
        title: "Error",
        description: "Error removing the follower. Please try again later",
      });
    }

    return excludeDeletedFollower;
  };

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    targetId ? ["/api/user-relation/get-follower", targetId] : null,
    () => fetchFollower(targetId, queryUsername)
  );

  return {
    removeFollower,
    allFollower: data,
    isLoading,
    error,
    isValidating,
    followerMutate: mutate,
  };
};
