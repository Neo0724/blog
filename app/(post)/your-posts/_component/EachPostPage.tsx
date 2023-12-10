import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { BiComment } from "react-icons/bi";
import CommentPage from "./CommentPage";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentSchema } from "@/app/api/create-comment/route";
import { useLocalStorage } from "@uidotdev/usehooks";
import axios from "axios";
import useComment, { GetBackCommentType } from "./useCommentHook";

type CommentType = z.infer<typeof CommentSchema>;

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
  const [userId, _] = useLocalStorage<string>("test-userId");

  const [getComments, setGetComments] = useComment(postId);

  const form = useForm<CommentType>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      user_id: userId,
      post_id: postId,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await axios.post("/api/create-comment", data);

      const newComment = response.data;

      setGetComments((prev: GetBackCommentType[]) => {
        return [...prev, newComment];
      });
    } catch (error) {
      console.log(error);
    }
  });

  const handleSetComment = () => {};

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
            form={form}
            handleSubmit={handleSubmit}
            postId={postId}
            comment={getComments}
            handleSetcomment={handleSetComment}
          />
        </Button>
      </div>
    </div>
  );
}
