import { create } from "zustand";
import { ToastProp } from "./postStore";
import axios from "axios";
import { mutate } from "swr";

type LikedCommentAction = {
  actions: {
    addLikeComment: (
      userId: string,
      commentId: string,
      setIsLiked: React.Dispatch<boolean>,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<void>;
    removeLikeComment: (
      userId: string,
      commentId: string,
      setIsLiked: React.Dispatch<boolean>,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<void>;
  };
};

export const likedCommentStore = create<LikedCommentAction>(() => ({
  actions: {
    addLikeComment: async (userId, commentId, setIsLiked, showToast) => {
      try {
        const res = await axios.post("/api/add-like-comment", {
          user_id: userId,
          comment_id: commentId,
        });

        if (res.status === 200) {
          mutate(["/api/count-like-comment", commentId]);
          console.log("Added successfully");
          setIsLiked(true);
        }
      } catch (error) {
        console.error(error);
        showToast({
          title: "Error",
          description:
            "An error occured when liking the comment. Please try again later",
        });
      }
    },
    removeLikeComment: async (userId, commentId, setIsLiked, showToast) => {
      try {
        const res = await axios.delete("/api/delete-like-comment", {
          params: {
            user_id: userId,
            comment_id: commentId,
          },
        });

        if (res.status === 200) {
          mutate(["/api/count-like-comment", commentId]);
          console.log("Deleted successfully");
          setIsLiked(false);
        }
      } catch (error) {
        console.error(error);
        showToast({
          title: "Error",
          description:
            "An error occured when removing like from the comment. Please try again later",
        });
      }
    },
  },
}));
