import axios from "axios";
import { UserType } from "../GetPost";
import useSWR from "swr";
import { commentStore } from "../_store/commentStore";
import { useStore } from "zustand";

export type GetBackCommentType = {
  comment_id: string;
  content: string;
  created_at: Date;
  dateDifferent: string;
  User: UserType; // User is the one who created the comment
};

export default function useComment(post_id: string, userId: string | null) {
  const getComment = async (
    url: string,
    post_id: string,
    userId: string | null
  ): Promise<GetBackCommentType[] | []> => {
    let returnedComments: GetBackCommentType[] | [] = [];
    try {
      const response = await axios.get(url, {
        params: {
          post_id: post_id,
          user_id: userId ?? "",
        },
      });

      if (response.status === 200) {
        returnedComments = response.data as GetBackCommentType[];
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      return returnedComments;
    }
  };

  const { data, isLoading, error } = useSWR(
    ["/api/get-comment", post_id, userId],
    ([url, post_id, userId]) => getComment(url, post_id, userId)
  );

  const actions = useStore(commentStore, (state) => state.actions);

  return { comments: data, isLoading, commentError: error, ...actions };
}
