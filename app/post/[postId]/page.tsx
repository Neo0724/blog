"use client";
import EachPostPage from "../_component/postComponent/EachPostPage";
import PostSkeleton from "../_component/postComponent/PostSkeleton";
import useSpecificPostHook from "../_component/custom_hook/useSpecificPostHook";

export default function SpecificPostPage({
  params,
}: {
  params: { postId: string };
}) {
  const {
    data: specificPost,
    isLoading,
    error,
  } = useSpecificPostHook(params.postId);
  return (
    <>
      {isLoading && <PostSkeleton />}
      {specificPost && !isLoading && (
        <EachPostPage
          author={specificPost?.User?.name}
          authorId={specificPost?.User?.user_id}
          content={specificPost?.content}
          createdAt={specificPost.createdAt}
          dateDifferent={specificPost.dateDifferent}
          postId={specificPost.post_id}
          title={specificPost.title}
          key={specificPost.post_id}
        />
      )}
      {!isLoading && !specificPost && (
        <div>Unfortunately, post could not found ...</div>
      )}
    </>
  );
}
