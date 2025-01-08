import { Button } from "@/components/ui/button";
import React from "react";
import CommentPage from "./CommentPage";
import { BiLike } from "react-icons/bi";
import PostOptionComponent from "./PostOptionComponent";
import { BiDislike } from "react-icons/bi";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useState, useEffect } from "react";
import useLikedPost from "./_custom_hook/useLikedPostHook";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ToastAction } from "@/components/ui/toast";
import { IoIosHeartEmpty } from "react-icons/io";
import useFavourite from "./_custom_hook/useFavouriteHook";
import { MdOutlineHeartBroken } from "react-icons/md";
import { useLikedPostCount } from "./_custom_hook/useLikedPostCountHook";
import { useStore } from "zustand";
import { likedPostStore } from "./_store/likedPostStore";

type EachPostProps = {
  title: string;
  content: string;
  createdAt: Date;
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
  const { toast } = useToast();
  const [userId, _] = useLocalStorage("test-userId", null);
  const [isLiked, setIsLiked] = useState(false);
  const { likedPost, likedPostLoading } = useLikedPost(userId);
  const {
    favouritedPost,
    favouritePostLoading,
    addToFavourite,
    removeFromFavourite,
  } = useFavourite(userId);
  const [isFavourited, setIsFavourited] = useState(false);
  const postLikeCount = useLikedPostCount(postId);
  const { addLikePost, removeLikePost } = useStore(
    likedPostStore,
    (state) => state.actions
  );

  const handleLike = async () => {
    // User is not logged in
    if (!userId) {
      toast({
        title: "Error",
        description: "Please sign in to like",
        action: (
          <ToastAction
            altText="Sign in now"
            onClick={() => router.push("sign-in")}
          >
            Sign in
          </ToastAction>
        ),
      });
      return;
    }
    // User is logged in

    // User wants to remove the like
    if (isLiked) {
      removeLikePost(userId, postId, setIsLiked, toast);
    } else {
      // User wants to add the like
      addLikePost(userId, postId, setIsLiked, toast);
    }
  };

  const handleFavourite = async () => {
    // User not logged in
    if (!userId) {
      toast({
        title: "Error",
        description: "Please sign in to add it to favourite",
        action: (
          <ToastAction
            altText="Sign in now"
            onClick={() => router.push("sign-in")}
          >
            Sign in
          </ToastAction>
        ),
      });

      return;
    }
    if (isFavourited) {
      removeFromFavourite(userId, postId, setIsFavourited, toast);
    } else {
      addToFavourite(userId, postId, setIsFavourited, toast);
    }
  };

  useEffect(() => {
    if (!likedPostLoading && likedPost && likedPost.length > 0) {
      const liked = likedPost.find((item) => item.Post_post_id === postId)
        ? true
        : false;
      setIsLiked(liked);
    }

    if (!favouritePostLoading && favouritedPost && favouritedPost.length > 0) {
      const favourited = favouritedPost.find((item) => item.post_id === postId)
        ? true
        : false;
      setIsFavourited(favourited);
    }
  }, [
    likedPost,
    favouritedPost,
    likedPostLoading,
    favouritePostLoading,
    postId,
  ]);

  return (
    <div className="flex max-h[70%] z-10 relative flex-col gap-4 border-2 p-5 rounded-md mb-5">
      <PostOptionComponent
        userId={userId ?? ""}
        authorId={authorId}
        postId={postId}
        title={title}
        content={content}
      />
      <div className="flex flex-row gap-4 border-b-2">
        Title:
        <h1 className="pb-5">{title}</h1>
      </div>
      <div className="flex flex-row gap-4 border-b-2">
        <h2 className="pb-5">{content}</h2>
      </div>
      <div className="flex flex-row gap-4 border-b-2">
        By:
        <h2 className="pb-5">
          {author}, {dateDifferent}
        </h2>
        {userId !== authorId && <Button>Follower</Button>}
      </div>
      <div className="flex items-center justify-center flex-wrap gap-2 max-w-[40rem] w-full m-auto">
        {/* Like button  */}
        <Button className="flex gap-2 flex-1 min-w-fit" onClick={handleLike}>
          {isLiked ? <BiDislike /> : <BiLike />}
          {isLiked ? "Dislike" : "Like"}
          {"  " + (postLikeCount ?? 0)}
        </Button>
        {/* Comment button */}
        <CommentPage
          postId={postId}
          authorId={authorId}
          title={title}
          content={content}
          author={author}
          handleLike={handleLike}
          isLiked={isLiked}
          handleFavourite={handleFavourite}
          isFavourited={isFavourited}
          dateDifferent={dateDifferent}
        />
        {/* Favourite button  */}
        <Button
          className="flex gap-2 flex-1 min-w-fit"
          onClick={handleFavourite}
        >
          {isFavourited ? <MdOutlineHeartBroken /> : <IoIosHeartEmpty />}
          {isFavourited ? "Remove from favourite" : "Add to favourite"}
        </Button>
      </div>
    </div>
  );
}
