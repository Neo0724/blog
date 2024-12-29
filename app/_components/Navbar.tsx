import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";
import { FaHome } from "react-icons/fa";
import { IoCreate } from "react-icons/io5";
import { AiFillEdit } from "react-icons/ai";
import { TbPinnedFilled } from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

export type NavItemsType = {
  name: string;
  href: string;
  active: boolean;
  icon: React.ReactNode;
};

export default function Navbar() {
  const navItems: NavItemsType[] = [
    {
      name: "Home",
      href: "/",
      active: true,
      icon: <FaHome />,
    },
    {
      name: "Your posts",
      href: "/your-posts",
      active: false,
      icon: <TbPinnedFilled />,
    },
    {
      name: "All posts",
      href: "/all-posts",
      active: false,
      icon: <IoCreate />,
    },
    {
      name: "Favourite post",
      href: "/favourite-post",
      active: false,
      icon: <FaHeart />,
    },
    {
      name: "Create post",
      href: "/create-post",
      active: false,
      icon: <AiFillEdit />,
    },
    {
      name: "Sign Up",
      href: "/sign-up",
      active: false,
      icon: <FaUser />,
    },
  ];
  return (
    <div className="z-50">
      <NavDesktop navItems={navItems} />
      <NavMobile navItems={navItems} />
    </div>
  );
}
