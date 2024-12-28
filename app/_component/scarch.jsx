"use client";
import React, { useState } from "react";
import Link from "next/link";

const Search = () => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchClick = () => {
    setQuery("");
  };

  return (
    <div className="">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for movies..."
        className="p-1 border rounded-md text-xs lg:text-base"
      />

      <Link href={`/searchresult?query=${query}`}>
        <button onClick={ handleSearchClick } className="p-1 ml-2 text-xs lg:text-base bg-blue-500 text-white rounded-md">
          Search
        </button>
      </Link>
    </div>
  );
};

export default Search;
