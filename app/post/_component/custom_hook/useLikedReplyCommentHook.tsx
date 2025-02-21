import axios from "axios";
import useSwr, { KeyedMutator } from "swr";
import { useStore } from "zustand";
import { likedCommentReplyStore } from "../store/likedCommentReplyStore";
import { ToastFunctionType } from "./usePostHook";

// Get all replied comment for a single comment
export default function useLikedReplyComment(
  user_id: string,
  comment_id: string
) {
  const fetchLikedReplyComment = async (
    url: string | null,
    user_id: string,
    comment_id: string
  ): Promise<string[] | []> => {
    if (!url || !user_id) {
      return [];
    }

    let returnedLikedReplyComment: string[] | [] = [];

    try {
      const response = await axios.get(
        "/api/comment-reply/get-liked-comment-reply",
        {
          params: {
            comment_id: comment_id,
            user_id: user_id,
          },
        }
      );

      if (response.status === 200) {
        returnedLikedReplyComment = response.data;
      }
    } catch (err) {
      console.log(err);
    }
    return returnedLikedReplyComment;
  };

  const addLikeCommentReply = async (
    userId: string,
    commentReplyId: string,
    setIsLiked: React.Dispatch<boolean>,
    showToast: ToastFunctionType,
    commentReplyLikeCountMutate: KeyedMutator<number>
  ): Promise<string[] | []> => {
    let newLikeCommentReplyId: string = "";
    try {
      const res = await axios.post("/api/add-like-replycomment", {
        user_id: userId,
        comment_reply_id: commentReplyId,
      });

      if (res.status === 200) {
        // mutate([
        //   "/api/comment-reply/count-like-comment-reply",
        //   commentReplyId,
        // ]);
        newLikeCommentReplyId = res.data.commentReplyId;
        commentReplyLikeCountMutate((prev) => (prev ?? 0) + 1, {
          revalidate: false,
          populateCache: true,
        });
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

    return [...(data ?? []), newLikeCommentReplyId];
  };

  const removeLikeCommentReply = async (
    userId: string,
    commentReplyId: string,
    setIsLiked: React.Dispatch<boolean>,
    showToast: ToastFunctionType,
    commentReplyLikeCountMutate: KeyedMutator<number>
  ): Promise<string[] | []> => {
    let removedLikeCommentReplyId: string = "";
    try {
      const res = await axios.delete(
        "/api/comment-reply/delete-like-comment-reply",
        {
          params: {
            user_id: userId,
            comment_reply_id: commentReplyId,
          },
        }
      );

      if (res.status === 200) {
        // mutate([
        //   "/api/comment-reply/count-like-comment-reply",
        //   commentReplyId,
        // ]);
        removedLikeCommentReplyId = res.data.commentReplyId;
        commentReplyLikeCountMutate((prev) => (prev ?? 1) - 1, {
          revalidate: false,
          populateCache: true,
        });
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

    return (
      data?.filter((comment_reply_id) => comment_reply_id !== commentReplyId) ??
      []
    );
  };

  const { data, error, isLoading, mutate } = useSwr(
    [
      user_id ? "/api/comment-reply/get-liked-comment-reply" : null,
      user_id,
      comment_id,
    ],
    ([url, user_id, comment_id]) =>
      fetchLikedReplyComment(url, user_id, comment_id)
  );

  return {
    likedReplyComment: data,
    error,
    addLikeCommentReply,
    removeLikeCommentReply,
    likedCommentReplyMutate: mutate,
  };
}
