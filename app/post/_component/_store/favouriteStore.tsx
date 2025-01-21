import { create } from "zustand";
import { ToastProp } from "./postStore";
import axios from "axios";

type FavouriteActions = {
  actions: {
    addToFavourite: (
      userId: string,
      postId: string,
      setIsFavourited: React.Dispatch<boolean>,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<void>;

    removeFromFavourite: (
      userId: string,
      postId: string,
      setIsFavourited: React.Dispatch<boolean>,
      showToast: ({ title, description }: ToastProp) => void
    ) => Promise<void>;
  };
};

export const favouriteStore = create<FavouriteActions>(() => ({
  actions: {
    addToFavourite: async (userId, postId, setIsFavourited, showToast) => {
      try {
        const res = await axios.post("/api/post/add-favourite-post", {
          user_id: userId,
          post_id: postId,
        });

        if (res.status === 200) {
          setIsFavourited(true);
        }
      } catch (err) {
        console.log(err);
        showToast({
          title: "Error",
          description:
            "An error occured when adding to favourite. Please try again later",
        });
      }
    },

    removeFromFavourite: async (
      userId,
      postId,
      setIsFavourited: React.Dispatch<boolean>,
      showToast
    ) => {
      try {
        const res = await axios.delete("/api/post/delete-favourite-post", {
          params: {
            user_id: userId,
            post_id: postId,
          },
        });

        if (res.status === 200) {
          setIsFavourited(false);
        }
      } catch (err) {
        console.log(err);
        showToast({
          title: "Error",
          description:
            "An error occured when removing from favourite. Please try again later",
        });
      }
    },
  },
}));
