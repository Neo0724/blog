import { create } from "zustand";
import axios from "axios";
import { CreatePostFormType } from "../postComponent/CreatePostPage";
import { KeyedMutator } from "swr";
import { UseFormReturn } from "react-hook-form";
import { Dispatch } from "react";
import { PostType } from "../postComponent/RenderPost";

export type UserType = {
  user_id: string;
  name: string;
};

export type ToastProp = {
  title: string;
  description: string;
};

type PostAttribute = {
  attributes: {
    posts: PostType[] | [];
  };
};

type PostAction = {
  actions: {
    setPosts: (retrivedPosts: PostType[] | []) => void;
    updatePosts: (
      postId: string,
      updatedPost: CreatePostFormType,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<PostType[]>;
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

export const postStore = create<PostAttribute & PostAction>((set, get) => ({
  attributes: {
    posts: [],
  },
  actions: {
    // Store all action
    setPosts: (retrivedPosts) => set({ attributes: { posts: retrivedPosts } }),
    // Action to update post
    updatePosts: async (postId, updatedPost, showToast) => {
      let successfullyUpdatedPost: PostType | null = null;
      try {
        const res = await axios.put("/api/post/update-post", {
          ...updatedPost,
          postId: postId,
        });

        if (res.status === 200) {
          showToast({
            title: "Success",
            description: "Post has updated successfully",
          });
          successfullyUpdatedPost = res.data.updatedPost;
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
      } finally {
        return successfullyUpdatedPost
          ? [...get().attributes.posts, successfullyUpdatedPost]
          : [...get().attributes.posts];
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
