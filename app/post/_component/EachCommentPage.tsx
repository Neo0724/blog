import { UserType } from "./postComponent/RenderPost";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useNotification from "./custom_hook/useNotificationHook";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import useReplyComment, {
  COMMENT_REPLY_PAGE_SIZE,
} from "./custom_hook/useReplyCommentHook";
import EachCommentReplyPage from "./EachCommentReplyPage";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter, useSearchParams } from "next/navigation";
import useComment, { GetBackCommentType } from "./custom_hook/useCommentHook";
import { NotificationType } from "./Enum";
import EditCommentDialog from "./EditCommentDialog";
import LikeCommentButton from "./commentComponent/LikeCommentButton";
import useElementInView from "./custom_hook/useElementInViewHook";

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
  index,
  totalCommentNumber,
  setCommentSize,
}: {
  commentId: string;
  user: UserType;
  content: string;
  post_id: string;
  authorId: string;
  dateDifferent: string;
  index: number;
  totalCommentNumber: number;
  setCommentSize: (
    size: number | ((_size: number) => number)
  ) => Promise<GetBackCommentType[][] | undefined>;
}) {
  // TODO Scroll user into the specific comment id viewport if user came from notification. Use search params to get the comment id
  const router = useRouter();
  const searchParams = useSearchParams();
  const commentBoxRef = useRef<HTMLDivElement | null>(null);
  const viewRepliesRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const [loggedInUserId] = useLocalStorage("userId", "");
  const [openUserReplyBox, setOpenUserReplyBox] = useState(false);
  const [viewReplies, setViewReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const {
    replyComments,
    isLoading,
    createReplyComments,
    commentReplySize,
    setCommentReplySize,
  } = useReplyComment(commentId, loggedInUserId);
  const { comments, mutate, deleteComments } = useComment(
    post_id,
    loggedInUserId
  );
  const { addNotification, deleteNotification } = useNotification(
    loggedInUserId ?? ""
  );

  const { isVisible } = useElementInView(commentBoxRef);
  // Avoid duplicate fetching
  const doneUpdatingIndex = useRef<Set<number>>(new Set());

  // When the user click reply on the comment, the target user would be the author of the clicked comment, and it will be under the same category with reply comment
  const handleSubmitReply = async () => {
    const replyData = {
      content: replyContent,
      user_id: loggedInUserId,
      target_user_id: user.user_id,
      comment_id: commentId,
    };

    // Send the notification if the user is replying to other instead of himself
    if (user.user_id !== loggedInUserId) {
      const newNotification = {
        fromUserId: loggedInUserId,
        targetUserId: [user.user_id],
        type: NotificationType.COMMENT_REPLY,
      };
      createReplyComments(
        replyData,
        setViewReplies,
        setReplyContent,
        setOpenUserReplyBox,
        toast,
        addNotification,
        newNotification
      );
    } else {
      createReplyComments(
        replyData,
        setViewReplies,
        setReplyContent,
        setOpenUserReplyBox,
        toast
      );
    }
  };

  const handleDeleteComment = () => {
    // Remove the notification if user is not the author of the post
    if (loggedInUserId !== authorId) {
      const notificationToDelete = {
        fromUserId: loggedInUserId,
        targetUserId: authorId,
        type: NotificationType.COMMENT,
        resourceId: commentId,
      };

      // Delete the comment
      mutate(
        deleteComments(
          commentId,
          toast,
          deleteNotification,
          notificationToDelete
        ),
        {
          optimisticData: comments?.map((page) =>
            page.filter((comment) => comment.comment_id !== commentId)
          ),
          populateCache: true,
          revalidate: false,
          rollbackOnError: true,
        }
      );
    } else {
      // Delete the comment
      mutate(deleteComments(commentId, toast), {
        optimisticData: comments?.map((page) =>
          page.filter((comment) => comment.comment_id !== commentId)
        ),
        populateCache: true,
        revalidate: false,
        rollbackOnError: true,
      });
    }
  };

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
      setOpenUserReplyBox((prev) => !prev);
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

  function handleAuthorProfileNavigation(user_id: string): void {
    router.push(`/user/${user_id}`);
  }

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

  // Trigger load more comment
  useEffect(() => {
    const indexToUpdate = Math.floor((totalCommentNumber ?? 1) / 2);
    if (
      indexToUpdate === index &&
      isVisible &&
      !doneUpdatingIndex.current.has(indexToUpdate)
    ) {
      console.log(indexToUpdate);
      setCommentSize && setCommentSize((prev) => prev + 1);
      doneUpdatingIndex.current.add(indexToUpdate);
    }
  }, [index, isVisible, setCommentSize, totalCommentNumber]);

  const isLoadingMore =
    isLoading ||
    (commentReplySize > 0 &&
      replyComments &&
      typeof replyComments[commentReplySize - 1] === "undefined");

  const isEmpty = replyComments?.[0]?.length === 0;

  const isReachingEnd =
    isEmpty ||
    (replyComments &&
      replyComments[replyComments.length - 1]?.length <
        COMMENT_REPLY_PAGE_SIZE);

  const totalCommentReplyNumber = replyComments
    ? replyComments.flat().length
    : 0;

  let accumulateCommentReplyIndex = 0;

  return (
    <div className="flex flex-col ml-[7px]" ref={commentBoxRef}>
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
          <span className="ml-1 text-white opacity-70 font-normal">
            ( Self )
          </span>
        )}
        {/* The comment is created by the author */}
        {user?.user_id !== loggedInUserId && user?.user_id === authorId && (
          <span className="ml-1 text-white opacity-70 font-normal">
            ( Author )
          </span>
        )}
      </div>
      <div>{content}</div>
      <span className="mt-[5px] text-sm text-white opacity-70 font-normal">
        {dateDifferent}
      </span>
      {/* Like and reply comment button */}
      <div className="flex space-x-3 mt-[-5px]">
        {/* Like comment button */}
        <LikeCommentButton
          className="px-0 text-white"
          commentId={commentId}
          commentOwnerId={user.user_id}
          postId={post_id}
          variant="link"
          key={commentId}
        />
        <Button
          variant="link"
          className="px-0 text-white"
          onClick={handleOpenReply}
        >
          {openUserReplyBox ? "Cancel reply" : "Reply"}
        </Button>
        {/* Delete comment button and edit button */}
        {loggedInUserId === user?.user_id && (
          <>
            <Button
              variant="link"
              className="px-0 text-white"
              onClick={handleDeleteComment}
            >
              Delete
            </Button>
            <Button variant="link" className="px-0 text-white">
              <EditCommentDialog
                commentId={commentId}
                content={content}
                userId={loggedInUserId}
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
        disabled={totalCommentReplyNumber <= 0}
      >
        <hr className="w-64 h-px bg-gray-200 border-0 dark:bg-gray-700" />
        <span className="absolute px-3 font-medium -translate-x-1/2 left-1/2  bg-[rgb(36,37,38)] text-white">
          {isLoading
            ? "Loading..."
            : replyComments && totalCommentReplyNumber > 0
            ? viewReplies
              ? "Hide replies"
              : `View replies (${totalCommentReplyNumber})`
            : "No replies"}
        </span>
      </button>
      {/* Reply textarea for user to enter */}
      <div className="ml-8 mb-5 ">
        {openUserReplyBox && (
          <div className="flex flex-col border-solid border-2 p-5 pt-2 rounded-lg gap-2 mb-3 border-[rgb(58,59,60)]">
            <span className="opacity-70">Replying to {user.name} :</span>
            <div className="flex gap-3 justify-center items-center">
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
            replyComments.map((page) =>
              page.map((c) => {
                accumulateCommentReplyIndex += 1;
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
                    index={accumulateCommentReplyIndex - 1}
                    setCommentReplySize={setCommentReplySize}
                    totalCommentReplyNumber={totalCommentReplyNumber}
                  />
                );
              })
            )}
          {!isLoading && isEmpty && <div>No replies yet...</div>}
          {(isLoading || isLoadingMore) &&
            !isReachingEnd &&
            "Loading replies ..."}
          {isReachingEnd && !isEmpty && (
            <div className="pb-7">You have reached the end.</div>
          )}
        </div>
      </div>
    </div>
  );
}
