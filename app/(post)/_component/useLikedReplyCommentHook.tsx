import axios from "axios";
import useSwr from "swr";

export type GetBackLikedReplyCommentType = {
  CommentReply_comment_reply_id: string;
};

export default function useLikedReplyComment(user_id: string, comment_id: string) {
    const fetchData = async (user_id: string, comment_id: string) => {
        try {
            const response = await axios.get("/api/get-liked-replycomment", {
                params: {
                    comment_id: comment_id,
                    user_id: user_id,
                },
            });

            if (response.status === 200) {
                return response.data;
            } else {
                return [];
            }

        } catch(err) {
            console.log(err);
            return [];
        }
    }

  const { data, error, isLoading } = useSwr(["/api/get-liked-replycomment", user_id, comment_id], ([url, user_id, comment_id]) => fetchData(user_id, comment_id))

    console.log(data)
  return {likedReplyComment: data as GetBackLikedReplyCommentType[] | [], error};
}
