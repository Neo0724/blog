import { UserType } from "./GetPost";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useNotification from "./_custom_hook/useNotificationHook";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import useReplyComment from "./_custom_hook/useReplyComment";
import EachCommentReplyPage from "./EachCommentReplyPage";
import { cn } from "@/lib/utils";
import useLikedComment from "./_custom_hook/useLikedCommentHook";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter, useSearchParams } from "next/navigation";
import useComment from "./_custom_hook/useCommentHook";
import { useLikeCommentCount } from "./_custom_hook/useLikedCommentCountHook";
import { NotificationType } from "./Enum";
import EditCommentDialog from "./EditCommentDialog";

/*
 * The page when the user click "Comment" button on the post
 *
 * */
export default function EachCommentPage({
  commentId,
  user,
  content,
  post_id,
  authorId,
  dateDifferent,
}: {
  commentId: string;
  user: UserType;
  content: string;
  post_id: string;
  authorId: string;
  dateDifferent: string;
}) {
  // TODO Scroll user into the specific comment id viewport if user came from notification. Use search params to get the comment id
  const router = useRouter();
  const searchParams = useSearchParams();
  const commentBoxRef = useRef<HTMLDivElement | null>(null);
  const viewRepliesRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const [userId, _] = useLocalStorage("test-userId", "");
  const [openReply, setOpenReply] = useState(false);
  const [viewReplies, setViewReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const { replyComments, isLoading } = useReplyComment(commentId);
  const { likedComment, addLikeComment, removeLikeComment } = useLikedComment(
    userId,
    post_id
  );
  const [isLiked, setIsLiked] = useState<boolean>();
  const { deleteComments } = useComment(post_id, userId);
  const { createReplyComments } = useReplyComment(commentId);
  const commentLikeCount = useLikeCommentCount(commentId);
  const { addNotification, deleteNotification } = useNotification(userId ?? "");

  // When the user click reply on the comment, the target user would be the author of the clicked comment, and it will be under the same category with reply comment
  const handleSubmitReply = async () => {
    const replyData = {
      content: replyContent,
      user_id: userId,
      target_user_id: user.user_id,
      comment_id: commentId,
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
    if (user.user_id !== userId) {
      addNotification({
        fromUserId: userId,
        targetUserId: [user.user_id],
        type: NotificationType.COMMENT_REPLY,
        resourceId: commentReplyId,
      });
    }
  };

  const handleDeleteComment = () => {
    // Remove the notification if user is not the author of the post
    if (userId !== authorId) {
      deleteNotification({
        fromUserId: userId,
        targetUserId: authorId,
        type: NotificationType.COMMENT,
        resourceId: commentId,
      });
    }

    // Delete the comment
    deleteComments(commentId, post_id, userId, toast);
  };

  const handleOpenReply = () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please sign in to reply",
        action: (
          <ToastAction
            altText="Sign in now"
            onClick={() => {
              window.history.replaceState(null, "", "/sign-in");
              window.location.reload();
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

  const handleViewReply = () => {
    if (replyComments && replyComments.length > 0) {
      setViewReplies((prev) => !prev);
    }
  };

  const handleLikeComment = async () => {
    // User not logged in
    if (!userId) {
      toast({
        title: "Error",
        description: "Please sign in to like",
        action: (
          <ToastAction
            altText="Sign in now"
            onClick={() => {
              window.history.replaceState(null, "", "/sign-in");
              window.location.reload();
            }}
          >
            Sign in
          </ToastAction>
        ),
      });
      return;
    }
    if (isLiked) {
      // Remove the notification from the target user
      if (userId !== user.user_id) {
        deleteNotification({
          fromUserId: userId,
          targetUserId: user.user_id,
          type: NotificationType.LIKE_COMMENT,
          resourceId: commentId,
        });
      }

      // Remove the like
      removeLikeComment(userId, commentId, setIsLiked, toast);
    } else {
      // Only send notification if the user who liked is not the author
      if (userId !== user.user_id) {
        addNotification({
          fromUserId: userId,
          targetUserId: [user.user_id],
          type: NotificationType.LIKE_COMMENT,
          resourceId: commentId,
        });
      }

      // Add the like
      addLikeComment(userId, commentId, setIsLiked, toast);
    }
  };

  function handleAuthorProfileNavigation(user_id: string): void {
    router.push(`/user/${user_id}`);
  }

  useEffect(() => {
    if (likedComment && likedComment.length > 0) {
      const userLiked = likedComment.find(
        (item) => item.Comment_comment_id === commentId
      )
        ? true
        : false;
      setIsLiked(userLiked);
    }
  }, [commentId, likedComment]);

  // Scroll user to the view replies block to improve user experience
  useEffect(() => {
    if (viewReplies) {
      viewRepliesRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [viewReplies]);

  // Scroll user into the specific comment if user came from notification
  useEffect(() => {
    const commentIdToScroll = searchParams.get("commentId");

    if (commentBoxRef.current && commentId === commentIdToScroll) {
      commentBoxRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [commentBoxRef, commentId, searchParams]);

  // Open the view replies block when user came from notification and want to view specific comment reply
  useEffect(() => {
    if (
      searchParams.get("commentReplyId") &&
      commentId === searchParams.get("commentId")
    ) {
      setViewReplies(true);
    }
  }, [commentId, searchParams]);

  return (
    <div className="flex flex-col ml-[7px]" ref={commentBoxRef}>
      <div className="font-bold">
        <Button
          variant="link"
          className="p-0 h-auto text-base leading-none font-bold"
          onClick={() => handleAuthorProfileNavigation(user.user_id)}
        >
          {user.name}
        </Button>
        {/* The comment is created by the logged in user */}
        {user?.user_id === userId && (
          <span className="ml-1 text-black opacity-70 font-normal">
            ( Self )
          </span>
        )}
        {/* The comment is created by the author */}
        {user?.user_id !== userId && user?.user_id === authorId && (
          <span className="ml-1 text-black opacity-70 font-normal">
            ( Author )
          </span>
        )}
      </div>
      <div>{content}</div>
      <span className="mt-[5px] text-sm text-black opacity-70 font-normal">
        {dateDifferent}
      </span>
      {/* Like and reply button */}
      <div className="flex space-x-3 mt-[-5px]">
        <Button
          variant="link"
          className={cn("px-0", isLiked ? "text-red-500" : "")}
          onClick={handleLikeComment}
        >
          {isLiked ? "Dislike" : "Like"}
          {"  " + (commentLikeCount ?? 0)}
        </Button>
        <Button variant="link" className="px-0" onClick={handleOpenReply}>
          {openReply ? "Cancel reply" : "Reply"}
        </Button>
        {/* Delete comment button and edit button */}
        {userId === user?.user_id && (
          <>
            <Button
              variant="link"
              className="px-0"
              onClick={handleDeleteComment}
            >
              Delete
            </Button>
            <Button variant="link" className="px-0">
              <EditCommentDialog
                commentId={commentId}
                content={content}
                userId={userId}
                postId={post_id}
              />
            </Button>
          </>
        )}
      </div>
      {/* View reply bar */}
      <button
        className="inline-flex items-center justify-center w-full mb-[15px] relative mt-[15px]"
        onClick={handleViewReply}
      >
        <hr className="w-64 h-px bg-gray-200 border-0 dark:bg-gray-700" />
        <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">
          {isLoading
            ? "Loading..."
            : replyComments && replyComments.length > 0
            ? viewReplies
              ? "Hide replies"
              : "View replies (" + replyComments.length.toString() + ")"
            : "No replies"}
        </span>
      </button>
      {/* Reply textarea for user to enter */}
      <div className="ml-8 mb-5">
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
        {/* All the comments' replies */}

        <div
          className={cn(
            "min-h-[150px] max-h-[350px] overflow-y-scroll",
            !viewReplies && "hidden"
          )}
          ref={viewRepliesRef}
        >
          {replyComments &&
            replyComments.length > 0 &&
            viewReplies &&
            replyComments.map((c, idx) => {
              return (
                <EachCommentReplyPage
                  comment_id={commentId}
                  comment_reply_id={c.comment_reply_id}
                  user={c.User}
                  target_user={c.Target_user}
                  content={c.content}
                  key={c.comment_reply_id}
                  authorId={authorId}
                  dateDifferent={c.dateDifferent}
                  setViewReplies={setViewReplies}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
