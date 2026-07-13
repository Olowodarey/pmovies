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
    <div className="flex gap-2 w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for movies..."
        className="flex-1 min-w-0 p-1 border border-edge rounded-md text-xs lg:text-base bg-surface text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-brand"
      />

      <button
        onClick={handleSearch}
        className="shrink-0 p-1 text-xs lg:text-base bg-brand text-brand-contrast rounded-md font-medium hover:bg-brand-hover transition-colors"
      >
        Search
      </button>
    </div>
  );
};

export default Search;
