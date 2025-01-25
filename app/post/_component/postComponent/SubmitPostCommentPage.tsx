"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { NotificationType } from "../Enum";
import { ToastAction } from "@radix-ui/react-toast";
import { useLocalStorage } from "@uidotdev/usehooks";
import { CommentType } from "../store/commentStore";
import useComment from "../custom_hook/useCommentHook";
import { CommentSchema } from "@/app/api/comment/create-comment/route";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useNotification from "../custom_hook/useNotificationHook";

type SubmitPostCommentPageProps = {
  authorId: string;
  postId: string;
};

export default function SubmitPostCommentPage({
  authorId,
  postId,
}: SubmitPostCommentPageProps) {
  const [userId, _] = useLocalStorage<string | null>("test-userId", null);
  const { createComment } = useComment(postId, userId);
  const { addNotification } = useNotification(userId ?? "");

  const form = useForm<CommentType>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: "",
      user_id: userId ?? "",
      post_id: postId,
    },
  });

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

  return (
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
  );
}
