"use client";

import React from "react";
import EachPostPage from "./EachPostPage";
import { SearchPostType } from "./Enum";
import usePost from "./_custom_hook/usePostHook";
import { Skeleton } from "@/components/ui/skeleton";
import CreatePost from "./CreatePost";
import { useLocalStorage } from "@uidotdev/usehooks";

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

const ShowSkeleton = () => {
  return (
    <div className="flex flex-col items-center">
      {/* First  */}
      <div className="max-w-[800px] w-full flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-[250px] h-6" />
          <Skeleton className="w-9 h-9 ml-auto rounded-full" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="w-[50px] h-6" />
          <Skeleton className="w-[200px] h-6" />
          <div className="flex gap-3">
            <Skeleton className="w-[70px] h-6" />
            <Skeleton className="w-[70px] h-6" />
            <Skeleton className="w-[70px] h-6" />
          </div>
        </div>
      </div>
      {/* Second  */}
      <div className="max-w-[800px] w-full flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-[250px] h-6" />
          <Skeleton className="w-9 h-9 ml-auto rounded-full" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="w-[50px] h-6" />
          <Skeleton className="w-[200px] h-6" />
          <div className="flex gap-3">
            <Skeleton className="w-[70px] h-6" />
            <Skeleton className="w-[70px] h-6" />
            <Skeleton className="w-[70px] h-6" />
          </div>
        </div>
      </div>
      {/* Third  */}
      <div className="max-w-[800px] w-full flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-[250px] h-6" />
          <Skeleton className="w-9 h-9 ml-auto rounded-full" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="w-[50px] h-6" />
          <Skeleton className="w-[200px] h-6" />
          <div className="flex gap-3">
            <Skeleton className="w-[70px] h-6" />
            <Skeleton className="w-[70px] h-6" />
            <Skeleton className="w-[70px] h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function GetPost({
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
      {isLoading && <ShowSkeleton />}
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
      {!isLoading && yourPosts?.length === 0 && (
        <div className="max-w-[800px] w-full mx-auto">No posts found...</div>
      )}
    </>
  );
}
