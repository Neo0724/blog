import { Button } from "@/components/ui/button";
import React from "react";
import { BiComment } from "react-icons/bi";
import CommentPage from "./CommentPage";

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
      <div className="flex items-center justify-center">
        <Button className="flex gap-2">
          <BiComment />
          <CommentPage
            postId={postId}
          />
        </Button>
      </div>
    </div>
  );
}
