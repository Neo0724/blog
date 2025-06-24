"use client";

import usePost from "@/app/post/_component/custom_hook/usePostHook";
import { SearchPostType } from "@/app/post/_component/Enum";
import { Button, buttonVariants } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@uidotdev/usehooks";
import { VariantProps } from "class-variance-authority";
import { useEffect, useState } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineHeartBroken } from "react-icons/md";

type FavouritePostButtonProps = {
  postId: string;
  className: string;
  variant: VariantProps<typeof buttonVariants>["variant"];
};
export default function FavouritePostButton({
  postId,
  className,
  variant,
}: FavouritePostButtonProps) {
  const [isFavourited, setIsFavourited] = useState(false);
  const [loggedInUserId, _] = useLocalStorage<string | null>("userId", null);

  const {
    yourPosts,
    isLoading,
    addToFavourite,
    removeFromFavourite,
    postMutate,
  } = usePost(SearchPostType.USER_FAVOURITE_POST, "", loggedInUserId ?? "");

  const handleFavourite = async () => {
    // User not logged in
    if (!loggedInUserId) {
      toast({
        title: "Error",
        description: "Please sign in to add it to favourite",
        action: (
          <ToastAction
            altText="Sign in now"
            onClick={() => {
              window.location.replace("/sign-in");
            }}
          >
            Sign in
          </ToastAction>
        ),
      });

      return;
    }
    if (isFavourited) {
      postMutate(
        removeFromFavourite(loggedInUserId, postId, setIsFavourited, toast),
        {
          optimisticData: yourPosts?.map((page) =>
            page.filter((post) => post.post_id !== postId)
          ),
          populateCache: true,
          revalidate: false,
          rollbackOnError: true,
        }
      );
    } else {
      postMutate(
        addToFavourite(loggedInUserId, postId, setIsFavourited, toast)
      );
    }
  };

  useEffect(() => {
    if (!isLoading && yourPosts && yourPosts.length > 0) {
      const favourited = yourPosts.find(
        (page) => page && page.find((post) => post.post_id === postId)
      )
        ? true
        : false;
      setIsFavourited(favourited);
    }
  }, [postId, isLoading]);
  return (
    <Button
      variant={variant}
      className={cn(
        className,
        isFavourited
          ? "hover:text-red-800 active:text-red-800"
          : "hover:text-blue-600 active:text-blue-600"
      )}
      onClick={handleFavourite}
    >
      {isFavourited ? <MdOutlineHeartBroken /> : <IoIosHeartEmpty />}
      {isFavourited ? "Unfavourite" : "Favourite"}
    </Button>
  );
}
