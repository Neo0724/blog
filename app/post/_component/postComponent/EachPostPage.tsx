import { Button } from "@/components/ui/button";
import React from "react";
import PostComment from "./PostComment";
import PostOption from "./PostOption";
import { useRouter } from "next/navigation";
import LikePostButton from "@/app/_components/userInteraction/LikePostButton";
import FavouritePostButton from "@/app/_components/userInteraction/FavouritePostButton";
import FollowButton from "@/app/_components/userInteraction/FollowButton";
import PostContent from "./PostContent";

type EachPostProps = {
  title: string;
  content: string;
  createdAt: string;
  author: string;
  authorId: string;
  postId: string;
  dateDifferent: string;
};

export default function EachPostPage({
  title,
  content,
  createdAt,
  dateDifferent,
  author,
  postId,
  authorId,
}: EachPostProps) {
  const router = useRouter();

  const handleAuthorProfileNavigation = (authorId: string) => {
    router.push("/user/" + authorId);
  };

  return (
    <div className="flex max-h[70%] z-10 relative flex-col gap-4 border-2 p-5 rounded-md mb-5 max-w-[800px] mx-auto">
      <PostOption
        authorId={authorId}
        postId={postId}
        title={title}
        content={content}
      />
      <div className="flex flex-row gap-2 border-b-2 pb-5 flex-wrap items-center">
        <span>
          <Button
            variant="link"
            onClick={() => handleAuthorProfileNavigation(authorId)}
            className="font-bold p-0 h-0 text-lg"
          >
            {author}
          </Button>
        </span>
        <span className="opacity-80">&#x2022;</span>
        <span className="opacity-80">{dateDifferent}</span>
        {/* Follow button */}
        <FollowButton
          authorId={authorId}
          className="p-0 h-auto text-base leading-none text-blue-400"
          variant="link"
          key={postId}
        />
      </div>
      <div className="flex flex-row gap-4 pb-1">
        <h1 className="font-bold">{title}</h1>
      </div>
      <div className="flex flex-row gap-4 pb-2">
        <PostContent content={content} key={postId} />
      </div>
      <div className="flex items-center flex-wrap gap-2 max-w-[40rem] w-full">
        {/* Like button  */}
        <LikePostButton
          authorId={authorId}
          className="flex gap-2 min-w-fit rounded-xl bg-gray-200"
          postId={postId}
          variant="ghost"
          key={postId}
        />
        {/* Comment button */}
        <PostComment
          postId={postId}
          authorId={authorId}
          title={title}
          content={content}
          authorName={author}
          createdAt={createdAt}
        />
        {/* Favourite button  */}
        <FavouritePostButton
          className="flex gap-2 min-w-fit rounded-xl bg-gray-200"
          postId={postId}
          variant="ghost"
          key={postId}
        />
      </div>
    </div>
  );
}
