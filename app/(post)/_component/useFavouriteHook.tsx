import useSWR from "swr";
import axios from "axios";
import { PostType } from "./GetPost";

export type GetBackFavouritePost = {
  Post: PostType;
};

export default function useFavourite(userId: string | null) {
  const fetchData = async (url: string | null, userId: string | null) => {
    if (!url || !userId) {
      return [];
    }

    try {
      const res = await axios.get(url, { params: { user_id: userId } });

      if (res.status === 200) {
        return res.data.map((item: GetBackFavouritePost) => {
          return item.Post;
        });
      } else {
        return [];
      }
    } catch (err) {
      console.log(err);
      return [];
    }
  };
  const { data, isLoading, error } = useSWR(
    [userId ? "/api/get-favourite-post" : null, userId],
    ([url, userId]) => fetchData(url, userId),
  );

  return {
    favouritedPost: data as PostType[] | [],
    favouriteError: error,
    favouritePostLoading: isLoading,
  };
}
