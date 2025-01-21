import axios from "axios";
import { UserType } from "../GetPost";
import useSWR from "swr";
import { replyCommentStore } from "../_store/replyCommentStore";
import { useStore } from "zustand";

export type GetBackReplyCommentType = {
  comment_reply_id: string;
  content: string;
  User: UserType;
  createdAt: Date;
  dateDifferent: string;
  Target_user: UserType;
};

export default function useReplyComment(comment_id: string) {
  const getReplyComment = async (
    url: string,
    comment_id: string
  ): Promise<GetBackReplyCommentType[] | []> => {
    let returnedReplyComments: GetBackReplyCommentType[] | [] = [];
    try {
      const response = await axios.get(url, {
        params: {
          comment_id: comment_id,
        },
      });

      if (response.status === 200) {
        returnedReplyComments = response.data;
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      return returnedReplyComments;
    }
  };

  const { data, isLoading, error } = useSWR(
    ["/api/comment-reply/get-comment-reply", comment_id],
    ([url, comment_id]) => getReplyComment(url, comment_id)
  );

  const actions = useStore(replyCommentStore, (state) => state.actions);

  return {
    replyComments: data,
    isLoading,
    replyCommentsError: error,
    ...actions,
  };
}
