import { create } from "zustand";
import axios from "axios";
import { NotificationType } from "../Enum";
import { UserType } from "../GetPost";

type NewNotificationType = {
  targetUserId: string[];
  fromUserId: string;
  type: NotificationType;
  resourceId: string;
};

export type ReturnedNotificationType = {
  notification_id: string;
  type: NotificationType;
  resourceId: string;
  hasViewed: boolean;
  createdAt: string;
  TargetUser: UserType;
  FromUser: UserType;
};

type NotificationAction = {
  actions: {
    addNotification: (newNotification: NewNotificationType) => Promise<void>;
    readNotification: (notificationId: string) => Promise<void>;
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
        const res = await axios.patch("/api/notification/read-notification", {
          notification_id: notificationId,
        });

        if (res.status === 200) {
          console.log("Read successful");
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
}));
