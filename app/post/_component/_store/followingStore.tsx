import axios from "axios";
import { create } from "zustand";
import { ToastProp } from "./postStore";
import { mutate } from "swr";

type FollowingAction = {
  actions: {
    addFollowing: (
      ownerId: string,
      targetId: string,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<void>;
    removeFollowing: (
      ownerId: string,
      targetId: string,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<void>;
  };
};

export const followingStore = create<FollowingAction>(() => ({
  actions: {
    addFollowing: async (ownerId, targetId, showToast) => {
      try {
        const res = await axios.post("/api/user-relation/add-following", {
          ownerId,
          targetId,
        });

        if (res.status === 200) {
          mutate(["/api/user-relation/get-following", ownerId]);
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
    },
    removeFollowing: async (ownerId, targetId, showToast) => {
      try {
        const res = await axios.delete("/api/user-relation/delete-following", {
          params: {
            owner_id: ownerId,
            target_id: targetId,
          },
        });
        if (res.status === 200) {
          mutate(["/api/user-relation/get-following", ownerId]);
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
    },
  },
}));
