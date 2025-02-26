import axios from "axios";
import useSWR from "swr";
import { ToastFunctionType } from "./usePostHook";
import { PostType } from "../postComponent/RenderPost";
import {
  DeleteNotificationType,
  NewNotificationType,
} from "./useNotificationHook";

export default function useLikedPost(user_id: string | null) {
  const fetchData = async (user_id: string | null): Promise<string[] | []> => {
    let returnedLikedPost: string[] | [] = [];

    try {
      const response = await axios.get(
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
    addNotification?: (newNotification: NewNotificationType) => void,
    newNotification?: NewNotificationType
  ): Promise<string[] | []> => {
    let newLikePostId: string = "";
    try {
      const res = await axios.post("/api/post/add-like-post", {
        user_id: userId,
        post_id: post.post_id,
      });

      if (res.status === 200) {
        newLikePostId = res.data.postId;
        // Add the notification is both value are not null or undefined
        if (addNotification && newNotification) {
          addNotification(newNotification);
        }
        setIsLiked(true);
      }
    } catch (err) {
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
    deleteNotification?: (notificationToDelete: DeleteNotificationType) => void,
    notificationToDelete?: DeleteNotificationType
  ): Promise<string[] | []> => {
    let removedLikePostId: string = "";
    try {
      const res = await axios.delete(
        `/api/post/delete-like-post?user_id=${userId}&post_id=${post.post_id}`
      );

      if (res.status === 200) {
        removedLikePostId = res.data.postId;
        if (deleteNotification && notificationToDelete) {
          deleteNotification(notificationToDelete);
        }
        setIsLiked(false);
      }
    } catch (err) {
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
