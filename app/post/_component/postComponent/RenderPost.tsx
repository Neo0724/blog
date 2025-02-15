"use client";

import React from "react";
import EachPostPage from "./EachPostPage";
import { SearchPostType } from "../Enum";
import usePost from "../custom_hook/usePostHook";
import CreatePost from "./CreatePostPage";
import { useLocalStorage } from "@uidotdev/usehooks";
import PostSkeleton from "./PostSkeleton";

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
  const { yourPosts, isLoading } = usePost(searchPostType, searchText, userId);

  const [username] = useLocalStorage<string | null>("test-username");
  const [loggedInUserId] = useLocalStorage<string | null>("test-userId");
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
      {isLoading && <PostSkeleton />}
      {!isLoading &&
        yourPosts &&
        yourPosts.map((post: PostType) => {
          return (
            <div key={post.post_id}>
              <EachPostPage
                title={post.title}
                content={post.content}
                createdAt={post.createdAt}
                author={post.User.name}
                postId={post.post_id}
                authorId={post.User.user_id}
                dateDifferent={post.dateDifferent}
              />
            </div>
          );
        })}
      {!isLoading && yourPosts?.length === 0 && (
        <div className="max-w-[800px] w-full mx-auto">No posts found...</div>
      )}
    </>
  );
}
