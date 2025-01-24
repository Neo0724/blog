"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import React from "react";
import useNotification from "@/app/post/_component/_custom_hook/useNotificationHook";
import EachNotificationPage from "./EachNotificationPage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
export default function NotificationDialog() {
  const [userId] = useLocalStorage<string | null>("test-userId");
  const { allNotification, isLoading } = useNotification(userId ?? "");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative rounded-xl bg-gray-200 hover:text-blue-800 active:text-blue-800"
        >
          Notification
          {/* Show red dot if there are notifications */}
          {/* TODO Try to add a unread notification count on api so that the red dot will only appear if there are any unread notification only */}
          {!isLoading && allNotification && (
            <span className="absolute top-0 right-[-5px] w-3 h-3 rounded-full bg-red-800"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[400px] w-full">
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
      </PopoverContent>
    </Popover>
  );
}
