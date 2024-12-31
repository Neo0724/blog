import useSWR from "swr";
import { postStore, PostType } from "../_store/postStore";
import { SearchPostType } from "../Enum";
import { GetBackFavouritePost } from "./useFavouriteHook";
import axios from "axios";
import { useStore } from "zustand";

const fetchPost = async (
  apiUrl: string,
  searchText?: string,
  userId?: string
) => {
  try {
    const res = await axios.get(apiUrl, {
      params: {
        user_id: userId ?? "",
        searchText: searchText ?? "",
      },
    });

    if (res.status === 200) {
      let returnedPosts = res.data ?? [];
      if (apiUrl.match("favourite")) {
        const favouritePosts: PostType[] = res.data.map(
          (item: GetBackFavouritePost) => {
            return item.Post;
          }
        );

        returnedPosts = favouritePosts;
      }
      return returnedPosts;
    }
  } catch (err) {
    console.log(err);
    return [];
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
      apiUrl = "/api/get-own-post";
      break;
    case 2:
      apiUrl = "/api/get-all-post";
      break;
    case 3:
      apiUrl = "/api/get-search-post";
      break;
    case 4:
      apiUrl = "/api/get-favourite-post";
      break;
  }

  const { data, error, isLoading } = useSWR(apiUrl, () =>
    fetchPost(apiUrl, searchText, userId)
  );

  const actions = useStore(postStore, (state) => state.actions);

  return { isLoading, error, yourPosts: data, ...actions };
}
