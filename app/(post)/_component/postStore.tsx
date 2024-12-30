import { create, useStore } from "zustand";
import { SearchPostType } from "./Enum";
import axios from "axios";
import { GetBackFavouritePost } from "./useFavouriteHook";
import { CreatePostFormType } from "../create-post/page";

export type UserType = {
  user_id: string;
  name: string;
};

export type PostType = {
  title: string;
  content: string;
  created_at: Date;
  post_id: string;
  dateDifferent: string;
  User: UserType;
};

type GetPostProps =
  | {
    searchPostType: SearchPostType.ALL_POST | SearchPostType.FAVOURITE_POST;
    searchText?: string;
    userId?: string;
  }
  | {
    searchPostType: SearchPostType.SEARCH_POST;
    searchText: string;
    userId?: string;
  }
  | {
    searchPostType: SearchPostType.OWN_POST;
    searchText?: string;
    userId: string;
  };

type PostState = {
  yourPosts: PostType[] | [];
  isLoading: boolean;
};

type ToastProp = {
  title: string;
  description: string;
};

type PostAction = {
  actions: {
    updatePosts: (
      postId: string,
      updatedPost: CreatePostFormType,
      showToast: ({ title, description }: ToastProp) => void,
    ) => void;

    fetch: ({ searchPostType, searchText, userId }: GetPostProps) => void;
    deletePosts: (
      postId: string,
      showToast: ({ title, description }: ToastProp) => void,
    ) => void;
  };
};

export const postStore = create<PostState & PostAction>((set) => ({
  yourPosts: [],
  isLoading: false,
  // Store all action
  actions: {
    // Action to update post
    updatePosts: async (
      postId: string,
      updatedPost: CreatePostFormType,
      showToast: ({ title, description }: ToastProp) => void,
    ) => {
      try {
        const res = await axios.put("/api/update-post", {
          ...updatedPost,
          postId: postId,
        });

        if (res.status === 200) {
          set((state) => ({
            yourPosts: state.yourPosts.map((post) => {
              if (post.post_id === postId) {
                return {
                  ...post,
                  title: updatedPost.title as string,
                  content: updatedPost.content as string,
                };
              }
              return post;
            }),
          }));
          showToast({
            title: "Success",
            description: "Post has updated successfully",
          });
        } else {
          showToast({
            title: "Error",
            description:
              "Unexpected error occured. Please try deleting it later",
          });
        }
      } catch (err) {
        console.log(err);
        showToast({
          title: "Error",
          description: "Unexpected error occured. Please try editing it later",
        });
      }
    },

    // Action to delete post
    deletePosts: async (
      postId: string,
      showToast: ({ title, description }: ToastProp) => void,
    ) => {
      try {
        const res = await axios.delete("/api/delete-post", {
          params: {
            post_id: postId,
          },
        });

        if (res.status === 200) {
          showToast({
            title: "Success",
            description: "Post has deleted successfully",
          });
          set((state) => ({
            yourPosts: state.yourPosts.filter(
              (post) => post.post_id !== postId,
            ),
          }));
        } else {
          showToast({
            title: "Error",
            description:
              "Unexpected error occured. Please try deleting it later",
          });
        }
      } catch (err) {
        console.log(err);
        showToast({
          title: "Error",
          description: "Unexpected error occured. Please try deleting it later",
        });
      }
    },

    // Initial action to fetch the current page needed posts
    fetch: async ({ searchPostType, searchText, userId }: GetPostProps) => {
      try {
        set({ isLoading: true });
        let apiUrl = "";
        switch (searchPostType) {
          case 1:
            apiUrl = "/api/get-all-post";
            break;
          case 2:
            apiUrl = "/api/get-own-post";
            break;
          case 3:
            apiUrl = "/api/get-favourite-post";
            break;
          case 4:
            apiUrl = "/api/get-search-post";
            break;
        }
        const res = await axios.get(apiUrl, {
          params: {
            user_id: userId ?? "",
            searchText: searchText ?? "",
          },
        });

        if (res.status === 200) {
          let returnedPosts = res.data;
          if (searchPostType === 4) {
            const favouritePosts: PostType[] = res.data.map(
              (item: GetBackFavouritePost) => {
                return item.Post;
              },
            );

            returnedPosts = favouritePosts;
          }

          set({ yourPosts: returnedPosts });
        }
      } catch (err) {
        console.log(err);
      } finally {
        set({ isLoading: false });
      }
    },
  },
}));
