import useSWR from "swr";
import { PostType } from "../postComponent/RenderPost";
import axios from "axios";

const fetchSpecificPost = async (
  fetchUrl: string,
  postId: string
): Promise<PostType | null> => {
  let specificPost: PostType | null = null;

  try {
    const res = await axios.get(fetchUrl, {
      params: {
        post_id: postId,
      },
    });

    if (res.status === 200) {
      specificPost = res.data;
    }
  } catch (error) {
    console.log(error);
  }
  return specificPost;
};

export default function useSpecificPostHook(postId: string) {
  const { data, error, isLoading } = useSWR(
    "/api/post/get-specific-post",
    (fetchUrl) => fetchSpecificPost(fetchUrl, postId)
  );

  return { data, error, isLoading };
}
