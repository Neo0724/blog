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
  const [loggedInUserId] = useLocalStorage<string | null>("test-userId");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const { addNotification, deleteNotification } = useNotification(
    loggedInUserId ?? ""
  );
  const { likedReply, addLikeCommentReply, removeLikeCommentReply } =
    useLikedReplyComment(loggedInUserId ?? "", commentId);
  const replyCommentLikeCount = useLikedReplyCommentCount(commentReplyId);

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
    // Only send notification if the user who liked is not the author
    if (loggedInUserId !== commentReplyOwnerId) {
      addNotification({
        fromUserId: loggedInUserId,
        targetUserId: [commentReplyOwnerId],
        type: NotificationType.LIKE_REPLY_COMMENT,
        resourceId: commentReplyId,
      });
    }

    // Add the like
    addLikeCommentReply(loggedInUserId, commentReplyId, setIsLiked, toast);
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
    // Remove the notification from the target user
    if (loggedInUserId !== commentReplyOwnerId) {
      deleteNotification({
        fromUserId: loggedInUserId,
        targetUserId: commentReplyOwnerId,
        type: NotificationType.LIKE_REPLY_COMMENT,
        resourceId: commentReplyId,
      });
    }

    // Remove the like
    removeLikeCommentReply(loggedInUserId, commentReplyId, setIsLiked, toast);
  };

  useEffect(() => {
    if (likedReply && likedReply.length > 0) {
      const userLiked = likedReply.find(
        (item) => item.CommentReply_comment_reply_id === commentReplyId
      )
        ? true
        : false;
      setIsLiked(userLiked);
    }
  }, [commentReplyId, likedReply]);

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
