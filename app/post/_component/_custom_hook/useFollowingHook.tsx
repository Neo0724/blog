import useSWR from "swr";
import { useStore } from "zustand";
import { followingStore } from "../_store/followingStore";
import axios from "axios";
import { UserType } from "../GetPost";

type AllFollowing = {
  UserFollowing: UserType;
  createdAt: string;
};

const fetchFollowing = async (
  url: string,
  ownerId: string,
  queryUsername: string
): Promise<AllFollowing[] | []> => {
  if (!ownerId || ownerId.length === 0) return [];

  let following = [];
  try {
    const res = await axios.get(url, {
      params: {
        owner_id: ownerId,
        query_username: queryUsername,
      },
    });

    if (res.status === 200) {
      following = res.data;
    }
  } catch (err) {
    console.log(err);
  } finally {
    return following;
  }
};

export const useFollowing = (ownerId: string, queryUsername = "") => {
  const { data, isLoading, error, isValidating } = useSWR(
    ownerId ? ["/api/get-following", ownerId] : null,
    () => fetchFollowing("/api/get-following", ownerId, queryUsername)
  );

  const actions = useStore(followingStore, (state) => state.actions);

  return { ...actions, allFollowing: data, isLoading, error, isValidating };
};
