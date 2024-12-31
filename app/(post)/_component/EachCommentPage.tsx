import { UserType } from "./GetPost";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import useReplyComment from "./_custom_hook/useReplyComment";
import EachCommentReplyPage from "./EachCommentReplyPage";
import { cn } from "@/lib/utils";
import useLikedComment from "./_custom_hook/useLikedCommentHook";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import useComment from "./_custom_hook/useCommentHook";
import { DialogHeader } from "@/components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useStore } from "zustand";
import { commentStore, CommentType } from "./_store/commentStore";
import { CommentSchema } from "@/app/api/create-comment/route";
import { Form } from "@/components/ui/form";

/*
 * The page when the user click "Comment" button on the post
 *
 * */

function EditCommentDialog({
  commentId,
  content,
  userId,
  postId,
}: {
  commentId: string;
  content: string;
  userId: string;
  postId: string;
}) {
  const { toast } = useToast();
  const updateComments = useStore(
    commentStore,
    (state) => state.actions.updateComments
  );
  const form = useForm<CommentType>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content,
      user_id: userId ?? "",
      post_id: postId,
    },
  });

  const onSubmit = (formData: CommentType) => {
    updateComments(commentId, formData, toast);
  };

  const onInvalid = () => {
    console.log("Invalid");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="hover:opacity-75 flex gap-3 items-center transition-opacity duration-150 justify-left">
          <button>Edit</button>
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editing comment</DialogTitle>
          <DialogDescription>
            Make changes to your comment here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 justify-items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onInvalid)}
              className="flex flex-col min-w-[25%] w-[85%] max-w-[700px] space-y-4"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[150px] max-h-[250px] h-[50vh]"
                        placeholder="Enter content..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogClose className="ml-auto">
                <Button type="submit">Save changes</Button>
              </DialogClose>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function EachCommentPage({
  comment_id,
  user,
  content,
  post_id,
  authorId,
  dateDifferent,
}: {
  comment_id: string;
  user: UserType;
  content: string;
  post_id: string;
  authorId: string;
  dateDifferent: string;
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
  const { deleteComments } = useComment(post_id, userId);
  const { createReplyComments } = useReplyComment(comment_id);

  // When the user click reply on the comment, the target user would be the author of the clicked comment, and it will be under the same category with reply comment
  const handleSubmitReply = () => {
    const replyData = {
      content: replyContent,
      user_id: userId,
      target_user_id: user.user_id,
      comment_id: comment_id,
    };
    createReplyComments(
      replyData,
      setViewReplies,
      setReplyContent,
      setOpenReply,
      toast
    );
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
        (item) => item.Comment_comment_id === comment_id
      )
        ? true
        : false;
      setIsLiked(userLiked);
    }

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

    const initializeLikeCount = async () => {
      setTotalLike(await fetchTotalLike());
    };

    initializeLikeCount();
  }, [comment_id, likedComment]);

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
      <span className="mt-[5px] text-sm text-black opacity-70 font-normal">
        {dateDifferent}
      </span>
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
        {/* Delete comment button and edit button */}
        {userId === user?.user_id && (
          <>
            <Button
              variant="link"
              className="px-0"
              onClick={() => deleteComments(comment_id, post_id, userId, toast)}
            >
              Delete
            </Button>
            <Button variant="link" className="px-0">
              <EditCommentDialog
                commentId={comment_id}
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
