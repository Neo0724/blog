import axios from "axios";
import { UserType } from "./GetPost";
import useSWR from "swr";

export type GetBackReplyCommentType = {
  comment_reply_id: string;
  content: string;
  User: UserType;
  createdAt: Date;
  dateDifferent: string;
  Target_user: UserType;
};

export default function useReplyComment(comment_id: string) {
  const getReplyComment = async (url: string, comment_id: string) => {
    try {
      const response = await axios.get(url, {
        params: {
          comment_id: comment_id,
        },
      });

      if (response.status === 200) {
        return response.data as GetBackReplyCommentType[];
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  };

  const { data, isLoading, error } = useSWR(
    ["/api/get-reply-comment", comment_id],
    ([url, comment_id]) => getReplyComment(url, comment_id),
  );

  return { replyComments: data, isLoading, replyCommentsError: error };
}
