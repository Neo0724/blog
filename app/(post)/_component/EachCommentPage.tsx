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
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

/*
 * The page when the user click "Comment" button on the post
 *
 * */

export default function EachCommentPage({
  comment_id,
  user,
  content,
  post_id,
  authorId,
  handleDeleteComment,
}: {
  comment_id: string;
  user: UserType;
  content: string;
  post_id: string;
  authorId: string;
  handleDeleteComment: (comment_id: string) => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [userId, _] = useLocalStorage("test-userId", "");
  const [openReply, setOpenReply] = useState(false);
  const [viewReplies, setViewReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const { replyComments, isLoading } = useReplyComment(comment_id);
  const { likedComment } = useLikedComment(userId, post_id);
  const [isLiked, setIsLiked] = useState<boolean>();
  const [totalLike, setTotalLike] = useState(0);
  const { mutate } = useSWRConfig();

  const fetchTotalLike = async () => {
    try {
      const response = await axios.get("/api/count-like-comment", {
        params: {
          comment_id: comment_id,
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
        setViewReplies(true);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occured when replying. Please try again later",
      });
    } finally {
      setReplyContent("");
      setOpenReply(false);
      console.log(replyComments);
    }
  };

  const handleViewReply = () => {
    if (replyComments && replyComments.length > 0) {
      setViewReplies((prev) => !prev);
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
          const res = await axios.delete("/api/delete-like-comment", {
            params: {
              user_id: userId,
              comment_id: comment_id,
            },
          });

          if (res.status === 200) {
            console.log("Deleted successfully");
            setIsLiked((prev) => !prev);
            setTotalLike((prev) => prev - 1);
          }
        } catch (error) {
          console.error(error);
          toast({
            title: "Error",
            description:
              "An error occured when removing like from the comment. Please try again later",
          });
        }
      } else {
        try {
          const res = await axios.post("/api/add-like-comment", {
            user_id: userId,
            comment_id: comment_id,
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

  const handleDeleteCommentReply = async (comment_reply_id: string) => {
    try {
      const res = await axios.delete("/api/delete-reply-comment", {
        params: {
          comment_reply_id: comment_reply_id,
        },
      });

      if (res.status === 200) {
        mutate(["/api/get-reply-comment", comment_id]);
      } else {
        toast({
          title: "Error",
          description: "Unexpected error occured. Please try deleting it later",
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Unexpected error occured. Please try deleting it later",
      });
    }
  };

  useEffect(() => {
    if (likedComment && likedComment.length > 0) {
      const userLiked = likedComment.find(
        (item) => item.Comment_comment_id === comment_id,
      )
        ? true
        : false;
      setIsLiked(userLiked);
    }

    const initializeLikeCount = async () => {
      setTotalLike(await fetchTotalLike());
    };

    initializeLikeCount();
  }, [likedComment]);

  return (
    <div className="flex flex-col ml-[7px]">
      <h2 className="font-bold">
        {user?.name}
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
      </h2>
      <div>{content}</div>
      {/* Like and reply button */}
      <div className="flex space-x-3 mt-[-5px]">
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
        {/* Delete comment button */}
        {userId === user?.user_id && (
          <Button
            variant="link"
            className="px-0"
            onClick={() => handleDeleteComment(comment_id)}
          >
            Delete
          </Button>
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
      <div className="ml-8">
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
            "min-h-[150px] max-h-[350px] h-[80vh] overflow-y-scroll",
            !viewReplies && "hidden",
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
                  key={c.comment_reply_id}
                  authorId={authorId}
                  handleDeleteCommentReply={handleDeleteCommentReply}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
