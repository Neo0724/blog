import axios from "axios";
import { UserType } from "../postComponent/RenderPost";
import useSWR from "swr";
import { ToastFunctionType } from "./usePostHook";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { CommentSchema } from "@/zod_schema/schema";
import { NewNotificationType } from "./useNotificationHook";

export type GetBackCommentType = {
  comment_id: string;
  content: string;
  createdAt: Date;
  dateDifferent: string;
  User: UserType; // User is the one who created the comment
};

export type CommentType = z.infer<typeof CommentSchema>;

export default function useComment(post_id: string, userId: string | null) {
  const getComment = async (
    post_id: string,
    userId: string | null
  ): Promise<GetBackCommentType[] | []> => {
    let returnedComments: GetBackCommentType[] | [] = [];
    try {
      const response = await axios.get(
        `/api/comment/get-comment?post_id=${post_id}&user_id=${userId}`
      );

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
    ([url, post_id, userId]) => getComment(post_id, userId)
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
    }>,
    addNotification?: (newNotification: NewNotificationType) => void,
    newNotification?: Omit<NewNotificationType, "resourceId">
  ): Promise<void> => {
    try {
      const response = await axios.post(
        "/api/comment/create-comment",
        newComment
      );

      if (response.status === 200) {
        if (addNotification && newNotification) {
          addNotification({
            ...newNotification,
            resourceId: response.data.newComment.comment_id,
          });
        }
        mutate((prevData) => {
          return [response.data.newComment, ...(prevData ?? [])];
        });
        form.reset({ ...newComment, content: "" });
      }
    } catch (error) {
      console.log(error);
    }
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
