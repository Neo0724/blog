import { useFollowing } from "@/app/post/_component/custom_hook/useFollowingHook";
import useNotification from "@/app/post/_component/custom_hook/useNotificationHook";
import { ReturnedNotificationType } from "@/app/post/_component/custom_hook/useNotificationHook";
import { NotificationType } from "@/app/post/_component/Enum";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@uidotdev/usehooks";
import React from "react";
import { mutate } from "swr";

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
  const [loggedInUserId] = useLocalStorage<string>("userId");
  const {
    notViewedCount: notificationNotViewedCount,
    allNotification: allUserNotification,
    readNotification,
    addNotification,
    notificationMutate,
  } = useNotification(loggedInUserId);
  const { allFollowing, addFollowing, followingMutate } =
    useFollowing(loggedInUserId);
  const { toast } = useToast();

  const handleViewNotification = async () => {
    if (!notification.hasViewed) {
      notificationMutate(readNotification(notification.notification_id), {
        optimisticData: {
          allNotification:
            allUserNotification?.map((eachNotification) => {
              if (
                eachNotification.notification_id ===
                notification.notification_id
              ) {
                return { ...eachNotification, hasViewed: true };
              }

              return eachNotification;
            }) ?? [],
          notViewedCount: (notificationNotViewedCount ?? 1) - 1,
        },
      });
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
    const newNotification = {
      fromUserId: loggedInUserId,
      targetUserId: [notification.FromUser.user_id],
      type: NotificationType.FOLLOW,
      resourceId: loggedInUserId,
    };

    // Add to following
    followingMutate(
      addFollowing(
        loggedInUserId,
        notification.FromUser.user_id,
        toast,
        addNotification,
        newNotification
      ),
      {
        populateCache: true,
        revalidate: false,
        rollbackOnError: true,
      }
    );
  };
  return (
    <div
      key={notification.notification_id}
      className="flex gap-3 justify-between items-center text-white"
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
        className="rounded-xl bg-[rgb(58,59,60)] hover:text-blue-800 active:text-blue-800 text-white"
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
            className="rounded-xl bg-[rgb(58,59,60)] text-white hover:text-blue-800 active:text-blue-800"
            onClick={handleFollowBack}
          >
            Follow back
          </Button>
        )}
    </div>
  );
}
