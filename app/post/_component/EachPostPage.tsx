"use client";

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
import { useRouter, useSearchParams } from "next/navigation";
import { ToastAction } from "@/components/ui/toast";
import { IoIosHeartEmpty } from "react-icons/io";
import useFavourite from "./_custom_hook/useFavouriteHook";
import { MdOutlineHeartBroken } from "react-icons/md";
import { useLikedPostCount } from "./_custom_hook/useLikedPostCountHook";
import { useStore } from "zustand";
import { likedPostStore } from "./_store/likedPostStore";
import { useFollowing } from "./_custom_hook/useFollowingHook";
import { cn } from "@/lib/utils";
import useNotification from "./_custom_hook/useNotificationHook";
import { NotificationType } from "./Enum";

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
  const { toast } = useToast();
  const [userId, _] = useLocalStorage<string | null>("test-userId", null);
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
  const [readMore, setReadMore] = useState(false);
  const { addNotification, deleteNotification } = useNotification(userId ?? "");
  const { allFollowing, addFollowing, removeFollowing } = useFollowing(
    userId ?? ""
  );
  // Check if user is following any of the author of each post
  const isFollowing = allFollowing?.find(
    (following) => following.UserFollowing.user_id === authorId
  );

  const handleFollow = () => {
    // User is not logged in
    if (!userId) {
      toast({
        title: "Error",
        description: "Please sign in to like",
        action: (
          <ToastAction
            altText="Sign in now"
            onClick={() => {
              window.location.replace("/sign-in");
            }}
          >
            Sign in
          </ToastAction>
        ),
      });
      return;
    }

    // Send notification to the author that someone started following him or her
    addNotification({
      fromUserId: userId,
      targetUserId: [authorId],
      type: NotificationType.FOLLOW,
      resourceId: userId,
    });

    // Add to following
    addFollowing(userId, authorId, toast);
  };

  const handleUnfollow = () => {
    if (userId) {
      // Delete the follow notification
      deleteNotification({
        fromUserId: userId,
        targetUserId: authorId,
        type: NotificationType.FOLLOW,
        resourceId: userId,
      });

      // Remove from the following
      removeFollowing(userId, authorId, toast);
    }
  };

  const handleLikePost = async () => {
    // User is not logged in
    if (!userId) {
      toast({
        title: "Error",
        description: "Please sign in to like",
        action: (
          <ToastAction
            altText="Sign in now"
            onClick={() => {
              window.location.replace("/sign-in");
            }}
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
      // Remove the notification if user is not the author of the post
      if (userId !== authorId) {
        deleteNotification({
          fromUserId: userId,
          targetUserId: authorId,
          type: NotificationType.LIKE_POST,
          resourceId: postId,
        });
      }
      removeLikePost(userId, postId, setIsLiked, toast);
    } else {
      // User wants to add the like
      // Only send notification if the user who liked is not the author

      if (userId !== authorId) {
        addNotification({
          fromUserId: userId,
          targetUserId: [authorId],
          type: NotificationType.LIKE_POST,
          resourceId: postId,
        });
      }

      // Add the like to the post
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
            onClick={() => {
              window.location.replace("/sign-in");
            }}
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

  const handleAuthorProfileNavigation = (authorId: string) => {
    router.push("/user/" + authorId);
  };

  return (
    <div className="flex max-h[70%] z-10 relative flex-col gap-4 border-2 p-5 rounded-md mb-5 max-w-[800px] mx-auto">
      <PostOptionComponent
        userId={userId ?? ""}
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
        {/* Current user is not the author and has not follow the author */}
        {userId !== authorId && !isFollowing && (
          <div className="mr-[30px]">
            <span className="text-black opacity-80 mr-2">&#x2022;</span>
            <Button
              variant="link"
              onClick={handleFollow}
              className="p-0 h-auto text-base leading-none  text-blue-400"
            >
              Follow
            </Button>
          </div>
        )}
        {/* Current user is not the author and has already follwed the author */}
        {userId !== authorId && isFollowing && (
          <>
            <span className="text-black opacity-80">&#x2022;</span>
            <Button
              variant="link"
              onClick={handleUnfollow}
              className="p-0 h-auto text-base leading-none text-blue-400"
            >
              Unfollow
            </Button>
          </>
        )}
      </div>
      <div className="flex flex-row gap-4 pb-1">
        <h1 className="font-bold">{title}</h1>
      </div>
      <div className="flex flex-row gap-4 pb-2">
        {content.length > 255 ? (
          <span>
            {readMore ? content : content.substring(0, 255) + "..."}
            <button
              className="text-blue-600 hover:opacity-75"
              onClick={() => {
                setReadMore((prev) => !prev);
              }}
            >
              {readMore ? "Read less" : "Read more"}
            </button>
          </span>
        ) : (
          <span>{content}</span>
        )}
      </div>
      <div className="flex items-center flex-wrap gap-2 max-w-[40rem] w-full">
        {/* Like button  */}
        <Button
          variant="ghost"
          className={cn(
            "flex gap-2 min-w-fit rounded-xl bg-gray-200",
            isLiked
              ? "hover:text-red-800 active:text-red-800"
              : "hover:text-blue-600 active:text-blue-600"
          )}
          onClick={handleLikePost}
        >
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
          handleLike={handleLikePost}
          isLiked={isLiked}
          handleFavourite={handleFavourite}
          isFavourited={isFavourited}
          dateDifferent={dateDifferent}
          createdAt={createdAt}
        />
        {/* Favourite button  */}
        <Button
          variant="ghost"
          className={cn(
            "flex gap-2 min-w-fit rounded-xl bg-gray-200",
            isFavourited
              ? "hover:text-red-800 active:text-red-800"
              : "hover:text-blue-600 active:text-blue-600"
          )}
          onClick={handleFavourite}
        >
          {isFavourited ? <MdOutlineHeartBroken /> : <IoIosHeartEmpty />}
          {isFavourited ? "Unfavourite" : "Favourite"}
        </Button>
      </div>
    </div>
  );
}
