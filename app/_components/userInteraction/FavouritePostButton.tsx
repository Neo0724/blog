"use client";

import useFavourite from "@/app/post/_component/custom_hook/useFavouriteHook";
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
  const [loggedInUserId, _] = useLocalStorage<string | null>(
    "test-userId",
    null
  );
  const {
    favouritedPost,
    favouritePostLoading,
    addToFavourite,
    removeFromFavourite,
  } = useFavourite(loggedInUserId);

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
      removeFromFavourite(loggedInUserId, postId, setIsFavourited, toast);
    } else {
      addToFavourite(loggedInUserId, postId, setIsFavourited, toast);
    }
  };

  useEffect(() => {
    if (!favouritePostLoading && favouritedPost && favouritedPost.length > 0) {
      const favourited = favouritedPost.find((item) => item.post_id === postId)
        ? true
        : false;
      setIsFavourited(favourited);
    }
  }, [favouritedPost, favouritePostLoading, postId]);
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
