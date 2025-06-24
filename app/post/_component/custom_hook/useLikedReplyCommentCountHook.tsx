import customAxios from "@/lib/custom-axios";
import axios from "axios";
import useSWR from "swr";

const fetchReplyCommentLikeCount = async (
  commentReplyId: string
): Promise<number> => {
  let fetchedReplyCommentLikeCount = 0;
  try {
    const response = await customAxios.get(
      `/api/comment-reply/count-like-comment-reply?comment_reply_id=${commentReplyId}`
    );

    if (response.status === 200) {
      fetchedReplyCommentLikeCount = response.data;
    }
  } catch (err) {
    console.log(err);
  }
  return fetchedReplyCommentLikeCount;
};

export const useLikedReplyCommentCount = (commentReplyId: string) => {
  const { data, mutate } = useSWR(
    ["/api/comment-reply/count-like-comment-reply", commentReplyId],
    () => fetchReplyCommentLikeCount(commentReplyId),
    {
      refreshInterval: 180000,
    }
  );

  return { replyCommentLikeCount: data, replyCommentLikeCountMutate: mutate };
};
