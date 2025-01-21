"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import React from "react";
import useNotification from "../post/_component/_custom_hook/useNotificationHook";
import { Button } from "@/components/ui/button";
import { NotificationType } from "../post/_component/Enum";
import axios from "axios";

// Function to fetch for specific postId

const fetchPostId = async (commentId: string): Promise<string | null> => {
  let postId: string | null = null;
  try {
    const res = await axios.get("/api/post/get-post-id-by-comment-id", {
      params: {
        comment_id: commentId,
      },
    });

    if (res.status === 200) {
      postId = res.data.postId;
    }
  } catch (error) {
    console.log(error);
  } finally {
    return postId;
  }
};

export default function NotificationPage() {
  const [userId] = useLocalStorage<string | null>("test-userId");
  const { allNotification, isLoading } = useNotification(userId ?? "");

  // TODO Handle navigation of all notification type
  const handleViewNotification = async (
    notificationType: NotificationType,
    resourceId: string
  ) => {
    switch (notificationType) {
      // Redirect user to the target follower profile
      case NotificationType.FOLLOW:
        window.history.replaceState(null, "", `/user/${resourceId}`);
        window.location.reload();
        break;

      // Redirect user to the post
      case NotificationType.LIKE_POST:
      case NotificationType.POST:
        window.history.replaceState(null, "", `/post/${resourceId}`);
        window.location.reload();
        break;

      case NotificationType.COMMENT:
        // Need to first get the post id
        const postId = await fetchPostId(resourceId);
        window.history.replaceState(
          null,
          "",
          `/post/${postId}?commentId=${resourceId}`
        );
        window.location.reload();
        break;
      case NotificationType.LIKE_COMMENT:
        break;
      case NotificationType.LIKE_REPLY_COMMENT:
        break;
      case NotificationType.COMMENT_REPLY:
        break;
    }
  };

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
            <Button
              variant="ghost"
              className="rounded-xl bg-gray-200 hover:text-blue-800 active:text-blue-800"
              onClick={() =>
                handleViewNotification(
                  notification.type,
                  notification.resourceId
                )
              }
            >
              View
            </Button>
          </div>
        ))}
      {!isLoading && allNotification?.length === 0 && (
        <div>No notifications ...</div>
      )}
    </div>
  );
}
