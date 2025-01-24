import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { BiDislike } from "react-icons/bi";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { MdOutlineHeartBroken } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentSchema } from "@/app/api/comment/create-comment/route";
import useNotification from "./_custom_hook/useNotificationHook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalStorage } from "@uidotdev/usehooks";
import useComment from "./_custom_hook/useCommentHook";
import EachCommentPage from "./EachCommentPage";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastAction } from "@/components/ui/toast";
import { BiLike } from "react-icons/bi";
import { IoIosHeartEmpty } from "react-icons/io";
import { BiComment } from "react-icons/bi";
import PostOptionComponent from "./PostOptionComponent";
import { commentStore, CommentType } from "./_store/commentStore";
import { useStore } from "zustand";
import { useLikedPostCount } from "./_custom_hook/useLikedPostCountHook";
import { useFollowing } from "./_custom_hook/useFollowingHook";
import { getReadableDate } from "@/app/_util/getReadableDate";
import { NotificationType } from "./Enum";
import { useEffect, useState } from "react";

// The dialog when the user clicked on the "Comment" button, each comments in the dialog will be shown
// in the EachCommentPage component

export default function CommentPage({
  postId,
  title,
  content,
  author,
  authorId,
  handleLike,
  isLiked,
  handleFavourite,
  isFavourited,
  createdAt,
}: {
  postId: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  handleLike: () => void;
  isLiked: boolean;
  handleFavourite: () => void;
  isFavourited: boolean;
  dateDifferent: string;
  createdAt: string;
}) {
  const router = useRouter();
  const { toast } = useToast();

  // Use to search for specific comment id if user came from notification
  const searchParams = useSearchParams();
  // Has to open the dialog if user is coming from notification and wants to view specific comment
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [userId, _] = useLocalStorage<string>("test-userId");
  const { comments, isLoading } = useComment(postId, userId ?? null);
  const { addNotification, deleteNotification } = useNotification(userId ?? "");
  const postLikeCount = useLikedPostCount(postId);
  const createComment = useStore(
    commentStore,
    (state) => state.actions.createComment
  );
  const { allFollowing, addFollowing, removeFollowing } = useFollowing(userId);
  // Check if user is following any of the author of each post
  const isFollowing = allFollowing?.find(
    (following) => following.UserFollowing.user_id === authorId
  );

  const form = useForm<CommentType>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: "",
      user_id: userId ?? "",
      post_id: postId,
    },
  });

  const handleFollow = () => {
    // User is not logged in
    if (!userId) {
      toast({
        title: "Error",
        description: "Please sign in to like",
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
      return;
    }
    // Send notification to the author that someone started following him or her
    addNotification({
      fromUserId: userId,
      targetUserId: [authorId],
      type: NotificationType.FOLLOW,
      resourceId: userId,
    });

    // Add to following
    addFollowing(userId, authorId, toast);
  };

  const handleUnfollow = () => {
    if (userId) {
      // Delete the follow notification
      deleteNotification({
        fromUserId: userId,
        targetUserId: authorId,
        type: NotificationType.FOLLOW,
        resourceId: userId,
      });

      // Remove from the following
      removeFollowing(userId, authorId, toast);
    }
  };

  const submitComment = async (data: CommentType) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please sign in to comment",
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
      // Add the comment
      const commentId = await createComment(data, form);

      // Send notification to the author of the post
      // Only send notification if the user who comments is not the author
      if (userId !== authorId) {
        addNotification({
          fromUserId: userId,
          targetUserId: [authorId],
          type: NotificationType.COMMENT,
          resourceId: commentId,
        });
      }
    }
  };

  function handleAuthorProfileNavigation(user_id: string): void {
    router.push(`/user/${user_id}`);
  }

  // Set dialog to open if user came from notification to view specific comment
  useEffect(() => {
    if (searchParams.get("commentId")) {
      setDialogOpen(true);
    } else {
      setDialogOpen(false);
    }
  }, [searchParams.get("commentId")]);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="flex gap-2 min-w-fit rounded-xl bg-gray-200"
          >
            <BiComment />
            Comments {comments ? comments.length.toString() : ""}{" "}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <PostOptionComponent
            userId={userId}
            postId={postId}
            authorId={authorId}
            title={title}
            content={content}
            styleProperty={"top-[10px] right-[40px]"}
          />
          <DialogHeader>
            <DialogTitle>
              <div className="flex flex-row gap-2">
                <Button
                  variant="link"
                  className="p-0 h-auto text-base leading-none font-bold"
                  onClick={() => handleAuthorProfileNavigation(authorId)}
                >
                  {author}
                </Button>
                {/* Current user is not the author and has not follow the author */}
                {userId !== authorId && !isFollowing && (
                  <>
                    <span className="text-black opacity-80">&#x2022;</span>
                    <Button
                      variant="link"
                      onClick={handleFollow}
                      className="p-0 h-auto text-base leading-none  text-blue-400"
                    >
                      Follow
                    </Button>
                  </>
                )}
                {/* Current user is not the author and has already follwed the author */}
                {userId !== authorId && isFollowing && (
                  <>
                    <span className="text-black opacity-80">&#x2022;</span>
                    <Button
                      variant="link"
                      onClick={handleUnfollow}
                      className="p-0 h-auto text-base leading-none text-blue-400"
                    >
                      Unfollow
                    </Button>
                  </>
                )}
              </div>
            </DialogTitle>
            <div className="flex flex-col">
              <div className="flex mb-3 font-bold">
                <span>{title}</span>
              </div>
              <span className="overflow-y-scroll max-h-[125px]">{content}</span>
              <span className="text-sm text-black opacity-70 font-normal">
                {getReadableDate(createdAt)}
              </span>
            </div>
            <div className="flex gap-5 mb-5">
              {/* Like button  */}
              <Button
                variant="ghost"
                className={cn(
                  "flex gap-2 min-w-fit rounded-xl bg-gray-200",
                  isLiked
                    ? "hover:text-red-800 active:text-red-800"
                    : "hover:text-blue-600 active:text-blue-600"
                )}
                onClick={handleLike}
              >
                {isLiked ? <BiDislike /> : <BiLike />}
                {isLiked ? "Dislike" : "Like"}
                {"  " + (postLikeCount ?? 0)}
              </Button>
              {/* Favourite button  */}
              <Button
                variant="ghost"
                className={cn(
                  "flex gap-2 min-w-fit rounded-xl bg-gray-200",
                  isFavourited
                    ? "hover:text-red-800 active:text-red-800"
                    : "hover:text-blue-600 active:text-blue-600"
                )}
                onClick={handleFavourite}
              >
                {isFavourited ? <MdOutlineHeartBroken /> : <IoIosHeartEmpty />}
                {isFavourited ? "Unfavourite" : "Favourite"}
              </Button>
            </div>
            <div className="overflow-y-scroll border-solid border-2 border-black-500 p-3 rounded-lg h-[50svh]">
              {isLoading && <div>Comments are loading...</div>}
              {!isLoading &&
                comments &&
                comments.length > 0 &&
                comments.map((c) => {
                  return (
                    <EachCommentPage
                      key={c.comment_id}
                      commentId={c.comment_id}
                      user={c.User}
                      content={c.content}
                      post_id={postId}
                      authorId={authorId}
                      dateDifferent={c.dateDifferent}
                    />
                  );
                })}
              {!isLoading && comments?.length === 0 && (
                <div>No comments yet...</div>
              )}
            </div>
            <Form {...form}>
              <form
                className="flex items-center mt-3"
                onSubmit={form.handleSubmit(submitComment)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Textarea
                          placeholder="Write a comment ......"
                          {...field}
                          className="w-[90%] mx-auto m-0"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  className="ml-auto flex gap-2 min-w-fit rounded-xl bg-gray-200"
                  type="submit"
                  variant="ghost"
                >
                  Comment
                </Button>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
