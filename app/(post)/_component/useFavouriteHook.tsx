import useSWR from "swr"
import axios from "axios";

export type GetBackFavouritePost = {
    Post_post_id: string
}

export default function useFavourite(userId: string | null) {
    const fetchData = async (url: string | null, userId: string | null) => {
        if(!url || !userId) {
            return [];
        }

        try {
            const res = await axios.get(url, { params: { user_id: userId } } )

            if(res.status === 200) {
                return res.data;
            } else {
                return [];
            }
        } catch(err) {
            console.log(err);
            return [];
        }
    }
    const { data, isLoading, error } = useSWR([ userId ? "/api/get-favourite-post" : null, userId ], ([url, userId]) => fetchData(url, userId)) 

    return { favouritedPost: data as GetBackFavouritePost[] | [], favouriteError: error, favouritePostLoading: isLoading }
}
