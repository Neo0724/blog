import axios from "axios";
import useSWR from "swr";

const fetchReplyCommentLikeCount = async (
  url: string,
  commentReplyId: string
): Promise<number> => {
  let fetchedReplyCommentLikeCount = 0;
  try {
    const response = await axios.get(url, {
      params: {
        comment_reply_id: commentReplyId,
      },
    });

    if (response.status === 200) {
      fetchedReplyCommentLikeCount = response.data;
    }
  } catch (err) {
    console.log(err);
  } finally {
    return fetchedReplyCommentLikeCount;
  }
};

export const useLikedReplyCommentCount = (commentReplyId: string) => {
  const { data } = useSWR(
    ["/api/comment-reply/count-like-comment-reply", commentReplyId],
    () =>
      fetchReplyCommentLikeCount(
        "/api/comment-reply/count-like-comment-reply",
        commentReplyId
      )
  );

  return data;
};
