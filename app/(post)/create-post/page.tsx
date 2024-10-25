"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreatePostSchema,
  CreatePostFormSchema,
} from "@/app/api/create-post/route";

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
import { useLocalStorage } from "@uidotdev/usehooks";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

type CreatePostFormType = z.infer<typeof CreatePostFormSchema>;

export default function CreatePostPage() {
  const [error, setError] = useState("");
  const [userId, _] = useLocalStorage("test-userId");
  const { toast } = useToast();

  const form = useForm<CreatePostFormType>({
    resolver: zodResolver(CreatePostFormSchema),
  });

  const onSubmit = async (formData: CreatePostFormType) => {
    const formDataWithUserId = { ...formData, user_id: userId };
    try {
      const res = await axios.post("/api/create-post", formDataWithUserId);

      if (res.status === 200) {
        toast({
          title: "Success!",
          description: "Post is successfully created!",
        });
      }
    } catch (error) {
      setError("An unexpected error occur");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const onInvalid = () => {
    console.log("Invalid");
  };

  return (
    <div className="flex items-center max-w-[70%]  mb-[15px] sm:mb-0 mx-auto justify-center flex-col space-y-8 py-5 border-2 rounded-md">
      Creata a post
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="flex flex-col min-w-[25%] w-[85%] max-w-[700px] space-y-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title..." {...field} />
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
                    className="min-h-[150px] max-h-[250px] h-[50vh]"
                    placeholder="Enter content..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-20 mx-auto">
            Submit
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
