"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@uidotdev/usehooks";
import { NavItemsType } from "./Navbar";

export default function Navitem({ name, href, active, icon }: NavItemsType) {
  const [userId, _] = useLocalStorage<string>("test-userId");

  return (
    <>
      <div className="hidden md:block bg-white w-[1px] h-10"></div>
      <Button
        variant="ghost"
        asChild
        className={cn(
          "hover:underline md:w-23 w-full bg-zinc-500 text-white border-0 rounded-lg",
          userId && href === "/sign-up" ? "hidden" : ""
        )}
      >
        <div className="flex flex-col md:flex-row md:gap-3 hover:cursor-pointer">
          <span>{icon}</span>
          <Link href={href} className="text-xs md:text-sm">
            {name}
          </Link>
        </div>
      </Button>
    </>
  );
}
