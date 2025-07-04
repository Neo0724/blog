"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ListOfNavItems, SidebarItemSelectionType } from "./ListOfNavItem";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FaSignOutAlt } from "react-icons/fa";
import { useLocalStorage } from "@uidotdev/usehooks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import customAxios from "@/lib/custom-axios";

export default function AppSidebar() {
  const router = useRouter();
  const [userId, setUserId] = useLocalStorage<string | null>(
    "userId",
    undefined
  );
  const [_, setUsername] = useLocalStorage<string | null>(
    "username",
    undefined
  );
  const { setOpenMobile, isMobile } = useSidebar();
  const currentPathname = usePathname();

  const [selectedSidebarItem, setSelectedSidebarItem] =
    useState<SidebarItemSelectionType>("");

  const handleSignOut = async () => {
    try {
      setUserId(null);
      setUsername(null);
      await customAxios.delete("/api/jwt");
      router.push("/sign-in");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const findCorrectSelectedSidebarItem = () => {
      let newPathname: SidebarItemSelectionType = "";
      if (currentPathname.startsWith("/post/all-posts")) {
        newPathname = "Home";
      } else if (currentPathname.split("/").length - 1 === 2) {
        newPathname = "Profile";
      } else if (currentPathname.startsWith("/post/favourite-post")) {
        newPathname = "Favourite post";
      } else if (
        currentPathname.startsWith("/sign-up") ||
        currentPathname.startsWith("/sign-in")
      ) {
        newPathname = "Sign Up";
      }

      setSelectedSidebarItem(newPathname);
    };

    findCorrectSelectedSidebarItem();
  }, [currentPathname]);

  return (
    <Sidebar className="border-r-4 border-[rgb(58,59,60)]">
      <SidebarContent className="md:pt-[6rem] bg-[rgb(36,37,38)] pt-10">
        <SidebarMenu>
          {ListOfNavItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                className={cn(
                  "text-white border-0 rounded-lg justify-start cursor-pointer my-2 w-[80%] mx-auto h-10 font-bold",
                  userId && item.href === "/sign-up" ? "hidden" : "",
                  item.name === selectedSidebarItem && "bg-white text-black"
                )}
                asChild
              >
                <Link
                  href={
                    item.name === "Profile" ||
                    item.name === "Your posts" ||
                    item.name === "Favourite post"
                      ? item.href + userId
                      : item.href
                  }
                  onClick={() => {
                    isMobile && setOpenMobile(false);
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {/* Sign out button */}
          <SidebarMenuItem key="SignOut">
            <SidebarMenuButton
              className={cn(
                "text-white border-0 rounded-lg justify-start cursor-pointer w-[80%] mx-auto h-10",
                !userId && "hidden"
              )}
              onClick={handleSignOut}
              asChild
            >
              <Link href="/">
                <span>
                  <FaSignOutAlt />
                </span>
                <span className="font-bold">Sign Out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
