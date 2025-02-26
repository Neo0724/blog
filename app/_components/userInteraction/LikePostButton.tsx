"use client";
import getCorrectSearchPostType from "@/app/_util/getCorrectSearchPostType";
import { useLikedPostCount } from "@/app/post/_component/custom_hook/useLikedPostCountHook";
import useLikedPost from "@/app/post/_component/custom_hook/useLikedPostHook";
import useNotification from "@/app/post/_component/custom_hook/useNotificationHook";
import usePost from "@/app/post/_component/custom_hook/usePostHook";
import { NotificationType } from "@/app/post/_component/Enum";
import { PostType } from "@/app/post/_component/postComponent/RenderPost";
import { Button, buttonVariants } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@uidotdev/usehooks";
import { VariantProps } from "class-variance-authority";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiDislike, BiLike } from "react-icons/bi";

type LikePostButtonProps = {
  variant: VariantProps<typeof buttonVariants>["variant"];
  className: string;
  postId: string;
  authorId: string;
};

export default function LikePostButton({
  authorId,
  className,
  postId,
  variant,
}: LikePostButtonProps) {
  const { toast } = useToast();
  const [loggedInUserId, _] = useLocalStorage<string | null>(
    "test-userId",
    null
  );
  const [isLiked, setIsLiked] = useState(false);
  const { postLikeCount, postLikeCountMutate } = useLikedPostCount(postId);
  const { yourPosts } = usePost(
    getCorrectSearchPostType(usePathname()),
    "",
    loggedInUserId ?? ""
  );

  const { addNotification, deleteNotification } = useNotification(
    loggedInUserId ?? ""
  );
  const currentPost = yourPosts?.flat().find((post) => post.post_id === postId);

  const {
    likedPost,
    likedPostLoading,
    addLikePost,
    removeLikePost,
    likedPostMutate,
  } = useLikedPost(loggedInUserId);
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
      const newNotification = {
        fromUserId: loggedInUserId,
        targetUserId: [authorId],
        type: NotificationType.LIKE_POST,
        resourceId: postId,
      };
      likedPostMutate(
        addLikePost(
          loggedInUserId,
          currentPost as PostType,
          setIsLiked,
          toast,
          addNotification,
          newNotification
        ),
        {
          optimisticData: [...(likedPost ?? []), postId],
          populateCache: true,
          revalidate: false,
          rollbackOnError: true,
        }
      );
    } else {
      // Only add the like, do not add notification as the user is the author itself
      likedPostMutate(
        addLikePost(loggedInUserId, currentPost as PostType, setIsLiked, toast),
        {
          optimisticData: [...(likedPost ?? []), postId],
          populateCache: true,
          revalidate: false,
          rollbackOnError: true,
        }
      );
    }

    // Add the like to the post
    postLikeCountMutate((prev) => (prev ? prev + 1 : 1), {
      populateCache: true,
      revalidate: false,
      rollbackOnError: true,
    });
  };

  const handleUnlikePost = async () => {
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
      const notificationToDelete = {
        fromUserId: loggedInUserId,
        targetUserId: authorId,
        type: NotificationType.LIKE_POST,
        resourceId: postId,
      };

      likedPostMutate(
        removeLikePost(
          loggedInUserId,
          currentPost as PostType,
          setIsLiked,
          toast,
          deleteNotification,
          notificationToDelete
        ),
        {
          optimisticData: likedPost?.filter((post_id) => post_id !== postId),
          populateCache: true,
          revalidate: false,
          rollbackOnError: true,
        }
      );
    } else {
      likedPostMutate(
        removeLikePost(
          loggedInUserId,
          currentPost as PostType,
          setIsLiked,
          toast
        ),
        {
          optimisticData: likedPost?.filter((post_id) => post_id !== postId),
          populateCache: true,
          revalidate: false,
          rollbackOnError: true,
        }
      );
    }

    postLikeCountMutate((prev) => (prev ? prev - 1 : 0), {
      populateCache: true,
      revalidate: false,
      rollbackOnError: true,
    });
  };

  useEffect(() => {
    if (!likedPostLoading && likedPost && likedPost.length > 0) {
      const liked = likedPost.find((post_id) => post_id === postId)
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
