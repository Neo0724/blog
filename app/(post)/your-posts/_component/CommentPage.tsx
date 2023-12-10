import React, { Dispatch, SetStateAction } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GetBackCommentType } from "./useCommentHook";

export default function CommentPage({
  form,
  handleSubmit,
  postId,
  comment,
  handleSetcomment,
}: {
  form: any;
  handleSubmit: () => void;
  postId: string;
  comment: GetBackCommentType[];
  handleSetcomment: () => void;
}) {

  const correctComment = comment?.filter(item => {
    return item.post_id === postId
  })

  return (
    <>
      <Dialog>
        <DialogTrigger>Comments</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>
              <Form {...form}>
                <form className="flex items-center mt-3">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Textarea
                            placeholder="Type something..."
                            {...field}
                            className="w-[90%] mx-auto"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button className="ml-auto" onClick={handleSubmit}>
                    Submit
                  </Button>
                </form>
              </Form>
              {
                correctComment?.map(comment => {
                  return (
                    <div key={comment.comment_id}>{comment.content}</div>
                  )
                })
              }
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
