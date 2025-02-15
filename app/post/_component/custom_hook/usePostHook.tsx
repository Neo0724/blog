"use client";
import useSWR from "swr";
import { postStore } from "../store/postStore";
import { SearchPostType } from "../Enum";
import { GetBackFavouritePost } from "./useFavouriteHook";
import axios from "axios";
import { useStore } from "zustand";
import { PostType } from "../postComponent/RenderPost";

const fetchPost = async (
  apiUrl: string,
  searchText?: string,
  userId?: string
): Promise<PostType[] | []> => {
  let returnedPosts: PostType[] | [] = [];
  try {
    const res = await axios.get(apiUrl, {
      params: {
        user_id: userId ?? "",
        searchText: searchText ?? "",
      },
    });

    if (res.status === 200) {
      returnedPosts = res.data ?? [];
      if (apiUrl.match("favourite")) {
        const favouritePosts: PostType[] = res.data.map(
          (item: GetBackFavouritePost) => {
            return item.Post;
          }
        );

        returnedPosts = favouritePosts;
        postStore.setState(() => ({
          attributes: {
            posts: returnedPosts,
          },
        }));
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    return returnedPosts;
  }
};

export default function usePost(
  searchPostType: SearchPostType,
  searchText?: string,
  userId?: string
) {
  let apiUrl = "";
  switch (searchPostType) {
    case 1:
      apiUrl = "/api/post/get-own-post";
      break;
    case 2:
      apiUrl = "/api/post/get-all-post";
      break;
    case 3:
      apiUrl = "/api/post/get-search-post";
      break;
    case 4:
      apiUrl = "/api/post/get-favourite-post";
      break;
  }

  const { data, error, isLoading, mutate } = useSWR(apiUrl, () =>
    fetchPost(apiUrl, searchText, userId)
  );

  const actions = useStore(postStore, (state) => state.actions);

  return {
    isLoading,
    error,
    mutate,
    yourPosts: data,
    ...actions,
    fetchUrl: apiUrl,
  };
}
