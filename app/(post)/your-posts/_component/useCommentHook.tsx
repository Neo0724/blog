import axios from "axios";
import { useState, useEffect } from "react";

type User = {
  name: string;
};

export type GetBackCommentType = {
  comment_id: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  post_id: string;
  user: User;
  user_id: string;
};

export default function useComment(post_id: string) {
  const [getComments, setGetComments] = useState<GetBackCommentType[]>([]);

  useEffect(() => {
    const getComment = async (): Promise<void> => {
      try {
        const response = await axios.get("/api/get-comment", {
          params: {
            post_id: post_id,
          },
        });

        const commentsData: GetBackCommentType[] = response.data;

        setGetComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    getComment();
  }, [post_id]);

  return [getComments, setGetComments];
}
