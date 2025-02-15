"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@uidotdev/usehooks";
import useComment from "../custom_hook/useCommentHook";
import EachCommentPage from "../EachCommentPage";
import { useRouter, useSearchParams } from "next/navigation";
import { BiComment } from "react-icons/bi";
import PostOption from "./PostOption";
import { useEffect, useState } from "react";
import FavouritePostButton from "@/app/_components/userInteraction/FavouritePostButton";
import FollowButton from "@/app/_components/userInteraction/FollowButton";
import SubmitPostCommentPage from "./SubmitPostCommentPage";
import LikePostButton from "@/app/_components/userInteraction/LikePostButton";
import { getReadableDate } from "@/app/_util/getReadableDate";

// The dialog when the user clicked on the "Comment" button, each comments in the dialog will be shown in the EachCommentPage component

type PostCommentPageProps = {
  postId: string;
  title: string;
  content: string;
  authorName: string;
  authorId: string;
  createdAt: string;
};

export default function PostComment({
  postId,
  title,
  content,
  authorName,
  authorId,
  createdAt,
}: PostCommentPageProps) {
  const router = useRouter();

  // Use to search for specific comment id if user came from notification
  const searchParams = useSearchParams();
  // Has to open the dialog if user is coming from notification and wants to view specific comment
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [userId, _] = useLocalStorage<string>("test-userId");
  const { comments, isLoading } = useComment(postId, userId ?? null);

  function handleAuthorProfileNavigation(user_id: string): void {
    router.push(`/user/${user_id}`);
  }

  // Set dialog to open if user came from notification to view specific comment
  useEffect(() => {
    if (searchParams.get("commentId")) {
      setDialogOpen(true);
    } else {
      setDialogOpen(false);
    }
  }, [searchParams]);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="flex gap-2 min-w-fit rounded-xl bg-gray-200"
          >
            <BiComment />
            Comments {comments ? comments.length.toString() : ""}{" "}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <PostOption
            postId={postId}
            authorId={authorId}
            title={title}
            content={content}
            styleProperty={"top-[10px] right-[40px]"}
          />
          <DialogHeader>
            <DialogTitle>
              <div className="flex flex-row gap-2">
                {/* Author profile link button */}
                <Button
                  variant="link"
                  className="p-0 h-auto text-base leading-none font-bold"
                  onClick={() => handleAuthorProfileNavigation(authorId)}
                >
                  {authorName}
                </Button>
                {/* Follow button */}
                <FollowButton
                  authorId={authorId}
                  className="p-0 h-auto text-base leading-none text-blue-400"
                  variant="link"
                  key={postId}
                />
              </div>
            </DialogTitle>
            <div className="flex flex-col">
              <div className="flex mb-3 font-bold">
                <span>{title}</span>
              </div>
              <span className="overflow-y-scroll max-h-[125px]">{content}</span>
              <span className="text-sm text-black opacity-70 font-normal">
                {getReadableDate(createdAt)}
              </span>
            </div>
            <div className="flex gap-5 mb-5">
              {/* Like button  */}
              <LikePostButton
                authorId={authorId}
                className="flex gap-2 min-w-fit rounded-xl bg-gray-200"
                postId={postId}
                variant="ghost"
                key={postId}
              />
              {/* Favourite button  */}
              <FavouritePostButton
                className="flex gap-2 min-w-fit rounded-xl bg-gray-200"
                postId={postId}
                variant="ghost"
                key={postId}
              />
            </div>
            <div className="overflow-y-scroll border-solid border-2 border-black-500 p-3 rounded-lg h-[50svh]">
              {isLoading && <div>Comments are loading...</div>}
              {!isLoading &&
                comments &&
                comments.length > 0 &&
                comments.map((c) => {
                  return (
                    <EachCommentPage
                      key={c.comment_id}
                      commentId={c.comment_id}
                      user={c.User}
                      content={c.content}
                      post_id={postId}
                      authorId={authorId}
                      dateDifferent={c.dateDifferent}
                    />
                  );
                })}
              {!isLoading && comments?.length === 0 && (
                <div>No comments yet...</div>
              )}
            </div>
            <SubmitPostCommentPage authorId={authorId} postId={postId} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
