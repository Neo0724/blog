"use client";
import { useFollowing } from "@/app/post/_component/custom_hook/useFollowingHook";
import useNotification from "@/app/post/_component/custom_hook/useNotificationHook";
import { NotificationType } from "@/app/post/_component/Enum";
import { Button, buttonVariants } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@uidotdev/usehooks";
import React from "react";
import { VariantProps } from "class-variance-authority";

type FollowButtonProps = {
  authorId: string;
  variant: VariantProps<typeof buttonVariants>["variant"];
  className: string;
};

export default function FollowButton({
  authorId,
  className,
  variant,
}: FollowButtonProps) {
  const { toast } = useToast();
  const [loggedInUserId, _] = useLocalStorage<string | null>(
    "test-userId",
    null
  );
  const { allFollowing, addFollowing, removeFollowing } = useFollowing(
    loggedInUserId ?? ""
  );
  const { addNotification, deleteNotification } = useNotification(
    loggedInUserId ?? ""
  );

  const handleFollow = () => {
    // User is not logged in
    if (!loggedInUserId) {
      toast({
        title: "Error",
        description: "Please sign in to follow",
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
      fromUserId: loggedInUserId,
      targetUserId: [authorId],
      type: NotificationType.FOLLOW,
      resourceId: loggedInUserId,
    });

    // Add to following
    addFollowing(loggedInUserId, authorId, toast);
  };

  const handleUnfollow = () => {
    if (loggedInUserId) {
      // Delete the follow notification
      deleteNotification({
        fromUserId: loggedInUserId,
        targetUserId: authorId,
        type: NotificationType.FOLLOW,
        resourceId: loggedInUserId,
      });

      // Remove from the following
      removeFollowing(loggedInUserId, authorId, toast);
    }
  };

  // Check if user is following any of the author of each post
  const isFollowing = allFollowing?.find(
    (following) => following.UserFollowing.user_id === authorId
  );
  return (
    <>
      {/* Current user is not the author and has not follow the author */}
      {loggedInUserId !== authorId && !isFollowing && (
        <div className="mr-[30px]">
          <span className="text-white opacity-80 mr-2">&#x2022;</span>
          <Button
            variant={variant}
            onClick={handleFollow}
            className={className}
          >
            Follow
          </Button>
        </div>
      )}
      {/* Current user is not the author and has already follwed the author */}
      {loggedInUserId !== authorId && isFollowing && (
        <>
          <span className="text-white opacity-80">&#x2022;</span>
          <Button
            variant={variant}
            onClick={handleUnfollow}
            className={className}
          >
            Unfollow
          </Button>
        </>
      )}
    </>
  );
}
