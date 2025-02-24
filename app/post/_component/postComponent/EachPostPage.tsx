import { Button } from "@/components/ui/button";
import React, { useEffect, useRef } from "react";
import PostCommentButton from "./PostCommentButton";
import PostOption from "./PostOption";
import { useRouter } from "next/navigation";
import LikePostButton from "@/app/_components/userInteraction/LikePostButton";
import FavouritePostButton from "@/app/_components/userInteraction/FavouritePostButton";
import FollowButton from "@/app/_components/userInteraction/FollowButton";
import PostContent from "./PostContent";
import useElementInView from "../custom_hook/useElementInViewHook";
import { PostType } from "./RenderPost";

type EachPostProps = {
  title: string;
  content: string;
  createdAt: string;
  author: string;
  authorId: string;
  postId: string;
  dateDifferent: string;
  index?: number;
  totalPostsNumber?: number;
  setPostSize?: (
    size: number | ((_size: number) => number)
  ) => Promise<PostType[][] | undefined>;
};

export default function EachPostPage({
  title,
  content,
  createdAt,
  dateDifferent,
  author,
  postId,
  authorId,
  index,
  totalPostsNumber,
  setPostSize,
}: EachPostProps) {
  const router = useRouter();

  const postRef = useRef<HTMLDivElement>(null);

  const handleAuthorProfileNavigation = (authorId: string) => {
    router.push("/user/" + authorId);
  };

  const doneUpdatingIndex = useRef<Set<number>>(new Set());

  const handleScrollToPost = () => {
    if (postRef.current) {
      postRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "end",
      });
    }
  };

  const { isVisible } = useElementInView(postRef);

  useEffect(() => {
    const indexToUpdate = Math.floor((totalPostsNumber ?? 1) / 2);
    if (
      indexToUpdate === index &&
      isVisible &&
      !doneUpdatingIndex.current.has(indexToUpdate)
    ) {
      setPostSize && setPostSize((prev) => prev + 1);
      doneUpdatingIndex.current.add(indexToUpdate);
    }
  }, [index, isVisible, setPostSize, totalPostsNumber]);

  return (
    <div
      className="flex max-h[70%] z-10 relative flex-col gap-4 border-2 p-5 rounded-md mb-5 max-w-[800px] mx-auto border-[rgb(58,59,60)]"
      ref={postRef}
    >
      <PostOption
        authorId={authorId}
        postId={postId}
        title={title}
        content={content}
      />
      <div className="flex flex-row gap-2 pb-3 flex-wrap items-center">
        <span>
          <Button
            variant="link"
            onClick={() => handleAuthorProfileNavigation(authorId)}
            className="font-bold p-0 h-0 text-lg text-white"
          >
            {author}
          </Button>
        </span>
        <span className="opacity-80 text-white">&#x2022;</span>
        <span className="opacity-80">{dateDifferent}</span>
        {/* Follow button */}
        <FollowButton
          authorId={authorId}
          className="p-0 h-auto text-base leading-none text-blue-400"
          variant="link"
        />
      </div>
      <div className="flex flex-row gap-4 pb-1">
        <h1 className="font-bold">{title}</h1>
      </div>
      <div className="flex flex-row gap-4 pb-2">
        <PostContent
          content={content}
          handleScrollToPost={handleScrollToPost}
        />
      </div>
      <div className="flex items-center flex-wrap gap-2 max-w-[40rem] w-full">
        {/* Like button  */}
        <LikePostButton
          authorId={authorId}
          className="flex gap-2 min-w-fit rounded-xl bg-[rgb(58,59,60)]"
          postId={postId}
          variant="ghost"
        />
        {/* Comment button */}
        <PostCommentButton
          postId={postId}
          authorId={authorId}
          title={title}
          content={content}
          authorName={author}
          createdAt={createdAt}
          className="flex gap-2 min-w-fit rounded-xl bg-[rgb(58,59,60)]"
        />
        {/* Favourite button  */}
        <FavouritePostButton
          className="flex gap-2 min-w-fit rounded-xl bg-[rgb(58,59,60)]"
          postId={postId}
          variant="ghost"
        />
      </div>
    </div>
  );
}
