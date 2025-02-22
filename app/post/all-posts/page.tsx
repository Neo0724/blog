"use client";

import RenderPost from "../_component/postComponent/RenderPost";
import { SearchPostType } from "../_component/Enum";

export default function AllPostsPage() {
  return (
    <>
      <RenderPost searchPostType={SearchPostType.ALL_POST} />
    </>
  );
}
