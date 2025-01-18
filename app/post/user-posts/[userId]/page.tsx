"use client";
import GetPost from "../../_component/GetPost";
import { SearchPostType } from "../../_component/Enum";

export default function YourPostsPage({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <>
      <GetPost
        searchPostType={SearchPostType.USER_POST}
        userId={params.userId}
      />
    </>
  );
}
