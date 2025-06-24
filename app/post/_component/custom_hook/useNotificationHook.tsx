"use client";
import useSWR from "swr";
import axios from "axios";
import { NotificationType } from "../Enum";
import { UserType } from "./usePostHook";
import customAxios from "@/lib/custom-axios";

type ReturnedNotificationTypeWithNotViewedCount = {
  allNotification: ReturnedNotificationType[];
  notViewedCount: number;
};

export type NewNotificationType = {
  targetUserId: string[];
  fromUserId: string;
  type: NotificationType;
  resourceId: string;
};

export type DeleteNotificationType = Omit<
  NewNotificationType,
  "targetUserId"
> & {
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

export default function useNotification(userId: string) {
  const fetchNotification = async (
    userId: string
  ): Promise<ReturnedNotificationTypeWithNotViewedCount | undefined> => {
    let fetchedNotification: ReturnedNotificationType[] = [];
    let notViewedCount: number = 0;
    try {
      const res = await customAxios.get(
        `/api/notification/get-notification?user_id=${userId}`
      );

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
    newNotification: NewNotificationType
  ): Promise<void> => {
    try {
      await Promise.all([
        newNotification.targetUserId.map(
          async (userId) =>
            await customAxios.post("/api/notification/add-notification", {
              ...newNotification,
              targetUserId: userId,
            })
        ),
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  const readNotification = async (
    notificationId: string
  ): Promise<ReturnedNotificationTypeWithNotViewedCount | undefined> => {
    let updatedNotification:
      | ReturnedNotificationTypeWithNotViewedCount
      | undefined = undefined;
    try {
      const res = await customAxios.put(
        `/api/notification/read-notification?notification_id=${notificationId}`
      );

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
    deleteNotification: DeleteNotificationType
  ): Promise<void> => {
    try {
      await customAxios.delete(
        `/api/notification/delete-notification?type=${deleteNotification.type}&target_user_id=${deleteNotification.targetUserId}&from_user_id=${deleteNotification.fromUserId}&resource_id=${deleteNotification.resourceId}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  const readAllNotification = async (
    allUnreadNotifications: ReturnedNotificationType[]
  ): Promise<ReturnedNotificationTypeWithNotViewedCount | undefined> => {
    let updatedNotification:
      | ReturnedNotificationTypeWithNotViewedCount
      | undefined = undefined;
    try {
      await Promise.all(
        allUnreadNotifications.map((unreadNotification) => {
          return readNotification(unreadNotification.notification_id);
        })
      );

      updatedNotification = {
        allNotification:
          data?.allNotification.map((notification) => ({
            ...notification,
            hasViewed: true,
          })) ?? [],
        notViewedCount: 0,
      };
    } catch (error) {
      console.log(error);
    }
    return updatedNotification;
  };

  const { data, isLoading, error, mutate } = useSWR(
    userId ? "/api/notification/get-notification" : null,
    () => fetchNotification(userId)
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
    readAllNotification,
  };
}
