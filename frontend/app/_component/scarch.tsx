"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Use this for navigation

const Search = () => {
  const [query, setQuery] = useState("");
  const router = useRouter(); // Initialize Next.js router

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/searchresult?query=${query}`);
      setQuery("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents form submission issues
      handleSearch();
    }
  };

  return (
    <div className="">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Listen for Enter key
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
