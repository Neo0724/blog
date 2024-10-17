import axios from "axios";
import { useState, useEffect } from "react";
import { UserType } from "./GetYourPost";

export type GetBackCommentType = {
  comment_id: string;
  content: string;
  created_at: Date;
  User: UserType;
};

export default function useComment(post_id: string) {
  const [comments, setComments] = useState<GetBackCommentType[]>([]);

  useEffect(() => {
    const getComment = async () => {
      try {
        const response = await axios.get("/api/get-comment", {
          params: {
            post_id: post_id,
          },
        });

        if(response.status === 200) {
          setComments(response.data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    getComment();
  }, [post_id]);

  return { comments, setComments };
}
