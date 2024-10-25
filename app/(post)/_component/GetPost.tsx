"use client";

import React, { useEffect, useState } from "react";
import { useLocalStorage, useScript } from "@uidotdev/usehooks";
import axios from "axios";
import EachPostPage from "./EachPostPage";
import { SearchPostType } from "./Enum";

export type UserType = {
  user_id: string;
  name: string;
};

type PostType = {
  title: string;
  content: string;
  created_at: Date;
  post_id: string;
  User: UserType;
};

type GetPostProps =
  | {
    searchPostType: SearchPostType.ALL_POST | SearchPostType.OWN_POST;
    searchText?: string;
  }
  | { searchPostType: SearchPostType.SEARCH_POST; searchText: string };

export default function GetPost({ searchPostType, searchText }: GetPostProps) {
  const [userId, _] = useLocalStorage<string>("test-userId");
  const [isLoading, setIsLoading] = useState(false);
  const [yourPosts, setYourPosts] = useState<PostType[] | []>([]);

  useEffect(() => {
    const getOwnPosts = async (userId: string) => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/get-own-post", {
          params: {
            user_id: userId,
          },
        });

        if (response.status === 200) {
          setYourPosts(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    const getAllPosts = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get("/api/get-all-post");

        if (response.status === 200) {
          setYourPosts(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    const getSearchPost = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/api/get-search-post", {
          params: {
            searchText: searchText,
          },
        });

        if (res.status === 200) {
          setYourPosts(res.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchPostType === 1) {
      getOwnPosts(userId);
    } else if (searchPostType === 2) {
      getAllPosts();
    } else if (searchPostType === 3) {
      getSearchPost();
    }
  }, []);

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
              />
            </div>
          );
        })}
      {!isLoading && yourPosts.length === 0 && <div>No posts found...</div>}
    </>
  );
}
