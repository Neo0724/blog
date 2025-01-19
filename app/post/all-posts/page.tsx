"use client";

import GetPost from "../_component/GetPost";
import { NotificationType, SearchPostType } from "../_component/Enum";
import { useLocalStorage } from "@uidotdev/usehooks";
import useNotification from "../_component/_custom_hook/useNotificationHook";
import { useFollower } from "../_component/_custom_hook/useFollowerHook";

export default function AllPostsPage() {
  const [userId] = useLocalStorage<string | null>("test-userId");
  const { allFollower } = useFollower(userId ?? "");

  const { addNotification } = useNotification(userId ?? "");

  const handleNotification = () => {
    addNotification({
      fromUserId: userId ?? "",
      targetUserId:
        allFollower?.map((follower) => follower.UserFollower.user_id) ?? [],
      type: NotificationType.POST,
      resourceId: "1234",
    });
  };

  return (
    <>
      <button className="w-10 h-10" onClick={handleNotification}>
        Click me
      </button>
      <GetPost searchPostType={SearchPostType.ALL_POST} userId={userId ?? ""} />
    </>
  );
}
