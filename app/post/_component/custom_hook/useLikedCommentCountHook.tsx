import axios from "axios";
import useSWR from "swr";

const fetchCommentLikeCount = async (commentId: string): Promise<number> => {
  let likeCount = 0;
  try {
    const response = await axios.get("/api/comment/count-like-comment", {
      params: {
        comment_id: commentId,
      },
    });

    if (response.status === 200) {
      likeCount = response.data;
    }
  } catch (err) {
    console.log(err);
  }
  return likeCount;
};

export const useLikeCommentCount = (commentId: string) => {
  const { data, mutate } = useSWR(
    ["/api/comment/count-like-comment", commentId],
    () => fetchCommentLikeCount(commentId),
    {
      refreshInterval: 180000,
    }
  );

  return {
    commentLikeCount: data,
    fetchCommentLikeCount,
    commentLikeCountMutate: mutate,
  };
};
