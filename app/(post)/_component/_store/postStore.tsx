import { create } from "zustand";
import axios from "axios";
import { CreatePostFormType } from "../../create-post/page";
import { mutate } from "swr";
import { UseFormReturn } from "react-hook-form";
import { Dispatch } from "react";

export type UserType = {
  user_id: string;
  name: string;
};

export type PostType = {
  likeCount: number;
  title: string;
  content: string;
  created_at: Date;
  post_id: string;
  dateDifferent: string;
  User: UserType;
};

export type ToastProp = {
  title: string;
  description: string;
};

type PostAction = {
  actions: {
    updatePosts: (
      postId: string,
      updatedPost: CreatePostFormType,
      url: string,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<void>;
    deletePosts: (
      postId: string,
      url: string,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<void>;
    createPost: (
      newPost: CreatePostFormType,
      showToast: ({ title, description }: ToastProp) => void,
      form: UseFormReturn<{
        title: string;
        content: string;
      }>,
      setError: Dispatch<string>
    ) => Promise<void>;
  };
};

export const postStore = create<PostAction>((set) => ({
  // Store all action
  actions: {
    // Action to update post
    updatePosts: async (
      postId: string,
      updatedPost: CreatePostFormType,
      url: string,
      showToast: ({ title, description }: ToastProp) => void
    ) => {
      try {
        const res = await axios.put("/api/update-post", {
          ...updatedPost,
          postId: postId,
        });

        if (res.status === 200) {
          mutate(url);
          showToast({
            title: "Success",
            description: "Post has updated successfully",
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

    // Action to delete post
    deletePosts: async (
      postId: string,
      url: string,
      showToast: ({ title, description }: ToastProp) => void
    ) => {
      try {
        const res = await axios.delete("/api/delete-post", {
          params: {
            post_id: postId,
          },
        });
        mutate(url);
        if (res.status === 200) {
          showToast({
            title: "Success",
            description: "Post has deleted successfully",
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

    // Action to create post
    createPost: async (
      newPost: CreatePostFormType,
      showToast: ({ title, description }: ToastProp) => void,
      form: UseFormReturn<{
        title: string;
        content: string;
      }>,
      setError: Dispatch<string>
    ) => {
      try {
        const res = await axios.post("/api/create-post", newPost);

        if (res.status === 200) {
          showToast({
            title: "Success!",
            description: "Post is successfully created!",
          });
          form.reset({
            title: "",
            content: "",
          });
        }
      } catch (error) {
        setError("An unexpected error occur");
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    },
  },
}));
