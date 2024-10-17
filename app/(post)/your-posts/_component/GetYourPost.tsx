"use client";

import React, { useEffect, useState } from "react";
import { useLocalStorage, useScript } from "@uidotdev/usehooks";
import axios from "axios";
import EachPostPage from "./EachPostPage";

export type UserType = {
  user_id: string,
  name: string;
};


type PostType = {
  title: string;
  content: string;
  created_at: Date;
  post_id: string;
  User: UserType;
};

export default function GetYourPost() {
  const [userId, _] = useLocalStorage<string>("test-userId");

  const [yourPosts, setYourPosts] = useState<PostType[] | []>();

  useEffect(() => {
    try {
      const getPosts = async (userId: string) => {
        const response = await axios.get("/api/get-own-post", {
          params: {
            user_id: userId,
          },
        });

        if(response.status === 200) {
          setYourPosts(response.data);
        }
      };

      getPosts(userId);
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  return (
    <>
      {yourPosts?.map((post: PostType) => {
        return (
          <div key={post.post_id}> 
            <EachPostPage
              title={post.title}
              content={post.content}
              createdAt={post.created_at}
              author={post.User.name}
              postId={post.post_id ? post.post_id : ""}
            />
          </div>
        );
      })}
    </>
  );
}
