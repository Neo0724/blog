"use client";
import useSWR from "swr";
import {
  DeleteNotificationType,
  NewNotificationType,
  ReturnedNotificationType,
} from "../store/notificationStore";
import axios from "axios";

type ReturnedNotificationTypeWithNotViewedCount = {
  allNotification: ReturnedNotificationType[];
  notViewedCount: number;
};

export default function useNotification(userId: string) {
  const fetchNotification = async (
    apiUrl: string,
    userId: string,
  ): Promise<ReturnedNotificationTypeWithNotViewedCount> => {
    let fetchedNotification: ReturnedNotificationType[] = [];
    let notViewedCount: number = 0;
    try {
      const res = await axios.get(apiUrl, {
        params: {
          user_id: userId,
        },
      });

      if (res.status === 200) {
        fetchedNotification = res.data.allNotification;
        notViewedCount = res.data.notViewedCount;
      }
    } catch (error) {
      console.log(error);
    }
    return { allNotification: fetchedNotification, notViewedCount };
  };

  const addNotification = async (
    newNotification: NewNotificationType,
  ): Promise<void> => {
    try {
      await Promise.all([
        newNotification.targetUserId.map(
          async (userId) =>
            await axios.post("/api/notification/add-notification", {
              ...newNotification,
              targetUserId: userId,
            }),
        ),
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  const readNotification = async (
    notificationId: string,
  ): Promise<ReturnedNotificationTypeWithNotViewedCount | undefined> => {
    let updatedNotification:
      | ReturnedNotificationTypeWithNotViewedCount
      | undefined = undefined;
    try {
      const res = await axios.put("/api/notification/read-notification", {
        notification_id: notificationId,
      });

      if (res.status === 200) {
        updatedNotification = {
          allNotification:
            data?.allNotification?.map((notification) => {
              if (notification.notification_id === notificationId) {
                return { ...notification, hasViewed: true };
              }

              return notification;
            }) ?? [],
          notViewedCount: (data?.notViewedCount ?? 1) - 1,
        };
      }
    } catch (err) {
      console.log(err);
    }

    return updatedNotification;
  };

  const deleteNotification = async (
    deleteNotification: DeleteNotificationType,
  ): Promise<void> => {
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
  };

  const { data, isLoading, error, mutate } = useSWR(
    userId ? "/api/notification/get-notification" : null,
    () => fetchNotification("/api/notification/get-notification", userId),
  );

  return {
    allNotification: data?.allNotification,
    notViewedCount: data?.notViewedCount,
    isLoading,
    error,
    addNotification,
    readNotification,
    deleteNotification,
    notificationMutate: mutate,
  };
}
