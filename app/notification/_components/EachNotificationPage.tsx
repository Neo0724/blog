import useNotification from "@/app/post/_component/_custom_hook/useNotificationHook";
import { ReturnedNotificationType } from "@/app/post/_component/_store/notificationStore";
import { NotificationType } from "@/app/post/_component/Enum";
import { Button } from "@/components/ui/button";
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
  const { readNotification } = useNotification(notification.TargetUser.user_id);

  const handleViewNotification = async () => {
    if (!notification.hasViewed) {
      readNotification(notification.notification_id);
    }

    // Handle different notification type
    if (checkNotificationType(notification, NotificationType.FOLLOW)) {
      // Redirect user to the target follower profile
      window.history.replaceState(
        null,
        "",
        `/user/${notification.resource.followerUserId}`
      );
      window.location.replace(window.location.href);
    } else if (
      checkNotificationType(notification, NotificationType.LIKE_POST) ||
      checkNotificationType(notification, NotificationType.POST)
    ) {
      // Redirect user to the post
      window.history.replaceState(
        null,
        "",
        `/post/${notification.resource.postId}`
      );
      window.location.reload();
    } else if (
      checkNotificationType(notification, NotificationType.LIKE_COMMENT) ||
      checkNotificationType(notification, NotificationType.COMMENT)
    ) {
      // Redirect to the post that has the comment
      window.history.replaceState(
        null,
        "",
        `/post/${notification.resource.postId}?commentId=${notification.resource.commentId}`
      );
      window.location.reload();
    } else if (
      checkNotificationType(notification, NotificationType.COMMENT_REPLY) ||
      checkNotificationType(notification, NotificationType.LIKE_REPLY_COMMENT)
    ) {
      // Redirect to the post that has the comment reply
      window.history.replaceState(
        null,
        "",
        `/post/${notification.resource.postId}?commentId=${notification.resource.commentId}&commentReplyId=${notification.resource.commentReplyId}`
      );
      window.location.reload();
    }
  };
  return (
    <div key={notification.notification_id} className="flex gap-3">
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
      <Button
        variant="ghost"
        className="rounded-xl bg-gray-200 hover:text-blue-800 active:text-blue-800"
        onClick={() => handleViewNotification()}
      >
        {notification.hasViewed ? "View" : "Read"}
      </Button>
    </div>
  );
}
