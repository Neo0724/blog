import { create } from "zustand";
import axios from "axios";
import { NotificationType } from "../Enum";
import { UserType } from "../_postComponent/RenderPost";
import { mutate } from "swr";

type NewNotificationType = {
  targetUserId: string[];
  fromUserId: string;
  type: NotificationType;
  resourceId: string;
};

type DeleteNotificationType = Omit<NewNotificationType, "targetUserId"> & {
  targetUserId: string;
};

export type ReturnedNotificationType = {
  notification_id: string;
  hasViewed: boolean;
  createdAt: string;
  TargetUser: UserType;
  FromUser: UserType;
} & (
  | {
      type: NotificationType.FOLLOW;
      resource: { followerUserId: string };
    }
  | {
      type: NotificationType.POST | NotificationType.LIKE_POST;
      resource: { postId: string };
    }
  | {
      type: NotificationType.COMMENT | NotificationType.LIKE_COMMENT;
      resource: { postId: string; commentId: string };
    }
  | {
      type:
        | NotificationType.COMMENT_REPLY
        | NotificationType.LIKE_REPLY_COMMENT;
      resource: { postId: string; commentId: string; commentReplyId: string };
    }
);

type NotificationAction = {
  actions: {
    addNotification: (newNotification: NewNotificationType) => Promise<void>;
    readNotification: (notificationId: string) => Promise<void>;
    deleteNotification: (
      deleteNotification: DeleteNotificationType
    ) => Promise<void>;
  };
};

export const notificationStore = create<NotificationAction>(() => ({
  actions: {
    addNotification: async (newNotification) => {
      try {
        await Promise.all([
          newNotification.targetUserId.map(
            async (userId) =>
              await axios.post("/api/notification/add-notification", {
                ...newNotification,
                targetUserId: userId,
              })
          ),
        ]);
      } catch (err) {
        console.log(err);
      }
    },
    readNotification: async (notificationId) => {
      try {
        const res = await axios.put("/api/notification/read-notification", {
          notification_id: notificationId,
        });

        if (res.status === 200) {
          mutate("/api/notification/get-notification");
        }
      } catch (err) {
        console.log(err);
      }
    },
    deleteNotification: async (deleteNotification: DeleteNotificationType) => {
      try {
        await axios.delete("/api/notification/delete-notification", {
          params: {
            type: deleteNotification.type,
            target_user_id: deleteNotification.targetUserId,
            from_user_id: deleteNotification.fromUserId,
            resource_id: deleteNotification.resourceId,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
}));
