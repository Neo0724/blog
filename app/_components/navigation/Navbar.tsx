import { SidebarTrigger } from "@/components/ui/sidebar";
import SearchBar from "./searchBar";
import NotificationDialog from "../notification/NotificationDialog";

export default function Navbar() {
  return (
    <div className="z-50 flex fixed top-0 left-0 right-0 items-center justify-between p-5 shadow-md bg-[rgb(36,37,38)]">
      <SidebarTrigger className="mr-2 text-white" />
      <div className="mr-5 text-white">Blog</div>
      <SearchBar />
      <NotificationDialog />
    </div>
  );
}
