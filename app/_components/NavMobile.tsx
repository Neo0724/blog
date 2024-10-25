"use client";
import React, { useEffect } from "react";
import { NavItemsType } from "./Navbar";
import Navitem from "./Navitem";
import SignOut from "../(auth)/sign-in/_components/SignOut";
import SearchBar from "./searchBar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function NavMobile({ navItems }: { navItems: NavItemsType[] }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);
  return (
    <>
      <div className="overflow-scroll md:hidden flex fixed top-0 left-0 right-0 items-center justify-between p-5 shadow-md bg-zinc-500">
        <div className="mr-5 text-white">Blog</div>
        <SearchBar />
        <Button
          onClick={() => {
            setSidebarOpen(true);
          }}
        >
          Hamburger
        </Button>
      </div>
      {/* Sidebar */}
      <div
        className={cn(
          "md:hidden fixed shadow-2xl overflow-y-scroll flex flex-col gap-5 top-0 right-0 bg-zinc-500 h-full w-[30%] transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <Button
          onClick={() => {
            setSidebarOpen(false);
          }}
          className="w-full mt-5 bg-zinc-500"
        >
          Close
        </Button>
        <div className="flex flex-col items-center gap-3">
          {navItems.map((navItem) => {
            return (
              <Navitem
                key={navItem.href}
                name={navItem.name}
                href={navItem.href}
                active={navItem.active}
                icon={navItem.icon}
              />
            );
          })}
          <SignOut />
        </div>
      </div>
    </>
  );
}
