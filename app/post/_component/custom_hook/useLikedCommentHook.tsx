import axios from "axios";
import useSWR, { KeyedMutator } from "swr";
import { ToastFunctionType } from "./usePostHook";

export default function useLikedComment(user_id: string, post_id: string) {
  const fetchData = async (
    url: string | null,
    user_id: string,
    post_id: string
  ): Promise<string[] | []> => {
    if (!url) {
      return [];
    }
    let returnedLikedComment: string[] | [] = [];
    try {
      const response = await axios.get(url, {
        params: {
          post_id: post_id,
          user_id: user_id,
        },
      });

      if (response.status === 200) {
        returnedLikedComment = response.data;
      }
    } catch (err) {
      console.log(err);
    }
    return returnedLikedComment;
  };

  const { data, error, isLoading, mutate } = useSWR(
    [user_id ? "/api/comment/get-liked-comment" : null, user_id, post_id],
    ([url, user_id, post_id]) => fetchData(url, user_id, post_id)
  );

  const addLikeComment = async (
    userId: string,
    commentId: string,
    setIsLiked: React.Dispatch<boolean>,
    showToast: ToastFunctionType
  ): Promise<string[] | []> => {
    let newLikeCommentId: string = "";
    try {
      const res = await axios.post("/api/comment/add-like-comment", {
        user_id: userId,
        comment_id: commentId,
      });

      if (res.status === 200) {
        newLikeCommentId = res.data.commentId;
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

    return [...(data ?? []), newLikeCommentId];
  };

  const removeLikeComment = async (
    userId: string,
    commentId: string,
    setIsLiked: React.Dispatch<boolean>,
    showToast: ToastFunctionType
  ): Promise<string[] | []> => {
    let removedLikeCommentId: string = "";
    try {
      const res = await axios.delete("/api/comment/delete-like-comment", {
        params: {
          user_id: userId,
          comment_id: commentId,
        },
      });

      if (res.status === 200) {
        removedLikeCommentId = res.data.commentId;
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

    return (
      data?.filter((commentId) => commentId !== removedLikeCommentId) ?? []
    );
  };

  return {
    likedComment: data,
    error,
    likedCommentLoading: isLoading,
    addLikeComment,
    removeLikeComment,
    likedCommentMutate: mutate,
  };
}
