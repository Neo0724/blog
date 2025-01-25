"use client";
import useSWR from "swr";
import {
  notificationStore,
  ReturnedNotificationType,
} from "../store/notificationStore";
import { useStore } from "zustand";
import axios from "axios";

type ReturnedNotificationTypeWithNotViewedCount = {
  allNotification: ReturnedNotificationType[];
  notViewedCount: number;
};

const fetchNotification = async (
  apiUrl: string,
  userId: string
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
  } finally {
    return { allNotification: fetchedNotification, notViewedCount };
  }
};

export default function useNotification(userId: string) {
  const { data, isLoading, error } = useSWR(
    userId ? "/api/notification/get-notification" : null,
    () => fetchNotification("/api/notification/get-notification", userId)
  );
  const actions = useStore(notificationStore, (state) => state.actions);

  return {
    allNotification: data?.allNotification,
    notViewedCount: data?.notViewedCount,
    isLoading,
    error,
    ...actions,
  };
}
