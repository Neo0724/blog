import customAxios from "@/lib/custom-axios";
import axios from "axios";
import useSWR from "swr";

const fetchPostLikeCount = async (postId: string): Promise<number> => {
  let fetchedLikeCount = 0;
  try {
    const res = await customAxios.get(
      `/api/post/count-like-post?post_id=${postId}`
    );

    if (res.status === 200) {
      fetchedLikeCount = res.data;
    }
  } catch (err) {
    console.log(err);
  }
  return fetchedLikeCount;
};

export const useLikedPostCount = (postId: string) => {
  const { data, mutate } = useSWR(
    ["/api/post/count-like-post", postId],
    () => fetchPostLikeCount(postId),
    {
      refreshInterval: 180000,
    }
  );

  return {
    postLikeCount: data,
    fetchPostLikeCount,
    postLikeCountMutate: mutate,
  };
};
