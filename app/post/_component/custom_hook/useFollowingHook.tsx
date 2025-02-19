import useSWR from "swr";
import axios from "axios";
import { UserType } from "../postComponent/RenderPost";
import { ToastFunctionType } from "./usePostHook";

type FollowingType = {
  UserFollowing: UserType;
  UserOwner: UserType;
  createdAt: string;
};

export const useFollowing = (ownerId: string, queryUsername = "") => {
  const fetchFollowing = async (
    url: string,
    ownerId: string,
    queryUsername: string
  ): Promise<FollowingType[] | []> => {
    if (!ownerId || ownerId.length === 0) return [];

    let following = [];
    try {
      const res = await axios.get(url, {
        params: {
          owner_id: ownerId,
          query_username: queryUsername,
        },
      });

      if (res.status === 200) {
        following = res.data;
      }
    } catch (err) {
      console.log(err);
    } finally {
      return following;
    }
  };

  const addFollowing = async (
    ownerId: string,
    targetId: string,
    showToast: ToastFunctionType
  ): Promise<FollowingType[] | []> => {
    let newAllFollowing: FollowingType[] | [] = [];
    try {
      const res = await axios.post("/api/user-relation/add-following", {
        ownerId,
        targetId,
      });

      if (res.status === 200) {
        // mutate(["/api/user-relation/get-following", ownerId]);
        newAllFollowing = [res.data.newFollowing, ...(data ?? [])];
      } else {
        showToast({
          title: "Error",
          description: "Error following the author. Please try again later",
        });
      }
    } catch (error) {
      showToast({
        title: "Error",
        description: "Error following the author. Please try again later",
      });
    }
    return newAllFollowing;
  };

  const removeFollowing = async (
    ownerId: string,
    targetId: string,
    showToast: ToastFunctionType
  ): Promise<FollowingType[] | []> => {
    let excludeDeletedFollowing: FollowingType[] | [] = [];
    try {
      const res = await axios.delete("/api/user-relation/delete-following", {
        params: {
          owner_id: ownerId,
          target_id: targetId,
        },
      });
      if (res.status === 200) {
        // mutate(["/api/user-relation/get-following", ownerId]);
        excludeDeletedFollowing = excludeDeletedFollowing.filter(
          (following) => following.UserFollowing.user_id !== targetId
        );
      } else {
        showToast({
          title: "Error",
          description: "Error unfollowing the author. Please try again later",
        });
      }
    } catch (error) {
      showToast({
        title: "Error",
        description: "Error unfollowing the author. Please try again later",
      });
    }

    return excludeDeletedFollowing;
  };

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    ownerId ? ["/api/user-relation/get-following", ownerId] : null,
    () =>
      fetchFollowing("/api/user-relation/get-following", ownerId, queryUsername)
  );

  return {
    allFollowing: data,
    isLoading,
    error,
    isValidating,
    addFollowing,
    removeFollowing,
    followingMutate: mutate,
  };
};
