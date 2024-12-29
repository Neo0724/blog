import React from "react";
import { NavItemsType } from "./Navbar";
import Navitem from "./Navitem";
import SignOut from "../(auth)/sign-in/_components/SignOut";
import SearchBar from "./searchBar";

export default function NavDesktop({ navItems }: { navItems: NavItemsType[] }) {
  return (
    <div className="z-50 overflow-scroll hidden md:flex fixed top-0 left-0 right-0 items-center justify-between p-5 shadow-md bg-zinc-500">
      <div className="mr-5 text-white">Blog</div>
      <SearchBar />
      <div className="flex items-center justify-betweem gap-3">
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
  );
}
