"use client";
import React, { useState } from "react";
import MovieList from "@/app/_component/MovieList";

const Trending = () => {
  const [timeWindow, setTimeWindow] = useState("day");

  return (
    <div className="mt-5 lg:mt-10">
      <div className="flex justify-center px-2 space-x-12 items-center">
        <div className="text-xs lg:text-xl font-bold">What's Trending</div>
        <div className="flex space-x-2 border-2 rounded-full px-2 p-1">
          <button
            className={`rounded-md px-1 ${
              timeWindow === "day"
                ? "bg-blue-700 text-white"
                : "hover:bg-blue-700"
            }`}
            onClick={() => setTimeWindow("day")}
          >
            Today
          </button>
          <button
            className={`rounded-md px-1 ${
              timeWindow === "week"
                ? "bg-blue-700 text-white"
                : "hover:bg-blue-700"
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
