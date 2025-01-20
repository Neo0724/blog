"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import React from "react";
import useNotification from "../post/_component/_custom_hook/useNotificationHook";

export default function NotificationPage() {
  const [userId] = useLocalStorage<string | null>("test-userId");
  const { allNotification, isLoading } = useNotification(userId ?? "");
  return (
    <div className="flex flex-col gap-3">
      {isLoading && <div>Loading ...</div>}

      {!isLoading &&
        allNotification &&
        allNotification.map((notification) => (
          <div
            key={notification.notification_id}
            className="flex flex-col gap-5"
          >
            <span>From: {notification.FromUser.name}</span>
            <span>To: {notification.TargetUser.name}</span>
            <span>Type: {notification.type}</span>
            <span>ID: {notification.resourceId}</span>
          </div>
        ))}
      {!isLoading && allNotification?.length === 0 && (
        <div>No notifications ...</div>
      )}
    </div>
  );
}
