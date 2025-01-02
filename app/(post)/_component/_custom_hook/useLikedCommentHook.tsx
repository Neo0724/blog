import axios from "axios";
import useSWR from "swr";
import { useStore } from "zustand";
import { likedCommentStore } from "../_store/likedCommentStore";

export type GetBackLikedCommentType = {
  Comment_comment_id: string;
};

export default function useLikedComment(user_id: string, post_id: string) {
  const fetchData = async (
    url: string | null,
    user_id: string,
    post_id: string
  ): Promise<GetBackLikedCommentType[] | []> => {
    if (!url) {
      return [];
    }
    let returnedLikedComment: GetBackLikedCommentType[] | [] = [];
    try {
      const response = await axios.get(url, {
        params: {
          post_id: post_id,
          user_id: user_id,
        },
      });

      if (response.status === 200) {
        returnedLikedComment = response.data;
      }
    } catch (err) {
      console.log(err);
    } finally {
      return returnedLikedComment;
    }
  };

  const { data, error, isLoading } = useSWR(
    [user_id ? "/api/get-liked-comment" : null, user_id, post_id],
    ([url, user_id, post_id]) => fetchData(url, user_id, post_id)
  );

  const actions = useStore(likedCommentStore, (state) => state.actions);

  return { likedComment: data, error, ...actions };
}
