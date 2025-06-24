"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@uidotdev/usehooks";
import { NavItemsType } from "./ListOfNavItem";

export default function Navitem({ name, href, active, icon }: NavItemsType) {
  const [userId, _] = useLocalStorage<string | null>("userId");

  if (
    (!userId || userId.length === 0 || userId === null) &&
    name === "Profile"
  ) {
    return;
  }

  return (
    <>
      {/* Link button */}
      <Button
        variant="ghost"
        asChild
        className={cn(
          "w-[11.5rem] text-white border-0 rounded-lg justify-start cursor-pointer",
          /* Hide the sign up btn if user is signed in */
          userId && href === "/sign-up" ? "hidden" : "",
          name === "Home" && "mt-[1.7rem]"
        )}
      >
        <div className="flex flex-col md:flex-row md:gap-3">
          <span>{icon}</span>
          <Link
            href={
              name === "Profile" ||
              name === "Your posts" ||
              name === "Favourite post"
                ? href + userId
                : href
            }
            className="text-xs md:text-sm"
          >
            {name}
          </Link>
        </div>
      </Button>
    </>
  );
}
