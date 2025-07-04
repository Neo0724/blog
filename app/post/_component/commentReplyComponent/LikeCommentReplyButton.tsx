import { Button, buttonVariants } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@uidotdev/usehooks";
import { VariantProps } from "class-variance-authority";
import React, { useEffect, useState } from "react";
import { NotificationType } from "../Enum";
import useNotification from "../custom_hook/useNotificationHook";
import useLikedReplyComment from "../custom_hook/useLikedReplyCommentHook";
import { cn } from "@/lib/utils";
import { useLikedReplyCommentCount } from "../custom_hook/useLikedReplyCommentCountHook";

type LikeCommentReplyButtonProps = {
  variant: VariantProps<typeof buttonVariants>["variant"];
  className: string;
  commentReplyOwnerId: string;
  commentReplyId: string;
  commentId: string;
};

export default function LikeCommentReplyButton({
  className,
  variant,
  commentReplyOwnerId,
  commentReplyId,
  commentId,
}: LikeCommentReplyButtonProps) {
  const { toast } = useToast();
  const [loggedInUserId] = useLocalStorage<string | null>("userId");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const { addNotification, deleteNotification } = useNotification(
    loggedInUserId ?? ""
  );
  const {
    likedReplyComment,
    addLikeCommentReply,
    removeLikeCommentReply,
    likedCommentReplyMutate,
  } = useLikedReplyComment(loggedInUserId ?? "", commentId);
  const { replyCommentLikeCount, replyCommentLikeCountMutate } =
    useLikedReplyCommentCount(commentReplyId);

  const handleLikeCommentReply = async () => {
    // User not logged in
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
    // Set is liked to true
    setIsLiked(true);

    // Increment like count
    replyCommentLikeCountMutate((prev) => (prev ? prev + 1 : 1), {
      populateCache: true,
      revalidate: false,
      rollbackOnError: true,
    });

    // Only send notification if the user who liked is not the author
    if (loggedInUserId !== commentReplyOwnerId) {
      const newNotification = {
        fromUserId: loggedInUserId,
        targetUserId: [commentReplyOwnerId],
        type: NotificationType.LIKE_REPLY_COMMENT,
        resourceId: commentReplyId,
      };

      likedCommentReplyMutate(
        addLikeCommentReply(
          loggedInUserId,
          commentReplyId,
          setIsLiked,
          toast,
          replyCommentLikeCountMutate,
          addNotification,
          newNotification
        ),
        {
          optimisticData: [...(likedReplyComment ?? []), commentReplyId],
          populateCache: true,
          revalidate: false,
          rollbackOnError: true,
        }
      );
    } else {
      likedCommentReplyMutate(
        addLikeCommentReply(
          loggedInUserId,
          commentReplyId,
          setIsLiked,
          toast,
          replyCommentLikeCountMutate
        ),
        {
          optimisticData: [...(likedReplyComment ?? []), commentReplyId],
          populateCache: true,
          revalidate: false,
          rollbackOnError: true,
        }
      );
    }
  };
  const handleDislikeCommentReply = () => {
    // User not logged in
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

    // Set is liked to false
    setIsLiked(false);

    // Decrement the like count
    replyCommentLikeCountMutate((prev) => (prev ? prev - 1 : 0), {
      populateCache: true,
      revalidate: false,
      rollbackOnError: true,
    });

    // Remove the notification from the target user
    if (loggedInUserId !== commentReplyOwnerId) {
      const notificationToDelete = {
        fromUserId: loggedInUserId,
        targetUserId: commentReplyOwnerId,
        type: NotificationType.LIKE_REPLY_COMMENT,
        resourceId: commentReplyId,
      };
      // Remove the like
      likedCommentReplyMutate(
        removeLikeCommentReply(
          loggedInUserId,
          commentReplyId,
          setIsLiked,
          toast,
          replyCommentLikeCountMutate,
          deleteNotification,
          notificationToDelete
        ),
        {
          optimisticData:
            likedReplyComment?.filter(
              (comment_reply_id) => comment_reply_id !== commentReplyId
            ) ?? [],
          populateCache: true,
          revalidate: false,
          rollbackOnError: true,
        }
      );
    } else {
      // Remove the like
      likedCommentReplyMutate(
        removeLikeCommentReply(
          loggedInUserId,
          commentReplyId,
          setIsLiked,
          toast,
          replyCommentLikeCountMutate
        ),
        {
          optimisticData:
            likedReplyComment?.filter(
              (comment_reply_id) => comment_reply_id !== commentReplyId
            ) ?? [],
          populateCache: true,
          revalidate: false,
          rollbackOnError: true,
        }
      );
    }
  };

  useEffect(() => {
    if (likedReplyComment && likedReplyComment.length > 0) {
      const userLiked = likedReplyComment.find(
        (comment_reply_id) => comment_reply_id === commentReplyId
      )
        ? true
        : false;
      setIsLiked(userLiked);
    }
  }, [commentReplyId, likedReplyComment]);

  return (
    <Button
      variant={variant}
      className={cn(className, isLiked ? "text-red-500" : "")}
      onClick={() => {
        isLiked ? handleDislikeCommentReply() : handleLikeCommentReply();
      }}
    >
      {isLiked ? "Dislike" : "Like"}
      {"  " + (replyCommentLikeCount ?? 0)}
    </Button>
  );
}
