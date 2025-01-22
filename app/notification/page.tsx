"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import React from "react";
import useNotification from "../post/_component/_custom_hook/useNotificationHook";
import EachNotificationPage from "./_components/EachNotificationPage";

export default function NotificationPage() {
  const [userId] = useLocalStorage<string | null>("test-userId");
  const { allNotification, isLoading } = useNotification(userId ?? "");

  return (
    <div className="flex flex-col gap-3">
      {/* Notification is loading */}
      {isLoading && <div>Loading ...</div>}
      {!isLoading &&
        allNotification &&
        allNotification.map((notification) => (
          <EachNotificationPage
            key={notification.notification_id}
            notification={notification}
          />
        ))}
      {/* Current user does not has any notification */}
      {!isLoading && allNotification?.length === 0 && (
        <div>No notifications ...</div>
      )}
    </div>
  );
}
