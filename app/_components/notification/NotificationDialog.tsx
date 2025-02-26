"use client";

import React, { useState } from "react";
import useNotification from "@/app/post/_component/custom_hook/useNotificationHook";
import EachNotificationPage from "./EachNotificationPage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { IoNotifications } from "react-icons/io5";
import { useLocalStorage } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";

export default function NotificationDialog() {
  const [loggedInUserId] = useLocalStorage<string | null>("test-userId");
  const [notificationTab, setNotificationTab] = useState<"ALL" | "UNREAD">(
    "ALL"
  );
  const {
    allNotification,
    notViewedCount,
    isLoading,
    readAllNotification,
    notificationMutate,
  } = useNotification(loggedInUserId ?? "");
  const allNotViewedNotifications =
    allNotification?.filter(
      (notification) => notification.hasViewed === false
    ) ?? [];

  const handleReadAllNotification = () => {
    notificationMutate(readAllNotification(allNotViewedNotifications), {
      optimisticData: {
        allNotification:
          allNotification?.map((notification) => ({
            ...notification,
            hasViewed: true,
          })) ?? [],
        notViewedCount: 0,
      },
      populateCache: true,
      revalidate: false,
      rollbackOnError: true,
    });
  };

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
      <PopoverContent className="overflow-y-scroll max-h-[400px] max-w-[400px] w-full bg-[rgb(36,37,38)] border-[rgb(58,59,60)]">
        <div className="flex flex-col gap-3">
          <div className="flex gap-5">
            <Button
              className={cn(
                "rounded-xl bg-[rgb(58,59,60)] hover:text-blue-800 active:text-blue-800 text-white",
                notificationTab === "ALL" && "bg-white text-black"
              )}
              variant="ghost"
              onClick={() => setNotificationTab("ALL")}
            >
              All
            </Button>
            <Button
              className={cn(
                "rounded-xl bg-[rgb(58,59,60)] hover:text-blue-800 active:text-blue-800 text-white",
                notificationTab === "UNREAD" && "bg-white text-black"
              )}
              variant="ghost"
              onClick={() => setNotificationTab("UNREAD")}
            >
              Unread
            </Button>
          </div>
          {/* Notification is loading */}
          {isLoading && <div>Loading ...</div>}
          {/* Displays when user has notifications that have not been viewed */}
          {!isLoading &&
            allNotification &&
            allNotViewedNotifications.length > 0 && (
              <Button
                onClick={handleReadAllNotification}
                className="rounded-xl bg-[rgb(58,59,60)] hover:text-blue-800 active:text-blue-800 text-white"
              >
                Mark all as read
              </Button>
            )}
          {!isLoading &&
            allNotification &&
            notificationTab === "ALL" &&
            allNotification.map((notification) => (
              <EachNotificationPage
                key={notification.notification_id}
                notification={notification}
              />
            ))}

          {!isLoading &&
            allNotViewedNotifications &&
            notificationTab === "UNREAD" &&
            allNotViewedNotifications.map((notification) => (
              <EachNotificationPage
                key={notification.notification_id}
                notification={notification}
              />
            ))}
          {/* Current user does not has any notification */}
          {!isLoading && allNotification?.length === 0 && (
            <div className="text-white">No notifications ...</div>
          )}
          {/* User want to view unread notification but all has been read */}
          {!isLoading &&
            allNotViewedNotifications.length === 0 &&
            allNotification &&
            allNotification.length > 0 && (
              <div className="text-white">
                All notifications have been read...
              </div>
            )}
          {!loggedInUserId && (
            <div className="text-white">Please sign in to use this feature</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
