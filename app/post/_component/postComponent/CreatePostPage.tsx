"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@uidotdev/usehooks";
import usePost, { CreatePostFormSchema } from "../custom_hook/usePostHook";
import { NotificationType, SearchPostType } from "../Enum";
import { useFollower } from "../custom_hook/useFollowerHook";
import useNotification from "../custom_hook/useNotificationHook";

export type CreatePostFormType = z.infer<typeof CreatePostFormSchema>;

/* 
  searchPostType is for the createPost action to determine which page the user is currently on for data mutating 
*/
export default function CreatePost({
  searchPostType,
  userId,
}: {
  searchPostType: SearchPostType.ALL_POST | SearchPostType.USER_POST;
  userId: string;
}) {
  const [username] = useLocalStorage<string | null>("test-username");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { createPost, fetchUrl } = usePost(searchPostType, "", userId);
  const { allFollower } = useFollower(userId);
  const { addNotification } = useNotification(userId);

  const form = useForm<CreatePostFormType>({
    resolver: zodResolver(CreatePostFormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (formData: CreatePostFormType) => {
    const newPostId = await createPost(
      formData,
      toast,
      form,
      setError,
      userId,
      fetchUrl
    );

    if (newPostId) {
      addNotification({
        fromUserId: userId ?? "",
        targetUserId:
          allFollower?.map((follower) => follower.UserFollower.user_id) ?? [],
        type: NotificationType.POST,
        resourceId: newPostId,
      });
    }
  };

  const onInvalid = () => {
    console.log("Invalid");
  };

  return (
    <div className="flex items-start w-full mx-auto justify-center flex-col border-2 rounded-md p-5 mb-4 max-w-[800px] border-[rgb(58,59,60)]">
      <span className="w-[85%] font-bold text-xl">
        What&apos;s on your mind, {username}?
      </span>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="flex flex-col w-full max-w-[800px] space-y-2"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter title..."
                    {...field}
                    className="bg-[rgb(58,59,60)] border-[rgb(58,59,60)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    className="h-[3svh] bg-[rgb(58,59,60)] border-[rgb(58,59,60)]"
                    placeholder="Enter content..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="ghost"
            className="flex gap-2 w-min self-start rounded-xl bg-[rgb(58,59,60)]"
          >
            Create post
          </Button>
        </form>
        {error && (
          <Alert variant="destructive" className="w-auto">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </Form>
    </div>
  );
}
