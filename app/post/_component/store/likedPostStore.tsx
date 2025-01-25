import { create } from "zustand";
import { ToastProp } from "./postStore";
import axios from "axios";
import { mutate } from "swr";

type LikedPostAction = {
  actions: {
    addLikePost: (
      userId: string,
      postId: string,
      setIsLiked: React.Dispatch<boolean>,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<void>;
    removeLikePost: (
      userId: string,
      postId: string,
      setIsLiked: React.Dispatch<boolean>,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<void>;
  };
};

export const likedPostStore = create<LikedPostAction>(() => ({
  actions: {
    addLikePost: async (userId, postId, setIsLiked, showToast) => {
      try {
        const res = await axios.post("/api/post/add-like-post", {
          user_id: userId,
          post_id: postId,
        });

        if (res.status === 200) {
          mutate(["/api/post/count-like-post", postId]);
          setIsLiked(true);
        }
      } catch (err) {
        console.log(err);
        showToast({
          title: "Error",
          description:
            "An error occured when liking the post. Please try again later",
        });
      }
    },
    removeLikePost: async (userId, postId, setIsLiked, showToast) => {
      try {
        const res = await axios.delete("/api/post/delete-like-post", {
          params: {
            user_id: userId,
            post_id: postId,
          },
        });

        if (res.status === 200) {
          mutate(["/api/post/count-like-post", postId]);
          setIsLiked(false);
        }
      } catch (err) {
        console.log(err);
        showToast({
          title: "Error",
          description:
            "An error occured when removing like from the post. Please try again later",
        });
      }
    },
  },
}));
