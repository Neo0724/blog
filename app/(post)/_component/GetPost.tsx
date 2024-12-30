"use client";

import React, { useEffect, useState } from "react";
import { CreatePostFormType } from "../create-post/page";
import { useLocalStorage, useScript } from "@uidotdev/usehooks";
import axios from "axios";
import EachPostPage from "./EachPostPage";
import { SearchPostType } from "./Enum";
import { GetBackFavouritePost } from "./useFavouriteHook";
import { useToast } from "@/components/ui/use-toast";

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
    searchPostType:
    | SearchPostType.ALL_POST
    | SearchPostType.OWN_POST
    | SearchPostType.FAVOURITE_POST;
    searchText?: string;
  }
  | { searchPostType: SearchPostType.SEARCH_POST; searchText: string };

export default function GetPost({ searchPostType, searchText }: GetPostProps) {
  const [userId, _] = useLocalStorage<string>("test-userId");
  const [isLoading, setIsLoading] = useState(false);
  const [yourPosts, setYourPosts] = useState<PostType[] | []>([]);
  const { toast } = useToast();

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

    const getFavouritePost = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/api/get-favourite-post", {
          params: {
            user_id: userId,
          },
        });

        if (res.status === 200) {
          const favouritePost: PostType[] = res.data.map(
            (item: GetBackFavouritePost) => {
              return item.Post;
            },
          );

          setYourPosts(favouritePost);
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
    } else if (searchPostType === 4) {
      getFavouritePost();
    }
  }, []);

  const handleEdit = async (
    postId: string,
    newFormData: CreatePostFormType,
  ) => {
    try {
      // TODO Add edit post API
      const res = await axios.put("/api/edit-post", newFormData);

      if (res.status === 200) {
        setYourPosts((prev) => {
          return prev.map((post) => {
            if (post.post_id === postId) {
              return {
                ...post,
                title: res.data.title as string,
                content: res.data.content as string,
              };
            } else {
              return post;
            }
          });
        });
        toast({
          title: "Success",
          description: "Post has deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Unexpected error occured. Please try deleting it later",
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Unexpected error occured. Please try editing it later",
      });
    }
  };
  const handleDelete = async (postId: string) => {
    try {
      const res = await axios.delete("/api/delete-post", {
        params: {
          post_id: postId,
        },
      });

      if (res.status === 200) {
        const filteredPost = yourPosts.filter((post) => {
          return post.post_id !== postId;
        });
        toast({
          title: "Success",
          description: "Post has deleted successfully",
        });
        setYourPosts(filteredPost);
      } else {
        toast({
          title: "Error",
          description: "Unexpected error occured. Please try deleting it later",
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Unexpected error occured. Please try deleting it later",
      });
    }
  };

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
                handleDelete={handleDelete}
              />
            </div>
          );
        })}
      {!isLoading && yourPosts.length === 0 && <div>No posts found...</div>}
    </>
  );
}
