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

export default function EachCommentReplyPage({
  content,
  comment_reply_id,
  comment_id,
  user,
  target_user,
  setReplyComments,
}: {
  content: string;
  comment_reply_id: string;
  comment_id: string;
  user: UserType;
  target_user: UserType;
  setReplyComments: Dispatch<SetStateAction<GetBackReplyCommentType[]>>;
}) {
  const [user_id, _] = useLocalStorage("test-userId", "");
  const [openReply, setOpenReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const { likedReplyComment } = useLikedReplyComment(user_id, comment_id)
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

  const handleLike = async () => {
    if(isLiked) {
        try {
            const res = await axios.delete("/api/delete-like-replycomment", {
                params: {
                    user_id: user_id,
                    comment_reply_id: comment_reply_id
                }
            })
        
            if(res.status === 200) {
                console.log("Deleted successfully")
                setIsLiked(prev => !prev)
            }
        } catch(err) {
            console.log(err)
        }
    } else {
      try {
        const res = await axios.post("/api/add-like-replycomment", {
          user_id: user_id,
          comment_reply_id: comment_reply_id
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
    if(likedReplyComment && likedReplyComment.length > 0) {
      const userLiked = likedReplyComment.find((item) => item.CommentReply_comment_reply_id === comment_reply_id) ? true : false
      setIsLiked(userLiked)
    }
  }, [likedReplyComment])

  return (
    <div>
      <hr className="h-px mb-[5px] bg-gray-200 border-0 dark:bg-gray-700" />
      <span className="font-bold">{user.name}</span>
      <div>
        <span className="text-blue-500 font-bold">@{target_user.name} </span>
        {content}
      </div>
      <div className="flex space-x-3 mt-[-5px]">
        <Button variant="link" className={cn("px-0", isLiked ? "text-red-500" : "")} onClick={handleLike}>
        {isLiked ? "Dislike" : "Like"}
        </Button>
        <Button variant="link" className="px-0" onClick={handleOpenReply}>
          {openReply ? "Cancel reply" : "Reply"}
        </Button>
      </div>
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
      <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
    </div>
  );
}
