import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";
import { FaHome } from "react-icons/fa";
import { IoCreate } from "react-icons/io5";
import { AiFillEdit } from "react-icons/ai";
import { TbPinnedFilled } from "react-icons/tb";
import { FaUser } from "react-icons/fa";

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
    <div>
      <NavDesktop navItems={navItems} />
      <NavMobile navItems={navItems} />
    </div>
  );
}
