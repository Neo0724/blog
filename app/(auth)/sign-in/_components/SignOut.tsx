"use client";

import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@uidotdev/usehooks";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FaSignOutAlt } from "react-icons/fa";
import useCookie from "react-use-cookie";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();
  const [userId, setUserId] = useLocalStorage<string | null>("test-userId");
  const [_, setUserToken, __] = useCookie("userId", undefined);

  const handleSignOut = () => {
    setUserId(null);
    setUserToken("");
    router.push("/sign-in");
  };
  return (
    <Button
      variant="outline"
      asChild
      className={cn(
        "w-full hover:underline text-white border-none bg-zinc-500",
        !userId ? "hidden" : "",
      )}
      onClick={handleSignOut}
    >
      <div className="flex flex-col md:flex-row md:gap-3 hover:cursor-pointer">
        <span>
          <FaSignOutAlt />
        </span>
        <Link href="/" className="text-xs md:text-sm">
          Sign Out
        </Link>
      </div>
    </Button>
  );
}
