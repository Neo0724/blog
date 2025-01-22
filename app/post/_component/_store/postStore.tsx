import { create } from "zustand";
import axios from "axios";
import { CreatePostFormType } from "../CreatePostPage";
import { mutate } from "swr";
import { UseFormReturn } from "react-hook-form";
import { Dispatch } from "react";

export type UserType = {
  user_id: string;
  name: string;
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

    // It will return the newly created post ID
    createPost: (
      newPost: CreatePostFormType,
      showToast: ({ title, description }: ToastProp) => void,
      form: UseFormReturn<{
        title: string;
        content: string;
      }>,
      setError: Dispatch<string>,
      userId: string,
      url: string
    ) => Promise<string>;
  };
};

export const postStore = create<PostAction>(() => ({
  // Store all action
  actions: {
    // Action to update post
    updatePosts: async (postId, updatedPost, url, showToast) => {
      try {
        const res = await axios.put("/api/post/update-post", {
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
    deletePosts: async (postId, url, showToast) => {
      try {
        const res = await axios.delete("/api/post/delete-post", {
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
    createPost: async (newPost, showToast, form, setError, userId, url) => {
      const newPostWithUserId = { ...newPost, user_id: userId };
      let newPostId = "";
      try {
        const res = await axios.post(
          "/api/post/create-post",
          newPostWithUserId
        );

        if (res.status === 200) {
          showToast({
            title: "Success!",
            description: "Post is successfully created!",
          });
          mutate(url);
          form.reset({
            title: "",
            content: "",
          });
          newPostId = res.data.data.post_id;
        }
      } catch (error) {
        setError("An unexpected error occur");
        setTimeout(() => {
          setError("");
        }, 3000);
      } finally {
        return newPostId;
      }
    },
  },
}));
