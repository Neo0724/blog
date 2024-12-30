import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import { cn } from "@/lib/utils";
import { MdEdit } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CreatePostFormType } from "../create-post/page";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostFormSchema } from "@/app/api/create-post/route";

function EditPostDialog({
  postId,
  title,
  content,
}: {
  postId: string;
  title: string;
  content: string;
}) {
  const form = useForm<CreatePostFormType>({
    resolver: zodResolver(CreatePostFormSchema),
    defaultValues: {
      title,
      content,
    },
  });

  const onSubmit = (formData: CreatePostFormType) => {
    // TODO
    // handleEditPost(postId, formData);
  };

  const onInvalid = () => {
    console.log("Invalid");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="hover:opacity-75 flex gap-3 items-center transition-opacity duration-150 justify-left">
          <MdEdit />
          <button>Edit post</button>
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editing post</DialogTitle>
          <DialogDescription>
            Make changes to your post here. Click save when you're done.
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

export default function PostOptionComponent({
  userId,
  authorId,
  postId,
  title,
  content,
  styleProperty,
}: {
  userId: string;
  authorId: string;
  postId: string;
  title: string;
  content: string;
  styleProperty?: string;
}) {
  const [toolbar, setToolbar] = useState(false);

  const handleOpenToolbar = () => {
    setToolbar((prev) => !prev);
  };

  // TODO Delete and update post from store

  return (
    <>
      <div
        className={cn(
          "flex z-10 flex-col items-end absolute right-5",
          styleProperty,
        )}
      >
        <button
          className="hover:bg-gray-500 border-gray-300 rounded-full w-7 h-7 flex items-center justify-center transition-colors duration-150"
          onClick={handleOpenToolbar}
        >
          <BsThreeDots />
        </button>
        {/* TODO: Add a confirmation for deletion */}
        {/* Delete post button */}
        {userId === authorId ? (
          <div
            className={cn(
              "bg-gray-800 border-2 border-gray-500 p-3 rounded-md mt-2 transition-transform duration-150",
              toolbar ? "scale-100" : "scale-0",
            )}
          >
            <button
              onClick={() => handleDeletePost(postId)}
              className="hover:opacity-75 flex gap-3 items-center transition-opacity duration-150 justify-left"
            >
              <MdDeleteForever />
              <span>Delete</span>
            </button>
            <EditPostDialog
              postId={postId}
              title={title}
              content={content}
              handleEditPost={handleEditPost}
            />
          </div>
        ) : (
          // To be continue ...
          <button
            className={cn(
              "bg-gray-800 hover:opacity-75 border-2 border-gray-500 p-3 rounded-md mt-2 transition-transform duration-150",
              toolbar ? "scale-100" : "scale-0",
            )}
          >
            Empty...
          </button>
        )}
      </div>
    </>
  );
}
