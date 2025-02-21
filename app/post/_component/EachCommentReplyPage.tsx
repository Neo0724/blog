import React, { useRef } from "react";
import { UserType } from "./postComponent/RenderPost";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import useReplyComment from "./custom_hook/useReplyCommentHook";
import useLikedReplyComment from "./custom_hook/useLikedReplyCommentHook";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter, useSearchParams } from "next/navigation";
import { NotificationType } from "./Enum";
import EditCommentReplyDialog from "./EditCommentReplyDialog";
import LikeCommentReplyButton from "./commentReplyComponent/LikeCommentReplyButton";
import useNotification from "./custom_hook/useNotificationHook";

export default function EachCommentReplyPage({
  content,
  comment_reply_id,
  comment_id,
  user,
  target_user,
  authorId,
  dateDifferent,
  setViewReplies,
}: {
  content: string;
  comment_reply_id: string;
  comment_id: string;
  user: UserType;
  target_user: UserType;
  authorId: string;
  dateDifferent: string;
  setViewReplies: React.Dispatch<boolean>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [loggedInUserId, _] = useLocalStorage("test-userId", "");
  const [openReply, setOpenReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const {
    replyComments,
    createReplyComments,
    deleteReplyComments,
    mutateReplyComment,
  } = useReplyComment(comment_id, loggedInUserId);
  const { addNotification, deleteNotification } = useNotification(
    loggedInUserId ?? ""
  );
  const commentReplyBoxRef = useRef<HTMLDivElement | null>(null);

  const openReplyRef = useRef<HTMLDivElement | null>(null);

  const handleOpenReply = () => {
    if (!loggedInUserId) {
      toast({
        title: "Error",
        description: "Please sign in to reply",
        action: (
          <ToastAction
            altText="Sign in now"
            onClick={() => {
              window.location.replace("/sign-in");
            }}
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
    const replyData = {
      content: replyContent,
      user_id: loggedInUserId,
      target_user_id: user.user_id,
      comment_id: comment_id,
    };

    // Add the reply comment
    const commentReplyId = await createReplyComments(
      replyData,
      setViewReplies,
      setReplyContent,
      setOpenReply,
      toast
    );

    // Send the notification if the user is replying to other instead of himself
    if (user.user_id !== loggedInUserId) {
      addNotification({
        fromUserId: loggedInUserId,
        targetUserId: [user.user_id],
        type: NotificationType.COMMENT_REPLY,
        resourceId: commentReplyId,
      });
    }
  };

  const handleDeleteCommentReply = () => {
    // Remove the notification if user is not the author of the comment
    if (loggedInUserId !== target_user.user_id) {
      deleteNotification({
        fromUserId: loggedInUserId,
        // Target_user is the user that this comment is replying to
        targetUserId: target_user.user_id,
        type: NotificationType.COMMENT_REPLY,
        resourceId: comment_reply_id,
      });
    }

    // Delete the reply comment
    mutateReplyComment(
      deleteReplyComments(comment_reply_id, toast, comment_id),
      {
        optimisticData: replyComments?.filter(
          (replyComment) => replyComment.comment_reply_id !== comment_reply_id
        ),
        populateCache: true,
        revalidate: false,
        rollbackOnError: true,
      }
    );
  };

  function handleAuthorProfileNavigation(user_id: string): void {
    router.push(`/user/${user_id}`);
  }

  // Scroll the reply box into user view
  useEffect(() => {
    if (openReplyRef) {
      openReplyRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [openReplyRef, openReply]);

  // Scroll user into the specific comment reply box if user came from notification
  useEffect(() => {
    const commentReplyIdToScroll = searchParams.get("commentReplyId");

    if (comment_reply_id === commentReplyIdToScroll) {
      commentReplyBoxRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [comment_reply_id, searchParams]);

  return (
    <div className="ml-[3px]" ref={commentReplyBoxRef}>
      <hr className="h-px mb-[5px] bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="font-bold">
        <Button
          variant="link"
          className="p-0 h-auto text-base leading-none font-bold text-white"
          onClick={() => handleAuthorProfileNavigation(user.user_id)}
        >
          {user.name}
        </Button>
        {/* The comment is created by the logged in user */}
        {user?.user_id === loggedInUserId && (
          <span className="ml-1 text-white opacity-50 font-normal">
            ( Self )
          </span>
        )}
        {/* The comment is created by the author */}
        {user?.user_id !== loggedInUserId && user?.user_id === authorId && (
          <span className="ml-1 text-white opacity-50 font-normal">
            ( Author )
          </span>
        )}
      </div>
      <div>
        <span className="text-blue-500 font-bold">@{target_user.name} </span>
        {content}
      </div>
      <span className="text-sm text-white opacity-70 font-normal">
        {dateDifferent}
      </span>
      <div className="flex space-x-3 mt-[-5px] items-center">
        {/* Like and reply button */}
        <LikeCommentReplyButton
          variant="link"
          className="px-0 text-white"
          commentReplyOwnerId={user.user_id}
          commentReplyId={comment_reply_id}
          commentId={comment_id}
          key={comment_reply_id}
        />
        <Button
          variant="link"
          className="px-0 text-white"
          onClick={handleOpenReply}
        >
          {openReply ? "Cancel reply" : "Reply"}
        </Button>
        {/* Delete and edit comment reply button */}
        {loggedInUserId === user?.user_id && (
          <>
            <Button
              variant="link"
              className="px-0 text-white"
              onClick={handleDeleteCommentReply}
            >
              Delete
            </Button>
            <Button variant="link" className="px-0 text-white">
              <EditCommentReplyDialog
                content={content}
                commentId={comment_id}
                commentReplyId={comment_reply_id}
              />
            </Button>
          </>
        )}
      </div>
      {openReply && (
        <div className="flex flex-col border-solid border-2 border-black-500 p-5 pt-2 rounded-lg gap-2 mb-3 border-[rgb(58,59,60)]">
          <span className="opacity-70">Replying to {user.name} :</span>
          <div
            className="flex gap-3 justify-center items-center"
            ref={openReplyRef}
          >
            <Textarea
              name="replyComment"
              id="replyComment"
              title="replyComment"
              value={replyContent}
              className="min-h-[10px] border-[rgb(58,59,60)] bg-[rgb(36,37,38)]"
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
