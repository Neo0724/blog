"use client";

import { UserType } from "./GetPost";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import useReplyComment from "./useReplyComment";
import EachCommentReplyPage from "./EachCommentReplyPage";
import { cn } from "@/lib/utils";
import useLikedComment from "./useLikedCommentHook";

export default function EachCommentPage({
  comment_id,
  user,
  content,
  post_id
}: {
  comment_id: string;
  user: UserType;
  content: string;
  post_id: string;
}) {
  const [user_id, _] = useLocalStorage("test-userId", "");
  const [openReply, setOpenReply] = useState(false);
  const [viewReplies, setViewReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const { replyComments, setReplyComments } = useReplyComment(comment_id);
  const { likedComment } = useLikedComment(user_id, post_id)
  const [ isLiked, setIsLiked ] = useState<boolean>()

  const handleOpenReply = () => {
    setOpenReply((prev) => !prev);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value);
  };

  const handleSubmitReply = async () => {
    try {
      const replyData = {
        content: replyContent,
        user_id: user_id,
        target_user_id: user.user_id,
        comment_id: comment_id,
      };

      const res = await axios.post("/api/create-reply-comment", replyData);

      if (res.status === 200) {
        setReplyComments((prev) => [...prev, res.data]);
      }
    } catch (err) {
      // TODO
    } finally {
      setReplyContent("");
      setOpenReply(false);
    }
  };

  const handleViewReply = () => {
    setViewReplies((prev) => !prev);
  };

  const handleLike = async () => {
    if(isLiked) {
      try {
        const res = await axios.delete("/api/delete-like-comment", {
          params: {
            user_id: user_id,
            comment_id: comment_id
          }
        })
        
        if(res.status === 200) {
          console.log("Deleted successfully")
          setIsLiked(prev => !prev)
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const res = await axios.post("/api/add-like-comment", {
          user_id: user_id,
          comment_id: comment_id
        })
        
        if(res.status === 200) {
          console.log("Added successfully")
          setIsLiked(prev => !prev)

        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    if(likedComment && likedComment.length > 0) {
      const userLiked = likedComment.find((item) => item.Comment_comment_id === comment_id) ? true : false
      setIsLiked(userLiked)
    }
  }, [likedComment])
  
  return (
    <div className="flex flex-col">
      <h2 className="font-bold">{user.name}</h2>
      <div>{content}</div>
      {/* Like and reply button */}
      <div className="flex space-x-3 mt-[-5px]">
        <Button variant="link" className={cn("px-0", isLiked ? "text-red-500" : "")} onClick={handleLike}>
          {isLiked ? "Dislike" : "Like"}
        </Button>
        <Button variant="link" className="px-0" onClick={handleOpenReply}>
          {openReply ? "Cancel reply" : "Reply"}
        </Button>
      </div>
      {/* View reply bar */}
      <button
        className="inline-flex items-center justify-center w-full mb-[15px] relative"
        onClick={handleViewReply}
      >
        <hr className="w-64 h-px bg-gray-200 border-0 dark:bg-gray-700" />
        <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">
          {viewReplies ? "Hide replies" : "View replies"}
        </span>
      </button>
      {/* Reply textarea for user to enter */}
      <div className="ml-8">
        {openReply && (
          <div className="flex flex-col border-solid border-2 border-black-500 p-5 pt-2 rounded-lg gap-2">
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
        {/* All the comments' replies */}
        <div
          className={cn(
            "min-h-[150px] max-h-[350px] h-[80vh] overflow-y-scroll",
            !viewReplies && "hidden"
          )}
        >
          {replyComments &&
            replyComments.length > 0 &&
            viewReplies &&
            replyComments.map((c) => {
              return (
                <EachCommentReplyPage
                  comment_id={comment_id}
                  comment_reply_id={c.comment_reply_id}
                  user={c.User}
                  target_user={c.Target_user}
                  content={c.content}
                  setReplyComments={setReplyComments}
                  key={c.comment_reply_id}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
