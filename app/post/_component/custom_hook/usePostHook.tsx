"use client";
import { SearchPostType } from "../Enum";
import axios from "axios";
import { PostType } from "../postComponent/RenderPost";
import { CreatePostFormType } from "../postComponent/CreatePostPage";
import { UseFormReturn } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import useSWRInfinite from "swr/infinite";
import { NewNotificationType } from "./useNotificationHook";
import { UserFollower } from "./useFollowerHook";

export const POST_PAGE_SIZE = 4;

export type ToastFunctionType = ({ title, description }: ToastProp) => void;

export type UserType = {
  user_id: string;
  name: string;
};

export type ToastProp = {
  title: string;
  description: string;
};

/* Fetch for SWR infinite will only fetch post for one single page at once */
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
      apiUrl = userId ? `/api/post/get-own-post?user_id=${userId}` : "";
      break;
    case 2:
      apiUrl = `/api/post/get-all-post?`;
      break;
    case 3:
      apiUrl = `/api/post/get-search-post?searchText=${searchText}`;
      break;
    case 4:
      apiUrl = userId ? `/api/post/get-favourite-post?user_id=${userId}` : "";
      break;
    default:
      apiUrl = `/api/post/get-all-post?`;
      break;
  }

  // Action to update post
  const updatePosts = async (
    postId: string,
    updatedPost: CreatePostFormType,
    showToast: ToastFunctionType
  ): Promise<PostType[][] | undefined> => {
    let allPostsWithUpdatedPost: PostType[][] | undefined;
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
          data?.map((page) =>
            page.map((post) => {
              if (post.post_id === postId) {
                return {
                  ...post,
                  content: res.data.updatedPost.content,
                  title: res.data.updatedPost.title,
                };
              }
              return post;
            })
          ) ?? [];
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
  ): Promise<PostType[][] | undefined> => {
    let excludeDeletedPosts: PostType[][] | undefined;
    try {
      const res = await axios.delete("/api/post/delete-post", {
        params: {
          post_id: postId,
        },
      });
      if (res.status === 200) {
        excludeDeletedPosts =
          data?.map(
            (page) => page.filter((post) => post.post_id !== postId) ?? []
          ) ?? [];
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
    addNotification: (newNotification: NewNotificationType) => void,
    newNotification: Omit<NewNotificationType, "resourceId">,
    allFollower: UserFollower[] | []
  ): Promise<void> => {
    const newPostWithUserId = { ...newPost, user_id: userId };
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
        mutate(
          data?.map((page, index) => {
            index === 0 && page.push(res.data.newPost);
            return page;
          })
        );
        if (allFollower) {
          addNotification({
            ...newNotification,
            resourceId: res.data.newPost.post_id,
          });
        }
      }
    } catch (error) {
      setError("An unexpected error occur");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const addToFavourite = async (
    userId: string,
    postId: string,
    setIsFavourited: React.Dispatch<SetStateAction<boolean>>,
    showToast: ToastFunctionType
  ): Promise<PostType[][] | undefined> => {
    let newAllFavouritePost: PostType[][] | undefined;
    try {
      const res = await axios.post("/api/post/add-favourite-post", {
        user_id: userId,
        post_id: postId,
      });

      if (res.status === 200) {
        mutate(
          data?.map((page, index) => {
            index === 0 && page.push(res.data.newFavouritePost);
            return page;
          })
        );
        setIsFavourited(true);
      }
    } catch (err) {
      console.log(err);
      showToast({
        title: "Error",
        description:
          "An error occured when adding to favourite. Please try again later",
      });
    }

    return newAllFavouritePost;
  };
  const removeFromFavourite = async (
    userId: string,
    postId: string,
    setIsFavourited: React.Dispatch<SetStateAction<boolean>>,
    showToast: ToastFunctionType
  ): Promise<PostType[][] | undefined> => {
    let excludeDeletedFavourite: PostType[][] | undefined;
    try {
      const res = await axios.delete("/api/post/delete-favourite-post", {
        params: {
          user_id: userId,
          post_id: postId,
        },
      });

      if (res.status === 200) {
        excludeDeletedFavourite =
          data?.map((page) => page.filter((post) => post.post_id !== postId)) ??
          [];
        setIsFavourited(false);
      }
    } catch (err) {
      console.log(err);
      showToast({
        title: "Error",
        description:
          "An error occured when removing from favourite. Please try again later",
      });
    }

    return excludeDeletedFavourite;
  };

  const getKey = (pageIndex: number, previousPageData: PostType[]) => {
    if (
      (previousPageData && !previousPageData.length) ||
      (searchPostType === SearchPostType.USER_FAVOURITE_POST && !userId) ||
      (searchPostType === SearchPostType.USER_POST && !userId)
    )
      return null;
    const fetchUrl = `${apiUrl}&skipPost=${pageIndex}&limitPost=${POST_PAGE_SIZE}`;
    return fetchUrl;
  };

  const { data, error, isLoading, mutate, setSize, size } = useSWRInfinite<
    PostType[]
  >(getKey, fetchPost);

  return {
    isLoading,
    error,
    postMutate: mutate,
    yourPosts: data,
    createPost,
    updatePosts,
    deletePosts,
    setPostSize: setSize,
    addToFavourite,
    removeFromFavourite,
    postSize: size,
  };
}
