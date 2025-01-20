"use client";

import GetPost from "../_component/GetPost";
import { SearchPostType } from "../_component/Enum";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function AllPostsPage() {
  const [userId] = useLocalStorage<string | null>("test-userId");

  return (
    <>
      <GetPost searchPostType={SearchPostType.ALL_POST} userId={userId ?? ""} />
    </>
  );
}
