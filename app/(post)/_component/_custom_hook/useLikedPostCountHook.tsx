import axios from "axios";
import useSWR from "swr";

const fetchPostLikeCount = async (
  url: string,
  postId: string
): Promise<number> => {
  let fetchedLikeCount = 0;
  try {
    const res = await axios.get(url, {
      params: { post_id: postId },
    });

    if (res.status === 200) {
      fetchedLikeCount = res.data;
    }
  } catch (err) {
    console.log(err);
  } finally {
    return fetchedLikeCount;
  }
};

export const useLikedPostCount = (postId: string) => {
  const { data } = useSWR(["/api/count-like-post", postId], () =>
    fetchPostLikeCount("/api/count-like-post", postId)
  );

  return data;
};
