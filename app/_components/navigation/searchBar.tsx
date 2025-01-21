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
    <div className="mr-auto flex gap-5 max-w-[600px] min-w-[250px] flex-1">
      <Input
        type="text"
        placeholder="Search for post..."
        value={searchText}
        onChange={(e) => handleTextChange(e)}
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}
