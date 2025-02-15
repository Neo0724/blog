import { useFollowing } from "@/app/post/_component/custom_hook/useFollowingHook";
import useNotification from "@/app/post/_component/custom_hook/useNotificationHook";
import { ReturnedNotificationType } from "@/app/post/_component/store/notificationStore";
import { NotificationType } from "@/app/post/_component/Enum";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@uidotdev/usehooks";
import React from "react";

// Verify if the notification belongs the notificationType as different notificationType has different resource object shape
const checkNotificationType = <
  TObj extends ReturnedNotificationType,
  TType extends NotificationType
>(
  notification: TObj,
  notificationType: TType
): notification is TObj & { type: TType } => {
  return notification.type === notificationType;
};

export default function EachNotificationPage({
  notification,
}: {
  notification: ReturnedNotificationType;
}) {
  const [loggedInUserId] = useLocalStorage<string>("test-userId");
  const { readNotification, addNotification } = useNotification(loggedInUserId);
  const { allFollowing, addFollowing } = useFollowing(loggedInUserId);
  const { toast } = useToast();

  const handleViewNotification = async () => {
    if (!notification.hasViewed) {
      readNotification(notification.notification_id);
    }

    // Handle different notification type
    if (checkNotificationType(notification, NotificationType.FOLLOW)) {
      // Redirect user to the target follower profile
      window.location.replace(`/user/${notification.resource.followerUserId}`);
    } else if (
      checkNotificationType(notification, NotificationType.LIKE_POST) ||
      checkNotificationType(notification, NotificationType.POST)
    ) {
      // Redirect user to the post
      window.location.replace(`/post/${notification.resource.postId}`);
    } else if (
      checkNotificationType(notification, NotificationType.LIKE_COMMENT) ||
      checkNotificationType(notification, NotificationType.COMMENT)
    ) {
      // Redirect to the post that has the comment
      window.location.replace(
        `/post/${notification.resource.postId}?commentId=${notification.resource.commentId}`
      );
    } else if (
      checkNotificationType(notification, NotificationType.COMMENT_REPLY) ||
      checkNotificationType(notification, NotificationType.LIKE_REPLY_COMMENT)
    ) {
      // Redirect to the post that has the comment reply
      window.location.replace(
        `/post/${notification.resource.postId}?commentId=${notification.resource.commentId}&commentReplyId=${notification.resource.commentReplyId}`
      );
    }
  };

  const handleFollowBack = () => {
    addFollowing(loggedInUserId, notification.FromUser.user_id, toast);
    addNotification({
      fromUserId: loggedInUserId,
      targetUserId: [notification.FromUser.user_id],
      type: NotificationType.FOLLOW,
      resourceId: loggedInUserId,
    });
  };
  return (
    <div
      key={notification.notification_id}
      className="flex gap-3 justify-between items-center"
    >
      <div>
        <span>{notification.FromUser.name}</span>
        <span>
          {notification.type === NotificationType.COMMENT
            ? " just commented on your post"
            : notification.type === NotificationType.COMMENT_REPLY
            ? " just replied to your comment"
            : notification.type === NotificationType.FOLLOW
            ? " just follow you"
            : notification.type === NotificationType.LIKE_COMMENT
            ? " just liked your comment"
            : notification.type === NotificationType.LIKE_POST
            ? " just liked your post"
            : notification.type === NotificationType.LIKE_REPLY_COMMENT
            ? " just liked your reply"
            : notification.type === NotificationType.POST
            ? " just created a new post"
            : ""}
        </span>
      </div>
      <Button
        variant="ghost"
        className="rounded-xl bg-gray-200 hover:text-blue-800 active:text-blue-800"
        onClick={handleViewNotification}
      >
        {notification.hasViewed ? "View" : "Read"}
      </Button>
      {notification.type === NotificationType.FOLLOW &&
        !allFollowing?.find(
          (following) =>
            following.UserFollowing.user_id === notification.FromUser.user_id
        ) && (
          <Button
            variant="ghost"
            className="rounded-xl bg-gray-200 hover:text-blue-800 active:text-blue-800"
            onClick={handleFollowBack}
          >
            Follow back
          </Button>
        )}
    </div>
  );
}
