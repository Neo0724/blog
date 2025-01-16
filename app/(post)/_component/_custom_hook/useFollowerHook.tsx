import useSWR from "swr";
import { useStore } from "zustand";
import axios from "axios";
import { UserType } from "../GetPost";
import { followerStore } from "../_store/followerStore";

type UserFollower = {
  UserFollower: UserType;
  createdAt: string;
};

const fetchFollower = async (
  url: string,
  targetId: string,
  queryUsername: string
): Promise<UserFollower[] | []> => {
  let follower = [];
  try {
    const res = await axios.get(url, {
      params: {
        target_id: targetId,
        query_username: queryUsername,
      },
    });

    if (res.status === 200) {
      follower = res.data;
    }
  } catch (err) {
    console.log(err);
  } finally {
    return follower;
  }
};

export const useFollower = (targetId: string, queryUsername = "") => {
  const { data, isLoading, error } = useSWR(
    ["/api/get-follower", targetId],
    () => fetchFollower("/api/get-follower", targetId, queryUsername)
  );

  const actions = useStore(followerStore, (state) => state.actions);

  return { ...actions, allFollower: data, isLoading, error };
};
