"use client";

import React from "react";
import EachPostPage from "./EachPostPage";
import { SearchPostType } from "../Enum";
import usePost, { POST_PAGE_SIZE } from "../custom_hook/usePostHook";
import CreatePost from "./CreatePostPage";
import { useLocalStorage } from "@uidotdev/usehooks";
import PostSkeleton from "./PostSkeleton";
import getCorrectSearchPostType from "@/app/_util/getCorrectSearchPostType";
import { usePathname } from "next/navigation";

export type UserType = {
  user_id: string;
  name: string;
};

export type PostType = {
  title: string;
  content: string;
  createdAt: string;
  post_id: string;
  dateDifferent: string;
  User: UserType;
};

export type GetPostProps =
  | {
      searchPostType: SearchPostType.ALL_POST;
      searchText?: string;
      userId?: string;
    }
  | {
      searchPostType: SearchPostType.SEARCH_POST;
      searchText: string;
      userId?: string;
    }
  | {
      searchPostType:
        | SearchPostType.USER_POST
        | SearchPostType.USER_FAVOURITE_POST;
      searchText?: string;
      userId: string;
    };

export default function RenderPost({
  searchPostType,
  searchText,
  userId,
}: GetPostProps) {
  const { yourPosts, isLoading, setPostSize, postSize } = usePost(
    getCorrectSearchPostType(usePathname()),
    searchText,
    userId
  );

  const [username] = useLocalStorage<string | null>("test-username");
  const [loggedInUserId] = useLocalStorage<string | null>("test-userId");
  const isLoadingMore =
    isLoading ||
    (postSize > 0 &&
      yourPosts &&
      typeof yourPosts[postSize - 1] === "undefined");

  const isEmpty = yourPosts?.[0]?.length === 0;

  const isReachingEnd =
    isEmpty ||
    (yourPosts && yourPosts[yourPosts.length - 1]?.length < POST_PAGE_SIZE);

  const totalPosts = yourPosts ? yourPosts.flat().length : 0;
  // let prevPageSize = 0;
  let accumulatePostItem = 0;

  return (
    <>
      {userId === loggedInUserId && username && searchPostType !== 4 && (
        <CreatePost
          searchPostType={
            searchPostType as SearchPostType.ALL_POST | SearchPostType.USER_POST
          }
          userId={userId}
        />
      )}
      {!isLoading &&
        yourPosts &&
        yourPosts.map((page, pageIndex) => {
          // prevPageSize += pageIndex;
          return page.map((post, postIndex) => {
            // let currentIndex = postIndex + prevPageSize;
            accumulatePostItem += 1;
            return (
              <EachPostPage
                key={post.post_id}
                title={post.title}
                content={post.content}
                createdAt={post.createdAt}
                author={post.User.name}
                postId={post.post_id}
                authorId={post.User.user_id}
                dateDifferent={post.dateDifferent}
                index={accumulatePostItem - 1}
                totalPostsNumber={totalPosts}
                setPostSize={setPostSize}
              />
            );
          });
        })}

      {!isLoading && isEmpty && (
        <div className="max-w-[800px] w-full mx-auto">No posts found...</div>
      )}
      {(isLoading || isLoadingMore) && !isReachingEnd && <PostSkeleton />}
      {isReachingEnd && !isEmpty && <div>You have reached the end.</div>}
    </>
  );
}
