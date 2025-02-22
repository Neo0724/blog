import axios from "axios";
import useSWR, { KeyedMutator } from "swr";
import { ToastFunctionType } from "./usePostHook";
import { PostType } from "../postComponent/RenderPost";

export default function useLikedPost(user_id: string | null) {
  const fetchData = async (
    url: string | null,
    user_id: string | null
  ): Promise<string[] | []> => {
    if (!url || !user_id) {
      return [];
    }

    let returnedLikedPost: string[] | [] = [];

    try {
      const response = await axios.get(url, {
        params: {
          user_id: user_id,
        },
      });

      if (response.status === 200) {
        returnedLikedPost = response.data;
      }
    } catch (err) {
      console.log(err);
    }
    return returnedLikedPost;
  };

  const { data, error, isLoading, mutate } = useSWR(
    [user_id ? "/api/post/get-like-post" : null, user_id],
    ([url, user_id]) => fetchData(url, user_id)
  );

  const addLikePost = async (
    userId: string,
    post: PostType,
    setIsLiked: React.Dispatch<boolean>,
    showToast: ToastFunctionType,
    postLikeCountMutate: KeyedMutator<number>,
    postLikeCount: number
  ): Promise<string[] | []> => {
    let newLikePostId: string = "";
    try {
      const res = await axios.post("/api/post/add-like-post", {
        user_id: userId,
        post_id: post.post_id,
      });

      if (res.status === 200) {
        newLikePostId = res.data.postId;
        postLikeCountMutate((prev) => (prev ?? 0) + 1, {
          optimisticData: postLikeCount + 1,
          revalidate: false,
          populateCache: true,
        });
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
    postLikeCountMutate: KeyedMutator<number>,
    postLikeCount: number
  ): Promise<string[] | []> => {
    let removedLikePostId: string = "";

    try {
      const res = await axios.delete("/api/post/delete-like-post", {
        params: {
          user_id: userId,
          post_id: post.post_id,
        },
      });

      if (res.status === 200) {
        removedLikePostId = res.data.postId;
        postLikeCountMutate((prev) => (prev ?? 1) - 1, {
          optimisticData: postLikeCount - 1,
          revalidate: false,
          populateCache: true,
        });
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

  return {
    likedPost: data,
    likedPostError: error,
    likedPostLoading: isLoading,
    likedPostMutate: mutate,
    addLikePost,
    removeLikePost,
  };
}
