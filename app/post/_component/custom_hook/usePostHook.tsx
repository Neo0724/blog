"use client";
import useSWR from "swr";
import { SearchPostType } from "../Enum";
import axios from "axios";
import { PostType } from "../postComponent/RenderPost";
import { CreatePostFormType } from "../postComponent/CreatePostPage";
import { UseFormReturn } from "react-hook-form";
import { Dispatch } from "react";

export type ToastFunctionType = ({ title, description }: ToastProp) => void;

export type UserType = {
  user_id: string;
  name: string;
};

export type ToastProp = {
  title: string;
  description: string;
};

const fetchPost = async (apiUrl: string): Promise<PostType[] | []> => {
  let returnedPosts: PostType[] | [] = [];
  try {
    const res = await axios.get(apiUrl);

    if (res.status === 200) {
      returnedPosts = res.data ?? [];
    }
  } catch (err) {
    console.log(err);
  }
  return returnedPosts;
};

export default function usePost(
  searchPostType: SearchPostType,
  searchText?: string,
  userId?: string
) {
  let apiUrl = "";
  switch (searchPostType) {
    case 1:
      apiUrl = `/api/post/get-own-post?user_id=${userId}`;
      break;
    case 2:
      apiUrl = `/api/post/get-all-post`;
      break;
    case 3:
      apiUrl = `/api/post/get-search-post?searchText=${searchText}`;
      break;
    case 4:
      apiUrl = `/api/post/get-favourite-post?user_id=${userId}`;
      break;
    default:
      apiUrl = `/api/post/get-all-post`;
      break;
  }

  // Action to update post
  const updatePosts = async (
    postId: string,
    updatedPost: CreatePostFormType,
    showToast: ToastFunctionType
  ): Promise<PostType[] | []> => {
    let allPostsWithUpdatedPost: PostType[] = [];
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
        allPostsWithUpdatedPost =
          data?.map((post) => {
            if (post.post_id === postId) {
              return {
                ...post,
                content: res.data.updatedPost.content,
                title: res.data.updatedPost.title,
              };
            }
            return post;
          }) ?? [];
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
    return allPostsWithUpdatedPost;
  };

  // Action to delete post
  const deletePosts = async (
    postId: string,
    showToast: ToastFunctionType
  ): Promise<PostType[] | []> => {
    let excludeDeletedPosts: PostType[] = [];
    try {
      const res = await axios.delete("/api/post/delete-post", {
        params: {
          post_id: postId,
        },
      });
      if (res.status === 200) {
        excludeDeletedPosts =
          data?.filter((post) => post.post_id !== postId) ?? [];
        showToast({
          title: "Success",
          description: "Post has deleted successfully",
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

    return excludeDeletedPosts;
  };

  // Action to create post
  // Return the new post id for notification adding purpose
  const createPost = async (
    newPost: CreatePostFormType,
    showToast: ToastFunctionType,
    form: UseFormReturn<{
      title: string;
      content: string;
    }>,
    setError: Dispatch<string>,
    userId: string,
    url: string
  ): Promise<string> => {
    const newPostWithUserId = { ...newPost, user_id: userId };
    let newPostId = "";
    try {
      const res = await axios.post("/api/post/create-post", newPostWithUserId);

      if (res.status === 200) {
        showToast({
          title: "Success!",
          description: "Post is successfully created!",
        });
        form.reset({
          title: "",
          content: "",
        });
        mutate([res.data.newPost, ...(data ?? [])]);
        newPostId = res.data.newPost.post_id;
      }
    } catch (error) {
      setError("An unexpected error occur");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
    return newPostId;
  };

  const { data, error, isLoading, mutate } = useSWR(apiUrl, () =>
    fetchPost(apiUrl)
  );

  return {
    isLoading,
    error,
    mutate,
    yourPosts: data,
    createPost,
    updatePosts,
    deletePosts,
    fetchUrl: apiUrl,
  };
}
