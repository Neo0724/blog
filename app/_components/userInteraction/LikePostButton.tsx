"use client";
import { useLikedPostCount } from "@/app/post/_component/custom_hook/useLikedPostCountHook";
import useLikedPost from "@/app/post/_component/custom_hook/useLikedPostHook";
import useNotification from "@/app/post/_component/custom_hook/useNotificationHook";
import { NotificationType } from "@/app/post/_component/Enum";
import { Button, buttonVariants } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@uidotdev/usehooks";
import { VariantProps } from "class-variance-authority";
import React, { useEffect, useState } from "react";
import { BiDislike, BiLike } from "react-icons/bi";

type LikePostButtonProps = {
  variant: VariantProps<typeof buttonVariants>["variant"];
  className: string;
  postId: string;
  authorId: string;
};

export default function LikePostButton({
  className,
  postId,
  variant,
  authorId,
}: LikePostButtonProps) {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const postLikeCount = useLikedPostCount(postId);
  const [loggedInUserId, _] = useLocalStorage<string | null>(
    "test-userId",
    null
  );
  const { addNotification, deleteNotification } = useNotification(
    loggedInUserId ?? ""
  );
  const { likedPost, likedPostLoading, addLikePost, removeLikePost } =
    useLikedPost(loggedInUserId);
  const handleLikePost = async () => {
    // User is not logged in
    if (!loggedInUserId) {
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
    // Only send notification if the user who liked is not the author

    if (loggedInUserId !== authorId) {
      addNotification({
        fromUserId: loggedInUserId,
        targetUserId: [authorId],
        type: NotificationType.LIKE_POST,
        resourceId: postId,
      });
    }

    // Add the like to the post
    addLikePost(loggedInUserId, postId, setIsLiked, toast);
  };

  const handleUnlikePost = () => {
    // User is not logged in
    if (!loggedInUserId) {
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
    // Remove the notification if user is not the author of the post
    if (loggedInUserId !== authorId) {
      deleteNotification({
        fromUserId: loggedInUserId,
        targetUserId: authorId,
        type: NotificationType.LIKE_POST,
        resourceId: postId,
      });
    }
    removeLikePost(loggedInUserId, postId, setIsLiked, toast);
  };

  useEffect(() => {
    if (!likedPostLoading && likedPost && likedPost.length > 0) {
      const liked = likedPost.find((item) => item.Post_post_id === postId)
        ? true
        : false;
      setIsLiked(liked);
    }
  }, [likedPost, likedPostLoading, postId]);
  return (
    <Button
      variant={variant}
      className={cn(
        className,
        isLiked
          ? "hover:text-red-800 active:text-red-800"
          : "hover:text-blue-600 active:text-blue-600"
      )}
      onClick={() => {
        isLiked ? handleUnlikePost() : handleLikePost();
      }}
    >
      {isLiked ? <BiDislike /> : <BiLike />}
      {isLiked ? "Dislike" : "Like"}
      {"  " + (postLikeCount ?? 0)}
    </Button>
  );
}
