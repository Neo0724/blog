import { Button } from "@/components/ui/button";
import React from "react";
import { BiComment } from "react-icons/bi";
import CommentPage from "./CommentPage";
import { BiSolidLike } from "react-icons/bi";
import { BiLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import PostOptionComponent from "./PostOptionComponent";
import { BiDislike } from "react-icons/bi";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useState, useEffect } from "react";
import axios from "axios";
import useLikedPost from "./useLikedPostHook";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ToastAction } from "@/components/ui/toast";
import { IoIosHeartEmpty } from "react-icons/io";
import useFavourite from "./useFavouriteHook";
import { MdOutlineHeartBroken } from "react-icons/md";

type EachPostProps = {
  title: string;
  content: string;
  createdAt: Date;
  author: string;
  authorId: string;
  postId: string;
  dateDifferent: string;
  handleDelete: (postId: string) => void;
};

export default function EachPostPage({
  title,
  content,
  createdAt,
  dateDifferent,
  author,
  postId,
  authorId,
  handleDelete,
}: EachPostProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [userId, _] = useLocalStorage("test-userId", null);
  const [totalLike, setTotalLike] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { likedPost, likedPostLoading } = useLikedPost(userId);
  const { favouritedPost, favouritePostLoading } = useFavourite(userId);
  const [isFavourited, setIsFavourited] = useState(false);

  const handleLike = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please sign in to like",
        action: (
          <ToastAction
            altText="Sign in now"
            onClick={() => router.push("sign-in")}
          >
            Sign in
          </ToastAction>
        ),
      });
    } else {
      if (isLiked) {
        try {
          const res = await axios.delete("/api/delete-like-post", {
            params: {
              user_id: userId,
              post_id: postId,
            },
          });

          if (res.status === 200) {
            setTotalLike((prev) => prev - 1);
            setIsLiked(false);
          }
        } catch (err) {
          console.log(err);
          toast({
            title: "Error",
            description:
              "An error occured when removing like from the post. Please try again later",
          });
        }
      } else {
        try {
          const res = await axios.post("/api/add-like-post", {
            user_id: userId,
            post_id: postId,
          });

          if (res.status === 200) {
            setTotalLike((prev) => prev + 1);
            setIsLiked(true);
          }
        } catch (err) {
          console.log(err);
          toast({
            title: "Error",
            description:
              "An error occured when liking the post. Please try again later",
          });
        }
      }
    }
  };

  const fetchTotalLike = async () => {
    try {
      const res = await axios.get("/api/count-like-post", {
        params: { post_id: postId },
      });

      if (res.status === 200) {
        return res.data;
      } else {
        return 0;
      }
    } catch (err) {
      console.log(err);
      return 0;
    }
  };

  const handleFavourite = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please sign in to add it to favourite",
        action: (
          <ToastAction
            altText="Sign in now"
            onClick={() => router.push("sign-in")}
          >
            Sign in
          </ToastAction>
        ),
      });
    } else {
      if (isFavourited) {
        try {
          const res = await axios.delete("/api/delete-favourite-post", {
            params: {
              user_id: userId,
              post_id: postId,
            },
          });

          if (res.status === 200) {
            setIsFavourited(false);
          }
        } catch (err) {
          console.log(err);
          toast({
            title: "Error",
            description:
              "An error occured when removing from favourite. Please try again later",
          });
        }
      } else {
        try {
          const res = await axios.post("/api/add-favourite-post", {
            user_id: userId,
            post_id: postId,
          });

          if (res.status === 200) {
            setIsFavourited(true);
          }
        } catch (err) {
          console.log(err);
          toast({
            title: "Error",
            description:
              "An error occured when adding to favourite. Please try again later",
          });
        }
      }
    }
  };

  useEffect(() => {
    if (!likedPostLoading && likedPost && likedPost.length > 0) {
      const liked = likedPost.find((item) => item.Post_post_id === postId)
        ? true
        : false;
      setIsLiked(liked);
    }

    if (!favouritePostLoading && favouritedPost && favouritedPost.length > 0) {
      const favourited = favouritedPost.find((item) => item.post_id === postId)
        ? true
        : false;
      setIsFavourited(favourited);
    }

    const initializeTotalLike = async () => {
      setTotalLike(await fetchTotalLike());
    };

    initializeTotalLike();
  }, [likedPost, favouritedPost]);

  return (
    <div className="flex max-h[70%] z-10 relative flex-col gap-4 border-2 p-5 rounded-md mb-5">
      <PostOptionComponent
        userId={userId ?? ""}
        authorId={authorId}
        postId={postId}
        handleDelete={handleDelete}
      />
      <div className="flex flex-row gap-4 border-b-2">
        Title:
        <h1 className="pb-5">{title}</h1>
      </div>
      <div className="flex flex-row gap-4 border-b-2">
        <h2 className="pb-5">{content}</h2>
      </div>
      <div className="flex flex-row gap-4 border-b-2">
        By:
        <h2 className="pb-5">
          {author}, {dateDifferent}
        </h2>
      </div>
      <div className="flex items-center justify-center flex-wrap gap-2 max-w-[40rem] w-full m-auto">
        {/* Like button  */}
        <Button className="flex gap-2 flex-1 min-w-fit" onClick={handleLike}>
          {isLiked ? <BiDislike /> : <BiLike />}
          {isLiked ? "Dislike" : "Like"}
          {"  " + totalLike}
        </Button>
        {/* Comment button */}
        <CommentPage
          postId={postId}
          authorId={authorId}
          title={title}
          content={content}
          author={author}
          handleLike={handleLike}
          isLiked={isLiked}
          totalLike={totalLike}
          handleFavourite={handleFavourite}
          isFavourited={isFavourited}
          dateDifferent={dateDifferent}
        />
        {/* Favourite button  */}
        <Button
          className="flex gap-2 flex-1 min-w-fit"
          onClick={handleFavourite}
        >
          {isFavourited ? <MdOutlineHeartBroken /> : <IoIosHeartEmpty />}
          {isFavourited ? "Remove from favourite" : "Add to favourite"}
        </Button>
      </div>
    </div>
  );
}
