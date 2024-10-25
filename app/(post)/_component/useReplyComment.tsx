import axios from "axios";
import { useState, useEffect } from "react";
import { UserType } from "./GetPost";

export type GetBackReplyCommentType = {
  comment_reply_id: string;
  content: string;
  User: UserType;
  Target_user: UserType;
};

export default function useReplyComment(comment_id: string) {
  const [replyComments, setReplyComments] = useState<GetBackReplyCommentType[]>(
    [],
  );

  useEffect(() => {
    const getReplyComment = async () => {
      try {
        const response = await axios.get("/api/get-reply-comment", {
          params: {
            comment_id: comment_id,
          },
        });

        if (response.status === 200) {
          setReplyComments(response.data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    getReplyComment();
  }, [comment_id]);

  return { replyComments, setReplyComments };
}
