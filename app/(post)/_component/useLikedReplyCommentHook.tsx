import axios from "axios";
import useSwr from "swr";

export type GetBackLikedReplyCommentType = {
 CommentReply_comment_reply_id: string 
};

// Get all replied comment for a single comment
export default function useLikedReplyComment(user_id: string, comment_id: string) {
    const fetchLikedReplyComment = async (url: string | null, user_id: string, comment_id: string) => {
        if(!url || !user_id) {
            return [];
        }
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

  const { data, error, isLoading } = useSwr([user_id ? "/api/get-liked-replycomment" : null, user_id, comment_id], 
                                            ([url, user_id, comment_id]) => fetchLikedReplyComment(url, user_id, comment_id))

  return { likedReply : data as GetBackLikedReplyCommentType[], error};
}
