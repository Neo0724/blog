"use client";

import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@uidotdev/usehooks";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FaSignOutAlt } from "react-icons/fa";

export default function SignOut() {
  const [userId, setUserId] = useLocalStorage<string | null>("test-userId");

  return (
    <Button
      variant="outline"
      asChild
      className={cn("hover:underlinew text-white border-none bg-zinc-500", !userId ? "hidden" : "")}
      onClick={() => setUserId(null)}
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
