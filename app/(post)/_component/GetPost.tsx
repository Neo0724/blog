"use client";

import React from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
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

export default function GetPost({ searchPostType, searchText }: GetPostProps) {
  const [userId, _] = useLocalStorage<string>("test-userId");

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
                createdAt={post.created_at}
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
