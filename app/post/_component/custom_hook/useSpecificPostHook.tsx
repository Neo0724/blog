import useSWR from "swr";
import { PostType } from "../postComponent/RenderPost";
import customAxios from "@/lib/custom-axios";

const fetchSpecificPost = async (postId: string): Promise<PostType | null> => {
  let specificPost: PostType | null = null;

  try {
    const res = await customAxios.get(
      `/api/post/get-specific-post?post_id=${postId}`
    );

    if (res.status === 200) {
      specificPost = res.data;
    }
  } catch (error) {
    console.log(error);
  }
  return specificPost;
};

export default function useSpecificPostHook(postId: string) {
  const { data, error, isLoading } = useSWR("/api/post/get-specific-post", () =>
    fetchSpecificPost(postId)
  );

  return { data, error, isLoading };
}
