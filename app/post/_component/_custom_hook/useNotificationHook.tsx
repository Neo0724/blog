"use client";
import useSWR from "swr";
import { notificationStore } from "../_store/notificationStore";
import { useStore } from "zustand";
import { NotificationType } from "../Enum";
import axios from "axios";

const fetchNotification = async (
  apiUrl: string,
  userId: string
): Promise<NotificationType[]> => {
  let fetchedNotification: NotificationType[] = [];
  try {
    const res = await axios.get(apiUrl, {
      params: {
        user_id: userId,
      },
    });

    if (res.status === 200) {
      fetchedNotification = res.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    return fetchedNotification;
  }
};

export default function useNotification(userId: string) {
  const { data, isLoading, error } = useSWR(
    userId ? ["notification", userId] : null,
    () => fetchNotification("/api/notification/get-notification", userId)
  );
  const actions = useStore(notificationStore, (state) => state.actions);

  return { allNotification: data, isLoading, error, ...actions };
}
