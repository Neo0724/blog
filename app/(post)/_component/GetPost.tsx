"use client";

import React from "react";
import EachPostPage from "./EachPostPage";
import { SearchPostType } from "./Enum";
import usePost from "./_custom_hook/usePostHook";

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

type GetPostProps =
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

export default function GetPost({
  searchPostType,
  searchText,
  userId,
}: GetPostProps) {
  const { yourPosts, isLoading } = usePost(searchPostType, searchText, userId);

  return (
    <>
      {isLoading && <div>Contents are loading...</div>}
      {!isLoading &&
        yourPosts &&
        yourPosts.length > 0 &&
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
      {!isLoading && yourPosts?.length === 0 && <div>No posts found...</div>}
    </>
  );
}
