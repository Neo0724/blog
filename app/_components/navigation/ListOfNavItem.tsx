import { FaHome } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";

export type NavItemsType = {
  name: string;
  href: string;
  active: boolean;
  icon: React.ReactNode;
};

export const ListOfNavItems: NavItemsType[] = [
  {
    name: "Home",
    href: "/post/all-posts",
    active: true,
    icon: <FaHome />,
  },
  {
    name: "Profile",
    href: "/user/",
    active: false,
    icon: <FaCircleUser />,
  },
  {
    name: "Favourite post",
    href: "/post/favourite-post/",
    active: false,
    icon: <FaHeart />,
  },
  {
    name: "Sign Up",
    href: "/sign-up",
    active: false,
    icon: <FaUser />,
  },
];
