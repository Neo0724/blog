"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const handleSearch = () => {
    router.push(`/post/search-post/${searchText}`);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  return (
    <div className="mr-auto flex gap-5 max-w-[500px] min-w-[250px] w-full flex-1">
      <Input
        type="text"
        placeholder="Search for post..."
        value={searchText}
        onChange={(e) => handleTextChange(e)}
        className="bg-[rgb(58,59,60)] border-[rgb(58,59,60)] text-white"
      />
      <Button
        onClick={handleSearch}
        variant="ghost"
        className="min-w-fit rounded-xl bg-[rgb(58,59,60)] text-white mr-5"
      >
        Search
      </Button>
    </div>
  );
}
