import useSWR from "swr";
import axios from "axios";
import { PostType } from "../GetPost";
import { useStore } from "zustand";
import { favouriteStore } from "../_store/favouriteStore";

export type GetBackFavouritePost = {
  Post: PostType;
};

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
        returnedFavouritePost = res.data.map((item: GetBackFavouritePost) => {
          return item.Post;
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      return returnedFavouritePost;
    }
  };
  const { data, isLoading, error } = useSWR(
    [userId ? "/api/get-favourite-post" : null, userId],
    ([url, userId]) => fetchData(url, userId)
  );

  const actions = useStore(favouriteStore, (state) => state.actions);

  return {
    favouritedPost: data,
    favouriteError: error,
    favouritePostLoading: isLoading,
    ...actions,
  };
}
