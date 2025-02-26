"use client";
import { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import EditPostDialogPage from "./EditPostDialogPage";
import { useLocalStorage } from "@uidotdev/usehooks";
import usePost from "../custom_hook/usePostHook";
import getCorrectSearchPostType from "@/app/_util/getCorrectSearchPostType";
import { usePathname } from "next/navigation";

export default function PostOption({
  authorId,
  postId,
  title,
  content,
  className,
}: {
  authorId: string;
  postId: string;
  title: string;
  content: string;
  className?: string;
}) {
  const [toolbar, setToolbar] = useState(false);
  const { toast } = useToast();
  const menuRef = useRef<HTMLDivElement>(null);
  const [loggedInUserId] = useLocalStorage<string | null>("test-userId");

  const { yourPosts, postMutate, deletePosts } = usePost(
    getCorrectSearchPostType(usePathname()),
    "",
    loggedInUserId ?? ""
  );

  const handleOpenToolbar = () => {
    setToolbar((prev) => !prev);
  };

  const handleDeletePost = () => {
    postMutate(deletePosts(postId, toast), {
      optimisticData: yourPosts?.map(
        (page) => page.filter((post) => post.post_id !== postId) ?? []
      ),
      rollbackOnError: true,
      populateCache: true,
      revalidate: true,
    });
  };

  // Check if user click outside of the menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Outside
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Element)
      ) {
        setToolbar(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, setToolbar]);

  return (
    <>
      <div
        className={cn(
          "flex z-10 flex-col items-end absolute right-5",
          className
        )}
        ref={menuRef}
      >
        <button
          title="Open option"
          className="hover:bg-gray-500 border-gray-300 rounded-full w-7 h-7 flex items-center justify-center transition-colors duration-150"
          onClick={handleOpenToolbar}
        >
          <BsThreeDots />
        </button>
        {/* TODO: Add a confirmation for deletion */}
        {/* Delete post button */}
        {loggedInUserId === authorId ? (
          <div
            className={cn(
              "bg-gray-800 border-2 border-gray-500 p-3 rounded-md mt-2 transition-transform duration-150 text-white",
              toolbar ? "scale-100" : "scale-0"
            )}
          >
            <button
              onClick={handleDeletePost}
              className="hover:opacity-75 flex gap-3 items-center transition-opacity duration-150 justify-left"
            >
              <MdDeleteForever />
              <span>Delete</span>
            </button>
            <EditPostDialogPage
              postId={postId}
              title={title}
              content={content}
            />
          </div>
        ) : (
          // To be continue ...
          <div
            className={cn(
              "bg-gray-800 hover:opacity-75 border-2 border-gray-500 p-3 rounded-md mt-2 transition-transform duration-150 text-white",
              toolbar ? "scale-100" : "scale-0"
            )}
            ref={menuRef}
          >
            Empty...
          </div>
        )}
      </div>
    </>
  );
}
