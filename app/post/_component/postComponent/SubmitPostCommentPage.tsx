"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { NotificationType } from "../Enum";
import { ToastAction } from "@radix-ui/react-toast";
import { useLocalStorage } from "@uidotdev/usehooks";
import useComment, {
  CommentSchema,
  CommentType,
} from "../custom_hook/useCommentHook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useNotification from "../custom_hook/useNotificationHook";
import { RefObject } from "react";

type SubmitPostCommentPageProps = {
  authorId: string;
  postId: string;
  commentBoxRef: RefObject<HTMLDivElement>;
};

export default function SubmitPostCommentPage({
  authorId,
  postId,
  commentBoxRef,
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

  const submitComment = async (formData: CommentType) => {
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
      const commentId = await createComment(formData, form);

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

      commentBoxRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
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
                  className="w-[90%] mx-auto m-0 border-[rgb(58,59,60)] bg-[rgb(36,37,38)]"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          className="ml-auto flex gap-2 min-w-fit rounded-xl bg-[rgb(58,59,60)]"
          type="submit"
          variant="ghost"
        >
          Comment
        </Button>
      </form>
    </Form>
  );
}
