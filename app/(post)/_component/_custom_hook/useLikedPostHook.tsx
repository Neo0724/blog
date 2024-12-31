import axios from "axios";
import useSWR from "swr";

export type GetBackLikedPostType = {
  Post_post_id: string;
};

export default function useLikedPost(user_id: string | null) {
  const fetchData = async (url: string | null, user_id: string | null) => {
    if (!url || !user_id) {
      return [];
    }

    try {
      const response = await axios.get(url, {
        params: {
          user_id: user_id,
        },
      });

      if (response.status === 200) {
        return response.data;
      } else {
        return [];
      }
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const { data, error, isLoading } = useSWR(
    [user_id ? "/api/get-like-post" : null, user_id],
    ([url, user_id]) => fetchData(url, user_id)
  );

  return {
    likedPost: data as GetBackLikedPostType[] | [],
    likedPostError: error,
    likedPostLoading: isLoading,
  };
}
