import axios from "axios";
import { create } from "zustand";
import { ToastProp } from "./postStore";
import { mutate } from "swr";

type FollowerAction = {
  actions: {
    removeFollower: (
      ownerId: string,
      followerId: string,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<void>;
  };
};

export const followerStore = create<FollowerAction>(() => ({
  actions: {
    removeFollower: async (ownerId, followerId, showToast) => {
      try {
        const res = await axios.delete("/api/user-relation/delete-follower", {
          params: {
            owner_id: ownerId,
            follower_id: followerId,
          },
        });
        if (res.status === 200) {
          mutate(["/api/user-relation/get-follower", ownerId]);
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
    },
  },
}));
