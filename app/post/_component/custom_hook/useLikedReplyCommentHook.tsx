import axios from "axios";
import useSwr from "swr";
import { useStore } from "zustand";
import { likedCommentReplyStore } from "../store/likedCommentReplyStore";

export type GetBackLikedReplyCommentType = {
  CommentReply_comment_reply_id: string;
};

// Get all replied comment for a single comment
export default function useLikedReplyComment(
  user_id: string,
  comment_id: string
) {
  const fetchLikedReplyComment = async (
    url: string | null,
    user_id: string,
    comment_id: string
  ): Promise<GetBackLikedReplyCommentType[] | []> => {
    if (!url || !user_id) {
      return [];
    }

    let returnedLikedReplyComment: GetBackLikedReplyCommentType[] | [] = [];

    try {
      const response = await axios.get(
        "/api/comment-reply/get-liked-comment-reply",
        {
          params: {
            comment_id: comment_id,
            user_id: user_id,
          },
        }
      );

      if (response.status === 200) {
        returnedLikedReplyComment = response.data;
      }
    } catch (err) {
      console.log(err);
    } finally {
      return returnedLikedReplyComment;
    }
  };

  const { data, error, isLoading } = useSwr(
    [
      user_id ? "/api/comment-reply/get-liked-comment-reply" : null,
      user_id,
      comment_id,
    ],
    ([url, user_id, comment_id]) =>
      fetchLikedReplyComment(url, user_id, comment_id)
  );

  const actions = useStore(likedCommentReplyStore, (state) => state.actions);

  return { likedReply: data, error, ...actions };
}
