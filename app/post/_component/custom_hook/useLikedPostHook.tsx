import axios from "axios";
import useSWR, { KeyedMutator } from "swr";
import { ToastFunctionType } from "./usePostHook";
import { PostType } from "../postComponent/RenderPost";
import {
  DeleteNotificationType,
  NewNotificationType,
} from "./useNotificationHook";
import customAxios from "@/lib/custom-axios";

export default function useLikedPost(user_id: string | null) {
  const fetchData = async (user_id: string | null): Promise<string[] | []> => {
    let returnedLikedPost: string[] | [] = [];

    try {
      const response = await customAxios.get(
        `/api/post/get-like-post?user_id=${user_id}`
      );

      if (response.status === 200) {
        returnedLikedPost = response.data;
      }
    } catch (err) {
      console.log(err);
    }
    return returnedLikedPost;
  };

  const addLikePost = async (
    userId: string,
    post: PostType,
    setIsLiked: React.Dispatch<boolean>,
    showToast: ToastFunctionType,
    postLikeCountMutate: KeyedMutator<number>,
    addNotification?: (newNotification: NewNotificationType) => void,
    newNotification?: NewNotificationType
  ): Promise<string[] | []> => {
    let newLikePostId: string = "";
    try {
      const res = await customAxios.post("/api/post/add-like-post", {
        user_id: userId,
        post_id: post.post_id,
      });

      if (res.status === 200) {
        newLikePostId = res.data.postId;
        // Add the notification is both value are not null or undefined
        if (addNotification && newNotification) {
          addNotification(newNotification);
        }
      } else {
        console.log("Not 200");
      }
    } catch (err) {
      // Revert the changes
      setIsLiked(false);
      postLikeCountMutate((prev) => (prev ? prev - 1 : 0), {
        populateCache: true,
        revalidate: false,
        rollbackOnError: true,
      });
      console.log(err);
      showToast({
        title: "Error",
        description:
          "An error occured when liking the post. Please try again later",
      });
    }

    return [...(data ?? []), newLikePostId];
  };

  const removeLikePost = async (
    userId: string,
    post: PostType,
    setIsLiked: React.Dispatch<boolean>,
    showToast: ToastFunctionType,
    postLikeCountMutate: KeyedMutator<number>,
    deleteNotification?: (notificationToDelete: DeleteNotificationType) => void,
    notificationToDelete?: DeleteNotificationType
  ): Promise<string[] | []> => {
    let removedLikePostId: string = "";
    try {
      const res = await customAxios.delete(
        `/api/post/delete-like-post?user_id=${userId}&post_id=${post.post_id}`
      );

      if (res.status === 200) {
        removedLikePostId = res.data.postId;
        if (deleteNotification && notificationToDelete) {
          deleteNotification(notificationToDelete);
        }
      } else {
        console.log("Not 200");
      }
    } catch (err) {
      // Revert changes
      setIsLiked(true);
      postLikeCountMutate((prev) => (prev ? prev + 1 : 1), {
        populateCache: true,
        revalidate: false,
        rollbackOnError: true,
      });
      console.log(err);
      showToast({
        title: "Error",
        description:
          "An error occured when removing like from the post. Please try again later",
      });
    }

    return data?.filter((postId) => postId !== removedLikePostId) ?? [];
  };

  const { data, error, isLoading, mutate } = useSWR(
    [user_id ? "/api/post/get-like-post" : null, user_id],
    ([url, user_id]) => fetchData(user_id)
  );

  return {
    likedPost: data,
    likedPostError: error,
    likedPostLoading: isLoading,
    likedPostMutate: mutate,
    addLikePost,
    removeLikePost,
  };
}
