import axios from "axios";
import useSWR from "swr";

export type GetBackLikedPostType = {
  Post_post_id: string;
};

export default function useLikedPost(user_id: string | null) {
  const fetchData = async (
    url: string | null,
    user_id: string | null
  ): Promise<GetBackLikedPostType[] | []> => {
    if (!url || !user_id) {
      return [];
    }

    let returnedLikedPost: GetBackLikedPostType[] | [] = [];

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
    } finally {
      return returnedLikedPost;
    }
  };

  const { data, error, isLoading } = useSWR(
    [user_id ? "/api/post/get-like-post" : null, user_id],
    ([url, user_id]) => fetchData(url, user_id)
  );

  return {
    likedPost: data,
    likedPostError: error,
    likedPostLoading: isLoading,
  };
}
