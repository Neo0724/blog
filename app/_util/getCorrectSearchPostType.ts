import { SearchPostType } from "../post/_component/Enum";

export default function getCorrectSearchPostType(currentUrl: string) {
  // Get url key for mutation
  // let fetchUrl: string = "";

  // if (currentUrl.match("all-posts")) {
  //   fetchUrl = "/api/post/get-all-post";
  // } else if (currentUrl.match("user")) {
  //   fetchUrl = "/api/post/get-own-post";
  // } else if (currentUrl.match("favourite-post")) {
  //   fetchUrl = "/api/post/get-favourite-post";
  // } else if (currentUrl.match("search-post")) {
  //   fetchUrl = "/api/post/get-search-post";
  // } else if (currentUrl.match("post")) {
  //   fetchUrl = "/api/post/get-specific-post";
  // }

  // Get url key for mutation
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
