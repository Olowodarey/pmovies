"use client";
import { useState } from "react";
import MovieList from "@/app/_component/MovieList";

const Trending = () => {
  const [timeWindow, setTimeWindow] = useState<"day" | "week">("day");

  return (
    <div className="mt-5 lg:mt-10">
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-6">
        <h2 className="font-display text-xl lg:text-2xl font-bold tracking-tight text-ink">
          What&apos;s Trending
        </h2>
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
