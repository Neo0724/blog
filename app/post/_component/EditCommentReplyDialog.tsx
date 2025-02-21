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
import useReplyComment from "./custom_hook/useReplyCommentHook";
import { useLocalStorage } from "@uidotdev/usehooks";

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
  const [loggedInUserId, _] = useLocalStorage<string>("test-userId", "");

  const { updateReplyComment, replyComments, mutateReplyComment } =
    useReplyComment(commentId, loggedInUserId);

  const form = useForm<UpdateReplyCommentType>({
    resolver: zodResolver(UpdateReplyCommentSchema),
    defaultValues: {
      content,
      comment_reply_id: commentReplyId,
      comment_id: commentId,
    },
  });

  const onSubmit = (formData: UpdateReplyCommentType) => {
    mutateReplyComment(updateReplyComment(formData, toast), {
      optimisticData: replyComments?.map((replyComment) => {
        if (replyComment.comment_reply_id === commentReplyId) {
          return { ...replyComment, content: formData.content };
        }

        return replyComment;
      }),
      populateCache: true,
      revalidate: false,
      rollbackOnError: true,
    });
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
      <DialogContent className="sm:max-w-[425px] bg-[rgb(36,37,38)] text-white border-[rgb(58,59,60)]">
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
                        className="min-h-[150px] max-h-[250px] h-[50vh] bg-[rgb(58,59,60)] border-[rgb(58,59,60)]"
                        placeholder="Enter content..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogClose className="ml-auto">
                <Button
                  type="submit"
                  variant="ghost"
                  className="text-white bg-[rgb(58,59,60)]"
                >
                  Save changes
                </Button>
              </DialogClose>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
