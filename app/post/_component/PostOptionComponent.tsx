"use client";
import { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useStore } from "zustand";
import { postStore } from "./_store/postStore";
import { useToast } from "@/components/ui/use-toast";
import { usePathname } from "next/navigation";
import EditPostDialogPage from "./EditPostDialogPage";

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
  const { toast } = useToast();
  const menuRef = useRef<HTMLDivElement>(null);
  const currentUrl = usePathname();

  const deletePosts = useStore(postStore, (state) => state.actions.deletePosts);

  const handleOpenToolbar = () => {
    setToolbar((prev) => !prev);
  };

  const handleDeletePost = () => {
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
    deletePosts(postId, fetchUrl, toast);
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
          styleProperty
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
        {userId === authorId ? (
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
