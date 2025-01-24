import { CreatePostFormSchema } from "@/app/api/post/create-post/route";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import { useStore } from "zustand";
import { postStore } from "./_store/postStore";
import { CreatePostFormType } from "./CreatePostPage";
import { usePathname } from "next/navigation";

export default function EditPostDialogPage({
  postId,
  title,
  content,
}: {
  postId: string;
  title: string;
  content: string;
}) {
  const { toast } = useToast();
  const updatePost = useStore(postStore, (state) => state.actions.updatePosts);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const currentUrl = usePathname();

  const form = useForm<CreatePostFormType>({
    resolver: zodResolver(CreatePostFormSchema),
    defaultValues: {
      title,
      content,
    },
  });

  const onSubmit = (formData: CreatePostFormType) => {
    // Get url key for mutation
    let fetchUrl: string = "";

    if (currentUrl.match("all-posts")) {
      fetchUrl = "/api/post/get-all-post";
    } else if (currentUrl.match("user")) {
      fetchUrl = "/api/post/get-own-post";
    } else if (currentUrl.match("favourite-post")) {
      fetchUrl = "/api/post/get-favourite-post";
    } else if (currentUrl.match("search-post")) {
      fetchUrl = "/api/post/get-search-post";
    } else if (currentUrl.match("post")) {
      fetchUrl = "/api/post/get-specific-post";
    }
    updatePost(postId, formData, fetchUrl, toast);
    setDialogOpen(false);
  };

  const onInvalid = () => {
    console.log("Invalid");
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <span className="hover:opacity-75 flex gap-3 items-center transition-opacity duration-150 justify-left cursor-pointer">
          <MdEdit />
          Edit post
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editing post</DialogTitle>
          <DialogDescription>
            Make changes to your post here. Click save when you are done.
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
              <Button className="ml-auto" type="submit">
                Save changes
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
