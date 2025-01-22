import {
  UpdateReplyCommentType,
  UpdateReplyCommentSchema,
} from "@/app/api/comment-reply/update-comment-reply/route";
import { Button } from "@/components/ui/button";
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
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useStore } from "zustand";
import { replyCommentStore } from "./_store/replyCommentStore";

export default function EditCommentReplyDialog({
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
