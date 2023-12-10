"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import axios from "axios";

import { Button } from "@/components/ui/button";

export default function AllPostsPage() {
  const getOwnPost = async () => {
    try {
      const post = await axios.get("/api/get-all-post")
      console.log(post.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    getOwnPost();
  };
  return (
    <div>
      <Button onClick={handleClick}>Click to all posts</Button>
    </div>
  );
}
