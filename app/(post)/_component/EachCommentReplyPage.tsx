import React, { Dispatch, SetStateAction } from "react";
import { UserType } from "./GetPost";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { GetBackReplyCommentType } from "./useReplyComment";
import axios from "axios";
import useLikedReplyComment from "./useLikedReplyCommentHook";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

export default function EachCommentReplyPage({
  content,
  comment_reply_id,
  comment_id,
  user,
  target_user,
  authorId,
  handleDeleteCommentReply,
}: {
  content: string;
  comment_reply_id: string;
  comment_id: string;
  user: UserType;
  target_user: UserType;
  authorId: string;
  handleDeleteCommentReply: (comment_reply_id: string) => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [userId, _] = useLocalStorage("test-userId", "");
  const [openReply, setOpenReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const { likedReply } = useLikedReplyComment(userId, comment_id);
  const [isLiked, setIsLiked] = useState<boolean>();
  const [totalLike, setTotalLike] = useState(0);
  const { mutate } = useSWRConfig();

  const fetchTotalLike = async () => {
    try {
      const response = await axios.get("/api/count-like-replycomment", {
        params: {
          comment_reply_id: comment_reply_id,
        },
      });

      if (response.status === 200) {
        return response.data;
      } else {
        return 0;
      }
    } catch (err) {
      console.log(err);
      return 0;
    }
  };
  const handleOpenReply = () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please sign in to reply",
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
      setOpenReply((prev) => !prev);
    }
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value);
  };

  const handleSubmitReply = async () => {
    try {
      const replyData = {
        content: replyContent,
        user_id: userId,
        target_user_id: user.user_id,
        comment_id: comment_id,
      };

      const res = await axios.post("/api/create-reply-comment", replyData);

      if (res.status === 200) {
        mutate(["/api/get-reply-comment", comment_id]);
      } else {
        toast({
          title: "Error",
          description: "An error occured when replying. Please try again later",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occured when replying. Please try again later",
      });
    } finally {
      setReplyContent("");
      setOpenReply(false);
    }
  };

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
          const res = await axios.delete("/api/delete-like-replycomment", {
            params: {
              user_id: userId,
              comment_reply_id: comment_reply_id,
            },
          });

          if (res.status === 200) {
            console.log("Deleted successfully");
            setIsLiked((prev) => !prev);
            setTotalLike((prev) => prev - 1);
          }
        } catch (err) {
          console.log(err);
          toast({
            title: "Error",
            description:
              "An error occured when removing like from the comment. Please try again later",
          });
        }
      } else {
        try {
          const res = await axios.post("/api/add-like-replycomment", {
            user_id: userId,
            comment_reply_id: comment_reply_id,
          });

          if (res.status === 200) {
            console.log("Added successfully");
            setIsLiked((prev) => !prev);
            setTotalLike((prev) => prev + 1);
          }
        } catch (error) {
          console.error(error);
          toast({
            title: "Error",
            description:
              "An error occured when liking the comment. Please try again later",
          });
        }
      }
    }
  };

  useEffect(() => {
    if (likedReply && likedReply.length > 0) {
      const userLiked = likedReply.find(
        (item) => item.CommentReply_comment_reply_id === comment_reply_id,
      )
        ? true
        : false;
      setIsLiked(userLiked);
    }

    const initalizeTotalLike = async () => {
      setTotalLike(await fetchTotalLike());
    };

    initalizeTotalLike();
  }, [likedReply]);

  return (
    <div className="ml-[3px]">
      <hr className="h-px mb-[5px] bg-gray-200 border-0 dark:bg-gray-700" />
      <span className="font-bold">
        {user.name}

        {/* The comment is created by the logged in user */}
        {user?.user_id === userId && (
          <span className="ml-1 text-gray-100 opacity-70 font-normal">
            ( Self )
          </span>
        )}
        {/* The comment is created by the author */}
        {user?.user_id !== userId && user?.user_id === authorId && (
          <span className="ml-1 text-gray-100 opacity-70 font-normal">
            ( Author )
          </span>
        )}
      </span>
      <div>
        <span className="text-blue-500 font-bold">@{target_user.name} </span>
        {content}
      </div>
      <div className="flex space-x-3 mt-[-5px] items-center">
        {/* Like and reply button */}
        <Button
          variant="link"
          className={cn("px-0", isLiked ? "text-red-500" : "")}
          onClick={handleLike}
        >
          {isLiked ? "Dislike" : "Like"}
          {"  " + totalLike}
        </Button>
        <Button variant="link" className="px-0" onClick={handleOpenReply}>
          {openReply ? "Cancel reply" : "Reply"}
        </Button>
        {/* Delete comment reply button */}
        {userId === user?.user_id && (
          <Button
            variant="link"
            className="px-0"
            onClick={() => handleDeleteCommentReply(comment_reply_id)}
          >
            Delete
          </Button>
        )}
      </div>
      {openReply && (
        <div className="flex flex-col border-solid border-2 border-black-500 p-5 pt-2 rounded-lg gap-2 mb-3">
          <span className="opacity-70">Replying to {user.name} :</span>
          <div className="flex gap-3 justify-center items-center">
            <Textarea
              name="replyComment"
              id="replyComment"
              title="replyComment"
              value={replyContent}
              className="min-h-[10px]"
              onChange={(e) => handleContentChange(e)}
            ></Textarea>
            <Button className="w-[25%] mx-auto" onClick={handleSubmitReply}>
              Reply
            </Button>
          </div>
        </div>
      )}
      <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
    </div>
  );
}
