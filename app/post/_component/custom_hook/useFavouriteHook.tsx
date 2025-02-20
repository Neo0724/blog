import useSWR from "swr";
import axios from "axios";
import { PostType } from "../postComponent/RenderPost";
import { ToastFunctionType } from "./usePostHook";

export default function useFavourite(userId: string | null) {
  const fetchData = async (
    url: string | null,
    userId: string | null
  ): Promise<PostType[] | []> => {
    if (!url || !userId) {
      return [];
    }

    let returnedFavouritePost: PostType[] | [] = [];

    try {
      const res = await axios.get(url, { params: { user_id: userId } });

      if (res.status === 200) {
        return res.data;
      }
    } catch (err) {
      console.log(err);
    }
    return returnedFavouritePost;
  };

  const addToFavourite = async (
    userId: string,
    postId: string,
    setIsFavourited: React.Dispatch<boolean>,
    showToast: ToastFunctionType
  ): Promise<PostType[]> => {
    let newAllFavouritePost: PostType[] | [] = [];
    try {
      const res = await axios.post("/api/post/add-favourite-post", {
        user_id: userId,
        post_id: postId,
      });

      if (res.status === 200) {
        newAllFavouritePost = [res.data.newFavouritePost, ...(data ?? [])];
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
    setIsFavourited: React.Dispatch<boolean>,
    showToast: ToastFunctionType
  ): Promise<PostType[] | []> => {
    let excludeDeletedFavourite: PostType[] | [] = [];
    try {
      const res = await axios.delete("/api/post/delete-favourite-post", {
        params: {
          user_id: userId,
          post_id: postId,
        },
      });

      if (res.status === 200) {
        excludeDeletedFavourite =
          data?.filter((favouritePost) => favouritePost.post_id !== postId) ??
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
  const { data, isLoading, error, mutate } = useSWR(
    [userId ? "/api/post/get-favourite-post" : null, userId],
    ([url, userId]) => fetchData(url, userId)
  );

  return {
    favouritedPost: data,
    favouriteError: error,
    favouritePostLoading: isLoading,
    addToFavourite,
    removeFromFavourite,
    favouritePostMutate: mutate,
  };
}
