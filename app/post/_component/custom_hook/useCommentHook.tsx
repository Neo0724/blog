import axios from "axios";
import { UserType } from "../postComponent/RenderPost";
import useSWR from "swr";
import { CommentType } from "../store/commentStore";
import { ToastFunctionType } from "./usePostHook";
import { UseFormReturn } from "react-hook-form";

export type GetBackCommentType = {
  comment_id: string;
  content: string;
  createdAt: Date;
  dateDifferent: string;
  User: UserType; // User is the one who created the comment
};

export default function useComment(post_id: string, userId: string | null) {
  const getComment = async (
    url: string,
    post_id: string,
    userId: string | null
  ): Promise<GetBackCommentType[] | []> => {
    let returnedComments: GetBackCommentType[] | [] = [];
    try {
      const response = await axios.get(url, {
        params: {
          post_id: post_id,
          user_id: userId ?? "",
        },
      });

      if (response.status === 200) {
        returnedComments = response.data as GetBackCommentType[];
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }

    return returnedComments;
  };

  const { data, isLoading, error, mutate } = useSWR(
    ["/api/comment/get-comment", post_id, userId],
    ([url, post_id, userId]) => getComment(url, post_id, userId)
  );

  const updateComments = async (
    commentId: string,
    updatedComments: CommentType,
    showToast: ToastFunctionType
  ): Promise<GetBackCommentType[] | []> => {
    let allCommentsWithUpdatedComment: GetBackCommentType[] = [];
    try {
      const updatedCommentsWithId = {
        ...updatedComments,
        comment_id: commentId,
      };
      const res = await axios.put(
        "/api/comment/update-comment",
        updatedCommentsWithId
      );

      if (res.status === 200) {
        // mutate([
        //   "/api/comment/get-comment",
        //   updatedComments.post_id,
        //   updatedComments.user_id,
        // ]);
        allCommentsWithUpdatedComment =
          data?.map((comment) => {
            if (comment.comment_id === commentId) {
              return {
                ...comment,
                content: res.data.updatedComment.content,
              };
            }
            return comment;
          }) ?? [];
        showToast({
          title: "Success",
          description: "Comment has updated successfully",
        });
      } else {
        showToast({
          title: "Error",
          description: "Unexpected error occured. Please try updating it later",
        });
      }
    } catch (err) {
      console.log(err);
      showToast({
        title: "Error",
        description: "Unexpected error occured. Please try updating it later",
      });
    }

    return allCommentsWithUpdatedComment;
  };

  const deleteComments = async (
    commentId: string,
    postId: string,
    userId: string,
    showToast: ToastFunctionType
  ) => {
    let excludeDeletedComments: GetBackCommentType[] = [];
    try {
      const res = await axios.delete("/api/comment/delete-comment", {
        params: {
          comment_id: commentId,
        },
      });

      if (res.status === 200) {
        // mutate(["/api/comment/get-comment", postId, userId]);
        excludeDeletedComments =
          data?.filter((comment) => comment.comment_id !== commentId) ?? [];
        showToast({
          title: "Success",
          description: "Comment has deleted successfully",
        });
      } else {
        showToast({
          title: "Error",
          description: "Unexpected error occured. Please try deleting it later",
        });
      }
    } catch (err) {
      console.log(err);
      showToast({
        title: "Error",
        description: "Unexpected error occured. Please try deleting it later",
      });
    }

    return excludeDeletedComments;
  };

  const createComment = async (
    newComment: CommentType,
    form: UseFormReturn<{
      content: string;
      post_id: string;
      user_id: string;
    }>
  ): Promise<string> => {
    let commentId = "";
    try {
      const response = await axios.post(
        "/api/comment/create-comment",
        newComment
      );

      if (response.status === 200) {
        // mutate([
        //   "/api/comment/get-comment",
        //   newComment.post_id,
        //   newComment.user_id,
        // ]);
        mutate((prevData) => {
          return [response.data.newComment, ...(prevData ?? [])];
        });
        form.reset({ ...newComment, content: "" });
        commentId = response.data.newComment.comment_id;
      }
    } catch (error) {
      console.log(error);
    }
    return commentId;
  };

  return {
    comments: data,
    isLoading,
    commentError: error,
    mutate,
    createComment,
    updateComments,
    deleteComments,
  };
}
