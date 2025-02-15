"use client";

import RenderPost from "../_component/postComponent/RenderPost";
import { SearchPostType } from "../_component/Enum";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function AllPostsPage() {
  const [userId] = useLocalStorage<string | null>("test-userId");

  return (
    <>
      <RenderPost
        searchPostType={SearchPostType.ALL_POST}
        userId={userId ?? ""}
      />
    </>
  );
}
