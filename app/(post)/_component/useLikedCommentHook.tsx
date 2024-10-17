import axios from "axios";
import { useState, useEffect } from "react";
import { UserType } from "./GetPost";

export type GetBackLikedCommentType = {
  Comment_comment_id: string;
};

export default function useLikedComment(user_id: string, post_id: string) {
  const [likedComment, setLikedComment] = useState<GetBackLikedCommentType[] | null>(
    null
  );

  useEffect(() => {
    const getLikedComment = async () => {
      try {
        const response = await axios.get("/api/get-liked-comment", {
          params: {
            post_id: post_id,
            user_id: user_id,
          },
        });

        if (response.status === 200) {
          setLikedComment(response.data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    getLikedComment();
  }, [post_id, user_id]);

  return { likedComment, setLikedComment };
}
