import { create } from "zustand";
import { UserType } from "./postStore";
import { z } from "zod";
import { CommentSchema } from "@/app/api/comment/create-comment/route";
import { ToastProp } from "./postStore";
import axios from "axios";
import { mutate } from "swr";
import { UseFormReturn } from "react-hook-form";

export type GetBackCommentType = {
  comment_id: string;
  content: string;
  created_at: Date;
  dateDifferent: string;
  User: UserType;
};

export type CommentType = z.infer<typeof CommentSchema>;

type CommentAction = {
  actions: {
    updateComments: (
      commentId: string,
      updatedComments: CommentType,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<void>;
    deleteComments: (
      commentId: string,
      postId: string,
      userId: string,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<void>;

    // It will return the newly created comment ID
    createComment: (
      newComment: CommentType,
      form: UseFormReturn<{
        content: string;
        post_id: string;
        user_id: string;
      }>
    ) => Promise<string>;
  };
};

export const commentStore = create<CommentAction>(() => ({
  actions: {
    updateComments: async (
      commentId,
      updatedComments,
      showToast: ({ title, description }: ToastProp) => void
    ) => {
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
          mutate([
            "/api/comment/get-comment",
            updatedComments.post_id,
            updatedComments.user_id,
          ]);
          showToast({
            title: "Success",
            description: "Comment has updated successfully",
          });
        } else {
          showToast({
            title: "Error",
            description:
              "Unexpected error occured. Please try updating it later",
          });
        }
      } catch (err) {
        console.log(err);
        showToast({
          title: "Error",
          description: "Unexpected error occured. Please try updating it later",
        });
      }
    },
    deleteComments: async (
      commentId,
      postId,
      userId,
      showToast: ({ title, description }: ToastProp) => void
    ) => {
      try {
        const res = await axios.delete("/api/comment/delete-comment", {
          params: {
            comment_id: commentId,
          },
        });

        if (res.status === 200) {
          mutate(["/api/comment/get-comment", postId, userId]);
          showToast({
            title: "Success",
            description: "Comment has deleted successfully",
          });
        } else {
          showToast({
            title: "Error",
            description:
              "Unexpected error occured. Please try deleting it later",
          });
        }
      } catch (err) {
        console.log(err);
        showToast({
          title: "Error",
          description: "Unexpected error occured. Please try deleting it later",
        });
      }
    },
    createComment: async (newComment, form) => {
      let commentId = "";
      try {
        const response = await axios.post(
          "/api/comment/create-comment",
          newComment
        );

        if (response.status === 200) {
          mutate([
            "/api/comment/get-comment",
            newComment.post_id,
            newComment.user_id,
          ]);
          form.reset({ ...newComment, content: "" });
          commentId = response.data.comment_id;
        }
      } catch (error) {
        console.log(error);
      }
      return commentId;
    },
  },
}));
