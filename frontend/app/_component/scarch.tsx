"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Search = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/searchresult?query=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for movies..."
        className="p-1 border rounded-md text-xs lg:text-base"
      />

      <button
        onClick={handleSearch}
        className="p-1 ml-2 text-xs lg:text-base bg-blue-500 text-white rounded-md"
      >
        Search
      </button>
    </div>
  );
};

export default Search;
