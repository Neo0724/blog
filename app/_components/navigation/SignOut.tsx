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
  const [_, setUsername] = useLocalStorage<string | null>("test-username");
  const [__, setUserToken, ___] = useCookie("userId", undefined);

  const handleSignOut = () => {
    setUserId(null);
    setUsername(null);
    setUserToken("");
    router.push("/sign-in");
  };
  return (
    <Button
      variant="ghost"
      asChild
      className={cn(
        "w-[11.5rem] text-white font-bold border-0 rounded-lg justify-start cursor-pointer",
        !userId ? "hidden" : ""
      )}
      onClick={handleSignOut}
    >
      <div className="flex flex-col md:flex-row md:gap-3">
        <span>
          <FaSignOutAlt />
        </span>
        <Link href="/" className="text-xs md:text-sm font-bold">
          Sign Out
        </Link>
      </div>
    </Button>
  );
}
