import { Button } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import useNotification from "../custom_hook/useNotificationHook";
import { NotificationType } from "../Enum";
import useLikedComment from "../custom_hook/useLikedCommentHook";
import { useLikeCommentCount } from "../custom_hook/useLikedCommentCountHook";
import { useLocalStorage } from "@uidotdev/usehooks";

type LikeCommentButtonProps = {
  variant: VariantProps<typeof buttonVariants>["variant"];
  className: string;
  commentOwnerId: string;
  commentId: string;
  postId: string;
};

export default function LikeCommentButton({
  className,
  variant,
  commentOwnerId,
  commentId,
  postId,
}: LikeCommentButtonProps) {
  const [isLiked, setIsLiked] = useState<boolean>();
  const [loggedInUserId] = useLocalStorage<string | null>("test-userId");
  const { addNotification, deleteNotification } = useNotification(
    loggedInUserId ?? ""
  );
  const {
    likedComment,
    addLikeComment,
    removeLikeComment,
    likedCommentMutate,
    likedCommentLoading,
  } = useLikedComment(loggedInUserId ?? "", postId);

  const { commentLikeCount, fetchCommentLikeCount, commentLikeCountMutate } =
    useLikeCommentCount(commentId);

  const handleLikeComment = async () => {
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
    if (loggedInUserId !== commentOwnerId) {
      addNotification({
        fromUserId: loggedInUserId,
        targetUserId: [commentOwnerId],
        type: NotificationType.LIKE_COMMENT,
        resourceId: commentId,
      });
    }

    // Add the like
    likedCommentMutate(
      addLikeComment(
        loggedInUserId,
        commentId,
        setIsLiked,
        toast,
        commentLikeCountMutate
      ),
      {
        optimisticData: [...(likedComment ?? []), commentId],
        populateCache: true,
        revalidate: false,
        rollbackOnError: true,
      }
    );
  };

  const handleDislikeComment = async () => {
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
    if (loggedInUserId !== commentOwnerId) {
      deleteNotification({
        fromUserId: loggedInUserId,
        targetUserId: commentOwnerId,
        type: NotificationType.LIKE_COMMENT,
        resourceId: commentId,
      });
    }

    // Remove the like
    likedCommentMutate(
      removeLikeComment(
        loggedInUserId,
        commentId,
        setIsLiked,
        toast,
        commentLikeCountMutate
      ),
      {
        optimisticData: likedComment?.filter(
          (comment_id) => comment_id !== commentId
        ),
        populateCache: true,
        revalidate: false,
        rollbackOnError: true,
      }
    );
  };

  // Initialize the like button to be like or dislike
  useEffect(() => {
    if (!likedCommentLoading && likedComment && likedComment.length > 0) {
      const userLiked = likedComment.find(
        (comment_id) => comment_id === commentId
      )
        ? true
        : false;
      setIsLiked(userLiked);
    }
  }, [commentId, likedComment, likedCommentLoading]);
  return (
    <Button
      variant={variant}
      className={cn(className, isLiked ? "text-red-500" : "")}
      onClick={() => {
        isLiked ? handleDislikeComment() : handleLikeComment();
      }}
    >
      {isLiked ? "Dislike" : "Like"}
      {"  " + (commentLikeCount ?? 0)}
    </Button>
  );
}
