import axios from "axios";
import { UserType } from "./GetPost";
import useSWR from "swr";

export type GetBackCommentType = {
  comment_id: string;
  content: string;
  created_at: Date;
  dateDifferent: string;
  User: UserType;
};

export default function useComment(post_id: string, userId: string | null) {
  const getComment = async (
    url: string,
    post_id: string,
    userId: string | null,
  ) => {
    try {
      const response = await axios.get(url, {
        params: {
          post_id: post_id,
          user_id: userId ?? "",
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
    ["/api/get-comment", post_id, userId],
    ([url, post_id, userId]) => getComment(url, post_id, userId),
  );
  return { comments: data, isLoading, commentError: error };
}
