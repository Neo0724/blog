"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import React from "react";
import useNotification from "@/app/post/_component/custom_hook/useNotificationHook";
import EachNotificationPage from "./EachNotificationPage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { IoNotifications } from "react-icons/io5";

export default function NotificationDialog() {
  const [userId] = useLocalStorage<string | null>("test-userId");
  const { allNotification, notViewedCount, isLoading } = useNotification(
    userId ?? ""
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative rounded-xl bg-[rgb(58,59,60)] text-black border-[rgb(58,59,60)] group"
        >
          <IoNotifications className="text-white group-hover:text-black" />
          {/* Show red dot if there are notifications */}
          {/* TODO Try to add a unread notification count on api so that the red dot will only appear if there are any unread notification only */}
          {!isLoading && (notViewedCount as number) > 0 && (
            <span className="flex justify-center items-center absolute top-[-5px] right-[-5px] w-6 h-6 bg-gray-200 rounded-full border-2 border-red-800">
              {notViewedCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[400px] w-full bg-[rgb(36,37,38)] border-[rgb(58,59,60)]">
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
