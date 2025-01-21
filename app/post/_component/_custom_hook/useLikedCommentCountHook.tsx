import axios from "axios";
import useSWR from "swr";

const fetchCommentLikeCount = async (
  url: string,
  commentId: string
): Promise<number> => {
  let likeCount = 0;
  try {
    const response = await axios.get(url, {
      params: {
        comment_id: commentId,
      },
    });

    if (response.status === 200) {
      likeCount = response.data;
    }
  } catch (err) {
    console.log(err);
  } finally {
    return likeCount;
  }
};

export const useLikeCommentCount = (commentId: string) => {
  const { data } = useSWR(["/api/comment/count-like-comment", commentId], () =>
    fetchCommentLikeCount("/api/comment/count-like-comment", commentId)
  );

  return data;
};
