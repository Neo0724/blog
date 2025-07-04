import axios from "axios";
import useSwr, { KeyedMutator } from "swr";
import { ToastFunctionType } from "./usePostHook";
import {
  DeleteNotificationType,
  NewNotificationType,
} from "./useNotificationHook";
import customAxios from "@/lib/custom-axios";

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
      const response = await customAxios.get(
        `/api/comment-reply/get-liked-comment-reply?comment_id=${comment_id}&user_id=${user_id}`
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
    replyCommentLikeCountMutate: KeyedMutator<number>,
    addNotification?: (newNotification: NewNotificationType) => void,
    newNotification?: NewNotificationType
  ): Promise<string[] | []> => {
    let newLikeCommentReplyId: string = "";
    try {
      const res = await customAxios.post(
        `/api/add-like-replycomment?user_id=${userId}&comment_reply_id=${commentReplyId}`
      );

      if (res.status === 200) {
        // Add the notification is both value are not null or undefined
        if (addNotification && newNotification) {
          addNotification(newNotification);
        }
        newLikeCommentReplyId = res.data.commentReplyId;
      }
    } catch (error) {
      // Revert changes
      setIsLiked(false);
      replyCommentLikeCountMutate((prev) => (prev ? prev - 1 : 0), {
        populateCache: true,
        revalidate: false,
        rollbackOnError: true,
      });
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
    replyCommentLikeCountMutate: KeyedMutator<number>,
    deleteNotification?: (notificationToDelete: DeleteNotificationType) => void,
    notificationToDelete?: DeleteNotificationType
  ): Promise<string[] | []> => {
    let removedLikeCommentReplyId: string = "";
    try {
      const res = await customAxios.delete(
        "/api/comment-reply/delete-like-comment-reply",
        {
          params: {
            user_id: userId,
            comment_reply_id: commentReplyId,
          },
        }
      );

      if (res.status === 200) {
        if (notificationToDelete && deleteNotification) {
          deleteNotification(notificationToDelete);
        }
        removedLikeCommentReplyId = res.data.commentReplyId;
      }
    } catch (err) {
      // Revert changes
      setIsLiked(true);
      replyCommentLikeCountMutate((prev) => (prev ? prev + 1 : 1), {
        populateCache: true,
        revalidate: false,
        rollbackOnError: true,
      });
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
