import { create } from "zustand";
import { ToastProp } from "./postStore";
import axios from "axios";
import { mutate } from "swr";

type LikedCommentReplyAction = {
  actions: {
    addLikeCommentReply: (
      userId: string,
      commentReplyId: string,
      setIsLiked: React.Dispatch<boolean>,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<void>;
    removeLikeCommentReply: (
      userId: string,
      commentReplyId: string,
      setIsLiked: React.Dispatch<boolean>,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<void>;
  };
};

export const likedComentReplyStore = create<LikedCommentReplyAction>(() => ({
  actions: {
    addLikeCommentReply: async (
      userId,
      commentReplyId,
      setIsLiked,
      showToast
    ) => {
      try {
        const res = await axios.post("/api/add-like-replycomment", {
          user_id: userId,
          comment_reply_id: commentReplyId,
        });

        if (res.status === 200) {
          mutate(["/api/count-like-replycomment", commentReplyId]);
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
    removeLikeCommentReply: async (
      userId,
      commentReplyId,
      setIsLiked,
      showToast
    ) => {
      try {
        const res = await axios.delete("/api/delete-like-replycomment", {
          params: {
            user_id: userId,
            comment_reply_id: commentReplyId,
          },
        });

        if (res.status === 200) {
          mutate(["/api/count-like-replycomment", commentReplyId]);
          console.log("Deleted successfully");
          setIsLiked(false);
        }
      } catch (err) {
        console.log(err);
        showToast({
          title: "Error",
          description:
            "An error occured when removing like from the comment. Please try again later",
        });
      }
    },
  },
}));
