import axios from "axios";
import useSWR from "swr";

const fetchReplyCommentLikeCount = async (
  url: string,
  commentReplyId: string
): Promise<number> => {
  let fetchedReplyCommentLikeCount = 0;
  try {
    const response = await axios.get("/api/count-like-replycomment", {
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
    ["/api/count-like-replycomment", commentReplyId],
    () =>
      fetchReplyCommentLikeCount("/api/count-like-replycomment", commentReplyId)
  );

  return data;
};
