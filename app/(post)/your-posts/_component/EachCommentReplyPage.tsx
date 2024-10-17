"use client"

import React, { Dispatch, SetStateAction } from 'react'
import { UserType } from './GetYourPost'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { ChangeEvent } from 'react'
import { useLocalStorage } from '@uidotdev/usehooks'
import { GetBackReplyCommentType } from './useReplyComment'
import axios from 'axios'

export default function EachCommentReplyPage({
  content,
  comment_id,
  user,
  target_user,
  setReplyComments
}: {
  content: string,
  comment_id: string,
  user: UserType,
  target_user: UserType,
  setReplyComments: Dispatch<SetStateAction<GetBackReplyCommentType[]>>
}) {
  const [user_id, _] = useLocalStorage("test-userId", null);
  const [openReply, setOpenReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  

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

  return (
    <div>
      <hr className = "h-px mb-[5px] bg-gray-200 border-0 dark:bg-gray-700" />
      <span className='font-bold'>{user.name}</span>
      <div><span className='text-blue-500 font-bold'>@{target_user.name} </span>{content}</div>
      <div className="flex space-x-3 mt-[-5px]">
        <Button variant="link" className="px-0">
          Like
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
      <hr className = "h-px bg-gray-200 border-0 dark:bg-gray-700" />
    </div>
  )
}
