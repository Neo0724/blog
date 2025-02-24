import axios from "axios";
import { UserType } from "../postComponent/RenderPost";
import useSWR from "swr";
import { ToastFunctionType } from "./usePostHook";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { CommentSchema } from "@/zod_schema/schema";
import { NewNotificationType } from "./useNotificationHook";
import useSWRInfinite from "swr/infinite";

export type GetBackCommentType = {
  comment_id: string;
  content: string;
  createdAt: Date;
  dateDifferent: string;
  User: UserType; // User is the one who created the comment
};

export const COMMENT_PAGE_SIZE = 5;

export type CommentType = z.infer<typeof CommentSchema>;

export default function useComment(post_id: string, userId: string | null) {
  const getComment = async (
    apiUrl: string
  ): Promise<GetBackCommentType[] | []> => {
    let returnedComments: GetBackCommentType[] | [] = [];
    try {
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        returnedComments = response.data as GetBackCommentType[];
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }

    return returnedComments;
  };

  const updateComments = async (
    commentId: string,
    updatedComments: CommentType,
    showToast: ToastFunctionType
  ): Promise<GetBackCommentType[][] | undefined> => {
    let allCommentsWithUpdatedComment: GetBackCommentType[][] | undefined;
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
          data?.map((page) =>
            page.map((comment) => {
              if (comment.comment_id === commentId) {
                return {
                  ...comment,
                  content: res.data.updatedComment.content,
                };
              }
              return comment;
            })
          ) ?? [];
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
    let excludeDeletedComments: GetBackCommentType[][] | undefined;
    try {
      const res = await axios.delete("/api/comment/delete-comment", {
        params: {
          comment_id: commentId,
        },
      });

      if (res.status === 200) {
        excludeDeletedComments =
          data?.map((page) =>
            page.filter((comment) => comment.comment_id !== commentId)
          ) ?? [];
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
        mutate(
          data?.map((page, index) => {
            index === 0 && page.push(response.data.newComment);
            return page;
          })
        );
        form.reset({ ...newComment, content: "" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getKey = (
    pageIndex: number,
    previousPageData: GetBackCommentType[]
  ) => {
    if ((previousPageData && !previousPageData.length) || !post_id) return null;
    return `/api/comment/get-comment?skipComment=${pageIndex}&limitComment=${COMMENT_PAGE_SIZE}&post_id=${post_id}&user_id=${userId}`;
  };

  const { data, isLoading, error, mutate, size, setSize } = useSWRInfinite<
    GetBackCommentType[]
  >(getKey, getComment);

  return {
    comments: data,
    isLoading,
    commentError: error,
    mutate,
    createComment,
    updateComments,
    deleteComments,
    commentSize: size,
    setCommentSize: setSize,
  };
}
