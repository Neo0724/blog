import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentSchema } from "@/app/api/create-comment/route";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalStorage } from "@uidotdev/usehooks";
import axios from "axios";
import useComment, { GetBackCommentType } from "./useCommentHook";
import EachCommentPage from "./EachCommentPage";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ToastAction } from "@/components/ui/toast";

type CommentType = z.infer<typeof CommentSchema>;

export default function CommentPage({ postId }: { postId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [userId, _] = useLocalStorage<string>("test-userId");

  const { comments, setComments } = useComment(postId);

  const form = useForm<CommentType>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: "",
      user_id: userId ?? "",
      post_id: postId,
    },
  });

  const onSubmit = async (data: CommentType) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please sign in to comment",
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
      try {
        const response = await axios.post("/api/create-comment", data);

        if (response.status === 200) {
          const newComment = response.data;

          setComments((prev: GetBackCommentType[]) => {
            return [...prev, newComment];
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <Dialog>
        <DialogTrigger>Comments</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <div className="overflow-y-scroll border-solid border-2 border-black-500 p-3 rounded-lg h-[60vh]">
              {comments &&
                comments.length > 0 &&
                comments.map((c) => {
                  return (
                    <EachCommentPage
                      key={c.comment_id}
                      comment_id={c.comment_id}
                      user={c.User}
                      content={c.content}
                      post_id={postId}
                    />
                  );
                })}
              {comments.length === 0 && <div>No comments yet...</div>}
            </div>
            <DialogDescription>
              <Form {...form}>
                <form
                  className="flex items-center mt-3"
                  onSubmit={form.handleSubmit(onSubmit)}
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
                            className="w-[90%] mx-auto"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button className="ml-auto" type="submit">
                    Submit
                  </Button>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
