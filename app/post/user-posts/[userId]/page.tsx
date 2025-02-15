"use client";
import RenderPost from "../../_component/postComponent/RenderPost";
import { SearchPostType } from "../../_component/Enum";

export default function YourPostsPage({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <>
      <RenderPost
        searchPostType={SearchPostType.USER_POST}
        userId={params.userId}
      />
    </>
  );
}
