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
import { CreatePostFormType } from "./CreatePostPage";
import usePost from "../custom_hook/usePostHook";
import { useLocalStorage } from "@uidotdev/usehooks";
import { usePathname } from "next/navigation";
import getCorrectSearchPostType from "@/app/_util/getCorrectSearchPostType";

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
  // Edit post dialog
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loggedInUserId] = useLocalStorage<string | null>("test-userId");
  const { yourPosts, mutate, updatePosts } = usePost(
    getCorrectSearchPostType(usePathname()),
    "",
    loggedInUserId ?? ""
  );

  const form = useForm<CreatePostFormType>({
    resolver: zodResolver(CreatePostFormSchema),
    defaultValues: {
      title,
      content,
    },
  });

  const onSubmit = async (formData: CreatePostFormType) => {
    mutate(updatePosts(postId, formData, toast), {
      optimisticData: yourPosts?.map((post) => {
        if (post.post_id === postId) {
          return {
            ...post,
            content: formData.content,
            title: formData.title,
          };
        }
        return post;
      }),
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    });
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
      <DialogContent className="sm:max-w-[425px] bg-[rgb(36,37,38)] text-white border-[rgb(58,59,60)]">
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
                        className="min-h-[150px] max-h-[250px] h-[50vh] bg-[rgb(58,59,60)] border-[rgb(58,59,60)]"
                        placeholder="Enter content..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant="ghost"
                className="ml-auto bg-[rgb(58,59,60)]"
                type="submit"
              >
                Save changes
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
