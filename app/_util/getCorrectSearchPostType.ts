import { SearchPostType } from "../post/_component/Enum";

export default function getCorrectSearchPostType(currentUrl: string) {
  // Get url key for correct post type fetching
  let postType: SearchPostType = SearchPostType.ALL_POST;

  if (currentUrl.startsWith("/post/all-posts")) {
    postType = SearchPostType.ALL_POST;
  } else if (currentUrl.startsWith("/user")) {
    postType = SearchPostType.USER_POST;
  } else if (currentUrl.startsWith("/post/favourite-post")) {
    postType = SearchPostType.USER_FAVOURITE_POST;
  } else if (currentUrl.startsWith("/post/search-post")) {
    postType = SearchPostType.SEARCH_POST;
  } else if (currentUrl.startsWith("post")) {
    postType = SearchPostType.SPECIFIC_POST;
  }

  return postType;
}
