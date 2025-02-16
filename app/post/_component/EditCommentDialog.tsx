import { CommentSchema } from "@/app/api/comment/create-comment/route";
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
import { commentStore, CommentType } from "./store/commentStore";
import useComment from "./custom_hook/useCommentHook";

export default function EditCommentDialog({
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

  const { comments, updateComments, mutate } = useComment(postId, userId);

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
    mutate(updateComments(commentId, formData, toast), {
      optimisticData: comments?.map((comment) => {
        if (comment.comment_id === commentId) {
          return {
            ...comment,
            content: formData.content,
          };
        }
        return comment;
      }),
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    });
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
                  className="bg-[rgb(58,59,60)]"
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
