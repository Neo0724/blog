import useSWR from "swr";
import axios from "axios";
import { UserType } from "../postComponent/RenderPost";
import { ToastFunctionType } from "./usePostHook";
import {
  DeleteNotificationType,
  NewNotificationType,
} from "./useNotificationHook";
import customAxios from "@/lib/custom-axios";

type FollowingType = {
  UserFollowing: UserType;
  UserOwner: UserType;
  createdAt: string;
};

export const useFollowing = (ownerId: string, queryUsername = "") => {
  const fetchFollowing = async (
    ownerId: string,
    queryUsername: string
  ): Promise<FollowingType[] | []> => {
    if (!ownerId || ownerId.length === 0) return [];

    let following = [];
    try {
      const res = await customAxios.get(
        `/api/user-relation/get-following?owner_id=${ownerId}&query_username=${queryUsername}`
      );

      if (res.status === 200) {
        following = res.data;
      }
    } catch (err) {
      console.log(err);
    }
    return following;
  };

  const addFollowing = async (
    ownerId: string,
    targetId: string,
    showToast: ToastFunctionType,
    addNotification: (newNotification: NewNotificationType) => void,
    newNotification: NewNotificationType
  ): Promise<FollowingType[] | []> => {
    let newAllFollowing: FollowingType[] | [] = [];
    try {
      const res = await customAxios.post("/api/user-relation/add-following", {
        ownerId,
        targetId,
      });

      if (res.status === 200) {
        newAllFollowing = [res.data.newFollowing, ...(data ?? [])];
        // Send notification to the author that someone started following him or her
        addNotification(newNotification);
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
    showToast: ToastFunctionType,
    removeNotification: (notificationToDelete: DeleteNotificationType) => void,
    notificationToDelete: DeleteNotificationType
  ): Promise<FollowingType[] | []> => {
    let excludeDeletedFollowing: FollowingType[] | [] = [];
    try {
      const res = await customAxios.delete("/api/user-relation/delete-following", {
        params: {
          owner_id: ownerId,
          target_id: targetId,
        },
      });
      if (res.status === 200) {
        excludeDeletedFollowing = excludeDeletedFollowing.filter(
          (following) => following.UserFollowing.user_id !== targetId
        );
        // Delete the follow notification
        removeNotification(notificationToDelete);
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
    () => fetchFollowing(ownerId, queryUsername)
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
