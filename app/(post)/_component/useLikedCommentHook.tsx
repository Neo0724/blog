import axios from "axios";
import { useState, useEffect } from "react";
import useSWR from "swr";

export type GetBackLikedCommentType = {
  Comment_comment_id: string;
};

export default function useLikedComment(user_id: string, post_id: string) {
    const fetchData = async (url: string, user_id: string, post_id: string) => {
        try {
            const response = await axios.get(url, {
                params: {
                    post_id: post_id,
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
    };

  const { data, error, isLoading } = useSWR(["/api/get-liked-comment", user_id, post_id], ([url, user_id, post_id]) => fetchData(url, user_id, post_id))

  return { likedComment: data as GetBackLikedCommentType[] | [], error };
}
