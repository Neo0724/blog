import axios from "axios";
import { UserType } from "./GetPost";
import useSWR from "swr";

export type GetBackCommentType = {
  comment_id: string;
  content: string;
  created_at: Date;
  User: UserType;
};

export default function useComment(post_id: string) {
  const getComment = async (url: string, post_id: string) => {
    try {
      const response = await axios.get(url, {
        params: {
          post_id: post_id,
        },
      });

      if (response.status === 200) {
        return response.data as GetBackCommentType[];
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  };

  const { data, isLoading, error } = useSWR(
    ["/api/get-comment", post_id],
    ([url, post_id]) => getComment(url, post_id),
  );
  return { comments: data, isLoading, commentError: error };
}
