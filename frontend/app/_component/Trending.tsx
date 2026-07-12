"use client";
import React, { useState } from "react";
import MovieList from "@/app/_component/MovieList";

const Trending = () => {
  const [timeWindow, setTimeWindow] = useState("day");

  return (
    <div className="mt-5 lg:mt-10">
      <div className="flex  px-2 space-x-12 items-center">
        <h2 className="text-sm lg:text-xl font-bold">What's Trending</h2>
        <div className="flex border border-gray-400 rounded-full">
          <button
            className={`px-4 py-1 text-sm rounded-full transition-all ${
              timeWindow === "day"
                ? "bg-blue-700 text-white"
                : "text-gray-600"
            }`}
            onClick={() => setTimeWindow("day")}
          >
            Today
          </button>
          <button
             className={`px-4 py-1 text-sm rounded-full transition-all ${
              timeWindow === "week"
                ? "bg-blue-700 text-white"
                : "text-gray-600"
            }`}
            onClick={() => setTimeWindow("week")}
          >
            This Week
          </button>
        </div>
      </div>

      <div className="mt-5">
        <MovieList timeWindow={timeWindow} />
      </div>
    </div>
  );
};

export default Trending;
