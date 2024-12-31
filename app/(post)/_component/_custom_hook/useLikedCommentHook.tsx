import axios from "axios";
import useSWR from "swr";

export type GetBackLikedCommentType = {
  Comment_comment_id: string;
};

export default function useLikedComment(user_id: string, post_id: string) {
  const fetchData = async (
    url: string | null,
    user_id: string,
    post_id: string
  ) => {
    if (!url) {
      return [];
    }

    try {
      const response = await axios.get(url, {
        params: {
          post_id: post_id,
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
    [user_id ? "/api/get-liked-comment" : null, user_id, post_id],
    ([url, user_id, post_id]) => fetchData(url, user_id, post_id)
  );

  return { likedComment: data as GetBackLikedCommentType[] | [], error };
}
