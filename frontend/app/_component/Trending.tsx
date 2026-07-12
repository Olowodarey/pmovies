"use client";
import { useState } from "react";
import MovieList from "@/app/_component/MovieList";

const Trending = () => {
  const [timeWindow, setTimeWindow] = useState<"day" | "week">("day");

  return (
    <div className="mt-5 lg:mt-10">
      <div className="flex  px-2 space-x-12 items-center">
        <h2 className="text-sm lg:text-xl font-bold text-ink">What&apos;s Trending</h2>
        <div className="flex border border-edge rounded-full">
          <button
            className={`px-4 py-1 text-sm rounded-full transition-colors ${
              timeWindow === "day" ? "bg-brand text-brand-contrast" : "text-ink-muted hover:text-ink"
            }`}
            onClick={() => setTimeWindow("day")}
          >
            Today
          </button>
          <button
            className={`px-4 py-1 text-sm rounded-full transition-colors ${
              timeWindow === "week" ? "bg-brand text-brand-contrast" : "text-ink-muted hover:text-ink"
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
