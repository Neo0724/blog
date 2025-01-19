import React from "react";
import { UserType } from "./GetPost";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import useReplyComment from "./_custom_hook/useReplyComment";
import useLikedReplyComment from "./_custom_hook/useLikedReplyCommentHook";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  UpdateReplyCommentSchema,
  UpdateReplyCommentType,
} from "@/app/api/update-reply-comment/route";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { useStore } from "zustand";
import { replyCommentStore } from "./_store/replyCommentStore";
import { useLikedReplyCommentCount } from "./_custom_hook/useLikedReplyCommentCountHook";

function EditCommentDialog({
  content,
  commentReplyId,
  commentId,
}: {
  content: string;
  commentReplyId: string;
  commentId: string;
}) {
  const { toast } = useToast();

  const updateReplyComment = useStore(
    replyCommentStore,
    (state) => state.actions.updateReplyComment
  );

  const form = useForm<UpdateReplyCommentType>({
    resolver: zodResolver(UpdateReplyCommentSchema),
    defaultValues: {
      content,
      comment_reply_id: commentReplyId,
      comment_id: commentId,
    },
  });

  const onSubmit = (formData: UpdateReplyCommentType) => {
    updateReplyComment(formData, toast);
  };

  const onInvalid = () => {
    console.log("Invalid");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="hover:opacity-75 flex gap-3 items-center transition-opacity duration-150 justify-left">
          Edit
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
  const [userId, _] = useLocalStorage("test-userId", "");
  const [openReply, setOpenReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const { likedReply, addLikeCommentReply, removeLikeCommentReply } =
    useLikedReplyComment(userId, comment_id);
  const [isLiked, setIsLiked] = useState<boolean>();
  const replyCommentLikeCount = useLikedReplyCommentCount(comment_reply_id);
  const { createReplyComments, deleteReplyComments } =
    useReplyComment(comment_id);

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

  const handleDeleteCommentReply = () => {
    deleteReplyComments(comment_reply_id, toast, comment_id);
  };

  const handleLike = async () => {
    // User not logged in
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

      return;
    } else {
      if (isLiked) {
        removeLikeCommentReply(userId, comment_reply_id, setIsLiked, toast);
      } else {
        addLikeCommentReply(userId, comment_reply_id, setIsLiked, toast);
      }
    }
  };

  function handleAuthorProfileNavigation(user_id: string): void {
    router.push(`/user/${user_id}`);
  }

  useEffect(() => {
    if (likedReply && likedReply.length > 0) {
      const userLiked = likedReply.find(
        (item) => item.CommentReply_comment_reply_id === comment_reply_id
      )
        ? true
        : false;
      setIsLiked(userLiked);
    }
  }, [comment_reply_id, likedReply]);

  return (
    <div className="ml-[3px]">
      <hr className="h-px mb-[5px] bg-gray-200 border-0 dark:bg-gray-700" />
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
          <span className="ml-1 text-black opacity-50 font-normal">
            ( Self )
          </span>
        )}
        {/* The comment is created by the author */}
        {user?.user_id !== userId && user?.user_id === authorId && (
          <span className="ml-1 text-black opacity-50 font-normal">
            ( Author )
          </span>
        )}
      </div>
      <div>
        <span className="text-blue-500 font-bold">@{target_user.name} </span>
        {content}
      </div>
      <span className="text-sm text-black opacity-70 font-normal">
        {dateDifferent}
      </span>
      <div className="flex space-x-3 mt-[-5px] items-center">
        {/* Like and reply button */}
        <Button
          variant="link"
          className={cn("px-0", isLiked ? "text-red-500" : "")}
          onClick={handleLike}
        >
          {isLiked ? "Dislike" : "Like"}
          {"  " + (replyCommentLikeCount ?? 0)}
        </Button>
        <Button variant="link" className="px-0" onClick={handleOpenReply}>
          {openReply ? "Cancel reply" : "Reply"}
        </Button>
        {/* Delete comment reply button */}
        {userId === user?.user_id && (
          <>
            <Button
              variant="link"
              className="px-0"
              onClick={handleDeleteCommentReply}
            >
              Delete
            </Button>
            <Button variant="link" className="px-0">
              <EditCommentDialog
                content={content}
                commentId={comment_id}
                commentReplyId={comment_reply_id}
              />
            </Button>
          </>
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
