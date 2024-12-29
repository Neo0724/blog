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
import { BiLike } from "react-icons/bi";
import { IoIosHeartEmpty } from "react-icons/io";
import { useSWRConfig } from "swr";
import { BiComment } from "react-icons/bi";

type CommentType = z.infer<typeof CommentSchema>;

export default function CommentPage({
  postId,
  title,
  content,
  author,
  authorId,
  handleLike,
  isLiked,
  totalLike,
  handleFavourite,
  isFavourited,
  dateDifferent,
}: {
  postId: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  handleLike: () => void;
  isLiked: boolean;
  totalLike: number;
  handleFavourite: () => void;
  isFavourited: boolean;
  dateDifferent: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [userId, _] = useLocalStorage<string>("test-userId");
  const { mutate } = useSWRConfig();
  const { comments, isLoading } = useComment(postId, userId ?? null);

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
          mutate(["/api/get-comment", postId, userId]);
          form.reset({ ...data, content: "" });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDeleteComment = async (comment_id: string) => {
    try {
      const res = await axios.delete("/api/delete-comment", {
        params: {
          comment_id: comment_id,
        },
      });

      if (res.status === 200) {
        mutate(["/api/get-comment", postId, userId]);
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
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex gap-2 flex-1 min-w-fit">
            <BiComment />
            Comments {comments ? comments.length.toString() : ""}{" "}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{author}'s post</DialogTitle>
            <div className="flex flex-col">
              <div className="flex">
                <span>{title}</span>
              </div>
              <span>{content}</span>
              <span className="text-sm text-black opacity-70 font-normal">
                {dateDifferent}
              </span>
            </div>
            <div className="flex gap-5">
              {/* Like button  */}
              <Button className="flex gap-2 flex-1" onClick={handleLike}>
                <BiLike />
                {isLiked ? "Dislike" : "Like"}
                {"  " + totalLike}
              </Button>
              {/* Favourite button  */}

              <Button className="flex gap-2 flex-1" onClick={handleFavourite}>
                <IoIosHeartEmpty />
                {isFavourited ? "Remove from favourite" : "Add to favourite"}
              </Button>
            </div>
            <div className="overflow-y-scroll border-solid border-2 border-black-500 p-3 rounded-lg h-[60vh]">
              {isLoading && <div>Comments are loading...</div>}
              {!isLoading &&
                comments &&
                comments.length > 0 &&
                comments.map((c) => {
                  return (
                    <EachCommentPage
                      key={c.comment_id}
                      comment_id={c.comment_id}
                      user={c.User}
                      content={c.content}
                      post_id={postId}
                      authorId={authorId}
                      dateDifferent={c.dateDifferent}
                      handleDeleteComment={handleDeleteComment}
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
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
