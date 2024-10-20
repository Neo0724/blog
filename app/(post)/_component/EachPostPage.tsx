import { Button } from "@/components/ui/button";
import React from "react";
import { BiComment } from "react-icons/bi";
import CommentPage from "./CommentPage";
import { BiSolidLike } from "react-icons/bi";
import { BiLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { useLocalStorage } from "@uidotdev/usehooks";

type EachPostType = {
  title: string;
  content: string;
  createdAt: Date;
  author: string;
  postId: string;
};

export default function EachPostPage({
  title,
  content,
  createdAt,
  author,
  postId,
}: EachPostType) {
  const [userId, _] = useLocalStorage("test-userId", null);

  return (
    <div className="flex max-h[70%] flex-col gap-4 border-2 p-5 rounded-md mb-5">
      <div className="flex flex-row gap-4 border-b-2">
        Title:
        <h1 className="pb-5">{title}</h1>
      </div>
      <div className="flex flex-row gap-4 border-b-2">
        <h2 className="pb-5">{content}</h2>
      </div>
      <div className="flex flex-row gap-4 border-b-2">
        By:
        <h2 className="pb-5">{author}</h2>
      </div>
      <div className="flex items-center justify-center flex-wrap gap-2 max-w-[30rem] w-full m-auto">
      <Button className="flex gap-2 flex-1 min-w-fit">
       <BiLike /> 
       Like
      </Button>
        <Button className="flex gap-2 flex-1 min-w-fit">
          <BiComment />
          <CommentPage
            postId={postId}
          />
        </Button>
      </div>
    </div>
  );
}
